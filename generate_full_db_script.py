import random
import datetime
import os

# --- Configuration ---
NUM_USERS = 300
NUM_ITEMS = 800  # Will result in some lost, some found, some stolen
NUM_REPORTS = 300
NUM_ALERTS = 200
NUM_COMMENTS = 200
# Use absolute path for output to avoid confusion
OUTPUT_FILE = r"c:\Users\salik\OneDrive\Desktop\Sem\Sem 4\Projects\DB LAB Project\database\CommunityTrackerDB.sql"

# Ensure directory exists
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# --- Data Sources (India & Pakistan context) ---
FIRST_NAMES = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Omar", "Ali", "Hassan",
    "Ahmed", "Bilal", "Usman", "Hamza", "Fatima", "Aisha", "Zainab", "Maryam", "Zara", "Priya",
    "Neha", "Ananya", "Diya", "Sana", "Hina", "Kiran", "Rahul", "Amit", "Rohan", "Vikram"
]
LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Singh", "Kumar", "Gupta", "Khan", "Ahmed", "Ali", "Malik",
    "Hussain", "Qureshi", "Raza", "Shah", "Chaudhry", "Mishra", "Reddy", "Nair", "Fernandes"
]
CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar", "Multan", "Islamabad", "Quetta"
]
ITEM_NAMES = [
    "iPhone 13 Pro", "Samsung Galaxy S21", "Leather Wallet", "Car Keys", "Honda Civic", "Passport",
    "Debit Card", "Labrador Dog", "Persian Cat", "Dell XPS Laptop", "MacBook Air", "Wrist Watch",
    "Gold Ring", "Backpack", "Sunglasses", "Driving License", "Textbooks", "Bicycle", "Motorbike"
]
DESCRIPTIONS = [
    "Black color, slight scratch on screen.", "Brown leather, contains ID cards.", "Key with a blue keychain.",
    "White color, dent on bumper.", "Valid till 2030.", "Lost near the park.", "Found at the metro station.",
    " wearing a red collar.", "Grey color, laptop bag included.", "Gold plated, engraved initials."
]
TAGS_POOL = ["Electronics", "Mobile", "Wallet", "Keys", "Document", "Pet", "Vehicle", "Clothing", "Jewelry", "Bag"]

# --- Helper Functions ---
def get_random_date(start_year=2024, end_year=2025):
    start = datetime.date(start_year, 1, 1)
    end = datetime.date(end_year, 12, 31)
    return start + datetime.timedelta(days=random.randint(0, (end - start).days))

def escape_sql(val):
    if isinstance(val, str):
        return "'" + val.replace("'", "''") + "'"
    if val is None:
        return "NULL"
    return str(val)

# --- SQL Components ---

HEADER_SQL = """-- Community Lost & Stolen Items Tracker Database
-- Generated Script
-- Context: India & Pakistan

-- Target existing database
USE CommunityTrackerDB;

-- Disable FK checks to allow dropping tables out of order
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS itemtags;
DROP TABLE IF EXISTS useractivitylogs;
DROP TABLE IF EXISTS notificationsettings;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userroles;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS itemcategories;
DROP TABLE IF EXISTS itemconditions;
DROP TABLE IF EXISTS itempriorities;
DROP TABLE IF EXISTS recoverymethods;
DROP TABLE IF EXISTS categories; -- Drop old schema tables if any
DROP TABLE IF EXISTS conditions; -- Drop old schema tables if any

-- Views
DROP VIEW IF EXISTS LostItemsView;
DROP VIEW IF EXISTS FoundItemsView;
DROP VIEW IF EXISTS MatchSummaryView;

-- Procedures (Drop if exists)
DROP PROCEDURE IF EXISTS CreateUser;
DROP PROCEDURE IF EXISTS ReportItem;
"""

