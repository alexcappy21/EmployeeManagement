USE employees_DB;

INSERT INTO department (name)
VALUES ("Management"), ("Engineering"), ("Quality Assurance");

INSERT INTO role (title, salary, department_id)
VALUES ("General Manager", 140000, 1),
    ("Project Manager", 100000, 1),
    ("Intern Software Developer", 40000, 2),
    ("Jr Software Developer", 50000, 2),
    ("Software Engineer", 75000, 2),
    ("Sr Software Engineer", 90000, 2),
    ("Test Engineer", 50000, 3),
    ("Lead test Engineer", 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES ("Joe", "Boss", 1, NULL, 1),
    ("Proj", "Man", 2, 1, 1),
    ("Rachel", "Diaz", 3, 2, 2),
    ("Nathan", "Peek", 4, 2, 2),
    ("James", "Sen", 5, 2, 2),
    ("Alex", "Tes", 7, 2, 3),
    ("Ella", "Fitz", 8, 2, 3);
