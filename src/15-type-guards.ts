// =====================================
// 15 - TYPE GUARDS IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers who know basic TypeScript.
// This file is self-contained and fully runnable.

// THE CORE PROBLEM
// ----------------
// In TypeScript, you often work with union types — variables that can hold
// more than one type at a time. For example:
//
//   function process(value: string | number) { ... }
//
// Inside that function, TypeScript does not know whether `value` is a string
// or a number at any given moment. You cannot call `value.toUpperCase()` safely
// because that method does not exist on numbers.
//
// Type guards are expressions that narrow the type of a variable within a
// specific code block, giving TypeScript (and you) certainty about what type
// you are working with.

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

// JAVASCRIPT — no type safety, runtime errors
// -------------------------------------------
// function formatValue(value) {
//   return value.toUpperCase(); // crashes at runtime if value is a number
// }
// formatValue(42); // TypeError: value.toUpperCase is not a function

// TYPESCRIPT WITHOUT GUARDS — compile error
// ------------------------------------------
// function formatValue(value: string | number): string {
//   return value.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'number'
// }

// TYPESCRIPT WITH GUARDS — safe and correct
// ------------------------------------------
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows value is string here
  }
  return value.toFixed(2); // TypeScript knows value is number here
}

console.log(formatValue("hello")); // HELLO
console.log(formatValue(3.14159)); // 3.14

// =====================================
// TYPEOF GUARD
// =====================================

// WHAT IT IS
// ----------
// The typeof operator returns a string describing the primitive type of a value.
// TypeScript recognises typeof checks and narrows the type inside each branch.

// WHY IT EXISTS
// -------------
// JavaScript primitive types (string, number, boolean, bigint, symbol, undefined,
// function, object) can appear in union types. typeof lets you branch on them.

// SYNTAX
// ------
// if (typeof x === 'string') { /* x is string here */ }
// if (typeof x === 'number') { /* x is number here */ }
// if (typeof x === 'boolean') { /* x is boolean here */ }
// if (typeof x === 'undefined') { /* x is undefined here */ }
// if (typeof x === 'function') { /* x is Function here */ }
// if (typeof x === 'object') { /* x is object | null here — remember null edge case */ }

// SIMPLE EXAMPLE
function describeType(value: string | number | boolean): string {
  if (typeof value === "string") {
    return `String with ${value.length} characters: "${value}"`;
  } else if (typeof value === "number") {
    return `Number: ${value}`;
  } else {
    return `Boolean: ${value}`;
  }
}

console.log(describeType("TypeScript")); // String with 10 characters: "TypeScript"
console.log(describeType(42));           // Number: 42
console.log(describeType(true));         // Boolean: true

// PRACTICAL EXAMPLE — processing form input that can be string or number
function processInput(input: string | number | null | undefined): string {
  if (typeof input === "undefined") {
    return "No input provided";
  }
  if (input === null) {
    return "Input was cleared";
  }
  if (typeof input === "string") {
    return input.trim().toLowerCase();
  }
  // input is number here
  return String(input);
}

console.log(processInput(undefined));  // No input provided
console.log(processInput(null));       // Input was cleared
console.log(processInput("  Hello ")); // hello
console.log(processInput(99));         // 99

// REAL-WORLD EXAMPLE — API response field that can be string or number ID
function normalizeId(id: string | number): string {
  if (typeof id === "number") {
    return id.toString();
  }
  return id; // already a string
}

const numericId = normalizeId(12345);
const stringId = normalizeId("user_abc");
console.log(normalizeId(42));         // 42
console.log(normalizeId("user_abc")); // user_abc

// =====================================
// INSTANCEOF GUARD
// =====================================

// WHAT IT IS
// ----------
// instanceof checks whether an object was created by a particular constructor
// (class). TypeScript narrows the type to that class inside the branch.

// WHY IT EXISTS
// -------------
// Objects created from different classes share the type `object` at the
// primitive level. typeof cannot distinguish a Date from an Error. instanceof
// handles class-based type narrowing.

// SYNTAX
// ------
// if (x instanceof Date) { /* x is Date here */ }
// if (x instanceof MyClass) { /* x is MyClass here */ }

// SIMPLE EXAMPLE
function formatDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0]; // e.g. 2024-01-15
  }
  return value; // already a formatted string
}

console.log(formatDate(new Date("2024-01-15"))); // 2024-01-15
console.log(formatDate("2024-01-15"));           // 2024-01-15

// PRACTICAL EXAMPLE — error handling with multiple error types
class NetworkError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "NetworkError";
  }
}

class ValidationError extends Error {
  field: string;
  constructor(message: string, field: string) {
    super(message);
    this.field = field;
    this.name = "ValidationError";
  }
}

function handleError(error: NetworkError | ValidationError | Error): string {
  if (error instanceof NetworkError) {
    return `Network error ${error.statusCode}: ${error.message}`;
  }
  if (error instanceof ValidationError) {
    return `Validation failed on field "${error.field}": ${error.message}`;
  }
  return `Unknown error: ${error.message}`;
}

