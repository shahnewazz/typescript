// UNION & INTERSECTION TYPES
let id : number | string;
id = 10; // valid
id = "Hello"; // valid
// id = true; // invalid, will cause a TypeScript error

// INTERSECTION
interface Person {
    name: string;
    age?: number;
    hobbies?: string[];
}