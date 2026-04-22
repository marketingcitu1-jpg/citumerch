-- ============================================================
-- CIT-U Inventory System - Database Setup Script
-- Run this in phpMyAdmin or MySQL CLI before starting backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS citu_inventory
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE citu_inventory;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    role VARCHAR(255),
    employee_id VARCHAR(100) UNIQUE,
    user_role ENUM('ADMIN','STAFF') NOT NULL DEFAULT 'STAFF',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    status ENUM('IN_STOCK','LOW_STOCK','OUT_OF_STOCK') NOT NULL DEFAULT 'IN_STOCK',
    location VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(100) NOT NULL,
    student_email VARCHAR(255),
    course VARCHAR(255),
    year_level VARCHAR(50),
    total_amount DECIMAL(10,2),
    status ENUM('PENDING','PAID','CLAIMED') NOT NULL DEFAULT 'PENDING',
    date_reserved DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_claimed DATETIME
);

-- Order items (one-to-many)
CREATE TABLE IF NOT EXISTS order_items (
    order_id BIGINT NOT NULL,
    item_name VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Default admin user (password: Admin@123)
INSERT IGNORE INTO users (name, email, password, department, role, employee_id, user_role)
VALUES (
    'System Administrator',
    'admin@cit.edu',
    '$2a$10$N/6v1JoQVOnV6YVxFc8.Pux6Y/a7Y4CtG7x7ZdLdXZi8XKC.8T4bS',
    'ICT Department',
    'Administrator',
    'EMP-00001',
    'ADMIN'
);

-- Sample staff user (password: Staff@123)
INSERT IGNORE INTO users (name, email, password, department, role, employee_id, user_role)
VALUES (
    'Juana Dela Cruz',
    'j.delacruz@cit.edu',
    '$2a$10$5lbpV5Xcy1P.eF4p5dYfbOiDEXLZfNVq9lVBpYEr/bMiXPvASLPiK',
    'College of Engineering',
    'Head of Procurement',
    'EMP-00002',
    'STAFF'
);

-- Sample inventory items
INSERT IGNORE INTO inventory_items (name, category, quantity, unit_price, status, location) VALUES
    ('Dell Latitude 5420', 'IT Equipment', 12, 45000.00, 'IN_STOCK', 'IT Lab A'),
    ('Ergonomic Office Chair', 'Furniture', 45, 3200.00, 'IN_STOCK', 'Warehouse A'),
    ('Hand Sanitizer (1L)', 'Consumables', 3, 280.00, 'LOW_STOCK', 'Storage Room B'),
    ('HP LaserJet Pro M404n', 'IT Equipment', 7, 18500.00, 'IN_STOCK', 'Admin Office'),
    ('A4 Copy Paper (80gsm)', 'Office Supplies', 8, 350.00, 'LOW_STOCK', 'Warehouse B, Shelf 4'),
    ('Whiteboard Marker Set', 'Office Supplies', 50, 120.00, 'IN_STOCK', 'Supply Room'),
    ('HP LaserJet 85A Black Toner', 'IT Equipment', 2, 2800.00, 'LOW_STOCK', 'IT Lab Storage');
