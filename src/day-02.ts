import { EOL, sumRange } from "./lib/utils";

enum Choice {
  Rock = 1, // A, X, defeats Scissors
  Paper = 2, // B, Y, defeats Rock
  Scissors = 3, // C, Z, defeats Paper
}

type Play = {
  player1: Choice;
  player2: Choice;
};

type InputValue = "A" | "B" | "C" | "X" | "Y" | "Z";

function inputToChoice(val: InputValue): Choice {
  switch (val) {
    case "A":
    case "X":
      return Choice.Rock;
    case "B":
    case "Y":
      return Choice.Paper;
    case "C":
    case "Z":
      return Choice.Scissors;
  }
}

function scorePlayer2Draw(play: Play): number {
  if (play.player1 === play.player2) {
    return 3;
  }

  // rock beat scissors
  if (play.player1 == Choice.Rock && play.player2 === Choice.Scissors) {
    return 0;
  }
  if (play.player1 == Choice.Scissors && play.player2 === Choice.Rock) {
    return 6;
  }
  // scissors beat paper
  if (play.player1 == Choice.Scissors && play.player2 === Choice.Paper) {
    return 0;
  }
  if (play.player1 == Choice.Paper && play.player2 === Choice.Scissors) {
    return 6;
  }

  // paper beat rock
  if (play.player1 == Choice.Paper && play.player2 === Choice.Rock) {
    return 0;
  }
  if (play.player1 == Choice.Rock && play.player2 === Choice.Paper) {
    return 6;
  }
  return 0;
}

function scorePlay(play: Play): number {
  return play.player2 + scorePlayer2Draw(play);
}

function solvePart1(plays: Play[]): number {
  return sumRange(plays.map(scorePlay));
}

function solvePart2(plays: Play[]): number {
  // Update the player2 moves based on the new information received in part 2 before calculating score.
  // Original player2 moves have been lost in parsing but can be inferred to a Choice.
  const updatedPlays = plays.map((play) => {
    if (play.player2 === Choice.Scissors /* win, Z in original data */) {
      switch (play.player1) {
        case Choice.Paper:
          play.player2 = Choice.Scissors;
          break;
        case Choice.Rock:
          play.player2 = Choice.Paper;
          break;
        case Choice.Scissors:
          play.player2 = Choice.Rock;
      }
    } else if (play.player2 === Choice.Paper /* draw, Y in original data */) {
      play.player2 = play.player1;
    } else {
      // Loose, X in original data
      switch (play.player1) {
        case Choice.Scissors:
          play.player2 = Choice.Paper;
          break;
        case Choice.Paper:
          play.player2 = Choice.Rock;
          break;
        case Choice.Rock:
          play.player2 = Choice.Scissors;
      }
    }
    return play;
  });

  return sumRange(updatedPlays.map(scorePlay));
}

export default async (data: string) => {
  const input: Play[] = data.split(EOL).map((line) => {
    const inputs = line.split(" ");
    const play: Play = {
      player1: inputToChoice(inputs[0] as InputValue),
      player2: inputToChoice(inputs[1] as InputValue),
    };
    return play;
  });

  console.log(`Part 1: The result is: ${solvePart1(input)}`); // 13924 is correct
  console.log(`Part 2: The result is: ${solvePart2(input)}`); // 13448 is correct
};
