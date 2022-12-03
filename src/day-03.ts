import { EOL, removeDuplicatesFromArray, sumRange } from "./lib/utils";

type Rucksack = {
  compartment1: string[];
  compartment2: string[];
};

function prioritizeItem(letter: string): number {
  const charCode = letter.charCodeAt(0);
  if (charCode > 96) {
    return charCode - 96; // lowercase, 1-26
  }
  return charCode - 65 + 27; // uppercase, 27-52
}

function solvePart1(input: Rucksack[]): number {
  const prioritizedItems = input.map((rucksack) => {
    const commonItems = removeDuplicatesFromArray(
      rucksack.compartment1.filter((item) => rucksack.compartment2.includes(item))
    );
    return prioritizeItem(commonItems[0]);
  });
  return sumRange(prioritizedItems);
}

function solvePart2(input: Rucksack[]): number {
  let ix = 0;
  let result = 0;
  while (ix < input.length) {
    const elf1Items = [...input[ix].compartment1, ...input[ix].compartment2],
      elf2Items = [...input[ix + 1].compartment1, ...input[ix + 1].compartment2],
      elf3Items = [...input[ix + 2].compartment1, ...input[ix + 2].compartment2];
    const commonItems = removeDuplicatesFromArray(
      elf1Items.filter((item) => elf2Items.includes(item) && elf3Items.includes(item))
    );
    result += prioritizeItem(commonItems[0]);
    ix += 3;
  }
  return result;
}

export default async (data: string) => {
  const input: Rucksack[] = data.split(EOL).map((line) => {
    const items = line.split("");
    return {
      compartment1: items.slice(0, line.length / 2),
      compartment2: items.slice(line.length / 2, line.length),
    } as Rucksack;
  });

  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 7903 is correct
  console.log(`Part 2: The result is: ${solvePart2(input)}`); // 2548 is correct
};