console.log(handleError(new NetworkError("Not Found", 404)));
// Network error 404: Not Found
console.log(handleError(new ValidationError("Required", "email")));
// Validation failed on field "email": Required

// REAL-WORLD EXAMPLE — event handling where events can be of different types
class ClickEvent {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class KeyboardEvent {
  key: string;
  constructor(key: string) {
    this.key = key;
  }
}

function handleUIEvent(event: ClickEvent | KeyboardEvent): void {
  if (event instanceof ClickEvent) {
    console.log(`Clicked at (${event.x}, ${event.y})`);
  } else {
    console.log(`Key pressed: ${event.key}`);
  }
}

handleUIEvent(new ClickEvent(100, 200)); // Clicked at (100, 200)
handleUIEvent(new KeyboardEvent("Enter")); // Key pressed: Enter

// =====================================
// IN OPERATOR GUARD
// =====================================

// WHAT IT IS
// ----------
// The `in` operator checks whether a property exists on an object.
// TypeScript uses this to narrow union types of plain objects that share
// no common discriminant field yet differ by the presence of a property.

// WHY IT EXISTS
// -------------
// When you have union types made of object literals (not classes), instanceof
// does not work. The `in` operator lets you check for a distinguishing property.

// SYNTAX
// ------
// if ('propertyName' in someObject) { /* object has that property */ }

// SIMPLE EXAMPLE
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function describeShape(shape: Shape): string {
  if ("radius" in shape) {
    return `Circle with radius ${shape.radius}`;
  }
  return `Rectangle ${shape.width} x ${shape.height}`;
}

console.log(describeShape({ kind: "circle", radius: 5 }));       // Circle with radius 5
console.log(describeShape({ kind: "rectangle", width: 10, height: 4 })); // Rectangle 10 x 4

// PRACTICAL EXAMPLE — distinguishing API response shapes
interface SuccessResponse {
  data: unknown;
  status: "success";
}

interface ErrorResponse {
  error: string;
  code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleApiResponse(response: ApiResponse): void {
  if ("data" in response) {
    console.log("Success:", response.data);
  } else {
    console.log(`Error ${response.code}: ${response.error}`);
  }
}

handleApiResponse({ data: { id: 1 }, status: "success" }); // Success: { id: 1 }
handleApiResponse({ error: "Not found", code: 404 });       // Error 404: Not found

// REAL-WORLD EXAMPLE — cart items that can be physical or digital products
interface PhysicalProduct {
  name: string;
  weight: number;
  shippingAddress: string;
}

interface DigitalProduct {
  name: string;
  downloadUrl: string;
  licenseKey: string;
}

type CartItem = PhysicalProduct | DigitalProduct;

function processCartItem(item: CartItem): string {
  if ("shippingAddress" in item) {
    return `Ship "${item.name}" (${item.weight}kg) to ${item.shippingAddress}`;
  }
  return `Send download link for "${item.name}" to customer`;
}

const physical: PhysicalProduct = {
  name: "TypeScript Handbook",
  weight: 0.5,
  shippingAddress: "123 Main St",
};
const digital: DigitalProduct = {
  name: "TypeScript Course",
  downloadUrl: "https://example.com/download",
  licenseKey: "TS-2024-XYZ",
};

console.log(processCartItem(physical)); // Ship "TypeScript Handbook" (0.5kg) to 123 Main St
console.log(processCartItem(digital));  // Send download link for "TypeScript Course" to customer

// =====================================
// EQUALITY NARROWING
// =====================================

// WHAT IT IS
// ----------
// TypeScript narrows types when you compare a variable directly against a
// specific literal value using === or !==. This includes null, undefined,
// and any literal string/number.

// WHY IT EXISTS
// -------------
// Strict equality checks are extremely common in JavaScript already.
// TypeScript leverages them to remove impossible types from a union.

// SYNTAX
// ------
// if (x === null) { /* x is null here */ }
// if (x !== undefined) { /* x is not undefined here */ }
// if (x === 'admin') { /* x is the literal 'admin' here */ }

// SIMPLE EXAMPLE
function greet(name: string | null | undefined): string {
  if (name === null) {
    return "Hello, anonymous user";
  }
  if (name === undefined) {
    return "Hello, guest";
  }
  return `Hello, ${name}`; // name is string here
}

console.log(greet(null));      // Hello, anonymous user
console.log(greet(undefined)); // Hello, guest
console.log(greet("Alice"));   // Hello, Alice

// PRACTICAL EXAMPLE — role-based access
type Role = "admin" | "editor" | "viewer";

function getRolePermissions(role: Role): string[] {
  if (role === "admin") {
    return ["read", "write", "delete", "manage_users"];
  }
  if (role === "editor") {
    return ["read", "write"];
  }
  return ["read"]; // role is 'viewer' here
}

console.log(getRolePermissions("admin"));  // [ 'read', 'write', 'delete', 'manage_users' ]
console.log(getRolePermissions("viewer")); // [ 'read' ]

// =====================================
// TRUTHINESS NARROWING
// =====================================

// WHAT IT IS
// ----------
// TypeScript narrows types based on whether a value is truthy or falsy.
// Falsy values: false, 0, -0, 0n, "", null, undefined, NaN

// WHY IT EXISTS
// -------------
// JavaScript developers already rely on truthiness checks constantly.
// TypeScript formalises this — checking `if (x)` removes null and undefined
// from the type of x inside the if block.

// SYNTAX
// ------
// if (value) { /* value is not falsy here */ }
// if (!value) { /* value is falsy here */ }

// SIMPLE EXAMPLE
function printMessage(message: string | null | undefined): void {
  if (message) {
    // message is string here — null and undefined are filtered out
    console.log(message.toUpperCase());
  } else {
    console.log("No message provided");
  }
}

printMessage("hello world"); // HELLO WORLD
printMessage(null);          // No message provided
printMessage(undefined);     // No message provided
printMessage("");            // No message provided — empty string is also falsy!

// PRACTICAL EXAMPLE — optional array processing
function sumPositiveNumbers(numbers: number[] | null): number {
  if (!numbers) {
    return 0;
  }
  // numbers is number[] here
  return numbers.filter((n) => n > 0).reduce((sum, n) => sum + n, 0);
}

console.log(sumPositiveNumbers([1, -2, 3, -4, 5])); // 9
console.log(sumPositiveNumbers(null));               // 0

// IMPORTANT CAVEAT — truthiness narrowing and empty strings / zero
function processNumber(value: number | null): string {
  if (value) {
    return `Value is ${value}`;
  }
  // Both null AND 0 reach here — be careful!
  return "No value or zero";
}

console.log(processNumber(5));    // Value is 5
console.log(processNumber(0));    // No value or zero  <-- 0 is falsy!
console.log(processNumber(null)); // No value or zero

// =====================================
// USER-DEFINED TYPE GUARDS (TYPE PREDICATES)
// =====================================

// WHAT IT IS
// ----------
// A user-defined type guard is a function whose return type is a TYPE PREDICATE:
//   parameterName is TypeName
// When the function returns true, TypeScript narrows the argument to that type.

// WHY IT EXISTS
// -------------
// Built-in guards (typeof, instanceof, in) cannot express every narrowing
// you need. When you receive data from an API, from localStorage, or from
// any external source, you need to validate its shape at runtime and also
// tell TypeScript what the type is. Type predicates let you do both at once.

// SYNTAX
// ------
// function isXxx(value: unknown): value is SomeType {
//   return /* runtime check that confirms value matches SomeType */;
// }

// ===== isUser() — for API responses =====

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Record<string, unknown>).id === "number" &&
    typeof (obj as Record<string, unknown>).name === "string" &&
    typeof (obj as Record<string, unknown>).email === "string" &&
    ["admin", "editor", "viewer"].includes(
      (obj as Record<string, unknown>).role as string
    )
  );
}

