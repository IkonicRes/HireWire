const { getThingFromDatabase, updateDatabase } = require('./db');
const chalkAnimation = require('./chalk')
const inquire = require('inquirer')
const readline = require('readline');
const fs = require('fs')


const titleTextBefore = `
*██░ ██* ██▓ ██▀███**▓█████**█* ***█░ ██▓ ██▀███**▓█████*
▓██░*██▒▓██▒▓██*▒ ██▒▓█***▀ ▓█░*█*░█░▓██▒▓██*▒*██▒▓█***▀*
▒██▀▀██░▒██▒▓██*░▄█*▒▒███***▒█░*█*░█ ▒██▒▓██*░▄█*▒▒███***
░▓█ ░██ ░██░▒██▀▀█▄* ▒▓█**▄ ░█░*█*░█ ░██░▒██▀▀█▄* ▒▓█**▄ 
░▓█▒░██▓░██░░██▓ ▒██▒░▒████▒░░██▒██▓ ░██░░██▓ ▒██▒░▒████▒
▒*░░▒░▒░▓* ░*▒▓*░▒▓░░░*▒░*░░*▓░▒*▒**░▓* ░*▒▓*░▒▓░░░*▒░*░*
▒*░▒░*░*▒*░**░▒*░*▒░*░*░**░**▒*░*░***▒*░**░▒*░*▒░*░*░**░*
░  ░░ ░ ▒ ░  ░░   ░    ░     ░   ░   ▒ ░  ░░   ░    ░    
░  ░  ░ ░     ░        ░  ░    ░     ░     ░        ░  ░ 
~~~~~~~~~~~~~PRESS ANY BUTTON TO CONTINUE...~~~~~~~~~~~~~                                                      









`
const titleTextAfter = `
*██░ ██* ██▓ ██▀███**▓█████**█* ***█░ ██▓ ██▀███**▓█████*
▓██░*██▒▓██▒▓██*▒ ██▒▓█***▀ ▓█░*█*░█░▓██▒▓██*▒*██▒▓█***▀*
▒██▀▀██░▒██▒▓██*░▄█*▒▒███***▒█░*█*░█ ▒██▒▓██*░▄█*▒▒███***
░▓█ ░██ ░██░▒██▀▀█▄* ▒▓█**▄ ░█░*█*░█ ░██░▒██▀▀█▄* ▒▓█**▄ 
░▓█▒░██▓░██░░██▓ ▒██▒░▒████▒░░██▒██▓ ░██░░██▓ ▒██▒░▒████▒
▒*░░▒░▒░▓* ░*▒▓*░▒▓░░░*▒░*░░*▓░▒*▒**░▓* ░*▒▓*░▒▓░░░*▒░*░*
▒*░▒░*░*▒*░**░▒*░*▒░*░*░**░**▒*░*░***▒*░**░▒*░*▒░*░*░**░*
░  ░░ ░ ▒ ░  ░░   ░    ░     ░   ░   ▒ ░  ░░   ░    ░    
░  ░  ░ ░     ░        ░  ░    ░     ░     ░        ░  ░ 









`
var titleText = titleTextBefore

const scrollPrint = () => {
  let delay = 200;
  return async (s) => {
      const rainbow = chalkAnimation.animateString(s, delay, 7.5);
      setTimeout(() => {
        state = "active";
        console.log()
        rainbow.stop(); // Animation stops
      }, 500);
      
      setTimeout(() => {
        state != 'init' ? rainbow.start() : console.log("init"); // Animation resumes
      }, 500);
    }
};

const getDepartmentTitles = async () => {
  const departments = await getThingFromDatabase('departments');
  return departments.map(({name, id}) => ({name: name, value: id }));
};

const getRoleTitles = async () => {
  const roles = await getThingFromDatabase('roles');
  console.log(roles)
  return roles.map(({title, salary, department_id}) => ({Role: title, Salary: salary, Department_ID: department_id}));
};

