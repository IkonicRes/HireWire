INSERT INTO dept_db(name) VALUES ("HR"),
("Development"),
("Production"),
("Design"),

INSERT INTO role_db (title, salary, department_id)
VALUES ("HR", 60000, 0),
       ("Marketing", 90000, 2),
       ("Artist", 80000, 3),
       ("Developer", 75000, 1),
       ("Lead Developer", 90000, 1),
       ("Art Director", 100000, 3),
       ("Project Manager", 130000, 1),

INSERT INTO employees_db (first_name, last_name, role_id, manager_id)
VALUES ("Toby", "Flenderson", 0, 0),
       ("Afro", "Samari", 1, 0),
       ("Stan", "Lee", 1, 0),
       ("Miss", "Bushbush", 2, 3),
       ("Saitama", "Genos", 3, 3);