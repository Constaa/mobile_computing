-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
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


-- Exportiere Datenbank-Struktur für mobilecomputing
CREATE DATABASE IF NOT EXISTS `mobilecomputing` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci */;
USE `mobilecomputing`;

-- Exportiere Struktur von Tabelle mobilecomputing.calendarevents
CREATE TABLE IF NOT EXISTS `calendarevents` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `allDay` tinyint(1) DEFAULT 0,
  `start` timestamp NULL DEFAULT NULL,
  `end` timestamp NULL DEFAULT NULL,
  `daysOfWeek` varchar(50) DEFAULT '',
  `title` varchar(50) DEFAULT '',
  `className` varchar(50) DEFAULT '',
  `description` varchar(250) DEFAULT '',
  `minParticipants` int(11) DEFAULT 0,
  `maxParticipants` int(11) DEFAULT 0,
  `_year` year(4) DEFAULT NULL,
  `startRecur` timestamp NULL DEFAULT NULL,
  `endRecur` timestamp NULL DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  KEY `Schlüssel 1` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Exportiere Daten aus Tabelle mobilecomputing.calendarevents: ~8 rows (ungefähr)
INSERT INTO `calendarevents` (`Id`, `allDay`, `start`, `end`, `daysOfWeek`, `title`, `className`, `description`, `minParticipants`, `maxParticipants`, `_year`, `startRecur`, `endRecur`, `startTime`, `endTime`) VALUES
	(5, 0, '2024-11-19 15:09:26', '2024-11-19 17:09:26', '', 'First event', 'seminar', 'Description1', 0, 0, '2024', NULL, NULL, NULL, NULL),
	(6, 1, '2024-11-23 15:09:26', '2024-11-23 17:09:26', '', 'Second event', 'course', 'Description2', 0, 0, '2024', NULL, NULL, NULL, NULL),
	(9, 0, '2024-11-29 13:00:00', '2024-11-30 16:00:00', '', 'New Test event', 'conference', 'Description for test event', 0, 0, '2024', NULL, NULL, NULL, NULL),
	(10, 0, '2024-12-02 05:00:00', '2024-12-03 11:00:00', '', 'Test neu', 'conference', 'Beschreibung', 0, 0, '2024', NULL, NULL, NULL, NULL),
	(11, 0, '2024-12-03 05:00:00', '2024-12-03 06:00:00', '', 'Neues Test event', 'seminar', 'das ist die Beschreibung', 0, 0, '2024', NULL, NULL, NULL, NULL),
	(14, 0, '2024-12-02 05:00:00', '2024-12-23 09:00:00', '1,2', 'Wiederholung', 'course', 'Test1', 0, 0, '2024', '2024-12-02 05:00:00', '2024-12-23 09:00:00', '06:00:00', '10:00:00'),
	(15, 0, '2024-12-05 07:00:00', '2024-12-05 11:30:00', '', 'Test mit Teilnehmeranzahjl', 'seminar', 'fwAEF SAE', 5, 20, '2024', NULL, NULL, NULL, NULL),
	(16, 0, '2024-12-06 02:00:00', '2024-12-06 06:00:00', '', 'Neues Event', 'course', 'Neue Beschreibung', 1, 10, '2024', NULL, NULL, NULL, NULL);

-- Exportiere Struktur von Trigger mobilecomputing.insert_year_trigger
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `insert_year_trigger` BEFORE INSERT ON `calendarevents` FOR EACH ROW BEGIN
SET NEW._year = YEAR(NEW.start);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
