const welcomeMessage: string = "Welcome to the TypeScript project!";
// console.log(welcomeMessage);

const marks: number[] = [85, 90, 78, 92, 88];
const pages: Array<number> = [10, 20, 30, 40, 50];
const subjects: Array<string> = ["Math", "Science", "History", "English", "Art"];
const isPassed: boolean = marks.every(mark => mark >= 50);

let data: (string | number)[] = ["Hello", 42, "World", 3.14];

data.push("true")


export {};