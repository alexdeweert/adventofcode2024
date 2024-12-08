import { readFileSync } from "fs";

const readInput = (filePath: string): string[][] => {
  try {
    const data = readFileSync(filePath, "utf-8");
    const splitlines = data.split('\n');
    const result: string[][] = [];
    splitlines.forEach(line => {
      const splitline = line.trim().split('');
      result.push(splitline);
    });
    return result;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
  return [];
};

const data = readInput('./inputs/day8.txt');
const map = new Map<string, string[]>();
const antinode = '#.'
const set = new Set<string>();

for (let row = 0; row < data.length; row++) {
  for (let col = 0; col < data[0].length; col++) {
    let cur = data[row][col];
    if (antinode.includes(cur)) continue;
    if (map.has(cur)) map.get(cur)!.push(`${row}#${col}`)
    else map.set(cur, [`${row}#${col}`])
  }
}

const inBounds = (pair: number[]) => {
  const row = pair[0]
  const col = pair[1]
  return row >= 0 && row < data.length && col >= 0 && col < data[0].length;
}

// Now for each key, calculate distances between pairs, then generate their antinode pairs
map.forEach((v, k) => {
  for (let i = 0; i < v.length; i++) {
    for (let j = i + 1; j < v.length; j++) {
      generateAntiNodesV2(v[i], v[j]);
    }
  }
})

function generateAntiNodes(p1: string, p2: string) {
  const p1split = p1.split('#');
  const p2split = p2.split('#');
  const x1 = parseInt(p1split[1]);
  const y1 = parseInt(p1split[0]);
  const x2 = parseInt(p2split[1]);
  const y2 = parseInt(p2split[0]);

  const vx = (x2 - x1);
  const vy = (y2 - y1);

  const foox1 = x1 + vx;
  const fooy1 = y1 + vy;
  const barx1 = x1 - vx;
  const bary1 = y1 - vy;
  const foo1key = `${fooy1}#${foox1}`
  const bar1key = `${bary1}#${barx1}`

  const foox2 = x2 + vx;
  const fooy2 = y2 + vy;
  const barx2 = x2 - vx;
  const bary2 = y2 - vy;
  const foo2key = `${fooy2}#${foox2}`
  const bar2key = `${bary2}#${barx2}`

  const pairs: number[][] = [];
  if (foo1key != p1 && foo1key != p2) pairs.push([fooy1, foox1]);
  if (bar1key != p1 && bar1key != p2) pairs.push([bary1, barx1]);
  if (foo2key != p1 && foo2key != p2) pairs.push([fooy2, foox2]);
  if (bar2key != p1 && bar2key != p2) pairs.push([bary2, barx2]);

  pairs.forEach(pair => {
    let row = pair[0]
    let col = pair[1]
    if (inBounds(pair)) {
      set.add(`${row}#${col}`)
    }
  })
}

function generateAntiNodesV2(p1: string, p2: string) {
  const p1split = p1.split('#');
  const p2split = p2.split('#');

  const x1 = parseInt(p1split[1]);
  const y1 = parseInt(p1split[0]);

  const x2 = parseInt(p2split[1]);
  const y2 = parseInt(p2split[0]);

  const dx = (x1 - x2);
  const dy = (y1 - y2);
  const adx = -1 * dx;
  const ady = -1 * dy;

  let cur = [y1, x1];
  while (1) {
    cur[0] += dy;
    cur[1] += dx;
    if (!inBounds(cur)) break;
    set.add(`${cur[0]}#${cur[1]}`)
  }

  let anticur = [y1, x1];
  while (1) {
    anticur[0] += ady;
    anticur[1] += adx;
    if (!inBounds(anticur)) break;
    set.add(`${anticur[0]}#${anticur[1]}`)
  }

  let cur2 = [y2, x2];
  while (1) {
    cur2[0] += dy;
    cur2[1] += dx;
    if (!inBounds(cur2)) break;
    set.add(`${cur2[0]}#${cur2[1]}`)
  }

  let anticur2 = [y1, x1];
  while (1) {
    anticur2[0] += ady;
    anticur2[1] += adx;
    if (!inBounds(anticur2)) break;
    set.add(`${anticur2[0]}#${anticur2[1]}`)
  }
}

data.forEach(l => console.log(JSON.stringify(l)));
console.log(`Result: ${set.size}`);