const getEmployeeNames = async () => {
  const employees = await getThingFromDatabase('employees');
  console.log(employees)
  return employees.map(({first_name, last_name, role_id, manager_id}) => ({First_Name: first_name, Last_Name: last_name, Role_ID: role_id, Manager_ID: manager_id}));
};

async function viewAllEmployees(employees) {
  try {
    const employee_names = await getEmployeeNames()
    return employee_names;
  } catch (error) {
    console.log(error); // Log the error to the file
  }
}

const addRole = async () => {
  let tDepts = await getDepartmentTitles()
  console.log(tDepts)
  try {
    const data = await inquire.prompt(
      [
        {
          name: "roleName",
          message: "What is the name of the role you would like to add?",
          type: "input"
        },
        {
          name: "salary",
          message: "What is the salary of your new role?",
          type: "input"
        },
        {
          name: "departmentId",
          message: "What department would you like to add the role to?",
          type: "list",
          choices: tDepts,
        }
      ]
    );
    updateDatabase(data, 'roles')
  } catch (error) {
    console.log(error); // Log the error to the file
  }
};

const updateEmployeeRole = async () => {
  try {
    const data = await inquire.prompt(
      /* Your questions here */
    );
    console.log(data);
  } catch (error) {
    console.log(error); // Log the error to the file
  }
};

async function addEmployee() {
  getRoleTitles
  try {
    const data = await inquire.prompt(
      [
        {
          name: "fName",
          message: "What is the first name of the employee you would like to add?",
          type: "input"
        },
        {
          name: "lName",
          message: "What is the last name of the employee?",
          type: "input"
        },
        {
          name: "roleId",
          message: "What is the salary of your new role?",
          type: "input"
        },
        {
          name: "departmentId",
          message: "What department would you like to add the role to?",
          type: "list",
          choices: tDepts,
        }
      ]
    );
    updateDatabase(data, 'roles')
  } catch (error) {
    console.log(error); // Log the error to the file
  }
}

const addDepartment = async () => {
  try {
    const data = await inquire.prompt(
      [
        {
          name: "departmentName",
          message: "What is the name of the department you would like to add?",
          type: "input"
        },
      ]
    );
    updateDatabase(data, 'departments')
  } catch (error) {
    console.log(error); // Log the error to the file
  }
};

const printTable = (arr) => {
  // console.log("log ", arr)
  console.table(arr)
}

async function menu(employees, departments, roles) {
  const prompt = inquire.createPromptModule(); // Create a prompt module
  titleText = titleTextAfter;
  const answer = await prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'menu',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit',
    ],
  });

  // console.clear(); // Clear the console before displaying the menu options
  const choice = answer.menu;
  var continue_ = true;

  switch (choice) {
    case 'View All Employees':
      allEmployees = await viewAllEmployees(employees); // Pass the 'employees' array as an argument
      printTable(allEmployees)
      break;
    case 'Add Employee':
      await addEmployee();
      break;
    case 'Update Employee Role':
      await updateEmployeeRole();
      break;
    case 'View All Roles':
      var roleTitles = await getRoleTitles();
      printTable(roleTitles)
      break;
    case 'Add Role':
      await addRole();
      break;
    case 'View All Departments':
      var deptTitles = await getDepartmentTitles();
      printTable(deptTitles)
      break;
    case 'Add Department':
      await addDepartment();
      break;
    case 'Quit':
      continue_ = false;
      break;
    default:
      console.log('Invalid choice. Please try again.\n');
      break;
  }

  if (continue_) {
    console.log('\n'); // Add an empty line after the menu options
    return menu(employees, departments, roles); // Show the menu again for the next choice
  }
}

async function startApp() {
  const characters = titleText.split('');
  const print = scrollPrint();
  print(titleText);
  print('');
  setTimeout(async () => {
    try {
      const employees = await getThingFromDatabase('employees');
      const departments = await getThingFromDatabase('departments');
      const roles = await getThingFromDatabase('roles');
      await menu(employees, departments, roles);
    } catch (error) {
      console.log("startApp error: ", error); // Log the error to the file
    }
  }, 500);
}

// Call the startApp function to start the application
startApp();