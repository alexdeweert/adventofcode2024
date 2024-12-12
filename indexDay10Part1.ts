import { readFileSync } from "fs";

//https://adventofcode.com/2024/day/10

const readFile = (path: string): number[][] | undefined => {
  try {
    return readFileSync(path, "utf-8")
      .split("\n")
      .map((line) =>
        line.split("").map((ch) => {
          if (ch == ".") return -1;
          return parseInt(ch);
        })
      );
  } catch (err) {
    console.info(`Error reading from path ${path}: ${err}`);
  }
};

const data = readFile("./inputs/day10test.txt");
if (!data) console.log("No data");

data!.forEach((a) => {
  let line = "";
  for (let i = 0; i < a.length; i++) {
    let cur = a[i];
    line = line.concat(`${cur != -1 ? cur : "-"}`);
  }
  console.log(line);
});

/**
 * Can we do a recursive traversal, maybe using DFS?
 * each node has a specific level it's on, and can go to next (it's siblings)
 * else it's a leaf.
 *
 * If that leaf reaches the end and it's 9, return 1, else return 0
 * base case is level is 9, or no siblings.
 */

const getSiblings = (nodePosition: string, nodeValue: number) => {
  // returns a list of row, col coordinates from current
  let split = nodePosition.split("#");
  let row = parseInt(split[0]);
  let col = parseInt(split[1]);

  let left = col - 1;
  let right = col + 1;
  let up = row - 1;
  let down = row + 1;

  const pairs: string[] = [];
  // look left
  if (left >= 0 && left < data![0].length) {
    // left is a valid position, set that pair
    // also the value at this position must be nodeValue+1 equivalent
    if (data![row][left] == nodeValue + 1) pairs.push(`${row}#${left}`);
  }
  // look right
  if (right >= 0 && right < data![0].length) {
    if (data![row][right] == nodeValue + 1) pairs.push(`${row}#${right}`);
  }
  // look up
  if (up >= 0 && up < data!.length) {
    if (data![up][col] == nodeValue + 1) pairs.push(`${up}#${col}`);
  }
  // look down
  if (down >= 0 && down < data!.length) {
    if (data![down][col] == nodeValue + 1) pairs.push(`${down}#${col}`);
  }

  return pairs;
};

const getAllTrailheadLocations = () => {
  let locs: string[] = [];
  for (let row = 0; row < data!.length; row++) {
    for (let col = 0; col < data![0].length; col++) {
      let cur = data![row][col];
      if (cur == 0) locs.push(`${row}#${col}`);
    }
  }
  return locs;
};

/**
 * Now traverse through the graph, using getSiblings for next nodes.
 * We want to return the value of valid paths (e.g. 9s reachable from each trailhead, each zero)
 */

function run() {
  // Can memoize children
  const map = new Map<string, string[]>();

  /**
   * Each path down the tree is a specific way
   * If its valid, e.g. at the base case we can increment score.
   * Each trailhead will get its own score.
   *
   */
  let masterScore = 0;
  // let score = 0;
  let curSet = new Set<string>();
  const aux = (depth: number, loc: string) => {
    // base case: if 9, return 1
    // else if no siblings, return 0 (also memoize fetched siblings at that location)
    if (depth == 9) {
      console.log(`depth was 9 at ${loc}`);
      curSet.add(loc);
      return;
    }
    let siblings: string[] = [];
    if (map.has(loc)) {
      console.log(`got memoized sibings at ${loc}`);
      siblings = map.get(loc)!;
    } else {
      siblings = getSiblings(loc, depth);
      map.set(loc, siblings);
    }
    if (!siblings.length) return;

    //recursive case:
    // interesting, how can we know if the sibling was left, right, up, or down?
    // wait, the sib is the new coordinate
    siblings.forEach((sib) => aux(depth + 1, sib));
  };

  getAllTrailheadLocations().forEach((loc) => {
    curSet.clear();
    aux(0, loc);
    console.log(`Score from trailhead ${loc} == ${curSet.size}`);
    masterScore += curSet.size;
  });

  console.log(`got score from trailheads: ${masterScore}`);
}

run();
