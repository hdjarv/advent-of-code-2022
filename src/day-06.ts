import { removeDuplicatesFromArray } from "./lib/utils";

function findUniqueMarkerEnd(data: string[], length: number): number {
  for (let i = length - 1; i < data.length; i++) {
    if (removeDuplicatesFromArray(data.slice(i - (length - 1), i + 1)).length === length) {
      return i + 1;
    }
  }
  return -1;
}

function solvePart1(data: string[]): number {
  return findUniqueMarkerEnd(data, 4);
}

function solvePart2(data: string[]): number {
  return findUniqueMarkerEnd(data, 14);
}

export default async (data: string) => {
  const input = data.split("");

  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 1080 is correct
  console.log(`Part 2: The result is: ${solvePart2(input)}`); // 3645 is correct
};
