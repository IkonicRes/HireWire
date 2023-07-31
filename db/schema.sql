DROP DATABASE IF EXISTS hirewire_db;

CREATE DATABASE hirewire_db;

USE hirewire_db;

CREATE TABLE employees_db (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(36) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role_db(id)
);

CREATE TABLE role_db (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department_db(id)
);

CREATE TABLE department_db (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);
