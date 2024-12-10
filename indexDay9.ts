import { readFileSync } from 'fs';

//https://adventofcode.com/2024/day/9

const readFile = (path: string) => {
    let data: number[] = []
    try {
        data = readFileSync(path, 'utf-8').split('').map(x => parseInt(x))
        // Now try the rejects and see if removing one element results in a safe entry
    } catch(err) {
        console.info(`Error reading from path ${path}: ${err}`);
    }

    return data;
}

const data = readFile('./input/day9.txt');

const filesystem: number[] = [];
for(let i = 0; i < data.length; i++) {
    let count = data[i]
    // Even
    if(i % 2 == 0) {
        // i will always be half, so if we have 0 = 0, 2 = 1, 4 = 2, 8 = 4 etc
        let id = Math.floor(i/2)
        for(let k = 0; k < count; k++) filesystem.push(id);
    }
    // Odd
    else for(let k = 0; k < count; k++) filesystem.push(-1);
}

console.log(JSON.stringify(filesystem));

const checksum = () => {
    let checksum = 0;
    for(let i = 0; i < filesystem.length; i++) {
        const v = filesystem[i];
        if(v == -1) break;
        checksum += v * i;
    }
    console.log(checksum);
}

// Part 1: Defrag
// const part1Defrag = () => {
//     let lo = 0;
//     let hi = filesystem.length-1;
//     while(lo < hi) {
//         if(filesystem[lo] == -1 && filesystem[hi] != -1) {
//             filesystem[lo] = filesystem[hi];
//             filesystem[hi] = -1;
//         }
//         while(filesystem[lo] != -1) lo++;
//         while(filesystem[hi] == -1) hi--;
//     }
    
//     //Correct: 6384282079460
//     checksum();
// }
// part1Defrag();

const part2Defrag = () => {

    checksum();
}