TABLES_SQL = """
-- 1. Locations
CREATE TABLE Locations (
    LocationID INT AUTO_INCREMENT PRIMARY KEY,
    LocationName VARCHAR(100) NOT NULL
);

-- 2. UserRoles
CREATE TABLE UserRoles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Users
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(50),
    Location VARCHAR(100),
    RoleID INT NOT NULL,
    Email VARCHAR(100) UNIQUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleID) REFERENCES UserRoles(RoleID)
);

-- 4. ItemCategories
CREATE TABLE ItemCategories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL UNIQUE
);

-- 5. ItemConditions
CREATE TABLE ItemConditions (
    ConditionID INT AUTO_INCREMENT PRIMARY KEY,
    ConditionName VARCHAR(50) NOT NULL UNIQUE
);

-- 6. ItemPriorities
CREATE TABLE ItemPriorities (
    PriorityID INT AUTO_INCREMENT PRIMARY KEY,
    PriorityLevel VARCHAR(50) NOT NULL UNIQUE
);

-- 7. Items
CREATE TABLE Items (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    ItemName VARCHAR(100) NOT NULL,
    Description TEXT,
    UserID INT NOT NULL,
    CategoryID INT NOT NULL,
    ConditionID INT,
    PriorityID INT,
    LocationFoundOrLost INT, -- Linked to Locations table
    Status ENUM('Lost', 'Found', 'Stolen', 'Recovered') NOT NULL,
    DateReported DATETIME DEFAULT CURRENT_TIMESTAMP,
    ImageURL TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES ItemCategories(CategoryID),
    FOREIGN KEY (ConditionID) REFERENCES ItemConditions(ConditionID),
    FOREIGN KEY (PriorityID) REFERENCES ItemPriorities(PriorityID),
    FOREIGN KEY (LocationFoundOrLost) REFERENCES Locations(LocationID)
);

-- 8. Matches
CREATE TABLE Matches (
    MatchID INT AUTO_INCREMENT PRIMARY KEY,
    LostItemID INT NOT NULL,
    FoundItemID INT NOT NULL,
    MatchDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Confirmed', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (LostItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (FoundItemID) REFERENCES Items(ItemID)
);

-- 9. Reports
CREATE TABLE Reports (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    UserID INT NOT NULL,
    ReportType ENUM('Lost', 'Found', 'Stolen') NOT NULL,
    ReportDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 10. RecoveryMethods
CREATE TABLE RecoveryMethods (
    MethodID INT AUTO_INCREMENT PRIMARY KEY,
    MethodName VARCHAR(100) NOT NULL
);

-- 11. Alerts
CREATE TABLE Alerts (
    AlertID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT,
    UserID INT NOT NULL,
    AlertDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    AlertType VARCHAR(50), 
    Message TEXT,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE SET NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 12. Comments
CREATE TABLE Comments (
    CommentID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    UserID INT NOT NULL,
    CommentText TEXT NOT NULL,
    CommentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 13. ItemTags
CREATE TABLE ItemTags (
    TagID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT NOT NULL,
    TagName VARCHAR(50) NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

-- 14. UserActivityLogs
CREATE TABLE UserActivityLogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ActionType VARCHAR(50),
    ActionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Description TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 15. NotificationSettings
CREATE TABLE NotificationSettings (
    SettingID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    EmailAlerts BOOLEAN DEFAULT TRUE,
    SMSAlerts BOOLEAN DEFAULT FALSE,
    PushAlerts BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
"""

# Static Data Inserts
STATIC_DATA_SQL = """
INSERT INTO UserRoles (RoleName) VALUES ('Admin'), ('Moderator'), ('Regular User'), ('Community Member');
INSERT INTO ItemCategories (CategoryName) VALUES ('Electronics'), ('Documents'), ('Personal Accessories'), ('Vehicles'), ('Pets'), ('Clothing'), ('Keys'), ('Other');
INSERT INTO ItemConditions (ConditionName) VALUES ('New'), ('Good'), ('Used'), ('Damaged'), ('Broken');
INSERT INTO ItemPriorities (PriorityLevel) VALUES ('High'), ('Medium'), ('Low');
INSERT INTO RecoveryMethods (MethodName) VALUES ('Pickup'), ('Courier'), ('Meetup at Public Place'), ('Police Station Handover');
"""

# Generate Dynamic Locations
DYNAMIC_LOCATIONS_SQL = "INSERT INTO Locations (LocationName) VALUES "
location_values = []
for city in CITIES:
    location_values.append(f"('{city} City Center')")
    location_values.append(f"('{city} Airport')")
    location_values.append(f"('{city} Railway Station')")
DYNAMIC_LOCATIONS_SQL += ", ".join(location_values) + ";\n"
NUM_LOCATIONS = len(location_values)

