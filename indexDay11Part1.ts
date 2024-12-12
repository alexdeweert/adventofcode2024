import { readFileSync } from "fs";

//https://adventofcode.com/2024/day/10

const readFile = (path: string): string[] => {
    try {
        return readFileSync(path, "utf-8").split(" ")
    } catch (err) {
        console.info(`Error reading from path ${path}: ${err}`);
    }
    return [];
};

/**
 * Need functions for rules:
 * 
 * If 0, replace with 1
 * 
 * If even number digits, split into left and right halves (trim leading zeros)
 * 
 * If no rules, replace by multiplying by 2024
 */

// For efficiency a doubly linked list might be required.
// esp if we're shifting a shitload of elements right whenever we insert
const data = readFile("./inputs/day11.txt");
const run = () => {

    let i = 0;
    while (i < data.length) {
        // console.log(`data was: ${JSON.stringify(data)}`);
        const cur = data[i];

        if (cur == '0') {
            data[i] = '1';
            // console.log(`0 transformed into 1 at ${i}`)
        }
        // even, split into two halves
        // abcdef
        else if (cur.length % 2 == 0) {
            const left = cur.substring(0, cur.length / 2);
            const right = cur.substring(cur.length / 2);
            // If we split we have to update the index
            data[i] = left;
            data.splice(i + 1, 0, parseInt(right).toString());
            // console.log(`split ${cur} into ${left} -- ${right} at ${i}, i updated to ${i + 1}`);
            i++;
        }
        // No rules apply
        else {
            data[i] = (parseInt(cur) * 2024).toString();
            // console.log(`transformed: ${cur} into ${data[i]} at i ${i}`);
        }
        // console.log(`data now: ${JSON.stringify(data)}\n`);
        i++;
    }
}

for (let i = 0; i < 25; i++) run();
console.log(`result: ${data.length}`);