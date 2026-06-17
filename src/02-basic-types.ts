// =====================================
// 02 - BASIC TYPES IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers learning TypeScript from scratch.
// This file is self-contained and fully runnable.

// TypeScript has several primitive types that map directly to JavaScript
// primitives, plus a few extras that give you more control and safety.
//
// Primitives covered in this file:
//   string, number, boolean, null, undefined, symbol, bigint
//
// Special types:
//   unknown, never, void, literal types, any (recap)

// =====================================
// STRING TYPE
// =====================================

// What is string?
// The string type represents all text values.
// It maps directly to JavaScript's string primitive.

// Why use it?
// Prevents accidentally assigning a number or boolean where text is expected.

// Syntax:
//   let variableName: string = "value";

// --- Simple Example ---
let firstName: string = "Alice";
let lastName: string = "Johnson";
let greeting: string = `Hello, ${firstName} ${lastName}!`; // template literals work fine

console.log("--- STRING TYPE ---");
console.log(firstName);  // Alice
console.log(greeting);   // Hello, Alice Johnson!

// --- String Methods (still fully available) ---
console.log(firstName.toUpperCase());       // ALICE
console.log(firstName.length);             // 5
console.log("  trim me  ".trim());         // "trim me"

// --- Practical Example ---
let email: string = "alice@example.com";
let hasAtSign: boolean = email.includes("@");
console.log("Valid email format:", hasAtSign); // true

// --- Real-World Example: User Authentication ---
let username: string = "john_doe";
let passwordHash: string = "5f4dcc3b5aa765d61d8327deb882cf99";
let authToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
let userRole: string = "admin";

console.log("\nUser:", username, "| Role:", userRole);
console.log("Token preview:", authToken.slice(0, 20) + "...");

// --- Common Mistake ---
// let count: string = 42;      // Error: number is not assignable to string
// let flag: string = true;     // Error: boolean is not assignable to string

// =====================================
// NUMBER TYPE
// =====================================

// What is number?
// TypeScript (like JavaScript) has ONE number type for ALL numeric values:
// integers, floats, negative numbers, Infinity, NaN, hex, octal, binary.
// There is no separate 'int' or 'float' type.

// Why use it?
// Ensures numeric operations only happen on numeric values.

// Syntax:
//   let variableName: number = 42;

// --- Simple Example ---
let age: number = 25;
let price: number = 19.99;
let temperature: number = -5;
let hexColor: number = 0xff0000;  // hex
let binaryFlag: number = 0b1010;  // binary

console.log("\n--- NUMBER TYPE ---");
console.log("Age:", age);
console.log("Price:", price);
console.log("Temperature:", temperature);

// Special numeric values
let positiveInfinity: number = Infinity;
let notANumber: number = NaN;
console.log("Infinity:", positiveInfinity);   // Infinity
console.log("NaN:", notANumber);              // NaN

// --- Practical Example ---
function calculateTax(amount: number, taxRate: number): number {
  return parseFloat((amount * taxRate).toFixed(2));
}
console.log("Tax on $100 at 8%:", calculateTax(100, 0.08)); // 8

// --- Real-World Example: Product Pricing ---
let productPrice: number = 299.99;
let discountPercent: number = 15;
let discountAmount: number = (productPrice * discountPercent) / 100;
let finalPrice: number = productPrice - discountAmount;
let stockCount: number = 42;
let productRating: number = 4.7;

console.log("\n--- Product Pricing ---");
console.log(`Original: $${productPrice}`);
console.log(`Discount: ${discountPercent}% (-$${discountAmount.toFixed(2)})`);
console.log(`Final: $${finalPrice.toFixed(2)}`);
console.log(`Stock: ${stockCount} units | Rating: ${productRating}/5`);

// --- Common Mistake ---
// let total: number = "100";   // Error: string not assignable to number
// let qty: number = true;      // Error: boolean not assignable to number

// =====================================
// BOOLEAN TYPE
// =====================================

// What is boolean?
// Represents true or false — exactly like JavaScript booleans.

// Why use it?
// Prevents mixing boolean with truthy/falsy number or string values in type-critical spots.

// Syntax:
//   let variableName: boolean = true;

// --- Simple Example ---
let isActive: boolean = true;
let isDeleted: boolean = false;

console.log("\n--- BOOLEAN TYPE ---");
console.log("Is active:", isActive);   // true
console.log("Is deleted:", isDeleted); // false

