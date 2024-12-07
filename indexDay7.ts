import { readFileSync } from "fs";

const readInput = (filePath: string): number[][] => {
  try {
    const data = readFileSync(filePath, "utf-8");
    const splitlines = data.split('\n');
    const result: number[][] = [];
    splitlines.forEach(line => {
      const splitline = line.trim().replace(':', '').split(' ').map(v => parseInt(v));
      result.push(splitline);
    });
    return result;
  } catch (err) {
    console.info(`Error reading file at path ${filePath}: ${err}`);
  }
  return [];
};

const input = readInput('./inputs/day7.txt');
const comboMap = new Map<number, string[][]>();
const operationMap = new Map<string, (a: number,b: number) => number>();
operationMap.set('+', (a,b) => a + b)
operationMap.set('*', (a,b) => a * b)
operationMap.set('||', (a,b) => parseInt(`${a}${b}`) );

function generateCombinations (spaceCount: number) {
  if(comboMap.has(spaceCount)) return comboMap.get(spaceCount)!
  const aux = (acc: string[][], cur: string[]) => {
    if(cur.length == spaceCount) return acc.push(cur);
    aux(acc, [...cur, '+']);
    aux(acc, [...cur, '*']);
    aux(acc, [...cur, '||']);
  }
  let acc: string[][] = [];
  aux(acc, []);
  comboMap.set(spaceCount, acc);
  return acc;
}

input.forEach(line => generateCombinations(line.length - 2));

let lineMatchValueAcc = 0;
input.forEach(line => {
  let numSpaces = line.length - 2;
  let possibleResult = line[0];
  let spaceCombos = comboMap.get(numSpaces);
  let lineMatch = false;
  if(spaceCombos) {
    for(let k = 0; k < spaceCombos.length; k++) {
      let combo = spaceCombos[k];
      let acc: null | number = null;
      for(let i = 1, c = 0; i < line.length-1; i++, c++) {
        let operation = operationMap.get(combo[c]);
        if(operation) {
          let right = line[i+1]
          if(acc == null) {
            let left = line[i];
            acc = operation(left, right);
          } else {
            acc = operation(acc, right);
          }
          if(acc == possibleResult) {
            // console.log(`MATCH ${acc} with line ${line} and combo ${combo}`);
            lineMatch = true;
            lineMatchValueAcc += acc;
            break;
          }
        }
        if(lineMatch) break;
      }
      if(lineMatch) break;
    }
  } else console.error(`No space combinations for numSpace: ${numSpaces}`)
});

console.log(`result: ${lineMatchValueAcc}`);