const inquirer = require("inquirer");
const mysql = require("mysql2");
var cTable = require("console.table");

// Connect to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

function prompt() {
  runPrompts();
}

function runPrompts() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userChoice",
        message: "What do you want to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add an employee",
          "Add a role",
          "Delete a role",
          "Exit",
        ],
      },
    ])
    .then((choice) => {
      switch (choice.userChoice) {
        case "View all departments":
          showDepartments();
          break;
        case "View all roles":
          showRoles();
          break;
        case "View all employees":
          showEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a role":
          addRole();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Exit":
          return;
      }
    });
}

const showDepartments = () => {
  const sql = `SELECT department.id, department.name AS department FROM department`;
  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.log("Showing all the departments...\n");
      console.table(rows);
      runPrompts();
    })
    .catch((error) => {
      throw error;
    });
};

const showRoles = () => {
  const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id=department.id`;
  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.log("Showing all the roles...\n");
      console.table(rows);
      runPrompts();
    })
    .catch((error) => {
      throw error;
    });
};

const showEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,  ' ', manager.last_name) as Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;
  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.log("Showing all the employees...\n");
      console.table(rows);
      runPrompts();
    })
    .catch((error) => {
      throw error;
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "What is name of department you want to add?",
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO department (name)
          VALUES (?)`;

      connection.query(sql, answers.addDepartment, (err, result) => {
        if (err) {
          throw err;
        } else {
          console.log(answers.addDepartment + " is added to deparments");
        }
        showDepartments();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the employee?",
      },
    ])
    .then((answers) => {
      // get the answer out of the object
      const firstName = answers.firstName;
      const lastName = answers.lastName;
      // make a call to mysql to get all the available roles
      const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id=department.id`;

      connection
        .promise()
        .query(sql)
        .then(([rows]) => {
          const roleChoice = rows.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "choose the role the employee belongs to",
                choices: roleChoice,
              },
            ])
            .then((answers) => {
              const roleId = answers.role;

              const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,  ' ', manager.last_name) as Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;

              connection
                .promise()
                .query(sql)
                .then(([rows]) => {
                  const managerChoice = rows.map(
                    ({ id, first_name, last_name }) => ({
                      name: `${first_name} ${last_name}`,
                      value: id,
                    })
                  );
                  managerChoice.unshift({ name: "None", value: null });

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager_id",
                        message: "choose the manager the employee belongs to",
                        choices: managerChoice,
                      },
                    ])
                    .then((answers) => {
                      const employeeObj = {
                        first_name: firstName,
                        last_name: lastName,
                        role_id: roleId,
                        manager_id: answers.manager_id,
                      };

                      const sql = `INSERT INTO employee SET ?`;

                      connection.query(sql, employeeObj, (err, rows) => {
                        if (err) {
                          throw err;
                        } else {
                          console.log("New employee is added!");
                        }
                        showEmployees();
                      });
                    })
                    .catch((error) => {
                      throw error;
                    });
                });
            })
            .catch((error) => {
              throw error;
            });
        });
    });
};

const addRole = () => {
  const sql = `SELECT * FROM department`;

  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "department_id",
            message: "What is the department the new role belongs to?",
            choices: departmentChoices,
          },
          {
            type: "input",
            name: "title",
            message: "What is the role title?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the role salary?",
          },
        ])
        .then((answers) => {
          const roleSql = `INSERT INTO role SET ?`;
          connection.query(roleSql, answers, (err, result) => {
            if (err) {
              throw err;
            } else {
              console.log(answers.role + " is added to roles");
            }
            showRoles();
          });
        });
    })
    .catch((error) => {
      throw error;
    });
};

const deleteRole = () => {
  const sql = `SELECT * FROM role`;
  connection.query(sql, (err, data) => {
      if (err) throw err;
      const role = data.map(({ title, id }) => ({ name: title, value: id }));
      inquirer.prompt([
          {
              type: 'list',
              name: 'roleChoice',
              message: 'Which role you want to delete?',
              choices: role
          }
      ]).then(choice => {
          const role = choice.roleChoice;
          const roleSql = `DELETE FROM role WHERE id=?`;
          connection.query(roleSql, role, (err, result) => {
              if (err) throw err;
              console.log("Successfully deleted!");
              showRoles();
          });
      });
  });
};

prompt();