// SIMPLE EXAMPLE
const rawApiUser: unknown = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
};

if (isUser(rawApiUser)) {
  // rawApiUser is User inside this block
  console.log(`User: ${rawApiUser.name} (${rawApiUser.role})`); // User: Alice (admin)
} else {
  console.log("Invalid user data");
}

// PRACTICAL EXAMPLE — processing API responses with isUser()
function processUserFromApi(data: unknown): string {
  if (isUser(data)) {
    return `Welcome, ${data.name}! Your role is ${data.role}.`;
  }
  return "Failed to load user: invalid data shape";
}

console.log(processUserFromApi({ id: 2, name: "Bob", email: "bob@example.com", role: "editor" }));
// Welcome, Bob! Your role is editor.
console.log(processUserFromApi({ name: "Incomplete" }));
// Failed to load user: invalid data shape

// ===== isProduct() — for dynamic data from external APIs =====

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

function isProduct(obj: unknown): obj is Product {
  if (typeof obj !== "object" || obj === null) return false;
  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.price === "number" &&
    record.price >= 0 &&
    typeof record.stock === "number" &&
    typeof record.category === "string"
  );
}

// REAL-WORLD EXAMPLE — parsing products from an external API payload
function parseProducts(rawData: unknown[]): Product[] {
  const validProducts: Product[] = [];
  const invalidCount = { count: 0 };

  for (const item of rawData) {
    if (isProduct(item)) {
      validProducts.push(item);
    } else {
      invalidCount.count++;
    }
  }

  if (invalidCount.count > 0) {
    console.log(`Warning: ${invalidCount.count} invalid product(s) skipped`);
  }

  return validProducts;
}

const externalApiPayload: unknown[] = [
  { id: "p1", name: "Laptop", price: 999.99, stock: 10, category: "Electronics" },
  { id: "p2", name: "Broken Item" }, // missing fields
  { id: "p3", name: "Mouse", price: 29.99, stock: 50, category: "Peripherals" },
  { name: 42, price: -5 }, // wrong types
];

const products = parseProducts(externalApiPayload);
console.log(`Loaded ${products.length} valid products`); // Loaded 2 valid products
console.log(products.map((p) => p.name).join(", "));     // Laptop, Mouse

// ===== isAdminUser() — for permission checks =====

interface AdminUser extends User {
  permissions: string[];
  department: string;
}

