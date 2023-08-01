-- Drop the database if it already exists
DROP DATABASE IF EXISTS hirewire_db;

-- Create the database
CREATE DATABASE hirewire_db;

-- Switch to the newly created database
USE hirewire_db;

-- Create the department_db table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(36) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);


