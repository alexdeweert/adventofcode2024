import { read, readFileSync } from "fs";

//https://adventofcode.com/2024/day/10

const readFile = (path: string): string[] => {
  try {
    return readFileSync(path, "utf-8").split(" ")
  } catch (err) {
    console.info(`Error reading from path ${path}: ${err}`);
  }
  return [];
};

const data = readFile('./inputs/day11.txt');

function run(maxDepth: number) {
  let memo = new Map<string, number>();

  const aux = (depth: number, cur: string) => {
    let key = `${cur}#${depth}`
    // Base case: terminal node and we're at 75
    // Base case: memo has a key, we've already calculate this, return.
    if (depth == maxDepth) return 1;
    if (memo.has(key)) return memo.get(key)!;

    // Recursive case
    let memoStones = 0;
    if (cur == '0') {
      memoStones = aux(depth + 1, '1')!;
    }
    else if (cur.length % 2 == 0) {
      const left = cur.substring(0, cur.length / 2);
      const right = cur.substring(cur.length / 2);
      memoStones += aux(depth + 1, left)!;
      memoStones += aux(depth + 1, parseInt(right).toString())!;
    }
    else {
      memoStones += aux(depth + 1, (parseInt(cur) * 2024).toString())!;
    }
    memo.set(key, memoStones);
    return memoStones;
  }

  // call aux for every initial input value, then get the total for memo stone values at key value#0 (zero depth)
  data.forEach(v => aux(0, v));
  let res = 0;
  data.forEach(v => res += memo.get(`${v}#${0}`)!);
  console.log(res);
}

run(75);