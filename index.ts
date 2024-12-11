import { readFileSync } from "fs";

//https://adventofcode.com/2024/day/9

const readFile = (path: string) => {
  let data: number[] = [];
  try {
    data = readFileSync(path, "utf-8")
      .split("")
      .map((x) => parseInt(x));
    // Now try the rejects and see if removing one element results in a safe entry
  } catch (err) {
    console.info(`Error reading from path ${path}: ${err}`);
  }

  return data;
};

const data = readFile("./inputs/day9.txt");

const filesystem: number[] = [];
for (let i = 0; i < data.length; i++) {
  let count = data[i];
  // Even
  if (i % 2 == 0) {
    // i will always be half, so if we have 0 = 0, 2 = 1, 4 = 2, 8 = 4 etc
    let id = Math.floor(i / 2);
    for (let k = 0; k < count; k++) filesystem.push(id);
  }
  // Odd
  else for (let k = 0; k < count; k++) filesystem.push(-1);
}

const checksum = () => {
  let checksum = 0;
  for (let i = 0; i < filesystem.length; i++) {
    const v = filesystem[i];
    if (v == -1) continue;
    checksum += v * i;
  }
  console.log(checksum);
};

// Part 1: Defrag
const part1Defrag = () => {
  let lo = 0;
  let hi = filesystem.length - 1;
  while (lo < hi) {
    if (filesystem[lo] == -1 && filesystem[hi] != -1) {
      filesystem[lo] = filesystem[hi];
      filesystem[hi] = -1;
    }
    while (filesystem[lo] != -1) lo++;
    while (filesystem[hi] == -1) hi--;
  }

  //Correct: 6384282079460
  checksum();
};
// part1Defrag();

/**
 * Is it possible to use the single digit solution (where we just swap values w/ two pointers?)
 * now we're swapping groups of negatives with groups of positives.
 *
 * Hard parts:
 * - knowing the location and size of all contiguous memory blocks (from left to right)
 * - Updating these blocks once they are successfully written to (might need to re-scan the whole array and regen the freespace table)
 * - Get position of a file block given it's value, and we use 2x it's position in the original array to get the size.
 *   - e.g. if we see 9 9 9 9, we know 2x 9 is 18, which is the 18th position in the original array.
 *
 * Now we have ability to get filesize based on a file id (if we scan backwards)
 *
 * And we have the freespace map, so we can scan the key->values and get the first location
 * that has enough free space to write based on that filesize.
 *
 * after the write we update the freespace map.
 *
 * this might work?
 */
const getFileSize = (id: number) => {
  if (id != -1) {
    return data[id * 2];
  }
};

const freespace = new Map<number, number>();
const updateFreespace = () => {
  freespace.clear();
  let i = 0;
  while (i < filesystem.length) {
    const cur = filesystem[i];
    if (cur == -1) {
      const start = i;
      let size = 0;
      while (filesystem[i] == -1 && i < filesystem.length) {
        size++;
        i++;
      }
      freespace.set(start, size);
    } else {
      i++;
    }
  }
};
const part2Defrag = () => {
  updateFreespace();
  let i = filesystem.length - 1;
  while (i >= 0) {
    let cur = filesystem[i];
    if (cur != -1) {
      let size = getFileSize(cur)!;
      let iWrite: null | number = null;
      for (const key of freespace.keys()) {
        if (freespace.get(key)! >= size && key < i) {
          iWrite = key;
          break;
        }
      }
      if (iWrite == null) while (filesystem[i] == cur && i >= 0) i--;
      else {
        for (let z = 0; z < size; z++) {
          filesystem[iWrite + z] = cur;
          filesystem[i] = -1;
          i--;
        }
        updateFreespace();
      }
    } else i--;
  }
  // Part 2 answer: 6408966547049
  /**
   * Notes on this solution:
   * 1. It worked, but it took way too long.
   * 2. This is hackey, not elegant and quite brute force.
   * 3. I'm happy this is over so I can stop obsessing over it,
   *    but I still feel very dumb.
   */
  checksum();
};

part2Defrag();
