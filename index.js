
const chalkAnimation = require('./chalk')
const inquire = require('inquirer')
const readline = require('readline');

const titleText = `
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

async function menu() {
  inquire.prompt(
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'menu',
      choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
    }
  ).then(async (data) => {
    var continue_ = true
    console.log(data.menu)
    switch (data.menu) {
      case 'View All Employees':
        viewAllEmployees()
        break;
      case 'Add Employee':
        await addEmployee()
        break;
      case 'Update Employee Role':
        await updateEmployeeRole()
        break;
      case 'View All Roles':
        console.log(getRoleTitles())
        break;
      case "Add Role":
        await addRole()
        break;
      case 'View All Departments':
        console.log(getDepartmentTitles())
        break;
      case "Add Department":
        await addDepartment()
        break;
      case "Quit":
        continue_ = false
        break;
      default:
        menu()
        break;
    }
  })
};

var state = 'init'

if (state == 'init') {
  const characters = titleText.split('')
  const print = scrollPrint()
  print(titleText)
  print("")
  setTimeout(() => {
    menu()
    
    inquire.prompt(
      [{
        type: 'input',
        message: "Let's start with your employee's first name.",
        name: "fName"
      },
      {
        type: 'input',
        message: "Awesome! Now let's enter their last name.",
        name: "lName"
      }]
    ).then((data) => {console.clear(); setTimeout(() => { console.log(data)}, 500)}
  , 1000)
 
  }
)}
