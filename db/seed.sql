INSERT INTO departments(name) VALUES ("HR"),
("Development"),
("Production"),
("Design");

INSERT INTO roles (title, salary, department_id)
VALUES ("HR Rep", 60000, 1),
       ("Marketing", 90000, 3),
       ("Artist", 80000, 4),
       ("Developer", 75000, 2),
       ("Lead Developer", 90000, 2),
       ("Art Director", 100000, 4),
       ("Project Manager", 130000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Toby", "Flenderson", 1, NULL),
       ("Fiera", "Deigh", 2, 10),
       ("Alex", "Johnson", 2, 10),
       ("Phillip", "Danger", 3, 9),
       ("Jordan", "Tarrell", 3, 9),
       ("Constance", "Green", 4, 8),
       ("Crystal", "Pith", 4, 8),
       ("Richard", "Patts", 5, 10),
       ("Stan", "Lee", 6, 10),
       ("John", "Touchton", 7, NULL)
