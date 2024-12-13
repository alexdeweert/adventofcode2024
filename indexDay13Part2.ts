import { read, readFileSync } from "fs";
import { lusolve } from 'mathjs';

//https://adventofcode.com/2024/day/13

function convertIfCloseToInteger(num) {
    const roundedValue = Math.round(num);
    if (Math.abs(num - roundedValue) < 0.0001) {
        return roundedValue; // Convert to integer
    }
    return num; // Keep as float
}

const readFile = (path: string): string[] => {
    try {
        const foo = readFileSync(path, "utf-8")
            .split("\n")
            .filter(x => x != '');

        // let temp = [];
        /**
         * want
         * [
         *    a =
         *      [x1, x2],
         *      [y1, y2],
         *    b =
         *      [x, y]
         * ]
         */
        let re = /\d+/g;
        let total = 0;
        for (let i = 0; i < foo.length; i += 3) {
            let x1 = foo[i].match(re)?.[0];
            let y1 = foo[i].match(re)?.[1];
            let x2 = foo[i + 1].match(re)?.[0];
            let y2 = foo[i + 1].match(re)?.[1];
            let b1 = foo[i + 2].match(re)?.[0];
            let b2 = foo[i + 2].match(re)?.[1];
            if (x1 && x2 && y1 && y2 && b1 && b2) {
                let a0 = [parseInt(x1), parseInt(x2)];
                let a1 = [parseInt(y1), parseInt(y2)];
                let b = [parseInt(b1) + 10000000000000, parseInt(b2) + 10000000000000];
                let system = [a0, a1, b];

                let solve = lusolve([a0, a1], b);
                solve[0][0] = convertIfCloseToInteger(solve[0][0]);
                solve[1][0] = convertIfCloseToInteger(solve[1][0]);
                // console.log(`~~~ ${JSON.stringify(solve[0][0])}`);
                // solve.forEach(a => {
                //   console.log(`~~~ ${JSON.stringify(a[0])}`)
                //   // a[0][0] = convertIfCloseToInteger(a[0][0]);
                //   // a[1] = convertIfCloseToInteger(a[1]);
                // })
                if (Number.isInteger(solve[0][0]) && Number.isInteger(solve[1][0])) {
                    // get max if there are more than one solition?
                    total += (3 * solve[0][0]) + solve[1][0]
                }
                console.log(`for system ${JSON.stringify(system)} - solultion: ${JSON.stringify(solve)} \n`);
            }
        }
        console.log(`total: ${total}`);
    } catch (err) {
        console.info(`Error reading from path ${path}: ${err}`);
    }
    return [];
};

const data = readFile('./inputs/day13.txt')
// data.forEach(a => {
//   console.log(a)
// })
// console.log(JSON.stringify(data))