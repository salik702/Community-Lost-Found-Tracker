-- Community Lost & Stolen Items Tracker Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS CommunityTrackerDB;
USE CommunityTrackerDB;

-- Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Conditions table
CREATE TABLE Conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    categoryId INT,
    conditionId INT,
    location VARCHAR(255),
    status ENUM('Lost', 'Found', 'Stolen') NOT NULL DEFAULT 'Lost',
    userId INT NOT NULL,
    dateReported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (conditionId) REFERENCES Conditions(id) ON DELETE SET NULL
);

-- Comments table
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    itemId INT NOT NULL,
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (itemId) REFERENCES Items(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Insert sample seed data
INSERT INTO Categories (name) VALUES 
('Electronics'),
('Clothing'),
('Jewelry'),
('Documents'),
('Keys'),
('Wallet/Purse'),
('Other');

INSERT INTO Conditions (name) VALUES 
('New'),
('Good'),
('Fair'),
('Poor'),
('Broken');

INSERT INTO Users (name, email) VALUES 
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');

INSERT INTO Items (name, description, categoryId, conditionId, location, status, userId, dateReported) VALUES 
('iPhone 12', 'Black iPhone 12 with cracked screen', 1, 4, 'Central Park', 'Lost', 1, '2023-05-15 10:30:00'),
('Leather Wallet', 'Brown leather wallet with ID and credit cards', 6, 2, 'Downtown Library', 'Found', 2, '2023-05-16 14:45:00'),
('Silver Necklace', 'Delicate silver chain with heart pendant', 3, 1, 'Main Street Cafe', 'Stolen', 3, '2023-05-17 09:15:00');

INSERT INTO Comments (content, itemId, userId) VALUES 
('Has anyone turned this in?', 1, 1),
('I think I saw this at the library info desk', 1, 2),
('I found this wallet and turned it in to the library staff', 2, 2);