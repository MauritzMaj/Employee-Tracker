INSERT INTO department (department_name)
VALUES
('MANAGEMENT'),
('SALES'),
('FINANCE'),
('DEVELOPERS'),
('SECURITY');

INSERT INTO role (title, salary, department_id)
VALUES
('General Manager', 200000, 1),
('Assistant Manager', 170000, 1),
('Sales Manager', 120000, 1),
('Financial Manager', 150000, 1),
('Security Manager', 150000, 1),

('Senior Sales Associate', 80000, 2),
('Junior Sales Associate', 65000, 2),

('Senior Accountant', 85000, 3),
('Junior Accountant', 70000, 3),

('Front-end Developer', 95000, 4),
('Back-end Developer', 90000, 4),
('Software Engineer', 100000, 4),

('Junior Security Analyst', 95000, 5),
('Senior Security Analyst', 105000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Smith', 1, null),
('Anna', 'Delvaux', 2, 1)
('Derrick', 'Jones', 3, 1),
('Marjorie', 'Spits', 4, 1),
('Collin', 'Taylor', 5, 1),

('Hank', 'Toms', 6, 3),
('Woody', 'Gabels', 7, 3),

('Tim', 'Webber', 8 , 4),
('Mark', 'Doughty', 9, 4),

('Lola', 'Steiner', 10, 2),
('Janine', 'Chen', 11, 2),
('Harold', 'Loners', 12, 2),

('Nabil', "Sankur", 13, 5),
("Kendrick", "Potter", 14, 5);

{
        name: "choice",
        type: "rawlist",
        message: "who is the employee's manager?",
        choices: managerList
        
      }