import { EOL, strToNum } from "./lib/utils";

enum Direction {
  UP = 1,
  DOWN = 2,
  RIGHT = 3,
  LEFT = 4,
}

type Move = {
  dir: Direction;
  steps: number;
};

type Position = [number, number];

type Knot = {
  pos: Position;
  prevPos: Position[];
};

const DIR_MAP = new Map<string, Direction>([
  ["U", Direction.UP],
  ["D", Direction.DOWN],
  ["R", Direction.RIGHT],
  ["L", Direction.LEFT],
]);

function parseMove(s: string): Move {
  const parts = s.split(" ");
  return { dir: DIR_MAP.get(parts[0])!, steps: strToNum(parts[1]) };
}

function moveHeadPosition(headPos: Position, dir: Direction): Position {
  switch (dir) {
    case Direction.UP:
      return [headPos[0] + 1, headPos[1]];
    case Direction.DOWN:
      return [headPos[0] - 1, headPos[1]];
    case Direction.RIGHT:
      return [headPos[0], headPos[1] + 1];
    case Direction.LEFT:
      return [headPos[0], headPos[1] - 1];
  }
}

function runSimulation(moves: Move[], ropeLength: number): number {
  let rope: Knot[] = [...Array(ropeLength)].map((_) => ({ pos: [0, 0], prevPos: [] }));

  for (let move of moves) {
    for (let i = 0; i < move.steps; i++) {
      rope[0].prevPos.push(rope[0].pos);
      rope[0].pos = moveHeadPosition(rope[0].pos, move.dir);
      for (let knotNo = 1; knotNo < rope.length; knotNo++) {
        if (
          Math.abs(rope[knotNo - 1].pos[0] - rope[knotNo].pos[0]) > 1 ||
          Math.abs(rope[knotNo - 1].pos[1] - rope[knotNo].pos[1]) > 1
        ) {
          rope[knotNo].prevPos.push(rope[knotNo].pos);
          rope[knotNo].pos = rope[knotNo - 1].prevPos[rope[knotNo - 1].prevPos.length - 1];
        }
      }
      rope[0].prevPos.push(rope[0].pos);
    }
  }

  return [...new Set(rope[rope.length - 1].prevPos.map((p) => `${p[0]}:${p[1]}`))].length;
}
function solvePart1(moves: Move[]): number {
  return runSimulation(moves, 2);
}

function solvePart2(moves: Move[]): number {
  return runSimulation(moves, 10);
}

export default async (data: string) => {
  const input = data.split(EOL).map(parseMove);

  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 5735 is correct
  console.log(`Part 2: The result is: ${solvePart2(input)}`); // does NOT work! //  is correct
};
