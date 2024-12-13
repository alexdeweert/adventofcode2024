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
 * n sides must be n corners (didn't think of this on my own, thanks Reddit, but it makes sense).
 * Part 2 requires whole linear sides (instead of a perimeter, where each node contributes 1).
 */
const getCorners = (node: string) => {

    const split = node.split('#');
    const row = parseInt(split[0]);
    const col = parseInt(split[1]);
    const nodeVal = data[row][col];

    const left = (inBounds(row, col - 1) && data[row][col - 1] == nodeVal) ? `${row}#${col - 1}` : null;
    const right = (inBounds(row, col + 1) && data[row][col + 1] == nodeVal) ? `${row}#${col + 1}` : null;
    const up = (inBounds(row - 1, col) && data[row - 1][col] == nodeVal) ? `${row - 1}#${col}` : null;
    const down = (inBounds(row + 1, col) && data[row + 1][col] == nodeVal) ? `${row + 1}#${col}` : null;


    // A corner is a corner if up/down and left/right are DIFFERENT
    // OR left/right and up/down the same, but up-left DIFFERENT

    // Out of bounds counts as different

    const isDifferent = (r: number, c: number) => {
        // if not in bounds, return true
        if (!inBounds(r, c)) return true
        // Else, in bounds so check the values
        return data[r][c] != nodeVal;
    }

    // Up left
    // Convex if up, left different
    const upLeftIsConvexCorner = isDifferent(row - 1, col) && isDifferent(row, col - 1);
    // Convave is up, left same, AND, up-left different
    const upLeftIsConcaveCorner = !isDifferent(row - 1, col) && !isDifferent(row, col - 1) && isDifferent(row - 1, col - 1);

    // Up and Right
    const upRightIsConvexCorner = isDifferent(row - 1, col) && isDifferent(row, col + 1);
    // Convave is up, right same, AND, up-right different
    const upRightIsConcaveCorner = !isDifferent(row - 1, col) && !isDifferent(row, col + 1) && isDifferent(row - 1, col + 1);

    // Down and Left
    const downLeftIsConvexCorner = isDifferent(row + 1, col) && isDifferent(row, col - 1);
    // Convave is Down, Left same, AND, down-left different
    const downLeftIsConcaveCorner = !isDifferent(row + 1, col) && !isDifferent(row, col - 1) && isDifferent(row + 1, col - 1);

    // Down and Right
    const downRightIsConvexCorner = isDifferent(row + 1, col) && isDifferent(row, col + 1);
    // Convave is Down, Right same, AND, down-right different
    const downRightIsConcaveCorner = !isDifferent(row + 1, col) && !isDifferent(row, col + 1) && isDifferent(row + 1, col + 1);

    return (upLeftIsConvexCorner ? 1 : 0) +
        (upLeftIsConcaveCorner ? 1 : 0) +
        (upRightIsConvexCorner ? 1 : 0) +
        (upRightIsConcaveCorner ? 1 : 0) +
        (downLeftIsConvexCorner ? 1 : 0) +
        (downLeftIsConcaveCorner ? 1 : 0) +
        (downRightIsConvexCorner ? 1 : 0) +
        (downRightIsConcaveCorner ? 1 : 0)
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
    let numCorners = 0;
    let curRegionVisited = new Set<string>();

    const dfs = (node: string) => {
        visited.add(node);
        curRegionVisited.add(node);
        const siblings = getSiblings(node);
        // Every node can calculate it's perimeter, update acc, and return.
        // acc

        // Base case - no sibbies - return perimeter contribution and 1, e.g. [perim, 1]
        if (!siblings.length) {
            numCorners += getCorners(node);
            return;
        }

        // Recursive case, do the same thing but call dfs
        numCorners += getCorners(node);
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
            numCorners = 0;
            curRegionVisited.clear();
            dfs(curkey);
            // console.log(`region ${cur} has perim: ${tempPerim}, count: ${curRegionVisited.size}\n`);
            total += numCorners * curRegionVisited.size;
        }
    }
    console.log(`total: ${total}`);
}

run()