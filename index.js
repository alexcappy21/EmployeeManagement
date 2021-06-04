const inquirer = require("inquirer");
require("console.table");
const connection = require("./config/connection");

const menuOptions = async () => {
    await inquirer
        .prompt([
            {
                type: 'list',
                name: "options",
                message: "What would you like to do?",
                choices: ['Add Employees', 'Add Roles', 'Add Departments', 'View Employees', 'View Roles', 'View Departments', 'Update Employee Role', 'Exit']
            }
        ]).then(answer => {
            console.log(answer)
            switch (answer.options) {
                case 'View Employees':
                    viewEmployees();
                    break;

                case 'View Roles':
                    viewRoles();
                    break;

                case 'View Departments':
                    viewDepartments();
                    break;

                case 'Add Employees':
                    addEmployees();
                    break;

                case 'Add Departments':
                    addDept();
                    break;

                case 'Add Roles':
                    addRoles();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Exit':
                    exitSession();
                    break;
            }
        })
}

function viewEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.salary, role.title, employee.department_id
    FROM employee 
    INNER JOIN role 
    ON employee.role_id = role.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //added \n to make table readable
        console.log('\n')
        console.table(res);
        menuOptions();
    })
}

function viewRoles() {
    const query = `SELECT role.title, role.salary, role.department_id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id
    FROM role
    INNER JOIN employee
    ON role.id = employee.role_id
    ORDER BY role.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res);
        menuOptions();
    })
}

function viewDepartments() {
    const query = `SELECT department.id, department.name, employee.id, employee.first_name, employee.last_name
    FROM department
    INNER JOIN employee
    ON employee.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res);
        menuOptions();
    })
}

async function addEmployees() {
    await inquirer
        .prompt([
            {
                type: "input",
                name: "firstname",
                message: "What is the new team members first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the new team members last name?"
            },
            {
                type: "list",
                name: "newrole",
                message: "Choose new team members role",
                choices: ["Intern Software Developer", "Jr Software Developer", "Software Engineer", "Sr Software Engineer", "Test Engineer", "Lead test Engineer"]
            },
            {
                type: "list",
                name: "managerID",
                message: "Choose new team members manager",
                choices: ["Joe Boss", "Proj Man"]
            },
            {
                type: "list",
                name: "deptID",
                message: "Choose new team members department",
                choices: ["Engineering", "Quality Assurance"]
            },

        ]).then(answer => {
            console.log(answer)

            if (answer.managerID === "Proj Man") {
                manager_id = 2
            } else { manager_id = 1 }

            if (answer.newrole === "Intern Software Developer") {
                role_id = 3
            } else if (answer.newrole === "Jr Software Developer") {
                role_id = 4
            } else if (answer.newrole === "Software Engineer") {
                role_id = 5
            } else if (answer.newrole === "Sr Software Engineer") {
                role_id = 6
            } else if (answer.newrole === "Test Engineer") {
                role_id = 7
            } else if (answer.newrole === "Lead test Engineer") {
                role_id = 8
            }

            if (answer.deptID === "Engineering") {
                department_id = 2
            } else { department_id = 3 }

            let values = {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id,
                manager_id,
                department_id
            }
            connection.query("INSERT INTO employee SET ?",
                values,
                function (err, res) {
                    if (err) throw err;
                    console.table(values);
                    menuOptions();
                })
        })
}

async function addDept() {
    await inquirer
        .prompt([
            {
                type: "input",
                name: "newDept",
                message: "Enter new department name"
            },

        ]).then(answer => {
            console.log(answer)
            connection.query(`INSERT INTO department SET ?`,
                {
                    name: answer.newDept,
                },
                function (err, res) {
                    if (err) throw err;
                    menuOptions();
                })
        })
}

function addRoles() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newTitle",
                message: "What's the new roles title?"
            },
            {
                type: "input",
                name: "newSalary",
                message: "What's the new roles salary?"
            },
            {
                type: "input",
                name: "deptID",
                message: "What's the new roles departmentID?"
            },

        ]).then(answer => {
            console.log(answer)
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.newTitle,
                    salary: answer.newSalary,
                    department_id: answer.deptID
                },
                function (err, res) {
                    if (err) throw err;
                    menuOptions();
                })
        })
}

async function updateRole() {
    try {
        const empID = await inquirer
            .prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What is the employee's ID number?"
                }
            ]);
        connection.query('SELECT role.id, role.title, department_id FROM role', async (err, res) => {
            if (err) throw err;
            const { role } = await inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    choices: () => res.map(res => res.title),
                    message: 'What is the new employees role?: '
                }
            ]);
            let deptID;
            for (const selected of res) {
                if (selected.title === role) {
                    deptID = selected.department_id
                }
            }
            if (res.title === role.name) {
                connection.query(`UPDATE employee
              SET department_id = ${deptID}
              WHERE employee.id = ${empID.name}`, async (err, res) => {
                    if (err) throw err;
                    menuOptions();
                });
            }

            let roleId;
            for (const selected of res) {
                if (selected.title === role) {
                    roleId = selected.id;
                    continue;
                }
            }

            connection.query(`UPDATE employee 
            SET role_id = ${roleId} 
            WHERE employee.id = ${empID.name}`, async (err, res) => {
                if (err) throw err;
                menuOptions();
            });
        })
    } catch (err) {
        console.log(err)
    }
}

function exitSession() {
    console.log(`Session ended by id #${connection.threadId}`)
    connection.end();
}

menuOptions();