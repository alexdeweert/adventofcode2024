import { readFileSync } from "fs";

const readInput = (filePath: string) => {
  try {
    const data = readFileSync(filePath, "utf-8");
    return data;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
};

// Match sequences like "mul(123,553)" in capture groups
// from the input data
const data = readInput('./inputs/day3.txt');
const re = /(mul\([0-9]+,[0-9]+\))/g;
const pairre = /\(([0-9]+),([0-9]+)\)/;

const matches = data?.match(re) ?? [];
let result = 0;
matches.forEach(a => {
  // Need to extract the capture groups for just the numbers
  const pairGroups = a.match(pairre);
  if(pairGroups) {
    let num1 = parseInt(pairGroups[1]);
    let num2 = parseInt(pairGroups[2]);
    result += num1 * num2;
  }
})

// Part 1 Result - correct 188741603
console.log(result);

/**
 * Second part
 * Need the first sequence in between ^ and "don't()"
 * Need only sequences in between "do()" and "don't()"
 * 
 * Need the last sequence in between do? and end? or don't and end? :\
 * 
 * Brute force, save all strings between start and the first don't()
 */

const split = data?.split("don't()");
let result2 = 0;

split?.forEach((a, ai) => {
  console.log('\n\n------------------------------------------------------');
  console.log(a);
  console.log(`~~~`)
  const dosplit = a.split('do()') ?? [];
  dosplit.forEach((ds, dsi) => {
    // The very first ds is ignored since it came after a don't (except for the very first a)

    if(ai == 0 && dsi == 0) {
      // Do the instructions
      const submatches = ds?.match(re) ?? [];
        submatches.forEach(a => {
          // Need to extract the capture groups for just the numbers
          const subPairGroups = a.match(pairre);
          if(subPairGroups) {
            let num1 = parseInt(subPairGroups[1]);
            let num2 = parseInt(subPairGroups[2]);
            result2 += num1 * num2;
          }
        })
      console.log(ds);
    } else {
      // If dsi 0, it's directly after a don't - so ignore
      if(dsi > 0) {
        console.log(ds);
        const submatches = ds?.match(re) ?? [];
        submatches.forEach(a => {
          // Need to extract the capture groups for just the numbers
          const subPairGroups = a.match(pairre);
          if(subPairGroups) {
            let num1 = parseInt(subPairGroups[1]);
            let num2 = parseInt(subPairGroups[2]);
            result2 += num1 * num2;
          }
        })
      }
    }
    console.log(`--`)
  });
  /**
   * For each of these, we only want to execute mul instructions that occur after the very first do() - except for the very first one which is already a do.
   * Does it matter that there are other dos? nah.
   * 
   * So, we can split again.
   */
});

console.log(`Result2: ${result2}`)