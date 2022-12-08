import { EOL, multiplyRange, strToNum } from "./lib/utils";

function isTreeVisibleFromEdge(input: number[][], row: number, col: number): boolean {
  const height = input[row][col];

  let visible = true;
  // up-down
  for (let r = 0; r < row; r++) {
    if (visible && input[r][col] >= height) {
      visible = false;
      break;
    }
  }
  if (visible) return true;

  // down-up
  visible = true;
  for (let r = input.length - 1; r > row; r--) {
    if (visible && input[r][col] >= height) {
      visible = false;
      break;
    }
  }
  if (visible) return true;

  // left-right
  visible = true;
  for (let c = 0; c < col; c++) {
    if (visible && input[row][c] >= height) {
      visible = false;
      break;
    }
  }
  if (visible) return true;

  // right-left
  visible = true;
  for (let c = input[row].length - 1; c > col; c--) {
    if (visible && input[row][c] >= height) {
      visible = false;
      break;
    }
  }
  if (visible) return true;

  return visible;
}

function solvePart1(input: number[][]): number {
  let result = input.length * 2 - 2 + input[0].length * 2 - 2;
  let c = 0;
  for (let row = 1; row < input.length - 1; row++) {
    for (let col = 1; col < input[row].length - 1; col++) {
      if (isTreeVisibleFromEdge(input, row, col)) result++;
    }
  }
  return result;
}

function calculateScenicScore(input: number[][], row: number, col: number): number {
  const height = input[row][col];
  const treeCounts = [0, 0, 0, 0];

  // left
  for (let c = col - 1; c >= 0; c--) {
    treeCounts[0]++;
    if (input[row][c] >= height) {
      break;
    }
  }

  // right
  for (let c = col + 1; c < input[row].length; c++) {
    treeCounts[1]++;
    if (input[row][c] >= height) {
      break;
    }
  }
  // up
  for (let r = row - 1; r >= 0; r--) {
    treeCounts[2]++;
    if (input[r][col] >= height) {
      break;
    }
  }

  // down
  for (let r = row + 1; r < input.length; r++) {
    treeCounts[3]++;
    if (input[r][col] >= height) {
      break;
    }
  }
  return multiplyRange(treeCounts);
}

function solvePart2(input: number[][]): number {
  let result = 0;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const score = calculateScenicScore(input, row, col);
      result = result < score ? score : result;
    }
  }
  return result;
}

export default async (data: string) => {
  const input = data.split(EOL).map((s) => s.split("").map(strToNum));

  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 1672 is correct
  console.log(`Part 2: The result is: ${solvePart2(input)}`); // 327180 is correct
};
