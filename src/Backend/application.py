import mysql.connector as mysql
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask import Flask, abort, jsonify, request, current_app
from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import datetime
# from datetime import datetime

# TODO: Fix error handling to include rollbacks to account for potential faulty changes

app = Flask(__name__)
CORS(app)
# =========== JWT stuff for logins and authentication ==================================================================

# Configure the JWT
app.config['JWT_SECRET_KEY'] = 'HatsuneMiku3939'  # In a real project this key would be very secret, and much longer
jwt_manager = JWTManager(app)

'''def get_user_id_from_token(token):
    try:
        # Decode the JWT using the secret key
        payload = jwt_manager.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('user_id')  # Assuming the user ID is stored in the 'user_id' claim
    except jwt_manager.ExpiredSignatureError:
        return None  # Token has expired
    except jwt_manager.InvalidTokenError:
        return None  # Invalid token'''

def generate_jwt(user_id):
    token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(minutes=15))
    return token

# ==================== Initial Database stuff ==========================================================================

# MySQL Database config
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'medicalusers'
}

def get_db_connection():
    connection = mysql.connect(**config)
    return connection


# Connect to MariaDB Database (initial w/o specifying db)
connect = mysql.connect(host=config['host'], user=config['user'], password=config['password'])
curr = connect.cursor()

# Create database if it doesn't exist yet
curr.execute(f"CREATE DATABASE IF NOT EXISTS {config['database']}")
print("Database created successfully, or it already exists")

# Select database to operate on
curr.execute(f"USE {config['database']}")

# End Connection
curr.close()

# ================== Helper Functions ==================================================================================

