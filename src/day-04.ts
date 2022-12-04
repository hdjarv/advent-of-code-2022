import { EOL, strToNum } from "./lib/utils";

type Assignment = {
  from: number;
  to: number;
};

type AssignmentPair = {
  elf1: Assignment;
  elf2: Assignment;
};

function parseAssignment(assignmentInput: string): Assignment {
  const [from, to] = assignmentInput.split("-").map(strToNum);
  return {
    from,
    to,
  };
}

function parseAssignmentPair(pairInput: string): AssignmentPair {
  const pairParts = pairInput.split(",");
  return { elf1: parseAssignment(pairParts[0]), elf2: parseAssignment(pairParts[1]) };
}

function solvePart1(assignments: AssignmentPair[]): number {
  let result = 0;
  for (let ix = 0; ix < assignments.length; ix++) {
    const pair = assignments[ix];
    if (
      (pair.elf1.from >= pair.elf2.from && pair.elf1.to <= pair.elf2.to) ||
      (pair.elf2.from >= pair.elf1.from && pair.elf2.to <= pair.elf1.to)
    ) {
      result++;
    }
  }

  return result;
}

function solvePart2(assignments: AssignmentPair[]): number {
  let result = 0;
  for (let ix = 0; ix < assignments.length; ix++) {
    const pair = assignments[ix];
    if (
      (pair.elf1.from <= pair.elf2.from && pair.elf1.to >= pair.elf2.from) ||
      (pair.elf1.from > pair.elf2.from && pair.elf2.to >= pair.elf1.from)
    ) {
      result++;
    }
  }

  return result;
}

export default async (data: string) => {
  const input = data.split(EOL).map(parseAssignmentPair);

  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 471 is correct
  console.log(`Part 2: The result is: ${solvePart2(input)}`); // 888 is correct
};
