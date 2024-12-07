import { readFileSync } from "fs";

const readInput = (filePath: string): string[][] => {
  try {
    const data = readFileSync(filePath, "utf-8");
    const splitlines = data.split('\n');
    const result: string[][] = [];
    splitlines.forEach(line => {
      const splitline = line.split('');
      result.push(splitline);
    });
    return result;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
  return [];
};

/**
 * Generates a 2d map of string chars for this puzzle input
 */
const map = readInput('./inputs/day6test.txt');

/**
 * Want to simulate the traversal of the guard before she leaves the map.
 * They leave the map simply by being outside the bounds of the 2d array.
 * 
 * We can simply have a counter where "position" is not equivalent to a visited location
 * This can be accomplished with a set of "visited" where visited is just a hash of row-col key like "0#15"
 * 
 * So all we do is, in a while loop, simulate the movement
 */

enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
};
let direction = Direction.NORTH;
let hareDirection = Direction.NORTH;
const getPosition = (): number[] => {
  for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map[0].length; j++) {
      let cur = map[i][j];
      if(cur == '^') return [i, j]
    }
  }
  return [];
}
const inBounds = (pos: number[]) => {
  let row = pos[0];
  let col = pos[1];
  return row >= 0 && row < map.length && col >=0 && col < map[0].length
}

let position = getPosition();
let partOnePosition = [...position];
let origPosition = [...position];
let harePosition = [...position];
let set = new Set<string>();

const tickGuard = (pos: number[], i: number, slow: boolean = true, track: boolean = false) => {
  // The guard only moves on odd iterations to make it slow
  // So it misses the first iteration
  if(slow && i % 2 == 0) return;
  let y = pos[0];
  let x = pos[1];
  // They can cross previous paths so only unique valid positions are added.
  if(track) set.add(`${y}#${x}`);

  if(direction == Direction.NORTH) {
    // If the look ahead is out of bounds, decrement and continue
    if(y-1 < 0) pos[0]--;
    else {
      if(map[y-1][x] != '#' && map[y-1][x] != '0') pos[0]--;
      else direction = Direction.EAST;
    }
  }
  else if(direction == Direction.EAST) {
    if(x+1 >= map[0].length) pos[1]++;
    else {
      if(map[y][x+1] != '#' && map[y][x+1] != '0') pos[1]++;
      else direction = Direction.SOUTH;
    }
  }
  else if(direction == Direction.SOUTH) {
    if(y+1 >= map.length) pos[0]++;
    else {
      if(map[y+1][x] != '#' && map[y+1][x] != '0') pos[0]++;
      else direction = Direction.WEST;
    }
  }
  else if(direction == Direction.WEST) {
    if(x-1 < 0) pos[1]--;
    else {
      if(map[y][x-1] != '#' && map[y][x-1] != '0') pos[1]--;
      else direction = Direction.NORTH;
    }
  }
}

while(inBounds(partOnePosition)) {
  tickGuard(partOnePosition, 0, false, true);
}
set.forEach((s) => {
  console.log(s)
})
console.log(set.size)



const tickHare = () => {
  // The guard only moves on odd iterations to make it slow
  // So it misses the first iteration
  let y = harePosition[0];
  let x = harePosition[1];

  if(hareDirection == Direction.NORTH) {
    // If the look ahead is out of bounds, decrement and continue
    if(y-1 < 0) harePosition[0]--;
    else {
      if(map[y-1][x] != '#' && map[y-1][x] != '0') harePosition[0]--;
      else hareDirection = Direction.EAST;
    }
  }
  else if(hareDirection == Direction.EAST) {
    if(x+1 >= map[0].length) harePosition[1]++;
    else {
      if(map[y][x+1] != '#' && map[y][x+1] != '0') harePosition[1]++;
      else hareDirection = Direction.SOUTH;
    }
  }
  else if(hareDirection == Direction.SOUTH) {
    if(y+1 >= map.length) harePosition[0]++;
    else {
      if(map[y+1][x] != '#' && map[y+1][x] != '0') harePosition[0]++;
      else hareDirection = Direction.WEST;
    }
  }
  else if(hareDirection == Direction.WEST) {
    if(x-1 < 0) harePosition[1]--;
    else {
      if(map[y][x-1] != '#' && map[y][x-1] != '0') harePosition[1]--;
      else hareDirection = Direction.NORTH;
    }
  }
}

let cycles = 0;

const p2sim = async (i: number, j: number, last: number[]) => {
  let cur = map[i][j];
  if(cur == '.') {
    // console.log(`i: ${i}, j: ${j}`);
    map[i][j] = '0'
    last[0] = i;
    last[1] = j;
    let iter = 0;
    direction = Direction.NORTH;
    hareDirection = Direction.NORTH;
    position = [...origPosition];
    harePosition = [...origPosition];
    // Iterate over entire map - replace each dot position with a temp barrier - then do the simulation
    while(inBounds(position) && inBounds(harePosition)) {
      // console.log(`iterating while i: ${i}, j: ${j}`);
      tickHare();
      tickGuard(position, iter);
      // If at any time hare and guard meet we know there's a cycle.
      if(direction == hareDirection && position[0] == harePosition[0] && position[1] == harePosition[1]) {
        // console.log(`breaking`);
        cycles++;
        break;
      }
      iter++;

      map.forEach((line, ii) => {
        if(ii == harePosition[0] && ii == position[0]) {
          let tempLine = [...line]
          tempLine[harePosition[1]] = 'H';
          tempLine[position[1]] = 'G';
          console.log(JSON.stringify(tempLine).replace(/"/g, ' ').replace(/,/g, ''));
        }
        else if(ii == harePosition[0]) {
          let tempLine = [...line]
          tempLine[harePosition[1]] = 'H';
          console.log(JSON.stringify(tempLine).replace(/"/g, ' ').replace(/,/g, ''));
        }
        else if(ii == position[0]) {
          let tempLine = [...line]
          tempLine[position[1]] = 'G';
          console.log(JSON.stringify(tempLine).replace(/"/g, ' ').replace(/,/g, ''));
        }
        else {
          console.log(JSON.stringify(line).replace(/"/g, ' ').replace(/,/g, ''));
        }
      })
      console.log(`Cycles: ${cycles}`);
      console.log('\n');
      await new Promise(r => setTimeout(r, 1000));
    }
    // At the end of the simulation, reset the temp barrier back to a dot.
    map[last[0]][last[1]] = '.'
  }
  return cycles;
}

// As long as the guard is inBounds, keep simulating
// However, if at any time the guard meets the hare and they're in the same direction, same position - we know there's a cycle.

const run = async () => {
  // let last = [0,0]
  // for(let i = 0; i < map.length; i++) {
  //   for(let j = 0; j < map[0].length; j++) {
  //     await p2sim(i, j, last)
  //   }
  // }
  let last = [0,0]
  set.forEach(async (entry) => {
    const split = entry.split('#');
    const i = parseInt(split[0]);
    const j = parseInt(split[1]);
    p2sim(i, j, last)
  })
  console.log(`Result: ${set.size} - cycles: ${cycles}`);
}

run();



/**
 * Part 2:
 * If we place an obstruction at each possible position (which is an open space in the puzzle input)
 * how many of those obstructions result in an infinite loop?
 * 
 * How can we detect a loop? If we do tortise and hare.
 * The tortise (guard) moves only on odd iterations
 * The hare moves on odd and even
 * 
 * We COULD simulate the first path - using the Set hashes
 * and then, on subsequent iterations, choose one of those set path values to add the obstruction and test the cycle.
 * Brute force is to ignore the set.
 * 
 * Can we have hare and guard in the same while loop?
 */