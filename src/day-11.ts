import { EOL, strToNum } from "./lib/utils";

type Monkey = {
  items: number[];
  op: string;
  opArg: string;
  test: number; // divisable by
  trueTarget: number;
  falseTarget: number;
  inspectCount: number;
};

function parseMonkey(input: string): Monkey {
  const lines = input.split(EOL);
  if (!/^\s+Operation: new = old.*/.test(lines[2])) throw Error(`Unknown operation input: ${lines[2]}`);
  if (!/^\s+Test: divisible by \d+$/.test(lines[3])) throw Error(`Uknown test iput: ${lines[3]}`);
  if (!/^\s+If (:?true|false): throw to monkey \d+$/.test(lines[4])) throw Error(`Uknown test iput: ${lines[4]}`);
  if (!/^\s+If (:?true|false): throw to monkey \d+$/.test(lines[5])) throw Error(`Uknown test iput: ${lines[5]}`);

  const opParts = lines[2].substring(lines[2].indexOf("new = old") + 10).split(" ");
  const result: Monkey = {
    items: lines[1]
      .substring(lines[1].indexOf(":") + 1)
      .split(", ")
      .map((s) => strToNum(s)),
    op: opParts[0],
    opArg: opParts[1],
    test: strToNum(lines[3].substring(lines[3].indexOf("divisible by ") + 13)),
    trueTarget: strToNum(lines[4].substring(lines[4].indexOf("throw to monkey ") + 16)),
    falseTarget: strToNum(lines[5].substring(lines[5].indexOf("throw to monkey ") + 16)),
    inspectCount: 0,
  };
  return result;
}

function solvePart1(monkeys: Monkey[]): number {
  for (let round = 1; round <= 20; round++) {
    for (let monkeyNo = 0; monkeyNo < monkeys.length; monkeyNo++) {
      const monkey = monkeys[monkeyNo];
      let worryLevel = monkey.items.shift(); // inspect first item
      while (worryLevel) {
        monkey.inspectCount++;
        switch (monkey.op) {
          case "+":
            worryLevel += monkey.opArg === "old" ? worryLevel : strToNum(monkey.opArg);
            break;
          case "-":
            worryLevel -= monkey.opArg === "old" ? worryLevel : strToNum(monkey.opArg);
            break;
          case "*":
            worryLevel *= monkey.opArg === "old" ? worryLevel : strToNum(monkey.opArg);
            break;
          default:
            throw Error(`Unsupported op: ${monkey.op}`);
        }
        // divide by three
        worryLevel = Math.floor(worryLevel / 3);
        // test
        if (worryLevel % monkey.test === 0) {
          monkeys[monkey.trueTarget].items.push(worryLevel); // pass it
        } else {
          monkeys[monkey.falseTarget].items.push(worryLevel); // pass it
        }
        worryLevel = monkey.items.shift(); // inspect next item
      }
    }
  }

  monkeys.sort((m1, m2) => m2.inspectCount - m1.inspectCount);

  return monkeys[0].inspectCount * monkeys[1].inspectCount;
}

function solvePart2(data: string): string {
  return "not possible to solve";
}

export default async (data: string) => {
  const input = data.split(EOL + EOL).map(parseMonkey);
  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 112815 is correct
  console.log(`Part 2: The result is: ${solvePart2(data)}`); //  is correct
};
