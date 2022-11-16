const prompt = require('prompt-sync')();

const ERRORS = require('./error-message');
const DIRECTIONS = require('./directions');

let live = true, invalidMove, errorMessage;

const VALID = {
  commands: [ 'PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT', 'EXIT'],
  colors: ['BLACK', 'WHITE']
}

const PAWN = {
  location: null,
  face: null,
  color: null,
  firstMove: true,

  changeDirection(direction) {
    if (direction === 'RIGHT') {
      this.face = DIRECTIONS[this.face];
    } else {
      this.face = getObjKey(DIRECTIONS, this.face);
    }
  },
  set current(args) {
    const [x, y, face, color] = args;
    this.location = [parseInt(x), parseInt(y)];
    this.face = face;
    this.color = color;
    this.firstMove = true;
  },
  move(step, index) {
    if (step < 0 || step >= 8) {
      errorMessage = ERRORS.FALL
      return;
    }

    this.location[index] = step;
    this.firstMove = false;
  }
};

console.log(`
Welcome to Pawn Stimulator. Valid commands are -
○ PLACE X,Y,F,C
○ MOVE X
○ LEFT
○ RIGHT
○ REPORT
○ EXIT
=====================`);

getUserInput();

function getUserInput() {
  while (live) {
    const userInput = prompt('>');
    if(!userInput) return;

    const inputs = userInput?.split(/[, ]+/);
    const command = inputs?.shift();
    if(!isInValidMove(command, inputs))
      run(command, inputs)
  }
}

function run(command, args) {
  switch (command) {
    case 'PLACE':
      PAWN.current = args;
      break;
    case 'MOVE':
       movement(args[0] ? parseInt(args[0]) : 1);
    break;
    case 'RIGHT':
    case 'LEFT':
      PAWN.changeDirection(command);
      break;
    case 'REPORT':
      report();
      break;
    case 'EXIT':
      exit();
      break;
  }
}

function getObjKey(obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}

function report() {
  console.log(`${PAWN.location[0]}, ${PAWN.location[1]}, ${PAWN.face}, ${PAWN.color}`);
}

function exit() {
  console.log('Thank you for playing!');
  live = false;
}

function isInValidMove(command, args) {
  errorMessage = null;

  if(!VALID.commands.includes(command))
    errorMessage = ERRORS.INVALID_COMMAND;

  else if(!PAWN.location && (command != 'PLACE' && command !== 'EXIT'))
    errorMessage = ERRORS.FIRST_COMMAND;

  else if (command == 'PLACE' && (args.length != 4 || isNaN(args[0]) || isNaN(args[1]) || !args[2] in DIRECTIONS|| !VALID.colors.includes(args[3])))
    errorMessage = ERRORS.INVALID_PLACE;

  else if(command == 'MOVE') {
    const move = parseInt(args[0]);
    if(args.length && isNaN(move))
      errorMessage = ERRORS.INVALID_MOVE;
    else if (move >= 2 && !PAWN.firstMove) {
      errorMessage = ERRORS.MOVE_1;
    } else if (move >= 3) {
      errorMessage = ERRORS.MOVE_2;
    }
  }

  if(errorMessage)
    console.log(errorMessage);

  return errorMessage;
}

function movement(step) {
  const { face, location } = PAWN;
  let move;

  switch (face) {
    case 'NORTH':
    case 'SOUTH':
      move = (face === 'NORTH') ? location[1] + step : location[1] - step;
      PAWN.move(move, 1);
      break;
    case 'EAST':
    case 'WEST':
      move = (face === 'EAST') ? location[0] + step : location[0] - step;
      PAWN.move(move, 0);
      break;
    default:
      errorMessage = ERRORS.INVALID_FACE
  }
}

module.exports = {
  getUserInput,
  run,
  getObjKey,
  report,
  exit,
  isInValidMove,
  movement,
  PAWN,
  live,
  errorMessage,
};