# --- VIEWS, PROCEDURES, TRIGGERS ---
LOGIC_SQL = """
-- Views

CREATE VIEW LostItemsView AS
SELECT i.ItemID, i.ItemName, i.Description, c.CategoryName, l.LocationName, i.DateReported, u.Name as UsersName
FROM Items i
JOIN ItemCategories c ON i.CategoryID = c.CategoryID
JOIN Locations l ON i.LocationFoundOrLost = l.LocationID
JOIN Users u ON i.UserID = u.UserID
WHERE i.Status = 'Lost';

CREATE VIEW FoundItemsView AS
SELECT i.ItemID, i.ItemName, i.Description, c.CategoryName, l.LocationName, i.DateReported
FROM Items i
JOIN ItemCategories c ON i.CategoryID = c.CategoryID
JOIN Locations l ON i.LocationFoundOrLost = l.LocationID
WHERE i.Status = 'Found';

CREATE VIEW MatchSummaryView AS
SELECT m.MatchID, m.MatchDate, m.Status,
       l.ItemName as LostItem, f.ItemName as FoundItem,
       loc.LocationName
FROM Matches m
JOIN Items l ON m.LostItemID = l.ItemID
JOIN Items f ON m.FoundItemID = f.ItemID
JOIN Locations loc ON l.LocationFoundOrLost = loc.LocationID; 

-- Procedures

DELIMITER //

CREATE PROCEDURE CreateUser(
    IN p_Name VARCHAR(100),
    IN p_Contact VARCHAR(50),
    IN p_Location VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_RoleID INT
)
BEGIN
    INSERT INTO Users (Name, Contact, Location, RoleID, Email)
    VALUES (p_Name, p_Contact, p_Location, p_RoleID, p_Email);
END //

CREATE PROCEDURE ReportItem(
    IN p_ItemName VARCHAR(100),
    IN p_Description TEXT,
    IN p_UserID INT,
    IN p_CategoryID INT,
    IN p_LocationID INT,
    IN p_Status VARCHAR(20)
)
BEGIN
    INSERT INTO Items (ItemName, Description, UserID, CategoryID, LocationFoundOrLost, Status, DateReported)
    VALUES (p_ItemName, p_Description, p_UserID, p_CategoryID, p_LocationID, p_Status, NOW());
END //

-- Triggers

CREATE TRIGGER AfterItemInsert
AFTER INSERT ON Items
FOR EACH ROW
BEGIN
    -- Log Activity
    INSERT INTO UserActivityLogs (UserID, ActionType, Description, ActionDate)
    VALUES (NEW.UserID, 'Reported Item', CONCAT('User reported item: ', NEW.ItemName, ' as ', NEW.Status), NOW());

    -- Simple Auto-Match Logic
    -- Should only run if logic permits (e.g. not typically done on bulk insert in scripts, but requested)
    -- WARNING: In bulk inserts, triggers can be slow. But for 1000 items it's fine.
    
    IF NEW.Status = 'Found' THEN
        INSERT INTO Matches (LostItemID, FoundItemID, MatchDate, Status)
        SELECT ItemID, NEW.ItemID, NOW(), 'Pending'
        FROM Items
        WHERE Status = 'Lost'
          AND CategoryID = NEW.CategoryID
          AND LocationFoundOrLost = NEW.LocationFoundOrLost
          AND ItemID != NEW.ItemID;
    ELSEIF NEW.Status = 'Lost' THEN
        INSERT INTO Matches (LostItemID, FoundItemID, MatchDate, Status)
        SELECT NEW.ItemID, ItemID, NOW(), 'Pending'
        FROM Items
        WHERE Status = 'Found'
          AND CategoryID = NEW.CategoryID
          AND LocationFoundOrLost = NEW.LocationFoundOrLost
          AND ItemID != NEW.ItemID;
    END IF;
END //

CREATE TRIGGER AfterMatchInsert
AFTER INSERT ON Matches
FOR EACH ROW
BEGIN
    DECLARE lostUser INT;
    DECLARE foundUser INT;
    
    SELECT UserID INTO lostUser FROM Items WHERE ItemID = NEW.LostItemID;
    SELECT UserID INTO foundUser FROM Items WHERE ItemID = NEW.FoundItemID;

    -- Alert Lost Item Owner
    INSERT INTO Alerts (ItemID, UserID, AlertType, Message, AlertDate)
    VALUES (NEW.LostItemID, lostUser, 'Match Found', 'A potential match has been found for your lost item!', NOW());
    
    -- Alert Found Item Reporter
    INSERT INTO Alerts (ItemID, UserID, AlertType, Message, AlertDate)
    VALUES (NEW.FoundItemID, foundUser, 'Match Found', 'The item you found matches a lost report!', NOW());
END //

DELIMITER ;
"""

