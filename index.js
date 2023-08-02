const { getThingFromDatabase, updateDatabase } = require('./db');
const chalkAnimation = require('./chalk')
const inquire = require('inquirer')
const readline = require("readline");
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
  return roles.map(({title, salary, department_id}) => ({Role: title, Salary: salary, Department_ID: department_id}));
};

const getRoleArray = async () => {
  const roles = await getThingFromDatabase('roles');
  return roles.map(({title}) => (title));
};

const getEmployeeNameArray = async () => {
  const employees = await getThingFromDatabase('employees');
  return employees.map(({first_name, last_name}) => (`${first_name} ${last_name}`));
};

const getEmployeeNames = async () => {
  const employees = await getThingFromDatabase('employees');
  return employees.map(({first_name, last_name, role_id, manager_id}) => ({First_Name: first_name, Last_Name: last_name, Role_ID: role_id, Manager_ID: manager_id}));
};

const getManagerName = async (id) => {
  if (id == null) {
    return null;
  }
  const managers = await getThingFromDatabase(`employees WHERE id = ${id}`);
  return managers.map(({first_name, last_name}) => (`${first_name} ${last_name}`))[0]
}

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
    // Get the list of employees from the database
    const employees = await getThingFromDatabase('employees');
    const employeeNames = employees.map(({ first_name, last_name, index }) => ({
      name: `${first_name} ${last_name}`,
      value: `${first_name} ${last_name}`,
    }));
    const roles = await getThingFromDatabase('roles');
    const roleTitles = roles.map((role) => role.title);
    // Ask the user for the employee's name and new role
    const data = await inquire.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'What is the name of the employee you would like to change the role of?',
        choices: employeeNames,
      },
      {
        type: 'list',
        name: 'newRole',
        message: 'Which role would you like to assign to the employee?',
        choices: roleTitles,
      },
    ]);
    const employeeId = employees.find(
      (employee) =>
        `${employee.first_name} ${employee.last_name}` === data.employee
    )?.id;
    const roleName = data.newRole;

    const role = roles.find((role) => role.title === roleName);
    const selectedRole = roles.find((role) => role.title === roleName);
    const roleId = selectedRole.id;

    // Find the selected employee from the list
    const selectedEmployee = employees.find(
      (employee) =>
        `${employee.first_name} ${employee.last_name}` === data.employee
    );

   

    if (!selectedEmployee || !selectedRole) {
      console.log('Employee or Role not found.');
      return;
    }

    // Update the employee's role and manager in the database
    await updateDatabase(
      { roleId, employeeId: selectedEmployee.id},
      'updateRole'
    );

    console.log(`Successfully updated ${selectedEmployee.first_name} ${selectedEmployee.last_name}'s role to ${data.newRole}.`);
  } 
  catch (error) {
    console.log(error); // Log the error to the file
  }
};


async function addEmployee() {
  let tRolesArray = await getRoleArray()
  let tEmployeeArray = await getEmployeeNameArray()
  tEmployeeArray.unshift("No manager")
  let tDepts = await getDepartmentTitles()
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
          message: "What role should this employee have?",
          type: "list",
          choices: tRolesArray
        },
        {
          name: "deptId",
          message: "What department would you like to add the new employee to?",
          type: "list",
          choices: tDepts,
        },
        {
          name: "managerId",
          message: "What manager would you like to assign to the new employee?",
          type: "list",
          choices: tEmployeeArray
        }
      ]
    );
    console.log(data.managerId)
    let manager = tEmployeeArray.indexOf(data.managerId)
    if (data.managerId == 'No manager') {
      manager = null
    }
    tData = {
      fName: data.fName,
      lName: data.lName,
      roleId: tRolesArray.indexOf(data.roleId) + 1,
      deptId: data.deptId,
      managerId: manager
    }
    updateDatabase(tData, 'employees')
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
  console.log('\n')
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
      const allEmployees = await viewAllEmployees(employees); // Pass the 'employees' array as an argument
      console.log(allEmployees)
      const _employees = Promise.all(
        allEmployees.map( async(value) => ({
          first_name: value.First_Name,
          last_name: value.Last_Name,
          role_id: value.Role_ID,
          manager: await getManagerName(value.Manager_ID)
        }))
      ).then((data) => {
        printTable(data)
      })
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

var program_state = 1

// readline.emitKeypressEvents(process.stdin);
// if (process.stdin.isTTY) { process.stdin.setRawMode(true); }

// process.stdin.on('keypress', (chunk, key) => {
//   if (key && key.name == 'q') {
//     program_state = 1
//     console.log(program_state)
//   }
// })




async function startApp() {
  if (!program_state) {
    const characters = titleText.split('');
    // const print = scrollPrint();
    // print(titleText);
    // print('');
  } else {
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
}

// Call the startApp function to start the application
startApp();