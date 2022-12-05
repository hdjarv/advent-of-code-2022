import { EOL, strToNum } from "./lib/utils";

type Stack = String[];

type Move = {
  from: number;
  to: number;
  noOfCrates: number;
};

type State = {
  stacks: Stack[];
  moves: Move[];
};

function copyStacks(stacks: Stack[]): Stack[] {
  const result = [...stacks];
  for (let i = 0; i < result.length; i++) {
    result[i] = [...stacks[i]];
  }
  return result;
}

function parseInput(input: string): State {
  // Apparently, JavaScript's RegExp doesn't support repeating capturing groups: https://stackoverflow.com/questions/3537878/how-to-capture-an-arbitrary-number-of-groups-in-javascript-regexp
  const STATE_RE =
    /^(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?(\[[A-Z]\]|   ) ?$/;
  const CRATE_RE = /^\[([A-Z])\]$/;
  const MOVE_RE = /^move (\d+) from (\d+) to (\d+)$/;

  const state: State = { stacks: [...Array(9)].map(() => []), moves: [] };
  const lines = input.split(EOL);

  for (let ix = 0; ix < lines.length; ix++) {
    const line = lines[ix];

    if (STATE_RE.test(line)) {
      let match = STATE_RE.exec(line);
      if (match) {
        for (let matchNo = 1; matchNo <= 9; matchNo++) {
          if (/^ +$/.test(match[matchNo])) continue; // empty location
          const crateMatch = CRATE_RE.exec(match[matchNo]);
          if (crateMatch) {
            state.stacks[matchNo - 1].push(crateMatch[1]);
          } else throw Error(`Crate regex '${CRATE_RE}' did not match: ${match[matchNo]}`);
        }
      } else throw Error(`State regex '${STATE_RE}' did not match: ${line}`);
    } else if (MOVE_RE.test(line)) {
      let match = MOVE_RE.exec(line);
      if (match) {
        state.moves.push({ from: strToNum(match[2]), to: strToNum(match[3]), noOfCrates: strToNum(match[1]) });
      } else throw Error(`Move regex '${MOVE_RE}' did not match: ${line}`);
    }
  }
  state.stacks = state.stacks.map((stack) => stack.reverse());
  return state;
}

function readTopCrates(state: State): string {
  let result = "";
  for (let i = 0; i < state.stacks.length; i++) {
    const stack = state.stacks[i];
    result += `${stack[stack.length - 1]}`;
  }
  return result;
}

function runSimulation(state: State, moveCrateFn: (state: State, move: Move) => void): State {
  for (let move of state.moves) {
    moveCrateFn(state, move);
  }
  return state;
}

function solvePart1(state: State): string {
  state = runSimulation(state, (state, move) => {
    for (let i = 0; i < move.noOfCrates; i++) {
      state.stacks[move.to - 1].push(state.stacks[move.from - 1].pop()!);
    }
    return state;
  });
  return readTopCrates(state);
}

function solvePart2(state: State): string {
  state = runSimulation(
    state,
    (state, move) =>
      (state.stacks[move.to - 1] = [
        ...state.stacks[move.to - 1],
        ...state.stacks[move.from - 1].splice(-1 * move.noOfCrates),
      ])
  );
  return readTopCrates(state);
}

export default async (data: string) => {
  const state = parseInput(data);

  console.log(`Part 1: The result is: ${solvePart1({ stacks: copyStacks(state.stacks), moves: state.moves })}`); // GRTSWNJHH is correct
  console.log(`Part 2: The result is: ${solvePart2(state)}`); // QLFQDBBHM is correct
};
