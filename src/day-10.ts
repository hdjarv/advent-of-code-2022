import { EOL, strToNum, sumRange } from "./lib/utils";

function getPixel(cycle: number, x: number): string {
  let pixelIx = cycle % 40;
  // x within pixelIx ± 1 and remove 1 for 0-based indexing
  const pixel = x >= pixelIx - 1 - 1 && x <= pixelIx + 1 - 1 ? "#" : ".";
  return cycle % 40 === 0 ? `${pixel}\n` : `${pixel}`;
}

function solvePart1And2(code: string[][]) {
  let REG_X = 1;
  let cycle = 0;
  const signalStrengths: number[] = [];
  let picture = "";
  for (let i = 0; i < code.length; i++) {
    const op = code[i];
    switch (op[0]) {
      case "noop":
        cycle += 1;
        picture += getPixel(cycle, REG_X);
        if (cycle === 20 || (cycle - 20) % 40 === 0) {
          signalStrengths.push(cycle * REG_X);
        }
        break;
      case "addx":
        cycle += 1;
        picture += getPixel(cycle, REG_X);
        if (cycle === 20 || (cycle - 20) % 40 === 0) {
          signalStrengths.push(cycle * REG_X);
        }
        cycle += 1;
        picture += getPixel(cycle, REG_X);
        if (cycle === 20 || (cycle - 20) % 40 === 0) {
          signalStrengths.push(cycle * REG_X);
        }
        REG_X += strToNum(op[1]);
        break;
      default:
        throw Error(`Unsupported operation: ${op}`);
    }
  }
  console.log(`Part 1: The result is: ${sumRange(signalStrengths)}`); // 15020 is correct
  console.log("Part 2:");
  console.log(picture); // EFUGLPAP is correct
}

export default async (data: string) => {
  const input = data.split(EOL).map((s) => s.split(" "));

  solvePart1And2(input);
};
