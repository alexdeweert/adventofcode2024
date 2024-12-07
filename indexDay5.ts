import { readFileSync } from "fs";

const readInputPart1 = (filePath: string): Map<string, Array<string>> | undefined => {
  try {
    const data = readFileSync(filePath, "utf-8");
    const splitlines = data.split('\n');
    const part1map = new Map<string, Array<string>>();
    splitlines.forEach(line => {
      const splitrule = line.split('|');
      const pleft = splitrule[0];
      const pright = splitrule[1];
      
      if(part1map.has(pleft)) part1map.get(pleft)?.push(pright);
      else part1map.set(pleft, [pright]);
      // result.push(line.split('|'))
    });
    return part1map;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
};

const readInputPart2 = (filePath: string): string[][] | undefined => {
  try {
    const result: string[][] = [];
    const data = readFileSync(filePath, "utf-8");
    const splitlines = data.split('\n');
    
    splitlines.forEach(line => {
      result.push(line.split(','));
    })
    return result;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
};
/**
 * For each line in the second section, for each number, just ensure that it follows the rules of the map.
 * The map will have an entry for each line in the rules, where the value in the rule points to the numbers it needs to come before.
 * e.g. 75 -> [61,13,24,55]
 * 
 * Then, for each line, each number - just ensure that all numbers subsequent to it either aren't in the ruleset or are in the ruleset for tha tnumber.
 * When does it fail?
 * 
 * Each number subsequent also needs to be checked to ensure that the prior number isn't before it.
 * 
 * We have 23|34
 * 
 * This num 
 */

const part1map = readInputPart1('./inputs/day5part1.txt') ?? new Map<string, Array<string>>();
const part2data = readInputPart2('./inputs/day5part2.txt') ?? [];

/**
 * For each line in part2data, it's valid IF:
 * 1. Each parent number, considering it's subsequent numbers (sn):
 *    a. sn either DOESN'T have a map entry (in which case we don't care); or
 *    b. if it DOES have a map entry, the parent number isn't in it's list
 */

let result = 0;
let invalid: string[][] = [];
part2data.forEach(line => {
  let linevalid = true;
  for(let i = 0; i < line.length; i++) {
    let parent = line[i];
    for(let j = i+1; j < line.length; j++) {
      let sn = line[j];
      let snValid = !part1map.has(sn) || !part1map.get(sn)!.includes(parent);
      if(!snValid) {
        linevalid = false;
        break;
      }
    }
    if(!linevalid) break;
  }
  // If line valid, find middle number and break
  if(linevalid) result += parseInt(line[Math.floor(line.length/2)]);
  else invalid.push(line.sort((a,b) => {
      if(part1map.get(a)?.includes(b)) return -1;
      else if(part1map.get(b)?.includes(a)) return 1;
      return 0;
  }));
});

console.log(`Result Part1: ${result}`);

/**
 * Part2: For all incorrectly ordered lines, re-order them according to the page rules and add their middle numbers.
 * See above part1 sorting for invalid lines.
 */
let result2 = 0;
invalid.forEach(line => {
  result2 += parseInt(line[Math.floor(line.length/2)]);
})

console.log(`Result Part2: ${result2}`);