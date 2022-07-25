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

function init() {
  runPrompts();
}

function runPrompts() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userChoice",
        message: "What do you want to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", 
        "Add an employee", "Add a role", "View employees by department", "Delete a department", "Delete a role", "Delete an employee", "Exit",],
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
        case "View employees by department":
          employeeDepartment();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Exit":
          return;
      }
    });
}


