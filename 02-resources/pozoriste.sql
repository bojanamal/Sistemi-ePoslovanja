-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.4-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pozoriste
CREATE DATABASE IF NOT EXISTS `pozoriste` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `pozoriste`;

-- Dumping structure for table pozoriste.administrator
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table pozoriste.dvorana
CREATE TABLE IF NOT EXISTS `dvorana` (
  `dvorana_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `naziv` varchar(50) NOT NULL,
  PRIMARY KEY (`dvorana_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table pozoriste.glumac
CREATE TABLE IF NOT EXISTS `glumac` (
  `glumac_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ime` varchar(32) NOT NULL DEFAULT '0',
  `prezime` varchar(64) NOT NULL DEFAULT '0',
  `biografija` text NOT NULL,
  `fotografija` varchar(255) NOT NULL,
  PRIMARY KEY (`glumac_id`),
  UNIQUE KEY `uq_glumac_fotografija` (`fotografija`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table pozoriste.predstava
CREATE TABLE IF NOT EXISTS `predstava` (
  `predstava_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `naziv` varchar(50) NOT NULL DEFAULT '0',
  `kratak_opis` text NOT NULL,
  `slika_postera` varchar(255) NOT NULL DEFAULT '',
  `trajanje` int(255) NOT NULL DEFAULT 0,
  `spisak_glumaca` text NOT NULL,
  `dvorana_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`predstava_id`),
  UNIQUE KEY `uq_predstava_slika_postera` (`slika_postera`) USING BTREE,
  KEY `fk_predstava_dvorana_id` (`dvorana_id`),
  CONSTRAINT `fk_predstava_dvorana_id` FOREIGN KEY (`dvorana_id`) REFERENCES `dvorana` (`dvorana_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table pozoriste.uloga
CREATE TABLE IF NOT EXISTS `uloga` (
  `uloga_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `naziv_ili_spisak_uloga` varchar(100) NOT NULL,
  `glumac_id` int(11) unsigned NOT NULL DEFAULT 0,
  `predstava_id` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`uloga_id`),
  KEY `fk_uloga_glumac_id` (`glumac_id`),
  KEY `fk_uloga_predstava_id` (`predstava_id`),
  CONSTRAINT `fk_uloga_glumac_id` FOREIGN KEY (`glumac_id`) REFERENCES `glumac` (`glumac_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_uloga_predstava_id` FOREIGN KEY (`predstava_id`) REFERENCES `predstava` (`predstava_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
