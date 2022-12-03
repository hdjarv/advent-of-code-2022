import { EOL, findMinMaxInRange, sortDescending, splitStringIntoNumberArray, sumRange } from "./lib/utils";

function solvePart1(data: number[]): number {
  return findMinMaxInRange(data).max;
}

function solvePart2(data: number[]): number {
  return sumRange(data.sort(sortDescending), 0, 3);
}

export default async (input: string) => {
  const data = splitStringIntoNumberArray(input, EOL)
    .reduce(
      (result: number[][], value: number) => {
        if (Number.isNaN(value)) {
          result.push([]);
        } else {
          result[result.length - 1].push(value);
        }
        return result;
      },
      [[]]
    )
    .map((datarow: number[]) => sumRange(datarow));

  console.log(`Part 1: The result is: ${solvePart1(data)}`); // 74394 is correct
  console.log(`Part 2: The result is: ${solvePart2(data)}`); // 212836 is correct
};
