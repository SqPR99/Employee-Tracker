USE employeesDB;

INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Design");
INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 300000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 200000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 125000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Designer", 200000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Designer", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Patrick", "Ross", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Samuel", "Jackson", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brad", "Pitt", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emma", "Roberts", 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jamie Lee", "Curtis", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Idris", "Elba", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dwayne", "Johnson", 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emma", "Stone", 1, 2);