// --- Practical Example ---
function canCheckout(isLoggedIn: boolean, cartIsEmpty: boolean): boolean {
  return isLoggedIn && !cartIsEmpty;
}
console.log("Can checkout:", canCheckout(true, false));  // true
console.log("Can checkout:", canCheckout(false, false)); // false

// --- Real-World Example: E-commerce Flags ---
let userIsVerified: boolean = true;
let emailNotificationsEnabled: boolean = true;
let isPremiumMember: boolean = false;
let hasActiveSubscription: boolean = false;
let productIsAvailable: boolean = true;
let orderIsPaid: boolean = false;

console.log("\n--- User & Order Flags ---");
console.log("Verified:", userIsVerified);
console.log("Premium:", isPremiumMember);
console.log("Product available:", productIsAvailable);
console.log("Order paid:", orderIsPaid);

// --- Common Mistake ---
// let isReady: boolean = 1;       // Error: number not assignable to boolean
// let isEmpty: boolean = "false"; // Error: string not assignable to boolean
// (Note: "false" is truthy in JS — TypeScript saves you from this trap)

// =====================================
// NULL AND UNDEFINED
// =====================================

// What are null and undefined?
// null    — intentional absence of a value (you set it deliberately)
// undefined — a variable declared but not yet assigned a value

// Why the distinction matters:
//   null      → "I know the value and it is empty on purpose"
//   undefined → "this has not been set yet"

// With strict mode's strictNullChecks enabled (recommended):
//   null and undefined are NOT assignable to other types.
//   You must explicitly handle them.

// Syntax:
//   let value: string | null = null;
//   let data: number | undefined = undefined;

// --- Simple Example ---
let middleName: string | null = null;       // user has no middle name
let profilePicture: string | undefined;     // not yet loaded

console.log("\n--- NULL AND UNDEFINED ---");
console.log("Middle name:", middleName);        // null
console.log("Profile picture:", profilePicture); // undefined

// --- Practical Example ---
function findUser(id: number): string | null {
  const users: { [id: number]: string } = { 1: "Alice", 2: "Bob" };
  return users[id] ?? null;
}
console.log("User 1:", findUser(1)); // Alice
console.log("User 9:", findUser(9)); // null

// Nullish coalescing: provide a fallback when null or undefined
let displayName: string = middleName ?? "No middle name";
console.log("Display:", displayName); // No middle name

// Optional chaining: safely access properties that might be null/undefined
let user: { address?: { city?: string } } = {};
let city = user?.address?.city ?? "Unknown city";
console.log("City:", city); // Unknown city

// --- Real-World Example: Order Details ---
interface OrderSummary {
  id: number;
  couponCode: string | null;       // may or may not have a coupon
  deliveryDate: string | undefined; // not set until shipped
  notes: string | null;            // optional notes from customer
}

const order: OrderSummary = {
  id: 1001,
  couponCode: "SUMMER20",
  deliveryDate: undefined,
  notes: null,
};

console.log("\n--- Order Summary ---");
console.log("Order:", order.id);
console.log("Coupon:", order.couponCode ?? "None");
console.log("Delivery:", order.deliveryDate ?? "Pending");
console.log("Notes:", order.notes ?? "No notes");

// =====================================
// SYMBOL TYPE
// =====================================

// What is symbol?
// A symbol is a globally unique, immutable primitive value.
// Two symbols are NEVER equal — even if created with the same description.

// Why use it?
// - Creating truly unique property keys on objects
// - Avoiding accidental property name collisions
// - Used heavily in library internals and iteration protocols

// Syntax:
//   let sym: symbol = Symbol("description");

// --- Simple Example ---
let sym1: symbol = Symbol("id");
let sym2: symbol = Symbol("id");

console.log("\n--- SYMBOL TYPE ---");
console.log("sym1 === sym2:", sym1 === sym2); // false — every Symbol is unique!
console.log("sym1:", sym1.toString());         // Symbol(id)

// --- Practical Example: Unique Object Keys ---
const USER_ID: symbol = Symbol("userId");
const SESSION_TOKEN: symbol = Symbol("sessionToken");

const session: { [key: symbol]: string } = {};
session[USER_ID] = "usr_001";
session[SESSION_TOKEN] = "tok_abc123";

console.log("Session user ID:", session[USER_ID]);     // usr_001
console.log("Session token:", session[SESSION_TOKEN]); // tok_abc123

// =====================================
// BIGINT TYPE
// =====================================

