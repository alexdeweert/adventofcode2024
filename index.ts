import { readFileSync } from "fs";
import { Entity, Wall, Bot, Box } from "./Classes/classes";

//https://adventofcode.com/2024/day/14

const readBoard = (path: string): string[][] => {
  try {
    const board = readFileSync(path, "utf-8")
      .split("\n")
      .map((boardline) => {
        return boardline.split("");
      });
    return board;
  } catch (err) {
    console.info(`Error reading from path ${path}: ${err}`);
  }
  return [];
};

const readCommands = (path: string): string[] => {
  try {
    const commands = readFileSync(path, "utf-8")
      .split("\n")
      .join("")
      .split("")
      .reverse();
    console.log(`commands: ${commands}`);
    return commands;
  } catch (err) {
    console.info(`Error reading from path ${path}: ${err}`);
  }
  return [];
};

let boardw: number = 0;
let boardh: number = 0;
let player: Bot | undefined;
let box: Box | undefined;
const positions = new Map<string, Entity[]>();
// const board: Entity[][] = [];
const initBoard = () => {
  boardw = boardInitData[0].length;
  boardh = boardInitData.length;
  for (let y = 0; y < boardh; y++) {
    for (let x = 0; x < boardw; x++) {
      let cur = boardInitData[y][x];
      let key = `${y}#${x}`;
      let temp: Entity | undefined;
      if (cur == ".") {
        // temp = new Empty(y, x, ".");
        // temprow.push(temp);
      } else if (cur == "#") {
        temp = new Wall(y, x, "#");
        // temprow.push(temp);
      } else if (cur == "O") {
        temp = new Box(y, x, "O", positions);
        if (x == 5 && y == 1) box = temp as Box;
        // temprow.push(temp);
      } else if (cur == "@") {
        temp = new Bot(y, x, "@", positions);
        player = temp as Bot;
        //player = temp; //store reference to player
        // temprow.push(temp);
      }
      if (cur == ".") {
        if (!positions.has(key)) positions.set(key, []);
      } else {
        if (positions.has(key)) positions.get(key)?.push(temp!);
        else positions.set(key, [temp!]);
      }
    }
    // board.push(temprow);
  }
};

const printBoard = () => {
  for (let y = 0; y < boardh; y++) {
    let line = "";
    for (let x = 0; x < boardw; x++) {
      let key = `${y}#${x}`;
      if (positions.has(key)) {
        let posarr = positions.get(key)!;
        // console.log(`position array for ${key}: ${JSON.stringify(posarr)}`);
        if (posarr.length) line = line.concat(posarr[0].icon);
        else line = line.concat(".");
      }
    }
    console.log(line);
  }
};

const boardInitData = readBoard("./inputs/day15Board.txt");
const commands = readCommands("./inputs/day15Commands.txt");
const sleep = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));
initBoard();
printBoard();

positions.forEach((v, k) => {
  console.log(`key: ${k} has values: ${JSON.stringify(v)}`);
});

const run = async () => {
  printBoard();
  while (commands.length) {
    const cmd = commands.pop();
    console.log(`cmd: ${cmd}, remaining: ${commands.length}`);
    if (cmd == "<") {
      player?.moveLeft();
    } else if (cmd == ">") {
      player?.moveRight();
    } else if (cmd == "^") {
      player?.moveUp();
    } else if (cmd == "v") {
      player?.moveDown();
    }
    printBoard();
    console.log("");
    await sleep(750);
  }
};

run();
// player?.moveLeft();
// box?.moveLeft();
// player?.moveDown();
// box?.moveDown();
// printBoard();

// let i = 0;
// let intervalId = setInterval(() => {
//   if (i > 3) {
//     clearInterval(intervalId);
//     return;
//   }
//   player?.moveDown();
//   printBoard();
//   i++;
// }, 1000);

// const box = new Box(0, 0);
// const wall = new Wall(0, 0);
// const bot = new Bot(0, 0);

// console.log(`type box?: ${box instanceof Wall}`);

// printBoard();
// console.log(commands);
