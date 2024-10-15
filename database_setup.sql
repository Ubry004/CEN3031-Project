-- Users table to store login credentials and basic info
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) NOT NULL UNIQUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Roles table to define patient, doctor, desk operator
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

-- UserRoles relation to associate users with roles
CREATE TABLE UserRoles (
    UserID INT,
    RoleID INT,
    PRIMARY KEY (UserID, RoleID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Permissions table to define permissions for roles
CREATE TABLE Permissions (
    PermissionID INT PRIMARY KEY AUTO_INCREMENT,
    PermissionName VARCHAR(100) NOT NULL UNIQUE
);

-- RolePermissions table to associate roles with permissions
CREATE TABLE RolePermissions (
    RoleID INT,
    PermissionID INT,
    PRIMARY KEY (RoleID, PermissionID),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
    FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID)
);

-- Doctors table for doctor-specific information
CREATE TABLE Doctors (
    DoctorID INT PRIMARY KEY,
    Specialty VARCHAR(100),
    FOREIGN KEY (DoctorID) REFERENCES Users(UserID)
);

-- Patients table for patient-specific information
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    FOREIGN KEY (PatientID) REFERENCES Users(UserID)
);

-- Appointments table to schedule appointments
CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DoctorID INT,
    AppointmentDate DATETIME,
    Reason VARCHAR(255),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);

-- Medications table to list medications
CREATE TABLE Medications (
    MedicationID INT PRIMARY KEY AUTO_INCREMENT,
    MedicationName VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT
);

-- ScheduledMedications table to track medication schedules
CREATE TABLE ScheduledMedications (
    ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    MedicationID INT,
    Dosage VARCHAR(50),
    StartDate DATE,
    EndDate DATE,
    Frequency VARCHAR(50),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (MedicationID) REFERENCES Medications(MedicationID)
);
