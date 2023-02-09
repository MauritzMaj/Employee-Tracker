// Import and require dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const PORT = process.env.PORT || 3001;


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'holygrail',
    database: 'employees_db'
  },

  console.log(`Connected to the employees_db database.`)

  );

  db.connect((err) => {
    if (err) throw err;
    init();
  });



//function with inquirer prompts
async function init () {inquirer.prompt([
    {   type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ]

    }

])
.then(function (response) {
    switch (response.options) {
      case "View all departments":
        viewDepartments() 
        break;
      case "View all roles":
        viewRoles() 
        break;
      case "View all employees":
        viewEmployees()  
        break;
      case "Add a department":
        addDepartment() 
        break;
      case "Add a role":
        addRole() 
        break;
      case "Add an employee":
        addEmployee() 
        break;
      case "Update an employee role":
        updateRole() 
        break;
    }
  })
};

// view all departments
async function viewDepartments() {
    db.query(
      `SELECT id AS ID, name AS "Department Name"
      FROM department`, function (err, data) {
      if (err) throw err;
      console.table(data)
      init();
    }
    )
  };
  
  // view all roles
  async function viewRoles() {
    db.query(
      `SELECT emp_role.id AS ID, 
        title AS "Employee Role", 
        emp_role.salary AS Salary, 
        department_id AS "Dept #", 
        name AS "Department"
      FROM emp_role
      JOIN department
      ON department.id = department_id`,
      function (err, data) {
        if (err) throw err;
        console.table(data)
        init();
      }
    )
  };
  
  // view all employees 
  async function viewEmployees() {
    db.query(
      /*`SELECT employee.id AS ID, 
        employee.first_name AS FirstName, 
        employee.last_name AS LastName, 
        emp_role.title AS Role, 
        emp_role.salary AS Salary, 
        department.name AS Department,
        manager.last_name AS Manager
  FROM employee
  JOIN department 
   ON emp_role.department_id = department.id
  JOIN emp_role 
    ON employee.role_id = emp_role.id
  LEFT JOIN employee manager 
      ON employee.manager_id = manager.id
  ORDER BY employee.id ASC`,*/
  `SELECT * FROM employee`,
      function (err, data) {
        if (err) throw err;
        console.table(data)
        init();
      }
    )
  };
  
  
  // add a department
  async function addDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: "title",
        message: "enter the new department name: "
      }
    ])
      .then(function (response) {
        var query = db.query("INSERT INTO department (name) VALUES (?)",
          [name = response.title],
  
          function (err, result) {
            if (err) throw err;
            console.log(response.title + " has been added to department list")
            init();
          })
      })
  }
  
  // add a role
  function addRole() {
    var roleQuery = "SELECT * FROM emp_role;";
    var departmentQuery = "SELECT * FROM department;";
  
    db.query(roleQuery, function (err, roles) {
      db.query(departmentQuery, function (err, department) {
  
        if (err) throw err;
  
        inquirer.prompt([
  
          {
            name: "newRole",
            type: "input",
            message: ["what role would you like to add?"]
          },
          {
            name: "newSalary",
            type: "input",
            message: "What is the salary you would like to add?"
          },
          {
            name: "choice",
            type: "rawlist",
            choices: function () {
              var arrayOfChoices = [];
              for (var i = 0; i < department.length; i++) {
                arrayOfChoices.push(department[i].name);
              }
  
              return arrayOfChoices;
            },
            message: "which department does this role belong to?"
          },
        ]).then(function (answer) {
          for (var i = 0; i < department.length; i++) {
            if (department[i].name === answer.choice) {
              answer.department_id = department[i].id;
            }
          }
          var query = "INSERT INTO emp_role SET ?"
          const values = {
            title: answer.newRole,
            salary: answer.newSalary,
            department_id: answer.department_id
          }
          db.query(query, values, function (err) {
            if (err) throw err;
            console.table("role created!");
            init();
          })
        })
      })
    })
  };
  

  
  // collect employees
  const employeeList = () => new Promise((resolve, reject) => {
    db.query("SELECT last_name AS NAME FROM employee", (err, results) => {
      if (err) throw err;
  
      return resolve(results);
    })
  });
  
  // add an employee 
  async function addEmployee() {
    let employeeQuery = "SELECT * FROM employee";
    let roleQuery = "SELECT * from emp_role";
    
   

    const employees = await employeeList();  
    const managerList = employees.map(function (item) {
      return item.NAME
    })
   
    
    db.query(employeeQuery, function (err, employees) {
    db.query(roleQuery, function (err, roles) {
      
    if(err) throw err;

    const rolesList = roles.map(function (item) {
      return item.title;

    })
    
          
  
      
  
      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "enter the employee's first name: "
        },
        {
          type: "input",
          name: "lastName",
          message: "enter the employee's last name: "
        },
        {
          name: "choice",
          type: "rawlist",
          message: "what is the employee's role?",
          choices: rolesList
        },
        {
          name: "manager",
          type: "rawlist",
          message: "who is the employee's manager?",
          choices: managerList
        }
      ])
      .then(function(response) {
        
        for (var i=0; i < roles.length; i++) {
            if(roles[i].title === response.choice) {
                response.role_id = roles[i].id;
            }
        }
        for (var i=0; i < employees.length; i++) {
            if(employees[i].last_name === response.manager) {
                response.manager_id = employees[i].id;
            }
        }

        var query = "INSERT INTO employee SET ?"

        const values = {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: response.role_id,
            manager_id: response.manager_id
        }
        db.query(query, values, function(err) {
            if(err) throw err;
            console.log(`${response.firstName} ${response.lastName} has been added!`);
            init();
        })

        });
    })
})};



  // Update Employee Role
  async function updateRole() {
    db.query(`SELECT * FROM emp_role;`, (err, res) => {
        if (err) throw err;
        const rolesList = res.map(function (item) {
          return ({name: item.title, value: item.id })
        
        })

        db.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            const employees = res.map(function(item) { 
              return ({name: item.first_name + ' ' + item.last_name, value: item.id })
            })
            console.log(employees);
              
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'rawlist',
                    message: 'Which employee would you like to update?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'rawlist',
                    message: 'What is their new role?',
                    choices: rolesList
                },
            ]).then((response) => {
                db.query(`UPDATE employee SET ? WHERE ?`, 
                [
                    {
                        role_id: response.newRole,
                    },
                    {
                        id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n Successfully updated employee's role in the database! \n`);
                    init();
                })
            })
        })
    })
}
  

