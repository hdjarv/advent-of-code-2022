import { EOL, sortAscending, strToNum } from "./lib/utils";

type File = {
  type: "file";
  name: string;
  size: number;
};

type Directory = {
  type: "dir";
  parent?: Directory;
  name: string;
  size: number;
  content: Array<File | Directory>;
};

type State = {
  tree: Directory; // the root of the tree
  cwd: Directory;
};

function cmdCd(state: State, dirName: string) {
  if (dirName === "/") {
    state.cwd = state.tree;
  } else if (dirName === "..") {
    if (state.cwd.name !== "/") {
      if (state.cwd.parent) state.cwd = state.cwd.parent;
      else throw Error(`No possible to change to parent directory for: ${state.cwd}`);
    }
  } else {
    const dir = state.cwd.content.find(
      (fileOrDir) => fileOrDir.type === "dir" && fileOrDir.name === dirName
    ) as Directory;
    if (dir) {
      state.cwd = dir;
    } else throw Error(`Non-existing directory: ${dirName} in ${state.cwd.name}`);
  }
}

function handleCommand(state: State, command: string, args: string[]) {
  switch (command) {
    case "cd":
      cmdCd(state, args[0]);
      break;
    case "ls":
      // nothing to do here, the result is handled by the parseInput function
      break;
    default:
      throw Error(`Unknown command: ${command}, args: ${args}`);
  }
}

function increateDirectoryPathSize(leafDir: Directory, size: number) {
  let dir: Directory | undefined = leafDir;
  while (dir) {
    dir.size += size;
    dir = dir.parent;
  }
}

function parseInput(input: string): Directory {
  const COMMAND_RE = /^\$\s(\w+)\s{0,1}(.*)$/;
  const DIR_RE = /^dir\s(\w+)$/;
  const FILE_RE = /^(\d+)\s([\w\.]+)$/;

  const rootDir: Directory = { type: "dir", name: "/", size: 0, content: [] };
  const state: State = { tree: rootDir, cwd: rootDir };

  let lineNo = 0;
  for (let line of input.split(EOL)) {
    if (COMMAND_RE.test(line)) {
      let match = COMMAND_RE.exec(line);
      if (match) {
        let [_, command, ...args] = [...match];
        handleCommand(state, command, args);
      } else throw Error(`${lineNo}; Command regex '${COMMAND_RE}' did not match line: ${line}`);
    } else if (DIR_RE.test(line)) {
      let match = DIR_RE.exec(line);
      if (match) {
        let [_, path] = [...match];
        const newDir: Directory = { type: "dir", parent: state.cwd, name: path, size: 0, content: [] };
        state.cwd.content.push(newDir);
      } else throw Error(`${lineNo}; Dir regex '${DIR_RE}' did not match line: ${line}`);
    } else if (FILE_RE.test(line)) {
      let match = FILE_RE.exec(line);
      if (match) {
        let [_, size, path] = [...match];
        const fileSize = strToNum(size);
        const newFile: File = { type: "file", name: path, size: fileSize };
        state.cwd.content.push(newFile);
        increateDirectoryPathSize(state.cwd, fileSize);
      } else throw Error(`${lineNo}; File regex '${FILE_RE}' did not match line: ${line}`);
    } else throw Error(`Unknown input: ${line}`);
    lineNo++;
  }
  return state.tree;
}

function walkDirectory(
  dir: Directory,
  dirEnterCb: (dir: Directory) => void,
  dirLeaveCb: (dir: Directory) => void,
  fileCb: (file: File) => void
) {
  dirEnterCb(dir);
  for (let path of dir.content) {
    if (path.type === "file") {
      fileCb(path);
    } else {
      walkDirectory(path, dirEnterCb, dirLeaveCb, fileCb);
    }
  }
  dirLeaveCb(dir);
}

function printState(state: State) {
  let indentation = "";
  walkDirectory(
    state.tree,
    (dir) => {
      console.log(`${indentation}d: ${dir.name} (${dir.size}) ${dir === state.cwd ? "  <-- cwd" : ""}`);
      indentation += " ";
    },
    (_dir) => {
      indentation = indentation.substring(0, indentation.length - 2);
    },
    (file) => {
      console.log(`${indentation} f: ${file.name} (${file.size})`);
    }
  );
}

function solvePart1(rootDir: Directory): number {
  let result = 0;
  walkDirectory(
    rootDir,
    (dir) => {
      if (dir.size <= 100_000) {
        result += dir.size;
      }
    },
    (_dir) => {},
    (_file) => {}
  );
  return result;
}

function solvePart2(rootDir: Directory): number {
  const TOTAL_SPACE = 70_000_000;
  const SPACE_NEEDED = 30_000_000;
  const FREE_SPACE = TOTAL_SPACE - rootDir.size;

  const dirSizes: number[] = [];
  walkDirectory(
    rootDir,
    (dir) => {
      if (FREE_SPACE + dir.size >= SPACE_NEEDED) {
        dirSizes.push(dir.size);
      }
    },
    (_dir) => {},
    (_file) => {}
  );
  dirSizes.sort(sortAscending);

  return dirSizes[0];
}

export default async (data: string) => {
  const rootDir = parseInput(data);

  console.log(`Part 1: The result is: ${solvePart1(rootDir)}`); // 1908462 is correct
  console.log(`Part 2: The result is: ${solvePart2(rootDir)}`); // 3979145 is correct
};
