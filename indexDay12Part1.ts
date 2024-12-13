import { read, readFileSync } from "fs";

//https://adventofcode.com/2024/day/10

const readFile = (path: string): string[][] => {
    try {
        return readFileSync(path, "utf-8").split("\n").map(v => v.split(''))
    } catch (err) {
        console.info(`Error reading from path ${path}: ${err}`);
    }
    return [];
};

const data = readFile('./inputs/day12.txt');

// Keep track of all visited nodes so we don't repeat DFS
const visited = new Set<string>();

const inBounds = (row: number, col: number) => {
    return row >= 0 && row < data.length && col >= 0 && col < data[0].length
}

// Return an array of strings which are siblings to this node
const getSiblings = (node: string) => {
    const split = node.split('#');
    const row = parseInt(split[0]);
    const col = parseInt(split[1]);

    // console.log(`checking sibs for node ${node}`)
    // console.log(`right in bounds: ${inBounds(row, col + 1)}`);
    // console.log(`values the same: ${data[row][col + 1] == data[row][col]}`);
    // console.log(`visited does NOT have node: ${!visited.has(node)}`);

    // Left is only valid if it exists and the value matches
    const left = (inBounds(row, col - 1) && data[row][col - 1] == data[row][col] && !visited.has(`${row}#${col - 1}`)) ? `${row}#${col - 1}` : null;
    const right = (inBounds(row, col + 1) && data[row][col + 1] == data[row][col] && !visited.has(`${row}#${col + 1}`)) ? `${row}#${col + 1}` : null;
    const up = (inBounds(row - 1, col) && data[row - 1][col] == data[row][col] && !visited.has(`${row - 1}#${col}`)) ? `${row - 1}#${col}` : null;
    const down = (inBounds(row + 1, col) && data[row + 1][col] == data[row][col] && !visited.has(`${row + 1}#${col}`)) ? `${row + 1}#${col}` : null;

    // Look up down left right
    const siblings: string[] = [];
    if (left) siblings.push(left);
    if (right) siblings.push(right);
    if (up) siblings.push(up);
    if (down) siblings.push(down);
    // console.log(`returning sibs: ${JSON.stringify(siblings)}`);
    return siblings;
}

/**
 * Each node can only have a perimeter value on each side (up to a max of 4)
 * if its side is bordered by either nothing.
 * 
 * e.g. if we have left, there's a sibbie
 * 
 * if NOT left, left contributes a perimeter value.
 */
const getPerimeter = (node: string) => {

    const split = node.split('#');
    const row = parseInt(split[0]);
    const col = parseInt(split[1]);
    const nodeVal = data[row][col];

    const left = (inBounds(row, col - 1) && data[row][col - 1] == nodeVal) ? `${row}#${col - 1}` : null;
    const right = (inBounds(row, col + 1) && data[row][col + 1] == nodeVal) ? `${row}#${col + 1}` : null;
    const up = (inBounds(row - 1, col) && data[row - 1][col] == nodeVal) ? `${row - 1}#${col}` : null;
    const down = (inBounds(row + 1, col) && data[row + 1][col] == nodeVal) ? `${row + 1}#${col}` : null;

    // console.log(`node ${nodeVal} at ${node} has - no LEFT: ${!left}, no RIGHT: ${!right}, no UP: ${!up}, no DOWN: ${!down}`);
    const perim = (!left ? 1 : 0) + (!right ? 1 : 0) + (!up ? 1 : 0) + (!down ? 1 : 0);
    // console.log(`returning perim for: ${node} = ${perim}`)
    return perim
}

function run() {
    //data.forEach(x => console.log(JSON.stringify(x)));

    /**
     * Need to do a DFS on the grid and calculate the perimeter and area.
     * 
     * DFS is like, calling itself on available children.
     * Base case is when there aren't any unvisited siblings
     */

    // 

    // node is a key of co-ords like row#col
    // acc is the running perimeter cost so far
    let tempPerim = 0;
    let curRegionVisited = new Set<string>();

    const dfs = (node: string) => {
        visited.add(node);
        curRegionVisited.add(node);
        const siblings = getSiblings(node);
        // Every node can calculate it's perimeter, update acc, and return.
        // acc

        // Base case - no sibbies - return perimeter contribution and 1, e.g. [perim, 1]
        if (!siblings.length) {
            tempPerim += getPerimeter(node);
            return;
        }

        // Recursive case, do the same thing but call dfs
        tempPerim += getPerimeter(node);
        siblings.forEach(sibbie => {
            if (!visited.has(sibbie)) dfs(sibbie);
        });
    }

    let total = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let cur = data[i][j];
            let curkey = `${i}#${j}`;
            if (visited.has(curkey)) continue;
            tempPerim = 0;
            curRegionVisited.clear();
            dfs(curkey);
            // console.log(`region ${cur} has perim: ${tempPerim}, count: ${curRegionVisited.size}\n`);
            total += tempPerim * curRegionVisited.size;
        }
    }
    console.log(`total: ${total}`);
}

run()