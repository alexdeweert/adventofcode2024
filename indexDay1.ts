import { readFileSync } from "fs";

// Returns an array of strings like "123   623"
const readInput = (filePath: string, left: number[], right: number[]) => {
  try {
    const data = readFileSync(filePath, "utf-8").split("\n");
    data.forEach((d) => {
      const split = d.split("   ");
      const a = parseInt(split[0]);
      const b = parseInt(split[1]);
      left.push(a);
      right.push(b);
    });
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
};

let left: number[] = [];
let right: number[] = [];
readInput("./inputs/day1.txt", left, right);

left.sort((a, b) => {
  return a - b;
});

right.sort((a, b) => {
  return a - b;
});

let total = 0;
left.forEach((l, i) => {
  const r = right[i];
  total += Math.abs(l - r);
});

// Prints the answer for part1
console.log(`total: ${total}`);

// Part 2, each num in left exists x times in right
// create a map of nums in the right, update their total appearances
// then iterate through left list and do the calculation (left num * times in right)
// add up a running total

const map = new Map<number, number>();
right.forEach((v) => {
  if (map.has(v)) map.set(v, map.get(v)! + 1);
  else map.set(v, 1);
});

let total2 = 0;
left.forEach((v) => {
  let get = map.get(v);
  if (get) {
    total2 += v * get;
  }
});

console.log(`total2: ${total2}`);

/**
 * Both correct
 * --------------
 * total: 1603498
 * total2: 25574739
 */
