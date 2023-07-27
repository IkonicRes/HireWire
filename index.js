
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
~~~~~~~~~~~~~PRESS ANY BUTTON TO CONTINUE...~~~~~~~~~~~~ 
`

const scrollPrint = () => {
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  let delay = 200;
  return async (s) => {
      const rainbow = chalkAnimation.animateString(s, delay, 7.5);
      setTimeout(() => {
        state = "active";
        console.log()
        rainbow.stop(); // Animation stops
      }, 500);
      
      setTimeout(() => {
        state != 'init' ? rainbow.start() : console.log("active"); // Animation resumes
      }, 500);
    }
};

var state = 'init'

if (state == 'init') {
  const characters = titleText.split('')
  const print = scrollPrint()
  print(titleText)
  print("")
  setTimeout(() => {
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
