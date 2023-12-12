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

//check is database is working and logged in properly
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        //run sequelize.sync to create tables from models
        return sequelize.sync();
    })
    .then(() => {
        //start server
        app.listen(PORT, () => console.log('Now listening'));
        //call promptUser function
        promptUser();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


// Prompts for the user to select an action
const promptUser = async () => {
    const answers = await inquirer.prompt([
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
        .then(answers => {
            const { choices } = answers;

            //switch case for each choice calling the relative function
            switch (choices) {
                case 'View All Employees':
                    showEmployees();
                    break;
                case 'Add Employee':
                    addEmployees();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    showRoles();
                    break;
                case 'Add Role':
                    addRoles();
                    break;
                case 'View All Departments':
                    showDepartments();
                    break;
                case 'Add Department':
                    addDepartments();
                    break;
                case 'Exit':
                    sequelize.close();
                    process.exit();
                default:
                    console.log('Invalid choice');
                    break;
            }
        })
        .catch(err => {
            console.error(err);
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
        promptUser();
    } catch (err) {
        console.error(err);
        promptUser();
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
        promptUser();
    } catch (err) {
        console.error(err);
        promptUser();
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
        promptUser();
    } catch (err) {
        console.error(err);
        promptUser();
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
        promptUser();
    } catch (err) {
        console.error(err);
        promptUser();
    }
};

// Helper to get all department choices
function getDepartmentChoices() {
    return Department.findAll()
        .then((departments) => {
            return departments.map((department) => ({
                name: department.name,
                value: department.id,
            }));
        })
        .catch((err) => {
            console.error(err);
        });
};

// Helper to get all role choices
function getRoleChoices() {
    return Role.findAll()
        .then(roles => {
            return roles.map(role => ({
                name: role.title,
                value: role.id,
            }));
        })
        .catch(err => {
            console.error(err);
        });
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
        promptUser();
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
    promptUser();
};

//function to add new departments
function addDepartments() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:',
        },
    ])
        .then(answer => {
            const { name } = answer;

            Department.create({ name })
                .then(() => {
                    console.log(`Added ${name} department.`);
                    showDepartments();
                })
                .catch(err => {
                    console.error(err);
                    promptUser();
                });
        })
        .catch(err => {
            console.error(err);
            promptUser();
        });
};