// What is bigint?
// bigint holds integers larger than Number.MAX_SAFE_INTEGER (2^53 - 1).
// You create a bigint by appending 'n' to an integer literal.

// Why use it?
// - Financial calculations requiring exact large integers
// - Cryptography
// - IDs from databases that use 64-bit integers

// Syntax:
//   let big: bigint = 9007199254740993n;

// --- Simple Example ---
let maxSafeInt: number = Number.MAX_SAFE_INTEGER;  // 9007199254740991
let bigNumber: bigint = 9007199254740993n;          // safely beyond that

console.log("\n--- BIGINT TYPE ---");
console.log("Max safe integer:", maxSafeInt);
console.log("BigInt value:", bigNumber);
console.log("BigInt + 1:", bigNumber + 1n); // 9007199254740994n

// --- Real-World Example: Transaction IDs ---
let transactionId: bigint = 9_007_199_254_740_993n;
let totalRevenue: bigint = 1_000_000_000_000n; // 1 trillion (cents, perhaps)

console.log("Transaction ID:", transactionId);
console.log("Total revenue:", totalRevenue);

// Note: you CANNOT mix bigint and number in arithmetic
// console.log(bigNumber + 1);  // Error! Use 1n instead

// =====================================
// UNKNOWN TYPE
// =====================================

// What is unknown?
// 'unknown' is the type-safe counterpart to 'any'.
// Like 'any', it can hold any value.
// Unlike 'any', you MUST narrow the type before using the value.

// Why use it?
// When you receive data from an external source (API, user input)
// and you don't know the shape yet — but you want to keep safety.
// Prefer 'unknown' over 'any' for external data.

// Syntax:
//   let value: unknown = someExternalData;

// --- Simple Example ---
let apiResponse: unknown = { status: 200, data: "Hello" };

// This would be an error with 'unknown':
// console.log(apiResponse.status);  // Error! Must narrow first

// You must narrow before using:
if (typeof apiResponse === "object" && apiResponse !== null) {
  console.log("\n--- UNKNOWN TYPE ---");
  console.log("API response is an object:", apiResponse);
}

// --- Practical Example ---
function processInput(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // safe — narrowed to string
  }
  if (typeof value === "number") {
    return value.toFixed(2);    // safe — narrowed to number
  }
  return String(value);         // fallback
}

console.log(processInput("hello"));  // HELLO
console.log(processInput(42.5));     // 42.50
console.log(processInput(true));     // true

// --- Real-World Example: Parsing API Data ---
function parsePaymentResponse(raw: unknown): string {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "status" in raw &&
    typeof (raw as { status: unknown }).status === "string"
  ) {
    return (raw as { status: string }).status;
  }
  return "unknown";
}

const rawResponse: unknown = { status: "success", amount: 49.99 };
console.log("Payment status:", parsePaymentResponse(rawResponse)); // success

// =====================================
// VOID TYPE
// =====================================

// What is void?
// 'void' is used as the return type of functions that do NOT return a value.
// It is the TypeScript equivalent of "this function returns nothing."

// Why use it?
// Makes function intent explicit — callers know not to expect a return value.

// Syntax:
//   function doSomething(): void { ... }

// --- Simple Example ---
function logMessage(message: string): void {
  console.log("[LOG]:", message);
  // no return statement — void
}

console.log("\n--- VOID TYPE ---");
logMessage("Application started"); // [LOG]: Application started

// --- Real-World Example: Event Handlers ---
function onOrderPlaced(orderId: number): void {
  console.log(`Order #${orderId} placed successfully.`);
  // triggers side effects — no meaningful return value
}

function onPaymentFailed(errorMessage: string): void {
  console.error(`Payment failed: ${errorMessage}`);
}

onOrderPlaced(1042);              // Order #1042 placed successfully.
onPaymentFailed("Card declined"); // Payment failed: Card declined

// =====================================
// NEVER TYPE
// =====================================

// What is never?
// 'never' is the return type of functions that NEVER return:
//   - Functions that always throw an error
//   - Functions with infinite loops
//   - Exhaustive checks in switch statements

// Why use it?
// Signals to the compiler (and to readers) that this code path is unreachable.
// Used in exhaustive checking to catch unhandled union cases at compile time.

// Syntax:
//   function fail(msg: string): never { throw new Error(msg); }

// --- Simple Example ---
function throwError(message: string): never {
  throw new Error(message);
}

// --- Practical Example: Exhaustive Check ---
type PaymentMethod = "credit_card" | "paypal" | "crypto";