function isAdminUser(user: User | AdminUser): user is AdminUser {
  return (
    user.role === "admin" &&
    "permissions" in user &&
    Array.isArray((user as AdminUser).permissions) &&
    "department" in user &&
    typeof (user as AdminUser).department === "string"
  );
}

function renderAdminPanel(user: User | AdminUser): string {
  if (isAdminUser(user)) {
    return (
      `Admin panel for ${user.name} (${user.department})\n` +
      `  Permissions: ${user.permissions.join(", ")}`
    );
  }
  return `Standard dashboard for ${user.name}`;
}

const regularUser: User = { id: 1, name: "Alice", email: "alice@example.com", role: "editor" };
const adminUser: AdminUser = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  role: "admin",
  permissions: ["manage_users", "billing", "reports"],
  department: "Engineering",
};

console.log(renderAdminPanel(regularUser));
// Standard dashboard for Alice
console.log(renderAdminPanel(adminUser));
// Admin panel for Bob (Engineering)
//   Permissions: manage_users, billing, reports

// ===== isValidPayment() — for payment objects =====

interface CreditCardPayment {
  method: "credit_card";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

interface BankTransferPayment {
  method: "bank_transfer";
  accountNumber: string;
  routingNumber: string;
  amount: number;
}

interface CryptoPayment {
  method: "crypto";
  walletAddress: string;
  currency: "BTC" | "ETH" | "USDC";
  amount: number;
}

type Payment = CreditCardPayment | BankTransferPayment | CryptoPayment;

function isValidPayment(obj: unknown): obj is Payment {
  if (typeof obj !== "object" || obj === null) return false;
  const record = obj as Record<string, unknown>;
  if (typeof record.amount !== "number" || record.amount <= 0) return false;

  if (record.method === "credit_card") {
    return (
      typeof record.cardNumber === "string" &&
      typeof record.expiryDate === "string" &&
      typeof record.cvv === "string"
    );
  }
  if (record.method === "bank_transfer") {
    return (
      typeof record.accountNumber === "string" &&
      typeof record.routingNumber === "string"
    );
  }
  if (record.method === "crypto") {
    return (
      typeof record.walletAddress === "string" &&
      ["BTC", "ETH", "USDC"].includes(record.currency as string)
    );
  }
  return false;
}

function processPayment(data: unknown): string {
  if (!isValidPayment(data)) {
    return "Invalid payment data";
  }
  // data is Payment here — TypeScript knows it
  switch (data.method) {
    case "credit_card":
      return `Processing card ending ${data.cardNumber.slice(-4)} for $${data.amount}`;
    case "bank_transfer":
      return `Initiating transfer from account ${data.accountNumber} for $${data.amount}`;
    case "crypto":
      return `Sending ${data.amount} ${data.currency} to ${data.walletAddress}`;
  }
}

console.log(
  processPayment({
    method: "credit_card",
    cardNumber: "4111111111111234",
    expiryDate: "12/26",
    cvv: "123",
    amount: 150,
  })
); // Processing card ending 1234 for $150

console.log(
  processPayment({
    method: "crypto",
    walletAddress: "0xABC123",
    currency: "ETH",
    amount: 0.5,
  })
); // Sending 0.5 ETH to 0xABC123

console.log(processPayment({ method: "credit_card", amount: -10 })); // Invalid payment data

// =====================================
// ASSERTION FUNCTIONS
// =====================================

// WHAT IT IS
// ----------
// An assertion function throws if its condition is not met, and tells TypeScript
// that after the call, a narrowed type is guaranteed. The return type uses the
// `asserts` keyword.

// WHY IT EXISTS
// -------------
// Sometimes you want to assert a precondition and have TypeScript narrow the
// type for all code that follows the assertion call, not just inside an if block.
// If the assertion fails, execution stops (an error is thrown), so TypeScript
// can trust the narrowed type from that point forward.

// SYNTAX
// ------
// function assertIsType(x: unknown): asserts x is SomeType {
//   if (/* x is NOT SomeType */) { throw new Error('...'); }
// }
// function assert(condition: unknown): asserts condition {
//   if (!condition) { throw new Error('Assertion failed'); }
// }

// SIMPLE EXAMPLE
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") {
    throw new TypeError(`Expected string, got ${typeof x}`);
  }
}

function processName(name: unknown): void {
  assertIsString(name);
  // name is string here — TypeScript knows this
  console.log(name.toUpperCase());
}

processName("alice"); // ALICE
try {
  processName(42); // throws TypeError
} catch (e) {
  console.log((e as Error).message); // Expected string, got number
}

