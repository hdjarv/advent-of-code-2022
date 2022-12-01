#!/usr/bin/env node   # -*- TypeScript -*-

import { basename, extname, fileExists, join, readFileAsString, strToNum } from "./lib/utils";

if (process.argv.length < 3) {
  console.error(`Usage: ${basename(process.argv[1])} <day> [<arg1>...<argN>]`);
  process.exit(1);
}

const dayNo = strToNum(process.argv[2]);
const dayModule = `day-${dayNo < 10 ? `0${dayNo}` : dayNo}`;
const inputFileCandidates = [
  join(__dirname, "inputs", dayModule + "-input.txt"),
  join(__dirname, "..", "inputs", dayModule + "-input.txt"),
];

if (!fileExists(join(__dirname, dayModule + extname(__filename)))) {
  console.error(`Not implemented`);
  process.exit(2);
}

const inputFile = inputFileCandidates.find((file) => fileExists(file));
if (!inputFile) {
  console.error(`No input file found`);
  process.exit(3);
}

console.log(`AOC 2022 - Day ${dayNo}`);
const day = require("./" + dayModule);

(async () => {
  try {
    const data = await readFileAsString(inputFile);
    await day.default(data, ...process.argv.slice(3));
  } catch (error: any) {
    console.error(`Error running Day ${dayNo}`);
    console.error(error.stack);
    process.exit(4);
  }
})();