function processPayment(method: PaymentMethod): string {
  switch (method) {
    case "credit_card": return "Processing credit card...";
    case "paypal":      return "Redirecting to PayPal...";
    case "crypto":      return "Awaiting crypto confirmation...";
    default:
      // If you add a new PaymentMethod but forget to handle it here,
      // TypeScript will give a compile error on the next line:
      const _exhaustiveCheck: never = method;
      return _exhaustiveCheck; // this line is unreachable
  }
}

console.log("\n--- NEVER TYPE ---");
console.log(processPayment("credit_card")); // Processing credit card...
console.log(processPayment("paypal"));      // Redirecting to PayPal...

// =====================================
// LITERAL TYPES
// =====================================

// What are literal types?
// Instead of the broad 'string' type, you can specify EXACT allowed values.
//   type Direction = "north" | "south" | "east" | "west"
//
// This is like an enum but lighter — just a union of literal values.

// Why use them?
// Restricts a variable to a fixed set of valid values.
// TypeScript will error if you assign anything outside the set.

// Syntax:
//   type Status = "pending" | "active" | "inactive";
//   let currentStatus: Status = "active";

// --- Simple Example ---
type Direction = "north" | "south" | "east" | "west";
let heading: Direction = "north";
// heading = "up";  // Error: "up" is not assignable to type Direction

console.log("\n--- LITERAL TYPES ---");
console.log("Heading:", heading);

// --- Numeric Literal Types ---
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 4;
console.log("Dice roll:", roll);

// --- Real-World Example: E-commerce Status Types ---
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type UserRole = "admin" | "manager" | "customer" | "guest";
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
type ProductCondition = "new" | "refurbished" | "used";

let myOrderStatus: OrderStatus = "processing";
let myRole: UserRole = "customer";
let myPaymentStatus: PaymentStatus = "completed";

console.log("\n--- E-commerce Literal Types ---");
console.log("Order:", myOrderStatus);
console.log("Role:", myRole);
console.log("Payment:", myPaymentStatus);

function describeOrder(status: OrderStatus): string {
  switch (status) {
    case "pending":    return "Your order is waiting to be confirmed.";
    case "processing": return "Your order is being prepared.";
    case "shipped":    return "Your order is on its way!";
    case "delivered":  return "Your order has been delivered.";
    case "cancelled":  return "Your order has been cancelled.";
  }
}
console.log(describeOrder(myOrderStatus));

// =====================================
// TYPE ASSERTION
// =====================================

// What is type assertion?
// Tells TypeScript "trust me, I know the type of this value better than you."
// It does NOT change the runtime value — it's purely a compile-time instruction.

// Why use it?
// When TypeScript's inferred type is too broad and you have external knowledge
// about what the actual type is.

// Syntax (two forms — prefer 'as'):
//   const value = something as SpecificType;
//   const value = <SpecificType>something;  // avoid in .tsx files (JSX conflict)

// --- Simple Example ---
let someValue: unknown = "Hello, TypeScript";
let strLength: number = (someValue as string).length;
console.log("\n--- TYPE ASSERTION ---");
console.log("String length:", strLength); // 16

// --- Practical Example ---
// When working with DOM elements (browser context):
// const input = document.getElementById("username") as HTMLInputElement;
// console.log(input.value);  // TypeScript now knows it's an input element

// --- Real-World Example: API response assertion ---
type ApiUser = { id: number; name: string; email: string };
const rawData: unknown = { id: 1, name: "Alice", email: "alice@example.com" };

// We've validated the shape externally (e.g., with Zod or our own check)
const userData = rawData as ApiUser;
console.log("User from API:", userData.name); // Alice

// Warning: type assertion bypasses TypeScript's safety — use sparingly.
// Wrong assertion won't cause a TS error but WILL cause a runtime error:
// const broken = (42 as unknown) as string;  // no TS error, but bad practice

// =====================================
// NON-NULL ASSERTION OPERATOR (!)
// =====================================

// What is the non-null assertion operator?
// The '!' at the end of an expression tells TypeScript:
// "I guarantee this value is NOT null or undefined at this point."

// Why use it?
// When you know a value cannot be null/undefined but TypeScript can't verify it.

// Syntax:
//   element!.property   — asserts element is not null/undefined

// --- Simple Example ---
function getProductName(names: string[], index: number): string {
  // We know index is valid — tell TypeScript the result is definitely a string
  return names[index]!;
}