# --- Data Generation ---

def generate_users_sql():
    sql = "INSERT INTO Users (Name, Contact, Location, RoleID, Email) VALUES \n"
    values = []
    # Make sure we have unique emails
    for i in range(NUM_USERS):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        name = f"{fname} {lname}"
        contact = f"+91-{random.randint(7000000000, 9999999999)}" if random.random() > 0.5 else f"+92-{random.randint(3000000000, 3999999999)}"
        city = random.choice(CITIES)
        email = f"{fname.lower()}.{lname.lower()}{i}@example.com"
        role = 1 if i < 5 else 3 # First 5 admins, rest regular
        values.append(f"({escape_sql(name)}, {escape_sql(contact)}, {escape_sql(city)}, {role}, {escape_sql(email)})")
    return sql + ",\n".join(values) + ";"

def generate_items_sql():
    sql = "INSERT INTO Items (ItemName, Description, UserID, CategoryID, ConditionID, PriorityID, LocationFoundOrLost, Status, DateReported, ImageURL) VALUES \n"
    values = []
    for i in range(NUM_ITEMS):
        item_name = random.choice(ITEM_NAMES)
        desc = random.choice(DESCRIPTIONS)
        user_id = random.randint(1, NUM_USERS)
        cat_id = random.randint(1, 8)
        cond_id = random.randint(1, 5)
        prio_id = random.randint(1, 3)
        loc_id = random.randint(1, NUM_LOCATIONS)
        status = random.choice(['Lost', 'Found', 'Stolen'])
        date = get_random_date()
        values.append(f"({escape_sql(item_name)}, {escape_sql(desc)}, {user_id}, {cat_id}, {cond_id}, {prio_id}, {loc_id}, {escape_sql(status)}, '{date}', NULL)")
    return sql + ",\n".join(values) + ";"

def generate_reports_sql():
    sql = "INSERT INTO Reports (ItemID, UserID, ReportType, ReportDate) VALUES \n"
    values = []
    for i in range(NUM_REPORTS):
        item_id = random.randint(1, NUM_ITEMS)
        user_id = random.randint(1, NUM_USERS)
        rtype = random.choice(['Lost', 'Found', 'Stolen'])
        date = get_random_date()
        values.append(f"({item_id}, {user_id}, {escape_sql(rtype)}, '{date}')")
    return sql + ",\n".join(values) + ";"

def generate_tags_sql():
    sql = "INSERT INTO ItemTags (ItemID, TagName) VALUES \n"
    values = []
    for i in range(1, NUM_ITEMS + 1):
        if random.random() > 0.3:
            tag = random.choice(TAGS_POOL)
            values.append(f"({i}, {escape_sql(tag)})")
    return sql + ",\n".join(values) + ";"

def generate_notification_settings_sql():
    sql = "INSERT INTO NotificationSettings (UserID, EmailAlerts, SMSAlerts, PushAlerts) VALUES \n"
    values = []
    for i in range(1, NUM_USERS + 1):
        values.append(f"({i}, 1, {random.randint(0,1)}, 1)")
    return sql + ",\n".join(values) + ";"


# --- Main Execution ---
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(HEADER_SQL + "\n")
    f.write(TABLES_SQL + "\n")
    f.write(STATIC_DATA_SQL + "\n")
    f.write(DYNAMIC_LOCATIONS_SQL + "\n")
    f.write(generate_users_sql() + "\n")
    f.write(generate_items_sql() + "\n")
    f.write(generate_tags_sql() + "\n")
    f.write(generate_reports_sql() + "\n")
    f.write(generate_notification_settings_sql() + "\n")
    f.write(LOGIC_SQL + "\n")
    f.write("SET FOREIGN_KEY_CHECKS = 1;\n")
    f.write("-- END OF SCRIPT")

print(f"Successfully generated {OUTPUT_FILE}")
