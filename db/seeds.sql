-- Departments
INSERT INTO department (name)
VALUES
    ('HR'),
    ('Marketing'),
    ('Sales'),
    ('Finances'),
    ('HR'),
    ('R&D'),
    ('IT');

-- Roles
INSERT INTO roles (title, salary, department_id)
VALUES
    ('HR Manager', 150000, 1),
    ('HR Employee', 60000, 1),
    ('Marketing Manager', 100000, 2),
    ('Marketing Employee', 60000, 2),
    ('Sales Manager', 100000, 3),
    ('Sales Employee', 60000, 3),
    ('Finances Manager', 90000, 4),
    ('Finances Employee', 60000, 4),
    ('HR Manager', 100000, 5),
    ('HR Employee', 60000, 5),
    ('R&D Manager', 120000, 6),
    ('R&D Employee', 60000, 6),
    ('IT Manager', 150000, 7),
    ('IT Employee', 60000, 7);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, 1),
    ('Jane', 'Doe', 2, 1),
    ('Amber', 'Smith', 3, 3),
    ('Jayden', 'Powers', 4, 3),
    ('Aiden', 'Doe', 5, 5),
    ('Sarah', 'Williams', 6, 5),
    ('Austin', 'Gold', 7, 7),
    ('Robert', 'Watt', 8, 7),
    ('Mitchel', 'Walker', 9, 9),
    ('Ken', 'Neyith', 10, 9),
    ('David', 'Bowie', 11, 11),
    ('Joseph', 'Singleton', 12, 11),
    ('John', 'Lemon', 13, 13),
    ('Richard', 'Seltzer', 14, 13);
