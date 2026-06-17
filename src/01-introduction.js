"use strict";
// =====================================
// 01 - INTRODUCTION TO TYPESCRIPT
// =====================================
// Target audience: JavaScript developers learning TypeScript from scratch.
// This file is self-contained and fully runnable.
// =====================================
// WHAT IS TYPESCRIPT
// =====================================
// TypeScript is a SUPERSET of JavaScript developed by Microsoft.
// That means every valid JavaScript file is also a valid TypeScript file.
//
// Key points:
//   - TypeScript adds STATIC TYPING to JavaScript
//   - You tell the compiler what TYPE a variable should hold
//   - TypeScript catches type mistakes BEFORE the code ever runs
//   - TypeScript is NOT a new language — it compiles down to plain JavaScript
//   - Browsers and Node.js do NOT run TypeScript directly; they run the compiled JS
// =====================================
// WHY USE TYPESCRIPT
// =====================================
// 1. CATCH BUGS EARLY
//    JavaScript type errors only appear at runtime (when users are hitting the app).
//    TypeScript surfaces them at compile time — while you are still writing code.
//
// 2. BETTER TOOLING
//    Your editor (VS Code, WebStorm, etc.) can offer smarter autocomplete,
//    inline error messages, and accurate refactoring — all powered by types.
//
// 3. SCALABILITY
//    Large teams and large codebases become much easier to maintain.
//    Types act as living documentation that the compiler enforces.
//
// 4. GRADUAL ADOPTION
//    You can rename a .js file to .ts and adopt types one variable at a time.
// =====================================
// HOW IT WORKS
// =====================================
// Step 1 — You write TypeScript (.ts file)
// Step 2 — The TypeScript Compiler (tsc) checks your types
// Step 3 — tsc outputs plain JavaScript (.js file)
// Step 4 — Node.js / the browser runs that .js file
//
// Flow:
//   your-code.ts  →  tsc (TypeScript Compiler)  →  your-code.js  →  Runtime
//
// Install TypeScript globally:
//   npm install -g typescript
//
// Compile a file:
//   tsc 01-introduction.ts
//
// Watch mode (recompiles on save):
//   tsc --watch 01-introduction.ts
// =====================================
// TYPE ANNOTATION SYNTAX
// =====================================
// In JavaScript you write:
//   let name = "John"
//
// In TypeScript you CAN write:
//   let name: string = "John"
//              ^^^^^^
//          This is the TYPE ANNOTATION
//
// General syntax:
//   let variableName: type = value;
//
// Built-in primitive types:
//   string   — text values
//   number   — integers and floats (no separate int / float in TypeScript)
//   boolean  — true or false
// =====================================
// EXAMPLE 1 — SIMPLE VARIABLE ANNOTATIONS
// =====================================
let firstName = "Alice";
let age = 25;
let isLoggedIn = false;
console.log("--- Simple Variable Annotations ---");
console.log("First name:", firstName); // Alice
console.log("Age:", age); // 25
console.log("Is logged in:", isLoggedIn); // false
// =====================================
// EXAMPLE 2 — TYPESCRIPT CATCHING A TYPE ERROR
// =====================================
// In JavaScript, assigning the wrong type of value to a variable is allowed
// and silently causes bugs at runtime.
// TypeScript stops you IMMEDIATELY at compile time.
let score = 100;
// Try uncommenting the line below — TypeScript will show a red squiggly:
// score = "one hundred";
// Error: Type 'string' is not assignable to type 'number'.
// The commented-out line above is the bad code TypeScript prevents.
// This is the core value proposition of TypeScript.
console.log("\n--- Type Error Prevention ---");
console.log("Score:", score); // 100
// =====================================
// TYPE INFERENCE
// =====================================
// You do NOT always have to write the type annotation.
// When you assign a value immediately, TypeScript INFERS the type for you.
//
// TypeScript reads the right-hand side and figures out the type automatically.
let city = "New York"; // TypeScript infers: string
let temperature = 32; // TypeScript infers: number
let isSunny = true; // TypeScript infers: boolean
// Even without an annotation, these are still type-safe:
// city = 999;   // ← Still a compile error! TypeScript inferred 'string'
// temperature = "cold"; // ← Also an error
console.log("\n--- Type Inference ---");
console.log("City:", city); // New York
console.log("Temperature:", temperature); // 32
console.log("Is sunny:", isSunny); // true
// Best practice: let TypeScript infer when the value is obvious.
// Use explicit annotations when the variable is declared without a value,
// or when the inferred type would be too broad.
// =====================================
// THE 'ANY' TYPE
// =====================================
// 'any' is an ESCAPE HATCH — it turns off type checking for that variable.
// A variable typed as 'any' can hold any value without triggering errors.
//
// When is 'any' acceptable?
//   - When migrating an existing JavaScript codebase to TypeScript
//   - When dealing with truly dynamic external data (before you model it properly)
//
// Why to use it sparingly:
//   - Using 'any' everywhere defeats the entire purpose of TypeScript
//   - You lose autocomplete, safety, and refactoring support
let unknownValue = "Hello";
unknownValue = 42; // no error — any accepts strings
unknownValue = true; // no error — any accepts booleans
unknownValue = { id: 1 }; // no error — any accepts objects
console.log("\n--- The 'any' Type (use sparingly) ---");
console.log("Unknown value:", unknownValue); // { id: 1 }
// Rule of thumb: reach for 'unknown' or a proper type before defaulting to 'any'.
// =====================================
// STRICT MODE BENEFITS
// =====================================
// TypeScript has a 'strict' flag in tsconfig.json.
// Enabling it turns on a collection of stricter checks:
//
//   "strict": true  in tsconfig.json
//
// What strict mode enables:
//   - strictNullChecks    — variables cannot be null/undefined unless declared so
//   - noImplicitAny       — TypeScript errors if it cannot infer a type
//   - strictFunctionTypes — stricter checking for function parameter types
//   - strictPropertyInitialization — class properties must be initialized
//
// Best practice: ALWAYS enable strict mode in new projects.
// It forces better habits and catches an entire class of common bugs.
//
// Example tsconfig.json:
// {
//   "compilerOptions": {
//     "strict": true,
//     "target": "ES2020",
//     "outDir": "./dist"
//   }
// }
// =====================================
// JAVASCRIPT VS TYPESCRIPT — SIDE BY SIDE COMPARISON
// =====================================
// --- Variable declaration ---
// JavaScript:
// let productPrice = 49.99;   // No type — could be reassigned to anything
// TypeScript:
// let productPrice: number = 49.99;   // Enforced — must always be a number
// --- Function declaration ---
// JavaScript (no safety — wrong types cause silent runtime bugs):
// function getDiscount(price, percent) {
//   return price - (price * percent / 100);
// }
// getDiscount("fifty", "ten");  // Returns NaN — no warning in JavaScript!
// TypeScript (safe — wrong types are caught at compile time):
function getDiscount(price, percent) {
    return price - (price * percent / 100);
}
// getDiscount("fifty", "ten");
// ← TypeScript error: Argument of type 'string' is not assignable to parameter of type 'number'
// --- Error handling difference ---
// JavaScript allows this — no complaint:
// let user = "Alice";
// user = 100;         // Silently reassigns to a number
// TypeScript prevents this:
// let user: string = "Alice";
// user = 100;         // Error: Type 'number' is not assignable to type 'string'
console.log("\n--- JS vs TS: Discount Calculator ---");
console.log("$100 with 20% off: $" + getDiscount(100, 20)); // $80
console.log("$250 with 10% off: $" + getDiscount(250, 10)); // $225
console.log("$399 with 15% off: $" + getDiscount(399, 15)); // $339.15
// =====================================
// PRACTICAL EXAMPLE — USER LOGIN VARIABLES
// =====================================
// A typical login screen needs several pieces of data.
// TypeScript makes the expected type of each variable explicit and enforced.
let username = "john_doe";
let loginAttempts = 3;
let isAuthenticated = false;
let lastLoginDate = "2026-06-15";
let sessionToken = "abc123xyz789";
console.log("\n--- User Login Variables ---");
console.log("Username:", username);
console.log("Login attempts remaining:", loginAttempts);
console.log("Authenticated:", isAuthenticated);
console.log("Last login:", lastLoginDate);
console.log("Session token:", sessionToken);
// TypeScript would prevent mistakes like:
// loginAttempts = "three";       // Error
// isAuthenticated = "yes";       // Error — must be boolean, not string
// username = 12345;              // Error
// =====================================
// REAL-WORLD EXAMPLE — PRODUCT LISTING
// =====================================
// An e-commerce product has several distinct types of data.
// Annotating each variable communicates intent and prevents misuse.
let productName = "Wireless Noise-Cancelling Headphones";
let price = 79.99;
let inStock = true;
let sku = "WH-1000XM5";
let rating = 4.7;
let reviewCount = 2340;
let category = "Electronics";
console.log("\n--- Product Listing ---");
console.log("Product:", productName);
console.log("SKU:", sku);
console.log("Category:", category);
console.log("Price: $" + price);
console.log("Rating:", rating + "/5 (" + reviewCount + " reviews)");
console.log("In stock:", inStock);
// =====================================
// COMMON MISTAKES TO AVOID
// =====================================
// MISTAKE 1: Using 'any' everywhere
// This is the most common beginner mistake. It gives you the false
// comfort of "TypeScript works" while providing zero safety.
// BAD:
// let userId: any = 1;
// let userName: any = "Alice";
// let isAdmin: any = true;
// GOOD: use proper types — number, string, boolean
// MISTAKE 2: Ignoring TypeScript errors
// Many beginners suppress errors with @ts-ignore or cast to 'any'.
// TypeScript errors are signals — fix the root cause, not the symptom.
// BAD:
// // @ts-ignore
// let result = someFunction();
// GOOD: understand the error and type the code correctly.
// MISTAKE 3: Not enabling strict mode
// Without strict mode, TypeScript misses a large category of bugs
// (null/undefined issues, implicit any, etc.).
// Always set "strict": true in tsconfig.json.
// MISTAKE 4: Over-annotating obvious types
// Writing the annotation when TypeScript can infer it is redundant noise.
// BAD:  let count: number = 0;
// GOOD: let count = 0;   // TypeScript already knows it's a number
// =====================================
// BEST PRACTICES
// =====================================
// 1. Enable strict mode ("strict": true) in tsconfig.json from day one.
// 2. Let TypeScript infer types when the value makes the type obvious.
// 3. Always annotate function parameters and return types explicitly.
// 4. Avoid 'any' — use 'unknown' when the type is genuinely unknown.
// 5. Never use @ts-ignore to silence a legitimate error; fix the type.
// 6. Use meaningful variable names — good names plus types = self-documenting code.
// 7. Compile with --noEmitOnError so bad TypeScript never produces JS output.
// =====================================
// INTERVIEW QUESTIONS
// =====================================
// Q1: What is TypeScript and how does it relate to JavaScript?
// A: TypeScript is a statically typed superset of JavaScript made by Microsoft.
//    It adds optional type annotations and compiles down to plain JavaScript.
//    All valid JavaScript is valid TypeScript, but TypeScript adds compile-time
//    type safety that JavaScript lacks.
// Q2: What is the difference between type annotation and type inference?
// A: Type annotation is when you EXPLICITLY write the type:
//      let count: number = 0;
//    Type inference is when TypeScript AUTOMATICALLY figures out the type
//    from the assigned value:
//      let count = 0;   // inferred as number
//    Both result in the same type safety; annotation is just more explicit.
// Q3: When would you use the 'any' type and what are its downsides?
// A: 'any' is useful when migrating JavaScript code to TypeScript gradually,
//    or when dealing with truly dynamic/unknown external data temporarily.
//    Downside: it completely disables type checking for that variable,
//    so you lose all safety, autocomplete, and refactoring benefits TypeScript
//    provides. Overuse makes TypeScript pointless.
// Q4: What does enabling strict mode in TypeScript do?
// A: It enables a set of stricter compiler checks including:
//    - strictNullChecks: prevents null/undefined from being assigned to other types
//    - noImplicitAny: forces you to explicitly type variables TypeScript cannot infer
//    - strictFunctionTypes: stricter checking of function signatures
//    Together these catch an entire class of common runtime bugs at compile time.
// =====================================
// PRACTICE TASKS
// =====================================
// Task 1:
// Declare three variables representing a user profile:
//   - fullName (string): the user's full name
//   - age (number): the user's age
//   - isPremiumMember (boolean): whether they have a premium subscription
// Print all three to the console with descriptive labels.
// Task 2:
// Declare a variable: let userEmail: string = "alice@example.com";
// Then try to assign a number to it (e.g., userEmail = 12345;) and
// observe the TypeScript error in your editor or on tsc output.
// Comment out the bad line once you understand the error, and explain
// in a comment what TypeScript told you.
// Task 3:
// Create a set of variables for an Order summary:
//   - orderId (number)
//   - customerName (string)
//   - totalAmount (number)
//   - isPaid (boolean)
//   - orderDate (string)
// Then log a single formatted summary line to the console, like:
//   "Order #101 placed by Alice on 2026-06-17 — Total: $59.99 — Paid: true"
