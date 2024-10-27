-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for medicalusers
CREATE DATABASE IF NOT EXISTS `medicalusers` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `medicalusers`;

-- Dumping structure for table medicalusers.appointments
CREATE TABLE IF NOT EXISTS `appointments` (
  `AppointmentID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `DoctorID` int(11) NOT NULL,
  `AppointmentDate` datetime NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` enum('scheduled','completed','canceled') DEFAULT 'scheduled',
  PRIMARY KEY (`AppointmentID`),
  KEY `UserID` (`UserID`),
  KEY `DoctorID` (`DoctorID`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`DoctorID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table medicalusers.appointments: ~3 rows (approximately)
INSERT INTO `appointments` (`AppointmentID`, `UserID`, `DoctorID`, `AppointmentDate`, `Description`, `Status`) VALUES
	(1, 4, 3, '2024-11-01 10:00:00', 'Routine checkup with Dr. Brown', 'scheduled'),
	(2, 4, 3, '2024-11-08 14:30:00', 'Follow-up appointment for blood work', 'scheduled'),
	(3, 4, 3, '2024-11-15 09:00:00', 'Physical therapy session', 'completed');

-- Dumping structure for table medicalusers.medications
CREATE TABLE IF NOT EXISTS `medications` (
  `MedicationID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `MedicationName` varchar(100) NOT NULL,
  `Dosage` varchar(50) DEFAULT NULL,
  `Frequency` varchar(50) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  PRIMARY KEY (`MedicationID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `medications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table medicalusers.medications: ~2 rows (approximately)
INSERT INTO `medications` (`MedicationID`, `UserID`, `MedicationName`, `Dosage`, `Frequency`, `StartDate`, `EndDate`) VALUES
	(1, 4, 'Ibuprofen', '200 mg', 'Every 8 hours', '2024-10-20', '2024-11-01'),
	(2, 4, 'Vitamin D', '1000 IU', 'Once daily', '2024-10-15', '2024-12-15');

-- Dumping structure for table medicalusers.users
CREATE TABLE IF NOT EXISTS `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Role` enum('patient','doctor','operator','admin') NOT NULL DEFAULT 'patient',
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table medicalusers.users: ~5 rows (approximately)
INSERT INTO `users` (`UserID`, `Username`, `PasswordHash`, `FirstName`, `LastName`, `Email`, `Role`, `CreatedAt`) VALUES
	(1, 'alice_admin', 'hashed_password1', 'Alice', 'Smith', 'alice.smith@example.com', 'admin', '2024-10-26 04:30:43'),
	(2, 'bob_operator', 'hashed_password2', 'Bob', 'Jones', 'bob.jones@example.com', 'operator', '2024-10-26 04:30:43'),
	(3, 'charlie_doctor', 'hashed_password3', 'Charlie', 'Brown', 'charlie.brown@example.com', 'doctor', '2024-10-26 04:30:43'),
	(4, 'dana_patient', 'hashed_password4', 'Dana', 'White', 'dana.white@example.com', 'patient', '2024-10-26 04:30:43'),
	(5, 'test_user', 'password123', 'Test', 'User', 'test@example.com', 'patient', '2024-10-26 04:36:01');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