console.log("\n--- NON-NULL ASSERTION ---");
const products = ["Laptop", "Phone", "Tablet"];
console.log("Product:", getProductName(products, 0)); // Laptop

// Warning: if the value IS null/undefined at runtime, you get a crash.
// Only use '!' when you are genuinely certain. Prefer optional chaining (?.)
// and nullish coalescing (??) for safer alternatives.

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

console.log("\n--- JS vs TS Comparison ---");

// JavaScript (no safety):
// function calculateTotal(price, quantity) {
//   return price * quantity;   // if called with ("ten", "five") → NaN at runtime
// }
// calculateTotal("ten", "five"); // NaN — silent bug

// TypeScript (safe):
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
// calculateTotal("ten", "five"); // ← Compile error! Caught before running.
console.log("Total:", calculateTotal(29.99, 3)); // 89.97

// =====================================
// COMMON MISTAKES
// =====================================

// 1. Using 'any' instead of 'unknown' for external data
//    Bad:  let data: any = fetchFromApi();
//    Good: let data: unknown = fetchFromApi(); // then narrow before using

// 2. Forgetting null checks with strictNullChecks
//    Bad:  let name: string = user.name;   // might be null
//    Good: let name: string = user.name ?? "Anonymous";

// 3. Mixing number and bigint
//    Bad:  let total = bigIntValue + 1;   // Error: can't mix types
//    Good: let total = bigIntValue + 1n;

// 4. Using type assertion to "fix" a real type mismatch
//    Bad:  let broken = ("hello" as unknown) as number;
//    Good: properly model your types instead

// =====================================
// BEST PRACTICES
// =====================================

// 1. Prefer type INFERENCE over annotation when the value is obvious
//    let count = 0;         // ✓ TypeScript infers number
//    let count: number = 0; // ✓ also fine, more explicit

// 2. Always enable strict mode — especially strictNullChecks
//    tsconfig.json: { "compilerOptions": { "strict": true } }

// 3. Prefer 'unknown' over 'any' for external/untrusted data
//    Then narrow with typeof, instanceof, or a type guard before using

// 4. Use literal types instead of raw strings for fixed sets of values
//    type Status = "active" | "inactive"  →  prevents typos like "actve"

// 5. Use 'void' for functions that have side effects and no return value
//    Makes it immediately clear the caller shouldn't use the return value

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between 'any' and 'unknown'?
// A: Both can hold any value. But 'unknown' requires you to narrow the type
//    before using it (typeof, instanceof, etc.), whereas 'any' skips all
//    type checking. Prefer 'unknown' for external data.

// Q2: What is the difference between 'null' and 'undefined' in TypeScript?
// A: 'undefined' means a variable has been declared but not yet assigned.
//    'null' is an explicit assignment meaning "no value."
//    With strictNullChecks, neither is assignable to other types without
//    explicitly declaring the union (string | null).

// Q3: What is a literal type and when would you use one?
// A: A literal type restricts a variable to one or more exact values.
//    e.g., type Status = "active" | "inactive"
//    Use them when a value must come from a fixed, known set — like
//    order statuses, user roles, or HTTP methods.

// Q4: What does the 'never' type represent?
// A: A function returning 'never' can NEVER finish normally — it always
//    throws or loops forever. It's also used in exhaustive type checking:
//    if a discriminated union is fully handled, the default branch has
//    type 'never', so adding a new union member causes a compile error.

// =====================================
// PRACTICE TASKS
// =====================================

// Task 1:
// Declare variables for a complete User profile:
//   - id (number)
//   - username (string)
//   - email (string)
//   - age (number)
//   - isVerified (boolean)
//   - role (literal type: "admin" | "customer" | "guest")
//   - bio (string | null)  — not all users have a bio
//   - lastLoginDate (string | undefined)  — new users haven't logged in
// Print all fields to the console using a template literal.

// Task 2:
// Create a function processOrderStatus(status: OrderStatus): void
// that uses a switch statement to print a user-friendly message for each
// status: "pending", "processing", "shipped", "delivered", "cancelled".
// Add a default branch using 'never' for exhaustive checking.

// Task 3:
// Create a function safeDivide(a: number, b: number): number | null
// that returns null instead of Infinity or NaN when dividing by zero.
// Test it with: safeDivide(10, 2), safeDivide(10, 0), safeDivide(0, 0)
// Log a message using the nullish coalescing operator:
//   console.log("Result:", safeDivide(10, 0) ?? "Cannot divide by zero");
