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
      INNER JOIN department
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
      `SELECT employee.id, employee.first_name, 
      employee.last_name, emp_role.title, department.name, 
      emp_role.salary FROM employee, role, 
      department WHERE department.id = emp_role.department_id AND emp_role.id = employee.role_id 
      ORDER BY employee.id ASC`,
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
    db.query("SELECT CONCAT(first_name,' ',last_name) AS NAME FROM employee", (err, results) => {
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
          name: "choice2",
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

    db.query("SELECT * FROM emp_role", async function (err, results) {
      if (err) throw err;
  
      const rolesList = results.map(function (item) {
        return item.title;
      })

    const employees = await employeeList();  
    const Listemployees = employees.map(function (item) {
      return item.NAME
    })


    inquirer.prompt([
      {
        name: "employeename",
        type: "rawlist",
        message: "Which employee would you like to update?",
        choices: Listemployees
      },
      {
        name: "updateRole",
        type: "rawlist",
        message: "what is the employee's new role?",
        choices: rolesList
      },

    ]).then(function (answer) {
      db.query = "UPDATE emp_role SET title WHERE id=${answers.id}  INTO emp_role VALUES (?)",
      [{ title: answer.updateRole }], function (err) {
        if (err) throw err;
        console.table("role updated!");
        init();
      }});
    })
  };
  