# Helper function to get the role of a user from the database
def get_user_role(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT Role FROM Users WHERE UserID = %s", (user_id,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        cursor.close()
        conn.close()

# Decorator to check individual roles
def role_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()  # Get the user_id from the JWT token
            user_role = get_user_role(user_id)  # Fetch the user's role using user_id

            if user_role not in roles:
                return jsonify({"error": "Access forbidden"}), 403  # Forbidden
            return f(user_id=user_id)  # Pass user_id to the decorated function
        return decorated_function
    return decorator



# IMPORTANT (For Santiago)
'''
To enforce role permissions:
Store the user's role in the session after login and use it to determine what actions they can take
'''

# ================ GETTERS =============================================================================================

@app.route('/fetch_role', methods=['GET'])
def fetch_role(email): # for frontend, using email to grab role
    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT Role FROM Users WHERE email = %s", (email,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch_user_id/<string:email>', methods=['GET'])
def fetch_user_id(email): # You can grab the user's ID if you know their email (post-login)
    print(f"Received request to fetch user ID for email: {email}")
    if not email:
        print("No email provided")
        return jsonify({"error": "Email is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Fetch the UserID based on the provided email
        cursor.execute("SELECT UserID FROM Users WHERE Email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            print(f"No user found for email: {email}")
            return jsonify({"error": "User not found"}), 404

        print(f"User ID for email {email} is {user[0]}")
        return jsonify({"UserID": user[0]}), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch_user_appointments/<int:userid>', methods=['GET'])
def fetch_user_appointments(userid):
    if not userid:
        return jsonify({"error": "Valid UserID is required"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Fetch all appointments for the given user
        print("userid: ", userid)
        cursor.execute("SELECT AppointmentID, AppointmentDate, Description, Status FROM Appointments WHERE UserID = %s", (userid,))
        appointments = cursor.fetchall()


        if appointments:
            return jsonify({"appointments": appointments}), 200
        else:
            return jsonify({"message": "No appointments found"}), 404
    except mysql.Error as err:
        print("SQL Error: ", err)
        return jsonify({"error": str(err)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch_all_appointments', methods=['GET'])
def fetch_all_appointments():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT AppointmentID, AppointmentDate, Description, Status FROM Appointments")
        appointments = cursor.fetchall()

        if appointments:
            return jsonify({"appointments": appointments}), 200
        else:
            return jsonify({"message": "No appointments found"}), 404
    except mysql.Error as err:
        print("SQL Error: ", err)
        return jsonify({"error": str(err)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ================ LOGIN AND REGISTER FUNCTIONS ========================================================================

# User login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password') # may have to change this check once the passwords are hashed

    # Check if the user exists in the database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE Username = %s", (username,))
    user = cursor.fetchone()
    # print("user:", user)
    cursor.close()
    conn.close()

    if user and check_password_hash(user['PasswordHash'], password):        # Create JWT token. Automatically signs the user out after 15 minutes
        # access_token = create_access_token(identity=user['UserID'], expires_delta=datetime.timedelta(minutes=15))
        payload = {
            "UserID": user['UserID'],
            "Username": user['Username'],
            "FirstName": user['FirstName'],
            "LastName": user['LastName'],
            "Email": user['Email'],
            "Role": user['Role'],
            "HospitalID": user.get('HospitalID') # Uses get() in case the field is None
        }
        token = generate_jwt(payload)      # Generate token with the full payload
        return jsonify(access_token=token), 200

    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/logout', methods=['POST'])
@jwt_required()  # Ensure the user is logged in
def logout():
    # Might implement blacklisting
    # For now, when the user logs out, just delete their token instead

    return jsonify({"msg": "Successfully logged out"}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # print("incoming data: ", data)
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    role = data.get('userRole').lower() # making it lowercase for sql
    hospitalID = data.get('hospitalID') if role in ["operator", "doctor"] else None

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if role in ["operator", "doctor"] and hospitalID:
            cursor.execute(
                "INSERT INTO Users (Username, PasswordHash, FirstName, LastName, Email, Role, HospitalID) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (username, hashed_password, first_name, last_name, email, role, hospitalID)
             )
        else: 
            cursor.execute(
                "INSERT INTO Users (Username, PasswordHash, FirstName, LastName, Email, Role) VALUES (%s, %s, %s, %s, %s, %s)",
                (username, hashed_password, first_name, last_name, email, role)
             )
        conn.commit()
        return jsonify({"msg": "User created successfully"}), 201
    except mysql.Error as err:
        print("SQL Error: ", err)
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# ======================== General Functions ===========================================================================
# From here on, we create functions to be called upon by the frontend to retrieve data from the database

@app.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
@role_required(['operator', 'admin'])
def update_user_role(user_id):
    data = request.get_json()
    new_role = data.get('role')

    if new_role not in ['patient', 'operator', 'doctor', 'admin']:
        return jsonify({"error": "Invalid role"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "UPDATE Users SET Role = %s WHERE UserID = %s"
        cursor.execute(query, (new_role, user_id))
        conn.commit()
        return jsonify({"message": "User role updated successfully"}), 200
    except mysql.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# Username
@app.route('/users/<int:user_id>/username', methods=['PUT'])
@jwt_required()
@role_required(['patient', 'operator'])
def update_username(user_id):
    data = request.get_json()  # Get the JSON data from the request
    new_username = data.get('username')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "UPDATE Users SET Username = %s WHERE UserID = %s"
        cursor.execute(query, (new_username, user_id))
        conn.commit()
        return jsonify({"message": "Username updated successfully"}), 200
    except mysql.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# FOR SANTIAGO --->
# This is how you can implement a function and call it in JS to access this stuff through Flask
'''
function updateUsername(userId, newUsername) {
    fetch(`http://localhost:5000/users/${userId}/username`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername })
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

// Usage
updateUsername(1, 'newUsername123');
'''
# Do this for each of the functions and we should be fine

# Password
@app.route('/users/<int:user_id>/password', methods=['PUT'])
@jwt_required()
@role_required(['patient', 'operator'])
def update_password_hash(user_id):
    data = request.get_json()
    new_password = data.get('password')
    new_password_hash = generate_password_hash(new_password)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "UPDATE Users SET PasswordHash = %s WHERE UserID = %s"
        cursor.execute(query, (new_password_hash, user_id))
        conn.commit()
        return jsonify({"message": "Password hash updated successfully"}), 200
    except mysql.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# First Name
@app.route('/users/<int:user_id>/first-name', methods=['PUT'])
@jwt_required()
@role_required(['patient', 'operator'])
def update_first_name(user_id):
    data = request.get_json()
    new_first_name = data.get('firstName')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "UPDATE Users SET FirstName = %s WHERE UserID = %s"
        cursor.execute(query, (new_first_name, user_id))
        conn.commit()
        return jsonify({"message": "First name updated successfully"}), 200
    except mysql.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# Last Name
@app.route('/users/<int:user_id>/last-name', methods=['PUT'])
@jwt_required()
@role_required(['patient', 'operator'])
def update_last_name(user_id):
    data = request.get_json()
    new_last_name = data.get('lastName')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "UPDATE Users SET LastName = %s WHERE UserID = %s"
        cursor.execute(query, (new_last_name, user_id))
        conn.commit()
        return jsonify({"message": "Last name updated successfully"}), 200
    except mysql.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# Email Address
@app.route('/users/<int:user_id>/email', methods=['PUT'])
@jwt_required()
@role_required(['patient', 'operator'])
def update_email(user_id):
    data = request.get_json()
    new_email = data.get('email')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "UPDATE Users SET Email = %s WHERE UserID = %s"
        cursor.execute(query, (new_email, user_id))
        conn.commit()
        return jsonify({"message": "Email updated successfully"}), 200
    except mysql.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# ===================== APPOINTMENTS ===================================================================================

# Set Appointment
@app.route('/set_appointment', methods=['POST'])
def set_appointment():
    data = request.get_json()
    print("incoming data: ", data)
    user_id = data.get('user_id')
    doctor_id = data.get('doctor_id')
    appointment_date = data.get('appointment_date')
    description = data.get('description')

    print(f"user_id: {user_id}")
    print(f"doctor_id: {doctor_id}")
    print(f"appointment_date: {appointment_date}")
    print(f"description: {description}")

    # Validate required fields
    if not (user_id and doctor_id and appointment_date and description):
        return jsonify({"msg": "Missing required fields"}), 400

    # Convert appointment_date to datetime
    try:
        appointment_datetime = datetime.datetime.strptime(appointment_date, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

    # Insert new appointment into the database
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    INSERT INTO Appointments (UserID, DoctorID, AppointmentDate, Description)
    VALUES (%s, %s, %s, %s)
    """
    values = (user_id, doctor_id, appointment_datetime, description)

    try:
        cursor.execute(query, values)
        conn.commit()
        appointment_id = cursor.lastrowid  # Get the ID of the newly created appointment
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": "Failed to set appointment", "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"msg": "Appointment set successfully", "appointment_id": appointment_id}), 201

@app.route('/mark_appointment_complete', methods=['POST'])
def mark_appointment_completed(appointment_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    if not appointment_id:
        return jsonify({"error": "Appointment ID is required"}), 400

    try:
        # Update the status of the appointment to 'completed'
        cursor.execute(
            "UPDATE Appointments SET Status = 'completed' WHERE AppointmentID = %s",
            (appointment_id,)
        )
        conn.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Appointment marked as completed"}), 200
        else:
            return jsonify({"error": "Appointment not found"}), 404
    finally:
        cursor.close()
        conn.close()

# For testing
@app.route('/')
def index():
    return "User Management API is running! Woohoo!"


if __name__ == '__main__':
    app.run(debug=True)