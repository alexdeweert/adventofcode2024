import { readFileSync } from "fs";

//https://adventofcode.com/2024/day/14

const ROW = 0;
const COL = 1;

interface Robot {
    position: number[], //[row, col] == [y,x]
    vx: number,
    vy: number
}

const re = /-?\d+/g;
const readFile = (path: string): Robot[] => {
    try {
        // TODO: Ingest their x coordinate into col position (index 1), and y into index 0
        // Split data into [[x,y], ]
        const bots = readFileSync(path, "utf-8")
            .split("\n")
            .map(botline => {
                const split = botline.match(re);
                const col = parseInt(split?.[0] ?? '0');
                const row = parseInt(split?.[1] ?? '0');
                const vx = parseInt(split?.[2] ?? '0');
                const vy = parseInt(split?.[3] ?? '0');
                let bot: Robot = {
                    position: [row, col],
                    vx: vx,
                    vy: vy
                };
                return bot;
            });
        return bots
    } catch (err) {
        console.info(`Error reading from path ${path}: ${err}`);
    }
    return [];
};

const boardheight = 103;
const boardwidth = 101;
// const boardheight = 7;
// const boardwidth = 11;
let iterations = 100;
let count = 0;
const data = readFile('./inputs/day14.txt')
const board = Array.from({ length: boardheight }, () => Array(boardwidth).fill('.'));
// const board = [
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
//   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
// ]
// let bot = data[10];
const botIsHere = (row: number, col: number) => {
    for (let i = 0; i < data.length; i++) {
        let tempbot = data[i];
        if (row == tempbot.position[ROW] && col == tempbot.position[COL]) return true;
    }
    return false;
}
const printBoard = () => {
    // console.log('\n')
    for (let row = 0; row < board.length; row++) {
        let line = '';
        for (let col = 0; col < board[0].length; col++) {
            // If any row and col match any bot position

            if (botIsHere(row, col)) {
                line = line.concat(` # `);
                //board[row][col] = 'X';
            } else {
                line = line.concat(` ${board[row][col]} `);
            }
        }
        console.log(`${line}`)
    }
}
// printBoard();

const moveBot = (bot: Robot) => {
    bot.position[ROW] += bot.vy;
    bot.position[COL] += bot.vx;

    // if a bot was at 0, and it went -3 left, then we cant just set it at the end
    // we have to do (board.length-1) - Math.abs(the negative value)
    if (bot.position[ROW] < 0) bot.position[ROW] = boardheight - (Math.abs(bot.position[ROW]));
    if (bot.position[COL] < 0) bot.position[COL] = boardwidth - (Math.abs(bot.position[COL]));

    // have to resolve if we need to wrap around. use modulo.
    bot.position[ROW] %= boardheight;
    bot.position[COL] %= boardwidth;
}

// Now, need to update bots position on each tick with its velocity


/**
 * Can simulate all the bots,
 * then create a map of the bots position with a posKey => count
 * but ignore all positions exactly in v or h middle.
 */
// const intervalId = setInterval(() => {
//   iterations--;
//   count++;
//   for (let i = 0; i < data.length; i++) {
//     moveBot(data[i]);
//   }
//   // moveBot(bot);
//   console.log(`\nx/it: ${iterations} - count: ${count}`);
//   printBoard();
//   if (iterations == 0) clearTimeout(intervalId);
// }, 0)

// Full speed
while (iterations) {
    for (let i = 0; i < data.length; i++) {
        moveBot(data[i]);
    }
    iterations--;
}

const botmap = new Map<string, number>();
let midy = Math.floor(boardheight / 2);
let midx = Math.floor(boardwidth / 2);
data.forEach(bot => {
    let key = `${bot.position[ROW]}#${bot.position[COL]}`;
    // ignore bots in the middle
    if (bot.position[ROW] != midy && bot.position[COL] != midx) {
        if (botmap.has(key)) botmap.set(key, botmap.get(key)! + 1);
        else botmap.set(key, 1);
    }
})

// Get the counts in each quadrant
// top left quadrant is rows < mody && cols < midx
let topleft = 0;
let topright = 0;
let bottomleft = 0;
let bottomright = 0;
for (let row = 0; row < boardheight; row++) {
    for (let col = 0; col < boardwidth; col++) {
        let key = `${row}#${col}`;
        //If theres a count in that position, add it to relevant quad
        if (botmap.has(key)) {
            //calculate top left
            if (row < midy && col < midx) topleft += botmap.get(key)!;
            // top right
            else if (row < midy && col > midx) topright += botmap.get(key)!;
            // bottom left
            else if (row > midy && col < midx) bottomleft += botmap.get(key)!;
            else if (row > midy && col > midx) bottomright += botmap.get(key)!;
        }
    }
}

let result = (topleft ?? 1) * (topright ?? 1) * (bottomleft ?? 1) * (bottomright ?? 1);
console.log(result);

// printBoard();