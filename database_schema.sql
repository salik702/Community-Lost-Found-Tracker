/**
 * Community Lost & Found Tracker
 * Official Database Schema
 */

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS CommunityTrackerDB;
USE CommunityTrackerDB;

-- Disable FK checks for clean setup
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- 1. Locations Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Locations;
CREATE TABLE Locations (
    LocationID INT AUTO_INCREMENT PRIMARY KEY,
    LocationName VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 2. UserRoles Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS UserRoles;
CREATE TABLE UserRoles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 3. Users Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(50),
    Location VARCHAR(100),
    RoleID INT NOT NULL,
    Email VARCHAR(100) UNIQUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleID) REFERENCES UserRoles(RoleID)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 4. ItemCategories Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS ItemCategories;
CREATE TABLE ItemCategories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 5. ItemConditions Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS ItemConditions;
CREATE TABLE ItemConditions (
    ConditionID INT AUTO_INCREMENT PRIMARY KEY,
    ConditionName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 6. ItemPriorities Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS ItemPriorities;
CREATE TABLE ItemPriorities (
    PriorityID INT AUTO_INCREMENT PRIMARY KEY,
    PriorityLevel VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 7. Items Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Items;
CREATE TABLE Items (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    ItemName VARCHAR(100) NOT NULL,
    Description TEXT,
    UserID INT NOT NULL,
    CategoryID INT NOT NULL,
    ConditionID INT,
    PriorityID INT,
    LocationFoundOrLost INT,
    Status ENUM('Lost', 'Found', 'Stolen', 'Recovered') NOT NULL,
    DateReported DATETIME DEFAULT CURRENT_TIMESTAMP,
    ImageURL TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES ItemCategories(CategoryID),
    FOREIGN KEY (ConditionID) REFERENCES ItemConditions(ConditionID),
    FOREIGN KEY (PriorityID) REFERENCES ItemPriorities(PriorityID),
    FOREIGN KEY (LocationFoundOrLost) REFERENCES Locations(LocationID)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 8. Matches Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Matches;
CREATE TABLE Matches (
    MatchID INT AUTO_INCREMENT PRIMARY KEY,
    LostItemID INT NOT NULL,
    FoundItemID INT NOT NULL,
    MatchDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Confirmed', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (LostItemID) REFERENCES Items(ItemID) ON DELETE CASCADE,
    FOREIGN KEY (FoundItemID) REFERENCES Items(ItemID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 9. Reports Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Reports;
CREATE TABLE Reports (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    UserID INT NOT NULL,
    ReportType ENUM('Lost', 'Found', 'Stolen') NOT NULL,
    ReportDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 10. RecoveryMethods Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS RecoveryMethods;
CREATE TABLE RecoveryMethods (
    MethodID INT AUTO_INCREMENT PRIMARY KEY,
    MethodName VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 11. Alerts Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Alerts;
CREATE TABLE Alerts (
    AlertID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT,
    UserID INT NOT NULL,
    AlertDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    AlertType VARCHAR(50), 
    Message TEXT,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE SET NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 12. Comments Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS Comments;
CREATE TABLE Comments (
    CommentID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    UserID INT NOT NULL,
    CommentText TEXT NOT NULL,
    CommentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 13. ItemTags Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS ItemTags;
CREATE TABLE ItemTags (
    TagID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    TagName VARCHAR(50) NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 14. UserActivityLogs Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS UserActivityLogs;
CREATE TABLE UserActivityLogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ActionType VARCHAR(50),
    ActionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Description TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 15. NotificationSettings Table
-- ---------------------------------------------------------
DROP TABLE IF EXISTS NotificationSettings;
CREATE TABLE NotificationSettings (
    SettingID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    EmailAlerts BOOLEAN DEFAULT TRUE,
    SMSAlerts BOOLEAN DEFAULT FALSE,
    PushAlerts BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;