// PRACTICAL EXAMPLE — assert non-null helper used throughout an application
function assertDefined<T>(value: T | null | undefined, label: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${label} to be defined, but got ${value}`);
  }
}

interface Config {
  apiUrl: string;
  timeout: number;
}

function initApp(config: Config | null): void {
  assertDefined(config, "config");
  // config is Config here — TypeScript knows it cannot be null
  console.log(`Connecting to ${config.apiUrl} with timeout ${config.timeout}ms`);
}

initApp({ apiUrl: "https://api.example.com", timeout: 5000 });
// Connecting to https://api.example.com with timeout 5000ms

try {
  initApp(null);
} catch (e) {
  console.log((e as Error).message); // Expected config to be defined, but got null
}

// REAL-WORLD EXAMPLE — asserting valid API responses before processing
function assertIsUser(data: unknown): asserts data is User {
  if (!isUser(data)) {
    throw new Error("API returned invalid user data");
  }
}

function loadCurrentUser(apiResponse: unknown): void {
  assertIsUser(apiResponse);
  // apiResponse is User from this point on
  console.log(`Logged in as ${apiResponse.name} (${apiResponse.email})`);
}

try {
  loadCurrentUser({ id: 3, name: "Carol", email: "carol@example.com", role: "viewer" });
  // Logged in as Carol (carol@example.com)
} catch (e) {
  console.log((e as Error).message);
}

try {
  loadCurrentUser({ id: "wrong_type" });
} catch (e) {
  console.log((e as Error).message); // API returned invalid user data
}

// =====================================
// DISCRIMINATED UNION NARROWING
// =====================================

// WHAT IT IS
// ----------
// A discriminated union is a union of types that each have a shared
// LITERAL property (the discriminant). TypeScript narrows automatically
// when you check this discriminant in a switch or if-else chain.

// WHY IT EXISTS
// -------------
// Complex domain objects (orders, notifications, events) can have very
// different shapes depending on their state. Discriminated unions encode
// this in the type system. Narrowing on the discriminant gives you full
// type safety without any manual casting.

// SYNTAX
// ------
// interface TypeA { kind: 'a'; ... }
// interface TypeB { kind: 'b'; ... }
// type Union = TypeA | TypeB;
// switch (value.kind) { case 'a': /* TypeA */ break; case 'b': /* TypeB */ }

// ===== ApiResponse narrowing (success vs error states) =====

interface ApiSuccess<T> {
  status: "success";
  data: T;
  timestamp: number;
}

interface ApiError {
  status: "error";
  message: string;
  code: number;
}

interface ApiLoading {
  status: "loading";
}

type TypedApiResponse<T> = ApiSuccess<T> | ApiError | ApiLoading;

interface UserProfile {
  id: number;
  username: string;
  avatar: string;
}

function renderUserProfile(response: TypedApiResponse<UserProfile>): string {
  switch (response.status) {
    case "loading":
      return "Loading profile...";
    case "success":
      // response is ApiSuccess<UserProfile> here
      return `@${response.data.username} (fetched at ${new Date(response.timestamp).toISOString()})`;
    case "error":
      // response is ApiError here
      return `Error ${response.code}: ${response.message}`;
  }
}

const loading: ApiLoading = { status: "loading" };
const success: ApiSuccess<UserProfile> = {
  status: "success",
  data: { id: 1, username: "alice_ts", avatar: "https://example.com/avatar.png" },
  timestamp: Date.now(),
};
const error: ApiError = { status: "error", message: "Unauthorized", code: 401 };

console.log(renderUserProfile(loading));  // Loading profile...
console.log(renderUserProfile(error));    // Error 401: Unauthorized
// Success output will include current timestamp

// ===== Cart item type discrimination =====

interface StandardCartItem {
  itemType: "standard";
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface BundleCartItem {
  itemType: "bundle";
  bundleId: string;
  name: string;
  items: Array<{ productId: string; quantity: number }>;
  bundlePrice: number;
}

interface SubscriptionCartItem {
  itemType: "subscription";
  planId: string;
  name: string;
  billingCycle: "monthly" | "annual";
  pricePerCycle: number;
}

type AnyCartItem = StandardCartItem | BundleCartItem | SubscriptionCartItem;

function calculateItemTotal(item: AnyCartItem): number {
  switch (item.itemType) {
    case "standard":
      return item.quantity * item.unitPrice;
    case "bundle":
      return item.bundlePrice;
    case "subscription":
      return item.billingCycle === "annual"
        ? item.pricePerCycle * 10 // 2 months free
        : item.pricePerCycle;
  }
}

function describeCartItem(item: AnyCartItem): string {
  switch (item.itemType) {
    case "standard":
      return `${item.name} x${item.quantity} @ $${item.unitPrice} = $${calculateItemTotal(item)}`;
    case "bundle":
      return `Bundle: ${item.name} (${item.items.length} items) = $${calculateItemTotal(item)}`;
    case "subscription":
      return `${item.name} (${item.billingCycle}) = $${calculateItemTotal(item)}`;
  }
}

const standardItem: StandardCartItem = {
  itemType: "standard",
  productId: "p1",
  name: "TypeScript Handbook",
  quantity: 2,
  unitPrice: 49.99,
};
const bundleItem: BundleCartItem = {
  itemType: "bundle",
  bundleId: "b1",
  name: "Dev Tools Bundle",
  items: [{ productId: "p1", quantity: 1 }, { productId: "p2", quantity: 1 }],
  bundlePrice: 79.99,
};
const subscriptionItem: SubscriptionCartItem = {
  itemType: "subscription",
  planId: "plan_pro",
  name: "Pro Plan",
  billingCycle: "annual",
  pricePerCycle: 99,
};

const cart: AnyCartItem[] = [standardItem, bundleItem, subscriptionItem];
cart.forEach((item) => console.log(describeCartItem(item)));
// TypeScript Handbook x2 @ $49.99 = $99.98
// Bundle: Dev Tools Bundle (2 items) = $79.99
// Pro Plan (annual) = $990

// =====================================
// EXHAUSTIVE CHECKING WITH NEVER
// =====================================

// WHAT IT IS
// ----------
// `never` is a TypeScript type that represents values that should never exist.
// By assigning a variable to `never` in the default case of a switch, you
// get a compile-time error if you add a new variant to a union but forget to
// handle it.

// WHY IT EXISTS
// -------------
// As your codebase grows, discriminated unions gain new variants. Without
// exhaustive checks, new variants silently fall through to a default case.
// With a never check, TypeScript forces you to handle every variant.

// SYNTAX
// ------
// function assertNever(x: never): never {
//   throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
// }
// switch (value.discriminant) {
//   case 'a': ...
//   case 'b': ...
//   default: assertNever(value); // compile error if any case is missing
// }

function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

type NotificationType = "email" | "sms" | "push";

interface EmailNotification {
  type: "email";
  to: string;
  subject: string;
  body: string;
}

interface SmsNotification {
  type: "sms";
  phoneNumber: string;
  message: string;
}

interface PushNotificationMsg {
  type: "push";
  deviceToken: string;
  title: string;
  body: string;
}

type Notification = EmailNotification | SmsNotification | PushNotificationMsg;

function sendNotification(notification: Notification): string {
  switch (notification.type) {
    case "email":
      return `Sending email to ${notification.to}: "${notification.subject}"`;
    case "sms":
      return `Sending SMS to ${notification.phoneNumber}: "${notification.message}"`;
    case "push":
      return `Sending push to ${notification.deviceToken}: "${notification.title}"`;
    default:
      // If you add a new type to Notification but forget to add a case here,
      // TypeScript will report a compile error: "Argument of type '...' is not
      // assignable to parameter of type 'never'"
      return assertNever(notification);
  }
}

const emailMsg: EmailNotification = {
  type: "email",
  to: "user@example.com",
  subject: "Welcome!",
  body: "Thanks for signing up.",
};
console.log(sendNotification(emailMsg));
// Sending email to user@example.com: "Welcome!"

const smsMsg: SmsNotification = {
  type: "sms",
  phoneNumber: "+1-555-0100",
  message: "Your code is 123456",
};
console.log(sendNotification(smsMsg));
// Sending SMS to +1-555-0100: "Your code is 123456"

// =====================================
// THE SATISFIES OPERATOR (TYPESCRIPT 4.9+)
// =====================================

// WHAT IT IS
// ----------
// The `satisfies` operator validates that an expression matches a type, but
// it PRESERVES the more specific inferred type instead of widening it to the
// declared type.

// WHY IT EXISTS
// -------------
// When you write `const x: SomeType = { ... }`, TypeScript widens the type
// of x to SomeType. You lose the specific literal types and you cannot access
// properties that exist on x but not on SomeType. `satisfies` checks the type
// without widening — you get type validation AND precise inference.

// SYNTAX
// ------
// const value = expression satisfies SomeType;

// SIMPLE EXAMPLE — without satisfies (widened type)
type StringOrNumber = string | number;
type Config1 = Record<string, StringOrNumber>;

// Using type annotation — TypeScript widens all values to StringOrNumber
const config1: Config1 = {
  host: "localhost",
  port: 3000,
};
// config1.host is StringOrNumber — cannot use string methods directly without a guard

// Using satisfies — TypeScript keeps the precise types
const config2 = {
  host: "localhost",
  port: 3000,
} satisfies Config1;

// config2.host is string (not StringOrNumber) — string methods work directly
console.log(config2.host.toUpperCase()); // LOCALHOST
// config2.port is number — number methods work directly
console.log(config2.port.toFixed(0));    // 3000

// PRACTICAL EXAMPLE — route configuration that must satisfy a shape but keep literal types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RouteConfig {
  method: HttpMethod;
  path: string;
  requiresAuth: boolean;
}

type RouteName = "getUser" | "createUser" | "updateUser" | "deleteUser";

// satisfies validates the shape AND preserves the literal types for each key
const routes = {
  getUser: { method: "GET", path: "/users/:id", requiresAuth: true },
  createUser: { method: "POST", path: "/users", requiresAuth: false },
  updateUser: { method: "PUT", path: "/users/:id", requiresAuth: true },
  deleteUser: { method: "DELETE", path: "/users/:id", requiresAuth: true },
} satisfies Record<RouteName, RouteConfig>;

// routes.getUser.method is "GET" (literal), not HttpMethod (union)
console.log(routes.getUser.method);    // GET
console.log(routes.createUser.path);   // /users

// =====================================
// AS CONST FOR LITERAL NARROWING
// =====================================

// WHAT IT IS
// ----------
// `as const` asserts that all values in an object or array are their exact
// literal types, and that the structure is readonly. TypeScript infers the
// most specific type possible instead of a wider primitive type.

// WHY IT EXISTS
// -------------
// Without `as const`, TypeScript widens string literals to `string`, numbers
// to `number`, etc. This can cause mismatches when you need literal types for
// discriminated unions or precise mapping types.

// SYNTAX
// ------
// const x = 'hello' as const;           // type is "hello", not string
// const obj = { a: 1, b: 'x' } as const; // type is { readonly a: 1, readonly b: "x" }
// const arr = ['a', 'b', 'c'] as const;  // type is readonly ["a", "b", "c"]

// SIMPLE EXAMPLE
const statusWithoutConst = { active: "active", inactive: "inactive" };
// Type: { active: string; inactive: string } — widened

const statusWithConst = { active: "active", inactive: "inactive" } as const;
// Type: { readonly active: "active"; readonly inactive: "inactive" } — literal

type StatusKey = typeof statusWithConst[keyof typeof statusWithConst];
// StatusKey is "active" | "inactive" — precise union derived from the object

function setStatus(status: StatusKey): void {
  console.log(`Status set to: ${status}`);
}

setStatus(statusWithConst.active);   // Status set to: active
setStatus(statusWithConst.inactive); // Status set to: inactive
// setStatus("pending"); // Error: Argument of type '"pending"' is not assignable

// REAL-WORLD EXAMPLE — permission constants used throughout an application
const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  MANAGE_USERS: "manage_users",
} as const;

type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
// "read" | "write" | "delete" | "manage_users"

function hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required);
}

const userPerms: Permission[] = [PERMISSIONS.READ, PERMISSIONS.WRITE];
console.log(hasPermission(userPerms, PERMISSIONS.READ));         // true
console.log(hasPermission(userPerms, PERMISSIONS.MANAGE_USERS)); // false

// =====================================
// CONTROL FLOW ANALYSIS
// =====================================

// WHAT IT IS
// ----------
// TypeScript's compiler analyses every execution path through your code and
// tracks the type of each variable at each point. This is called control flow
// analysis (CFA). It is the underlying engine behind all narrowing — typeof,
// instanceof, in, equality, truthiness, and custom guards all feed into it.

// WHY IT EXISTS
// -------------
// CFA means you do NOT need to cast (as Type) in most situations. TypeScript
// figures out types automatically based on the checks you have already written.
// Understanding CFA helps you write safer code with fewer type assertions.

// EXAMPLE — TypeScript tracks types through multiple branches and assignments
function analyseUserInput(input: string | number | boolean | null): string {
  // At this point: input is string | number | boolean | null

  if (input === null) {
    return "null"; // TypeScript removes null from the type after this block
  }

  // Here: input is string | number | boolean

  if (typeof input === "boolean") {
    return input ? "true_value" : "false_value";
  }

  // Here: input is string | number

  if (typeof input === "string" && input.length === 0) {
    return "empty_string";
  }

  // Here: input is string | number (but if it is a string, it is non-empty)

  return String(input);
}

console.log(analyseUserInput(null));   // null
console.log(analyseUserInput(true));   // true_value
console.log(analyseUserInput(""));     // empty_string
console.log(analyseUserInput("hi"));   // hi
console.log(analyseUserInput(7));      // 7

// CFA also tracks across assignments
function demonstrateCFA(): void {
  let value: string | null = Math.random() > 0.5 ? "hello" : null;

  // value is string | null here
  if (value !== null) {
    // value is string here
    const upper = value.toUpperCase();
    console.log(upper); // TypeScript allows this — no cast needed
  }

  // After reassignment, TypeScript resets the narrowed type
  value = "always a string now";
  // value is string here (TypeScript narrows based on the assignment)
  console.log(value.length);
}

demonstrateCFA();

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1 — using `any` instead of type guards
// -----------------------------------------------
// BAD: bypasses the type system entirely
function processDataBad(data: any): string {
  return data.name.toUpperCase(); // no safety — crashes if data.name is undefined
}

// GOOD: validate at runtime with a type guard
function processDataGood(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).name === "string"
  ) {
    return (data as { name: string }).name.toUpperCase();
  }
  return "Unknown";
}

console.log(processDataGood({ name: "alice" })); // ALICE
console.log(processDataGood(null));              // Unknown

// MISTAKE 2 — imprecise type guard that passes wrong objects
// ----------------------------------------------------------
// BAD: only checks for the presence of a property, not its type
function isUserBad(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "name" in obj;
  // This passes for { name: 42 } which is not a valid User!
}

// GOOD: check every field and its type
// (The isUser function defined earlier in this file is correct)

// MISTAKE 3 — forgetting that typeof null === 'object'
// -----------------------------------------------------
function processObject(value: object | null): string {
  // BAD: typeof value === 'object' is true even when value is null
  // if (typeof value === 'object') { return value.toString(); } // crashes on null!

  // GOOD: check for null explicitly
  if (value !== null && typeof value === "object") {
    return value.toString();
  }
  return "null";
}

console.log(processObject({}));   // [object Object]
console.log(processObject(null)); // null

// MISTAKE 4 — using truthiness when 0 or '' should be valid values
// ----------------------------------------------------------------
function getCount(count: number | undefined): number {
  // BAD: this treats 0 as undefined!
  // return count ?? 0;  // This one is actually fine but:
  // if (count) return count;  // 0 would be treated as "no count"

  // GOOD: check explicitly for undefined
  if (count === undefined) return 0;
  return count;
}

console.log(getCount(0));         // 0  (correct)
console.log(getCount(5));         // 5
console.log(getCount(undefined)); // 0

// =====================================
// BEST PRACTICES
// =====================================

// 1. PREFER DISCRIMINATED UNIONS OVER FRAGILE `in` CHECKS
//    Add a discriminant field (kind/type/status) to every variant of a union.
//    This makes narrowing explicit, readable, and exhaustively checkable.

// 2. USE `unknown` INSTEAD OF `any` FOR EXTERNAL DATA
//    unknown forces you to write a type guard before using the value.
//    any disables type checking entirely. Prefer unknown for API data,
//    JSON.parse results, localStorage reads, and anything user-supplied.

// 3. WRITE THOROUGH TYPE GUARDS
//    Check every field and its type. A guard that only checks one property
//    can let malformed data slip through with incorrect types attached.

// 4. USE assertNever FOR EXHAUSTIVE UNION HANDLING
//    Place assertNever in the default branch of every switch on a
//    discriminated union. This ensures compile-time errors when new
//    variants are added without corresponding handling.

// 5. KEEP GUARDS CLOSE TO THE TYPES THEY VALIDATE
//    Define isUser() next to the User interface. isProduct() next to Product.
//    This makes maintenance easy — when you update the type, you update the guard.

// 6. AVOID CASTING (as SomeType) WHEN A GUARD IS FEASIBLE
//    Type assertions skip runtime validation. A type guard validates AND narrows.
//    Reserve `as` for truly unavoidable situations (DOM access, third-party libs).

// 7. COMBINE satisfies WITH as const FOR CONFIGURATION OBJECTS
//    Use `as const` to preserve literal types, then validate shape with satisfies.
//    This gives you both precision and type safety.

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between a type guard and a type assertion (as)?
//
// A: A type assertion (as SomeType) is a compile-time instruction that TELLS
//    TypeScript "trust me, this is SomeType" without any runtime check. It can
//    mask real runtime errors if the actual value does not match. A type guard is
//    a runtime check that PROVES to TypeScript that a value has a certain type.
//    TypeScript then narrows the type in subsequent code based on that proof.
//    Prefer type guards for external/dynamic data; use assertions sparingly.

// Q2: What is a discriminated union and why is it preferred over ad-hoc `in` checks?
//
// A: A discriminated union is a union of types that share a common literal
//    property (the discriminant) whose value is unique per variant. When you
//    switch on the discriminant, TypeScript narrows each case fully and the
//    compiler can enforce exhaustive handling (via never). Ad-hoc `in` checks
//    work but do not compose as cleanly, are harder to read, and are not
//    automatically exhaustive.

// Q3: What does the `never` type represent and how is it used for exhaustive checks?
//
// A: `never` represents values that can never exist — a type with no inhabitants.
//    In exhaustive checking, after handling every variant in a switch, the default
//    branch receives a value of type `never` (because all cases are covered).
//    A function `assertNever(x: never): never` accepts only `never`. If you add a
//    new variant but forget a case, TypeScript raises a compile error because the
//    unhandled variant is not assignable to `never`.

// Q4: What is the difference between `satisfies` and a type annotation?
//
// A: A type annotation (const x: T = value) widens the type of x to T, losing
//    specificity. For example, string literals become `string`, numbers become
//    `number`. The `satisfies` operator validates that value matches T but
//    PRESERVES the inferred type of value. This gives you both validation and
//    precise autocompletion / type inference. Use satisfies for configuration
//    objects and lookup tables where literal types are valuable.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — isOrderItem() type guard
// ----------------------------------
// Define these interfaces:
//   interface OrderItem { productId: string; quantity: number; price: number; }
//   interface GiftItem  { giftMessage: string; recipientEmail: string; price: number; }
//   type LineItem = OrderItem | GiftItem;
//
// Write a type guard `isOrderItem(obj: unknown): obj is OrderItem`.
// Write a function `calculateLineTotal(item: LineItem): number` that returns
// quantity * price for OrderItem and just price for GiftItem.
// Test with at least one of each.

// TASK 2 — Exhaustive notification system
// ----------------------------------------
// Create a discriminated union for notifications with at least four variants:
// email, sms, push, and webhook. Each variant has a `type` discriminant and
// variant-specific fields.
//
// Write `formatNotification(n: Notification): string` using a switch that
// handles every variant. Add an assertNever default branch.
// Then add a new variant `slack` to the union and observe the compile error
// in the switch. Add the missing case to fix it.

// TASK 3 — Runtime API validation pipeline
// ------------------------------------------
// Simulate a function `fetchUsers(): Promise<unknown[]>` that resolves with
// an array of mixed data (some valid User objects, some invalid).
//
// Using the isUser() guard from this file:
// - Filter to only valid users
// - Count how many were invalid
// - Return an object { users: User[]; skipped: number }
//
// Test it by calling the function with a hardcoded array that contains
// both valid and invalid entries. Log the result.
