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
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, 1),
    ('Jane', 'Doe', 2, 1),
    ('Amber', 'Smith', 3, 2),
    ('Jayden', 'Powers', 4, 2)
    ('Aiden', 'Doe', 5, 3),
    ('Sarah', 'Williams', 5, 3),
    ('Austin', 'Gold', 6, 4),
    ('Robert', 'Watt', 7, 4),
    ('Mitchel', 'Walker', 8, 5),
    ('Ken', 'Neyith', 9, 5),
    ('David', 'Bowie', 10, 6);
    ('Joseph', 'Singleton', 11, 6);
    ('John', 'Lemon', 12, 7);
    ('Richard', 'Seltzer', 13, 7);
    ('George', 'Harvey', 14, 8);
    ('Isaic', 'Palmer', 15, 8);
