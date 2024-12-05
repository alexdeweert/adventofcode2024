import { readFileSync } from "fs";

const readInput = (filePath: string): string[][] => {
  try {
    const result: string[][] = [];
    const data = readFileSync(filePath, "utf-8");
    const splitlines = data.split('\n');
    splitlines.forEach(line => result.push(line.split('')));
    return result;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
  return [];
};

// Arr is 140 x 140 chars (total 19600 chars)
const arr = readInput('./inputs/day4.txt');
// const arr = [
//   ["M", "M", "M", "S", "X", "X", "M", "A", "S", "M"],
//   ["M", "S", "A", "M", "X", "M", "S", "M", "S", "A"],
//   ["A", "M", "X", "S", "X", "M", "A", "A", "M", "M"],
//   ["M", "S", "A", "M", "A", "S", "M", "S", "M", "X"],
//   ["X", "M", "A", "S", "A", "M", "X", "A", "M", "M"],
//   ["X", "X", "A", "M", "M", "X", "X", "A", "M", "A"],
//   ["S", "M", "S", "M", "S", "A", "S", "X", "S", "S"],
//   ["S", "A", "X", "A", "M", "A", "S", "A", "A", "A"],
//   ["M", "A", "M", "M", "M", "X", "M", "M", "M", "M"],
//   ["M", "X", "M", "X", "A", "X", "M", "A", "S", "X"]
// ];

const xmas = 'XMAS';

const checki = (i: number, cur: string) => {
  return (i == 0 && cur != 'X') || (i == 1 && cur != 'M') || (i == 2 && cur != 'A') || (i == 3 && cur != 'S');
}

// upleft
const upleft = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(row >= 0 && col >= 0 && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    row--;
    col--;
    i++;
  }
  return acc == xmas;
}

// upright
const upright = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(row >= 0 && col < arr[0].length && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    row--;
    col++;
    i++;
  }
  return acc == xmas;
}

// downleft
const downleft = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(row < arr.length && col >= 0 && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    row++;
    col--;
    i++;
  }
  return acc == xmas;
}

// downright
const downright = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(row < arr.length && col < arr[0].length && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    row++;
    col++;
    i++;
  }
  return acc == xmas;
}

// left
const left = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(col >= 0 && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    col--;
    i++;
  }
  return acc == xmas;
}

// right
const right = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(col < arr[0].length && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    col++;
    i++;
  }
  return acc == xmas;
}

// up
const up = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(row >= 0 && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    row--;
    i++;
  }
  return acc == xmas;
}

// down
const down = (row: number, col: number, acc: string = '', i: number = 0) => {
  while(row < arr.length && i < 4) {
    if(checki(i, arr[row][col])) return false;
    acc += arr[row][col];
    row++;
    i++;
  }
  return acc == xmas;
}

let result = 0;
for(let row = 0; row < arr.length; row++) {
  // Each row
  for(let col = 0; col < arr[0].length; col++) {
    // From each cur we want to do all the checks (for xmas)
    // Check upleft, upright, downleft, downright, up, down, left, right - all 8 directions from current
    if(up(row, col)) result++;
    if(down(row, col)) result++;
    if(left(row, col)) result++;
    if(right(row, col)) result++;
    if(upleft(row, col)) result++;
    if(upright(row, col)) result++;
    if(downleft(row, col)) result++;
    if(downright(row, col)) result++;
  }
}

console.log(`Part 1 Result: ${result}`);

/**
 * Part 2:
 * 
 * We need to look at two MAS in the shape of an X
 * Each MAS can be forwards or backwards.
 * 
 * M-M
 * -A-
 * S-S
 * 
 * We can see that always in the middle of the block we'll need an A.
 * if we know the upperleft row and col, we know the bounds of the window
 * and we can check that. Can have an "is valid window" fn
 * 
 * Could do a sliding block of a 3x3 window.
 */

const isValidWindow = (originRow: number, originCol: number) => {
  return originRow + 2 < arr.length && originCol + 2 < arr[0].length;
}

// Then we just iterate across and down, doing the MAS check in a 3x3 grid
const hasMas = (row: number, col: number) => {
  const hasDownRight = arr[row][col] == 'M' && arr[row+1][col+1] == 'A' && arr[row+2][col+2] == 'S'
  const hasUpLeft = arr[row][col] == 'S' && arr[row+1][col+1] == 'A' && arr[row+2][col+2] == 'M'
  const hasUpRight = arr[row+2][col] == 'M' && arr[row+1][col+1] == 'A' && arr[row][col+2] == 'S'
  const hasDownLeft = arr[row+2][col] == 'S' && arr[row+1][col+1] == 'A' && arr[row][col+2] == 'M'
  return (hasDownRight || hasUpLeft) && (hasUpRight || hasDownLeft)
}

// Now we need to slide the thing along
let result2 = 0;
for(let row = 0; row < arr.length; row++) {
  for(let col = 0; col < arr[0].length; col++) {
    if(isValidWindow(row, col) && hasMas(row, col)) result2++;
  }
}

console.log(`Part 2 Result: ${result2}`);
