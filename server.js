const express = require('express');
const inquirer = require('inquirer');
const sequelize = require('./config/connection');
const Employee = require('./models/employee');
const Role = require('./models/role');
const Department = require('./models/department');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

// Prompts for the user to select an action
const InquirerPrompt = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choices',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Exit',
                ],
            },
        ])
        // Switch statement to handle the user's selection
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View All Employees') {
                showEmployees();
            }

            if (choices === 'Add Employee') {
                addEmployees();
            }

            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choices === 'View All Roles') {
                showRoles();
            }

            if (choices === 'Add Role') {
                addRoles();
            }

            if (choices === 'View All Departments') {
                showDepartments();
            }

            if (choices === 'Add Department') {
                addDepartments();
            }

            if (choices === 'Exit') {
                sequelize.close();
                process.exit();
            }
        });
};

//show all employees
const showEmployees = async () => {
    try {
        const employees = await Employee.findAll({
            include: [
                {
                    model: Role,
                    include: {
                        model: Department,
                    },
                },
                {
                    model: Employee,
                    as: 'manager',
                    include: Role,
                },
            ],
        });

        const employeeData = employees.map((employee, index) => ({
            ID: employee.id,
            'First-Name': employee.first_name,
            'Last-Name': employee.last_name,
            Title: employee.role ? employee.role.title : 'N/A',
            Department: employee.role && employee.role.department ? employee.role.department.name : 'N/A',
            Salary: employee.role ? employee.role.salary : 'N/A',
            Manager: employee.manager ? `${employee.manager.first_name} ${employee.manager.last_name}` : 'N/A',
        }));

        console.table(employeeData);
        InquirerPrompt();
    } catch (err) {
        console.error(err);
        InquirerPrompt();
    }
};

// Add a new employee
const addEmployees = async () => {
    try {
        const departments = await getDepartmentChoices();
        const roles = await getRoleChoices();

        // Prompt for employee information
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter the employee's first name:",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the employee's last name:",
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department for this employee:',
                choices: departments,
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the role for this employee:',
                choices: roles,
            },
            {
                type: 'input',
                name: 'managerId',
                message: "Enter the employee's manager ID (if applicable):",
            },
        ]);

        const { firstName, lastName, departmentId, roleId, managerId } = answers;

        await Employee.create({
            first_name: firstName,
            last_name: lastName,
            department_id: departmentId,
            role_id: roleId,
            manager_id: managerId,
        });

        console.log(`Added ${firstName} ${lastName} to employees.`);
        // Return to the main menu
        InquirerPrompt();
    } catch (err) {
        console.error(err);
        InquirerPrompt();
    }
};

// Update an employee's role
const updateEmployeeRole = async () => {
    try {
        const employees = await Employee.findAll({
            include: Role,
        });

        // Create an array of employee choices for the inquirer prompt
        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name} - Current Role: ${employee.role.title}`,
            value: employee.id,
        }));

        const roles = await Role.findAll();

        // Create an array of role choices for the inquirer prompt
        const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));

        // Prompt the user to select an employee to update
        const employeeAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select an employee to update their role:',
                choices: employeeChoices,
            },
        ]);

        const { employeeId } = employeeAnswer;

        // Prompt the user to select a new role for the employee
        const roleAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the new role for the employee:',
                choices: roleChoices,
            },
        ]);

        const { roleId } = roleAnswer;

        // Update the employee's role in the database
        await Employee.update(
            {
                role_id: roleId,
            },
            {
                where: {
                    id: employeeId,
                },
            }
        );

        console.log('Employee role updated.');
        InquirerPrompt();
    } catch (err) {
        console.error(err);
        InquirerPrompt();
    }
};

// Show roles
const showRoles = async () => {
    console.log('Show all roles.');

    try {
        const roles = await Role.findAll({
            include: Department,
        });

        const roleData = roles.map((role) => ({
            id: role.id,
            title: role.title,
            salary: role.salary,
            department: role.department.name,
        }));

        console.table(roleData);
        InquirerPrompt();
    } catch (err) {
        console.error(err);
        InquirerPrompt();
    }
};

// Helper to get all role choices
async function getRoleChoices() {
    try {
        const roles = await Role.findAll();
        return roles.map(role => ({
            name: role.title,
            value: role.id,
        }));
    } catch (err) {
        console.error(err);
    }
};

// Add new roles info
const addRoles = async () => {
    try {
        const departments = await getDepartmentChoices();

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department for this role:',
                choices: departments,
            },
        ]);

        const { title, salary, departmentId } = answers;

        await Role.create({
            title,
            salary,
            department_id: departmentId,
        });

        console.log(`Added ${title} role to roles.`);
        showRoles();
    } catch (err) {
        console.error(err);
        InquirerPrompt();
    }
};

// Departments information
const showDepartments = async () => {
    console.log('All departments are showing.');

    // Query to retrieve department data
    const sql = `SELECT id, name FROM department`;

    try {
        const rows = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });

        // Check if any departments were found
        if (rows.length > 0) {
            console.table(rows);
        } else {
            console.log('No departments found.');
        }
    } catch (err) {
        console.error(err);
    }

    // Continue with the inquirer prompts
    InquirerPrompt();
};

// Helper to get all department choices
async function getDepartmentChoices() {
    try {
        const departments = await Department.findAll();
        return departments.map(department => ({
            name: department.name,
            value: department.id,
        }));
    } catch (err) {
        console.error(err);
    }
};

//function to add new departments
async function addDepartments() {
    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:',
            },
        ]);

        const { name } = answer;

        await Department.create({ name });

        console.log(`Added ${name} department.`);
        showDepartments();
    } catch (err) {
        console.error(err);
        InquirerPrompt();
    }
};

InquirerPrompt();