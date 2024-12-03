import { strict } from "assert";
import { readFileSync } from "fs";

// Split data into usable array of integers
const readInput = (filePath: string) => {
  try {
    const data = readFileSync(filePath, "utf-8").split("\n");
    const splitData: number[][] = [];
    data.forEach((d) => splitData.push(d.split(" ").map(x => parseInt(x))));
    return splitData;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
};

// With the formatted number, begin the filtering process
const sd = readInput('./inputs/day2.txt');
const unsafe: number[][] = [];

// All increasing
const strictlyMonotonic = sd.filter(arr => {
  let monoResult = 0;
  for(let i = 1; i < arr.length; i++) {
    const prev = arr[i-1];
    const cur = arr[i];
    if(prev > cur) monoResult++;
    else if(cur > prev) monoResult--;
  }
  const safe = Math.abs(monoResult) == arr.length-1;
  if(!safe) unsafe.push(arr);
  return safe;
})

// Differ levels
const differByAtMostThree = strictlyMonotonic.filter(arr => {
  for(let i = 1; i < arr.length; i++) {
    const prev = arr[i-1];
    const cur = arr[i];
    if(Math.abs(prev-cur) > 3) {
      unsafe.push(arr);
      return false;
    };
  }
  return true;
});

// differByAtMostThree.forEach(x => console.log(x));
// console.log(differByAtMostThree.length);
// console.log(unsafe.length);

// Now we need to take all the unsafe ones, and see if its both strictly monotonic and differ by at most three
// after removing a bad one.

const sm = (arr: number[]) => {
  // All increasing
  let monoResult = 0;
  for(let i = 1; i < arr.length; i++) {
    const prev = arr[i-1];
    const cur = arr[i];
    if(prev > cur) monoResult++;
    else if(cur > prev) monoResult--;
  }
  const safe = Math.abs(monoResult) == arr.length-1;
  return safe;
}

const dbamt = (arr: number[]) => {
  for(let i = 1; i < arr.length; i++) {
    const prev = arr[i-1];
    const cur = arr[i];
    if(Math.abs(prev-cur) > 3) return false;
  }
  return true;
}

let result = 0;
unsafe.forEach(arr => {
  // Each arr is bad - need to remove one char at a time and re-test
  const copy = [...arr];
  for(let i = 0; i < arr.length; i++) {
    // Remove it
    const removed = arr.splice(i, 1);
    // console.log(`orig: ${copy}`);
    // Test what remains
    // console.log(`removed: ${removed[0]} from ${arr}`)
    if(sm(arr) && dbamt(arr)) {
      // console.log(arr);
      result++
      break;
    };

    // Re-insert it
    arr.splice(i, 0, removed[0]);
    // console.log(`readded it: ${arr}\n\n`);
  }
});

console.log(`Result: ${result + differByAtMostThree.length}`);