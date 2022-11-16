const prompt = require('prompt-sync')();

let { PAWN, getObjKey, exit, live, isInValidMove, errorMessage, movement } = require('./index');

const mockDirections =  {
  "NORTH": "EAST",
  "EAST": "SOUTH",
  "SOUTH": "WEST",
  "WEST": "NORTH",
};

describe('place function', () => {
  it('should place the pawn in position given by user', () => {
    PAWN.move(1, 0);
    expect(PAWN.firstMove).toEqual(false);
  });
});

describe('getObjKey function', () => {
  it('should return key of the object respective to the value given', () => {
    const direction = getObjKey(mockDirections, 'NORTH');

    expect(direction).toEqual("WEST");
  });
});

describe('exit function', () => {
  it('should make live false', () => {
    exit();

    expect(live).toEqual(false);
  });
});

describe('isInValidMove function', () => {
  it('should move the pawn if the move is valid', () => {
    isInValidMove('PLACE', ['0', '0', 'NORTH', 'WHITE']);

    expect(errorMessage).toEqual(null);
  });
});

describe('movement function', () => {
  it('should move the pawn in given direction', () => {
    movement(1);

    expect(errorMessage).toEqual(null);
  });
});
