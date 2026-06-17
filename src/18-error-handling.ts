// =====================================
// 18 - ERROR HANDLING IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers who know basic TypeScript.
// This file is self-contained and fully runnable.
// Run: npx ts-node src/18-error-handling.ts

// =====================================
// TABLE OF CONTENTS
// =====================================

// 1. Basic try/catch/finally with TypeScript
// 2. Why catch (e) is 'unknown' in strict mode
// 3. Narrowing error types in catch blocks
// 4. instanceof Error check
// 5. Re-throwing errors
// 6. Custom Error Classes
// 7. Error hierarchies
// 8. Custom error codes and messages
// 9. Result Pattern (Result<T, E>)
// 10. Either pattern
// 11. Option/Maybe pattern
// 12. Typed error handling with discriminated unions
// 13. Error boundary concept
// 14. Global error handler patterns
// 15. Logging errors with proper types
// 16. JavaScript vs TypeScript comparison
// 17. Common mistakes
// 18. Best practices
// 19. Interview questions
// 20. Practice tasks

// =====================================
// BASIC TRY/CATCH/FINALLY IN TYPESCRIPT
// =====================================

// WHAT IT IS:
//   The try/catch/finally block lets you handle errors that occur at runtime.
//   TypeScript adds type safety on top of JavaScript's existing mechanism.

// WHY IT EXISTS:
//   Without it, an unhandled error crashes the entire program.
//   try/catch lets you gracefully recover from failures or show meaningful messages.

// SYNTAX:
//   try    — code that might throw
//   catch  — receives the thrown value, typed as 'unknown' in strict mode
//   finally — always runs, whether or not an error was thrown (cleanup code)

// SIMPLE EXAMPLE:
console.log("--- Basic try/catch/finally ---");

function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

try {
  const result = divide(10, 2);
  console.log("10 / 2 =", result); // 5

  const badResult = divide(10, 0); // throws
  console.log("This line never runs:", badResult);
} catch (e) {
  // In strict mode, 'e' is typed as 'unknown', NOT 'any'
  if (e instanceof Error) {
    console.log("Caught error:", e.message);
  }
} finally {
  console.log("Finally block always runs — good for cleanup");
}

// =====================================
// WHY catch (e) IS 'unknown' IN STRICT MODE
// =====================================

// WHAT IT IS:
//   In TypeScript 4.0+ with useUnknownInCatchVariables (enabled by default in strict mode),
//   the caught value 'e' has type 'unknown' instead of 'any'.

// WHY IT EXISTS:
//   JavaScript lets you throw ANYTHING — not just Error objects:
//     throw "a string"
//     throw 42
//     throw { code: 500 }
//     throw null
//   TypeScript uses 'unknown' to FORCE you to check what was actually thrown
//   before using it, preventing runtime crashes from assuming it is an Error.

// JAVASCRIPT BEHAVIOR (dangerous):
//   catch (e) { console.log(e.message) }
//   // If e is a string or number, '.message' is undefined — silent bug

// TYPESCRIPT STRICT BEHAVIOR (safe):
//   catch (e: unknown) { console.log(e.message) } // COMPILE ERROR
//   // TypeScript refuses to let you access .message without narrowing first

console.log("\n--- unknown in catch ---");

function riskyOperation(input: unknown): string {
  if (typeof input !== "string") {
    throw "not a string"; // throwing a plain string, not an Error
  }
  return input.toUpperCase();
}

try {
  riskyOperation(42);
} catch (e: unknown) {
  // e is 'unknown' — TypeScript forces us to check before using
  if (typeof e === "string") {
    console.log("String was thrown:", e);
  } else if (e instanceof Error) {
    console.log("Error object thrown:", e.message);
  } else {
    console.log("Something unknown was thrown:", JSON.stringify(e));
  }
}

// =====================================
// NARROWING ERROR TYPES IN CATCH BLOCKS
// =====================================

// WHAT IT IS:
//   Narrowing means using checks (typeof, instanceof, property checks)
//   to progressively reduce the type of 'e' from 'unknown' to something specific.

// WHY IT EXISTS:
//   Because 'unknown' is unworkable on its own — you cannot call methods on it.
//   Narrowing gives TypeScript proof that 'e' is safe to use as a specific type.

// TECHNIQUES:
//   1. instanceof Error — check if it is a standard Error or subclass
//   2. typeof e === "string" — check if a plain string was thrown
//   3. Property guard  — check for a specific property (e.g. 'code', 'statusCode')

console.log("\n--- Narrowing error types ---");

// Utility: check if value has a specific property
function hasProperty<T extends object>(
  obj: unknown,
  key: keyof T
): obj is T {
  return typeof obj === "object" && obj !== null && key in obj;
}

// Narrow to an object with a 'message' string
interface HasMessage {
  message: string;
}

function extractMessage(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === "string") {
    return e;
  }
  if (hasProperty<HasMessage>(e, "message") && typeof (e as HasMessage).message === "string") {
    return (e as HasMessage).message;
  }
  return "An unknown error occurred";
}

// Test all three cases
try { throw new Error("Standard error object"); }
catch (e) { console.log("Narrowed:", extractMessage(e)); }

try { throw "Plain string error"; }
catch (e) { console.log("Narrowed:", extractMessage(e)); }

try { throw { message: "Custom object error", code: 404 }; }
catch (e) { console.log("Narrowed:", extractMessage(e)); }

// =====================================
// instanceof ERROR CHECK
// =====================================

// WHAT IT IS:
//   instanceof checks whether an object was created by a specific constructor (or its subclass).

// WHY IT EXISTS:
//   It is the cleanest way to determine if a thrown value is an Error (or custom error subclass).
//   It works across the entire prototype chain, so instanceof Error is true
//   for all subclasses of Error: TypeError, RangeError, your own CustomError, etc.

console.log("\n--- instanceof Error check ---");

function parseJsonSafe(raw: string): unknown {
  if (!raw.trim()) {
    throw new TypeError("Input string is empty");
  }
  return JSON.parse(raw); // throws SyntaxError if invalid JSON
}

const inputs = ['{"name":"Alice"}', "", "not-json"];

for (const input of inputs) {
  try {
    const parsed = parseJsonSafe(input);
    console.log("Parsed:", JSON.stringify(parsed));
  } catch (e: unknown) {
    if (e instanceof TypeError) {
      console.log("TypeError:", e.message);
    } else if (e instanceof SyntaxError) {
      console.log("SyntaxError:", e.message);
    } else if (e instanceof Error) {
      console.log("Generic Error:", e.message);
    } else {
      console.log("Non-Error thrown:", e);
    }
  }
}

// =====================================
// RE-THROWING ERRORS
// =====================================

// WHAT IT IS:
//   After catching an error, you can re-throw it if you cannot handle it at that level.
//   This lets the error propagate up the call stack where it might be handled better.

// WHY IT EXISTS:
//   A function often knows that an error occurred but not HOW to recover from it.
//   The caller (or a top-level handler) may have that context.
//   Re-throwing avoids silently swallowing errors — one of the most dangerous mistakes.

// BEST PRACTICE:
//   Only catch what you can handle. Re-throw everything else.
//   When re-throwing, you can also WRAP the error to add context.

console.log("\n--- Re-throwing errors ---");

class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly query: string,
    public override readonly cause?: Error
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

function runQuery(query: string): string[] {
  if (query.includes("DROP")) {
    throw new Error("Dangerous query detected");
  }
  return ["row1", "row2"];
}

function getUsersFromDB(filter: string): string[] {
  try {
    return runQuery(`SELECT * FROM users WHERE ${filter}`);
  } catch (e: unknown) {
    if (e instanceof Error) {
      // Wrap with context and re-throw as a more specific error
      throw new DatabaseError(
        `Failed to fetch users with filter: ${filter}`,
        `SELECT * FROM users WHERE ${filter}`,
        e
      );
    }
    throw e; // re-throw unknown values as-is
  }
}

try {
  getUsersFromDB("1=1; DROP TABLE users");
} catch (e: unknown) {
  if (e instanceof DatabaseError) {
    console.log("DatabaseError caught at top level");
    console.log("  Message:", e.message);
    console.log("  Query:", e.query);
    console.log("  Caused by:", e.cause?.message);
  }
}

// =====================================
// CUSTOM ERROR CLASSES
// =====================================

// WHAT IT IS:
//   You can extend the built-in Error class to create domain-specific error types.

// WHY IT EXISTS:
//   Generic Error objects carry only a message string.
//   Custom errors can carry structured data (HTTP status, field name, error code)
//   and let callers distinguish error types with instanceof checks.

// SYNTAX:
//   class MyError extends Error {
//     constructor(message: string, public extraData: SomeType) {
//       super(message);
//       this.name = "MyError";         // IMPORTANT: set name manually
//       Object.setPrototypeOf(this, MyError.prototype); // fix instanceof in older targets
//     }
//   }

// WHY Object.setPrototypeOf?
//   When TypeScript compiles class extensions down to ES5, the prototype chain breaks,
//   making instanceof fail. setPrototypeOf restores it.
//   If you target ES2015+ this is unnecessary, but it is harmless to include.

console.log("\n--- Custom Error Classes ---");

// Base custom error
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Domain-specific error: User API
class UserNotFoundError extends AppError {
  constructor(public readonly userId: string) {
    super(`User with ID '${userId}' was not found`, "USER_NOT_FOUND", 404);
    this.name = "UserNotFoundError";
  }
}

// Domain-specific error: Inventory
class InsufficientStockError extends AppError {
  constructor(
    public readonly productId: string,
    public readonly requested: number,
    public readonly available: number
  ) {
    super(
      `Insufficient stock for product '${productId}': requested ${requested}, available ${available}`,
      "INSUFFICIENT_STOCK",
      409
    );
    this.name = "InsufficientStockError";
  }
}

// Test custom errors
function findUser(id: string): { id: string; name: string } {
  const db: Record<string, { id: string; name: string }> = {
    u1: { id: "u1", name: "Alice" },
  };
  if (!db[id]) {
    throw new UserNotFoundError(id);
  }
  return db[id];
}

function reserveStock(productId: string, qty: number): void {
  const stock: Record<string, number> = { p1: 5 };
  const available = stock[productId] ?? 0;
  if (qty > available) {
    throw new InsufficientStockError(productId, qty, available);
  }
  console.log(`Reserved ${qty} units of product ${productId}`);
}

try {
  findUser("u99");
} catch (e: unknown) {
  if (e instanceof UserNotFoundError) {
    console.log(`[${e.code}] ${e.statusCode}: ${e.message}`);
    console.log("  userId:", e.userId);
  }
}

try {
  reserveStock("p1", 10);
} catch (e: unknown) {
  if (e instanceof InsufficientStockError) {
    console.log(`[${e.code}] ${e.statusCode}: ${e.message}`);
    console.log(`  Requested: ${e.requested}, Available: ${e.available}`);
  }
}

// =====================================
// ERROR HIERARCHIES
// =====================================

// WHAT IT IS:
//   A tree of error classes where each level adds more specificity.
//   BaseAppError → ValidationError, NetworkError, AuthError → specific subtypes

// WHY IT EXISTS:
//   Hierarchies let you catch at the right level of specificity.
//   catch (e instanceof ValidationError) catches ALL validation errors.
//   catch (e instanceof AppError) catches EVERYTHING your app throws intentionally.
//   This makes error handling composable and scalable.

console.log("\n--- Error Hierarchies ---");

// Level 1: Root of all app errors
class BaseAppError extends Error {
  public readonly timestamp: Date;
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "BaseAppError";
    this.timestamp = new Date();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Level 2: Category errors
class ValidationError extends BaseAppError {
  constructor(
    message: string,
    public readonly fields: Record<string, string>
  ) {
    super(message, "VALIDATION_ERROR", 422);
    this.name = "ValidationError";
  }
}

class NetworkError extends BaseAppError {
  constructor(
    message: string,
    public readonly url: string,
    public readonly retryable: boolean = true
  ) {
    super(message, "NETWORK_ERROR", 503);
    this.name = "NetworkError";
  }
}

class AuthenticationError extends BaseAppError {
  constructor(
    message: string,
    public readonly reason: "TOKEN_EXPIRED" | "INVALID_CREDENTIALS" | "UNAUTHORIZED"
  ) {
    super(message, `AUTH_${reason}`, 401);
    this.name = "AuthenticationError";
  }
}

// Level 3: Specific errors
class PaymentFailedError extends BaseAppError {
  constructor(
    public readonly errorCode: "CARD_DECLINED" | "INSUFFICIENT_FUNDS" | "GATEWAY_TIMEOUT",
    public readonly transactionId: string
  ) {
    super(
      `Payment failed: ${errorCode} (transaction: ${transactionId})`,
      `PAYMENT_${errorCode}`,
      402
    );
    this.name = "PaymentFailedError";
  }
}

class OrderProcessingError extends BaseAppError {
  constructor(
    message: string,
    public readonly orderId: string,
    public override readonly cause?: BaseAppError
  ) {
    super(message, "ORDER_PROCESSING_ERROR", 500);
    this.name = "OrderProcessingError";
  }
}

// Demonstrate hierarchy catching
function processPayment(cardNumber: string, amount: number, transactionId: string): void {
  if (cardNumber === "0000") {
    throw new PaymentFailedError("CARD_DECLINED", transactionId);
  }
  if (amount > 10000) {
    throw new PaymentFailedError("INSUFFICIENT_FUNDS", transactionId);
  }
  console.log(`Payment of $${amount} succeeded for transaction ${transactionId}`);
}

function validateOrderInput(data: { userId?: string; productId?: string }): void {
  const errors: Record<string, string> = {};
  if (!data.userId) errors.userId = "User ID is required";
  if (!data.productId) errors.productId = "Product ID is required";
  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Order input validation failed", errors);
  }
}

// Catch at hierarchy level — catches all BaseAppError subtypes
function safeProcessOrder(data: { userId?: string; productId?: string; cardNumber: string }): void {
  try {
    validateOrderInput(data);
    processPayment(data.cardNumber, 5000, "txn_001");
  } catch (e: unknown) {
    if (e instanceof PaymentFailedError) {
      console.log(`Payment error [${e.errorCode}]: ${e.message}`);
    } else if (e instanceof ValidationError) {
      console.log(`Validation error: ${e.message}`);
      console.log("  Fields:", JSON.stringify(e.fields));
    } else if (e instanceof BaseAppError) {
      // catches any other domain error
      console.log(`App error [${e.code}]: ${e.message}`);
    } else {
      throw e; // re-throw unexpected errors
    }
  }
}

safeProcessOrder({ userId: "", productId: "p1", cardNumber: "1234" });
safeProcessOrder({ userId: "u1", productId: "p1", cardNumber: "0000" });
safeProcessOrder({ userId: "u1", productId: "p1", cardNumber: "4242" });

// =====================================
// CUSTOM ERROR CODES AND MESSAGES
// =====================================

// WHAT IT IS:
//   Error codes are machine-readable identifiers (e.g. "USER_NOT_FOUND", "E4001").
//   Error messages are human-readable descriptions.
//   Using both gives you the ability to handle errors programmatically
//   (switch on code) AND present readable messages to users.

console.log("\n--- Custom Error Codes and Messages ---");

// Enum-based error codes (strongly typed)
enum AuthErrorCode {
  TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  ACCOUNT_LOCKED = "AUTH_ACCOUNT_LOCKED",
  TWO_FACTOR_REQUIRED = "AUTH_TWO_FACTOR_REQUIRED",
}

// Map codes to default messages
const authErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.TOKEN_EXPIRED]: "Your session has expired. Please log in again.",
  [AuthErrorCode.INVALID_CREDENTIALS]: "Email or password is incorrect.",
  [AuthErrorCode.ACCOUNT_LOCKED]: "Account locked after too many failed attempts.",
  [AuthErrorCode.TWO_FACTOR_REQUIRED]: "Two-factor authentication is required.",
};

class TypedAuthError extends BaseAppError {
  constructor(
    public readonly authCode: AuthErrorCode,
    customMessage?: string
  ) {
    super(customMessage ?? authErrorMessages[authCode], authCode, 401);
    this.name = "TypedAuthError";
  }
}

function authenticateUser(email: string, password: string): { id: string; name: string } {
  if (email === "locked@example.com") {
    throw new TypedAuthError(AuthErrorCode.ACCOUNT_LOCKED);
  }
  if (password === "expired") {
    throw new TypedAuthError(AuthErrorCode.TOKEN_EXPIRED);
  }
  if (password !== "correct") {
    throw new TypedAuthError(AuthErrorCode.INVALID_CREDENTIALS);
  }
  return { id: "u1", name: "Alice" };
}

const testCases = [
  { email: "locked@example.com", password: "anything" },
  { email: "alice@example.com", password: "expired" },
  { email: "alice@example.com", password: "wrong" },
  { email: "alice@example.com", password: "correct" },
];

for (const { email, password } of testCases) {
  try {
    const user = authenticateUser(email, password);
    console.log(`Auth success: Welcome, ${user.name}`);
  } catch (e: unknown) {
    if (e instanceof TypedAuthError) {
      console.log(`Auth failed [${e.authCode}]: ${e.message}`);
    }
  }
}

// =====================================
// RESULT PATTERN (Result<T, E>)
// =====================================

// WHAT IT IS:
//   Instead of throwing errors, functions return a Result<T, E> that is either
//   a success containing value T, or a failure containing error E.
//   Inspired by Rust's Result<T, E> and Haskell's Either type.

// WHY IT EXISTS:
//   Throwing exceptions has hidden costs:
//     1. The caller has NO IDEA a function can fail unless they read the docs or source
//     2. Forgetting to wrap in try/catch silently lets errors propagate
//     3. There is no type-level indication of what errors are possible
//   Result<T, E> makes failures EXPLICIT in the type signature.
//   The caller is FORCED to handle both cases — TypeScript will not let them ignore it.

// ADVANTAGES OVER THROWING:
//   - Failure is part of the function signature (self-documenting)
//   - Compiler enforces handling both success and failure
//   - No hidden control flow — you can see exactly where errors come from
//   - Composable — Result values can be chained and transformed
//   - No need for try/catch at every call site

console.log("\n--- Result Pattern ---");

// Result type definition
type Result<T, E extends Error = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Helper constructors
function Ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

function Err<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// Example: login returning Result<User, AuthenticationError>
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

function loginUser(
  email: string,
  password: string
): Result<User, AuthenticationError> {
  const users: Record<string, { password: string; user: User }> = {
    "alice@example.com": {
      password: "secret123",
      user: { id: "u1", name: "Alice", email: "alice@example.com", role: "user" },
    },
  };

  const record = users[email];
  if (!record) {
    return Err(
      new AuthenticationError(`No account found for ${email}`, "INVALID_CREDENTIALS")
    );
  }
  if (record.password !== password) {
    return Err(
      new AuthenticationError("Password is incorrect", "INVALID_CREDENTIALS")
    );
  }
  return Ok(record.user);
}

// Caller MUST handle both cases — no way to "forget"
const loginResult = loginUser("alice@example.com", "secret123");
if (loginResult.success) {
  console.log(`Logged in as ${loginResult.value.name} (${loginResult.value.role})`);
} else {
  console.log(`Login failed: ${loginResult.error.message}`);
}

const badLogin = loginUser("bob@example.com", "anything");
if (badLogin.success) {
  console.log("Logged in:", badLogin.value.name);
} else {
  console.log(`Login failed [${badLogin.error.reason}]: ${badLogin.error.message}`);
}

// =====================================
// RESULT PATTERN — CHECKOUT EXAMPLE
// =====================================

console.log("\n--- Result<Order, PaymentError> for checkout ---");

interface Order {
  id: string;
  userId: string;
  items: { productId: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "failed";
}

// Chain multiple Result operations
function validateStock(
  items: { productId: string; qty: number }[]
): Result<void, InsufficientStockError> {
  const stock: Record<string, number> = { p1: 10, p2: 3 };
  for (const item of items) {
    const available = stock[item.productId] ?? 0;
    if (item.qty > available) {
      return Err(new InsufficientStockError(item.productId, item.qty, available));
    }
  }
  return Ok(undefined);
}

function chargeCard(
  cardNumber: string,
  amount: number,
  transactionId: string
): Result<string, PaymentFailedError> {
  if (cardNumber === "0000") {
    return Err(new PaymentFailedError("CARD_DECLINED", transactionId));
  }
  return Ok(`charge_${transactionId}`);
}

function processOrder(
  userId: string,
  items: { productId: string; qty: number; price: number }[],
  cardNumber: string
): Result<Order, OrderProcessingError | InsufficientStockError | PaymentFailedError> {
  // Step 1: validate stock
  const stockResult = validateStock(items);
  if (!stockResult.success) {
    return Err(stockResult.error);
  }

  // Step 2: charge payment
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const txnId = `txn_${Date.now()}`;
  const paymentResult = chargeCard(cardNumber, total, txnId);
  if (!paymentResult.success) {
    return Err(paymentResult.error);
  }

  // Step 3: create order
  const order: Order = {
    id: `ord_${Date.now()}`,
    userId,
    items,
    total,
    status: "confirmed",
  };
  return Ok(order);
}

// Good checkout
const goodCheckout = processOrder(
  "u1",
  [{ productId: "p1", qty: 2, price: 29.99 }],
  "4242424242"
);
if (goodCheckout.success) {
  console.log(`Order confirmed: ${goodCheckout.value.id} — $${goodCheckout.value.total.toFixed(2)}`);
} else {
  console.log(`Order failed: ${goodCheckout.error.message}`);
}

// Stock failure
const stockFail = processOrder(
  "u1",
  [{ productId: "p2", qty: 10, price: 9.99 }],
  "4242424242"
);
if (!stockFail.success) {
  if (stockFail.error instanceof InsufficientStockError) {
    console.log(`Stock issue: ${stockFail.error.message}`);
  }
}

// Payment failure
const payFail = processOrder(
  "u1",
  [{ productId: "p1", qty: 1, price: 29.99 }],
  "0000"
);
if (!payFail.success) {
  if (payFail.error instanceof PaymentFailedError) {
    console.log(`Payment issue [${payFail.error.errorCode}]: ${payFail.error.message}`);
  }
}

// =====================================
// EITHER PATTERN
// =====================================

// WHAT IT IS:
//   Either<L, R> is a value that is either Left (failure/error) or Right (success).
//   Left = "wrong" (the failure side), Right = "right" (the success side).
//   This is the functional programming name for the Result pattern.

// WHY IT EXISTS:
//   Either comes from functional languages (Haskell, Scala, fp-ts).
//   It is more general than Result — Left/Right do not necessarily mean error/success,
//   though that is the most common use. Result is a specialization of Either.

console.log("\n--- Either Pattern ---");

type Left<L> = { _tag: "Left"; left: L };
type Right<R> = { _tag: "Right"; right: R };
type Either<L, R> = Left<L> | Right<R>;

function left<L>(value: L): Left<L> {
  return { _tag: "Left", left: value };
}

function right<R>(value: R): Right<R> {
  return { _tag: "Right", right: value };
}

function isRight<L, R>(e: Either<L, R>): e is Right<R> {
  return e._tag === "Right";
}

function isLeft<L, R>(e: Either<L, R>): e is Left<L> {
  return e._tag === "Left";
}

// Map over the Right side (transform success value)
function mapRight<L, R, R2>(
  e: Either<L, R>,
  fn: (value: R) => R2
): Either<L, R2> {
  return isRight(e) ? right(fn(e.right)) : e;
}

// Real example: parse user age
function parseAge(input: string): Either<string, number> {
  const n = parseInt(input, 10);
  if (isNaN(n)) return left(`"${input}" is not a number`);
  if (n < 0 || n > 150) return left(`Age ${n} is out of valid range (0-150)`);
  return right(n);
}

const ageResults = ["25", "abc", "-5", "200", "42"];
for (const raw of ageResults) {
  const result = parseAge(raw);
  if (isRight(result)) {
    const doubled = mapRight(result, (age) => age * 2);
    console.log(`Age ${result.right} — doubled: ${isRight(doubled) ? doubled.right : "?"}`);
  } else {
    console.log(`Parse error: ${result.left}`);
  }
}

// =====================================
// OPTION / MAYBE PATTERN
// =====================================

// WHAT IT IS:
//   Option<T> (also called Maybe<T>) represents a value that might or might not be present.
//   It is either Some(value) or None.
//   Think of it as a type-safe replacement for null/undefined.

// WHY IT EXISTS:
//   null and undefined are the source of "billion dollar mistakes".
//   TypeScript's strict null checks help, but Option makes nullability
//   explicit and composable. You cannot accidentally use a None as if it were Some.

console.log("\n--- Option / Maybe Pattern ---");

type Some<T> = { _tag: "Some"; value: T };
type None = { _tag: "None" };
type Option<T> = Some<T> | None;

const none: None = { _tag: "None" };
function some<T>(value: T): Some<T> {
  return { _tag: "Some", value };
}
function isSome<T>(opt: Option<T>): opt is Some<T> {
  return opt._tag === "Some";
}

// Chain Option values (flatMap)
function flatMapOption<T, U>(opt: Option<T>, fn: (v: T) => Option<U>): Option<U> {
  return isSome(opt) ? fn(opt.value) : none;
}

// getOrElse — unwrap with a default
function getOrElse<T>(opt: Option<T>, fallback: T): T {
  return isSome(opt) ? opt.value : fallback;
}

// Example: safely get a nested user property
interface UserProfile {
  id: string;
  address?: {
    city?: string;
    zip?: string;
  };
}

function findUserById(id: string): Option<UserProfile> {
  const db: Record<string, UserProfile> = {
    u1: { id: "u1", address: { city: "Berlin", zip: "10115" } },
    u2: { id: "u2" }, // no address
  };
  return db[id] ? some(db[id]) : none;
}

function getUserCity(userId: string): Option<string> {
  return flatMapOption(
    findUserById(userId),
    (user) => (user.address?.city ? some(user.address.city) : none)
  );
}

const ids = ["u1", "u2", "u99"];
for (const id of ids) {
  const city = getUserCity(id);
  console.log(`User ${id} city: ${getOrElse(city, "Unknown")}`);
}

// =====================================
// TYPED ERROR HANDLING WITH DISCRIMINATED UNIONS
// =====================================

// WHAT IT IS:
//   Discriminated unions use a shared literal property (the "discriminant")
//   to model a set of related but different shapes.
//   When applied to errors, they create exhaustive, type-safe error handling.

// WHY IT EXISTS:
//   Class hierarchies require instanceof checks which can get complex.
//   Discriminated union errors are plain objects — serializable, easy to pass across
//   boundaries (e.g. API responses, web workers, IPC channels),
//   and TypeScript can check that ALL cases are handled (exhaustiveness checking).

console.log("\n--- Discriminated Union Errors ---");

// Define all possible API errors as a discriminated union
type ApiError =
  | { kind: "NotFound"; resourceType: string; resourceId: string }
  | { kind: "Unauthorized"; reason: "TOKEN_EXPIRED" | "NO_TOKEN" | "FORBIDDEN" }
  | { kind: "Validation"; fields: Record<string, string[]> }
  | { kind: "RateLimit"; retryAfterSeconds: number }
  | { kind: "ServerError"; message: string; traceId: string };

// Exhaustive handler — TypeScript warns if a case is missing
function handleApiError(error: ApiError): string {
  switch (error.kind) {
    case "NotFound":
      return `${error.resourceType} '${error.resourceId}' not found`;
    case "Unauthorized":
      return `Unauthorized: ${error.reason}`;
    case "Validation":
      return `Validation failed: ${JSON.stringify(error.fields)}`;
    case "RateLimit":
      return `Rate limited. Retry after ${error.retryAfterSeconds}s`;
    case "ServerError":
      return `Server error [${error.traceId}]: ${error.message}`;
    default:
      // This line is unreachable if all cases are handled.
      // The 'never' type makes TypeScript error if a case was forgotten.
      const _exhaustiveCheck: never = error;
      return _exhaustiveCheck;
  }
}

const apiErrors: ApiError[] = [
  { kind: "NotFound", resourceType: "User", resourceId: "u99" },
  { kind: "Unauthorized", reason: "TOKEN_EXPIRED" },
  { kind: "Validation", fields: { email: ["Invalid format"], age: ["Must be >= 18"] } },
  { kind: "RateLimit", retryAfterSeconds: 60 },
  { kind: "ServerError", message: "Unexpected error", traceId: "tr_abc123" },
];

for (const err of apiErrors) {
  console.log(handleApiError(err));
}

// =====================================
// ERROR BOUNDARY CONCEPT
// =====================================

// WHAT IT IS:
//   An error boundary is a layer in your application that catches ALL errors
//   from a section of code and handles them in a centralized way.
//   In React it is a specific lifecycle method; in general code it is a
//   wrapper function or class that isolates error propagation.

// WHY IT EXISTS:
//   Without boundaries, a single unhandled error crashes the whole app.
//   Boundaries allow partial failures — one module fails, the rest keeps running.
//   They are the production-safe equivalent of a global try/catch.

console.log("\n--- Error Boundary Concept ---");

// Generic error boundary wrapper
function withErrorBoundary<T>(
  context: string,
  fn: () => T,
  onError?: (e: unknown) => T
): T | undefined {
  try {
    return fn();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[ErrorBoundary:${context}] Caught: ${message}`);
    if (onError) {
      return onError(e);
    }
    return undefined;
  }
}

// Async version
async function withAsyncErrorBoundary<T>(
  context: string,
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[AsyncBoundary:${context}] Caught: ${message}`);
    return fallback;
  }
}

const result1 = withErrorBoundary(
  "UserService",
  () => {
    throw new UserNotFoundError("u99");
    return "user"; // unreachable
  },
  (e) => {
    if (e instanceof UserNotFoundError) return `FALLBACK: default guest profile`;
    return "FALLBACK: unknown error";
  }
);
console.log("Boundary result:", result1);

const result2 = withErrorBoundary("SafeParser", () => JSON.parse('{"ok":true}'));
console.log("Safe parse result:", JSON.stringify(result2));

// =====================================
// GLOBAL ERROR HANDLER PATTERNS
// =====================================

// WHAT IT IS:
//   A global handler is a single, top-level catch point for all unhandled errors.
//   In Node.js this is process.on('uncaughtException') and process.on('unhandledRejection').
//   In browsers it is window.onerror and window.onunhandledrejection.

// WHY IT EXISTS:
//   No matter how careful you are, some errors slip through.
//   A global handler gives you a safety net: log the error, alert on-call,
//   and prevent a silent crash with no trace.

console.log("\n--- Global Error Handler Pattern ---");

// Structured error report for logging/alerting
interface ErrorReport {
  timestamp: string;
  level: "fatal" | "error" | "warn";
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private logs: ErrorReport[] = [];

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  handle(e: unknown, context?: Record<string, unknown>): void {
    const report = this.buildReport(e, context);
    this.logs.push(report);
    this.output(report);
  }

  private buildReport(e: unknown, context?: Record<string, unknown>): ErrorReport {
    if (e instanceof BaseAppError) {
      return {
        timestamp: new Date().toISOString(),
        level: e.statusCode >= 500 ? "fatal" : "error",
        code: e.code,
        message: e.message,
        stack: e.stack,
        context,
      };
    }
    if (e instanceof Error) {
      return {
        timestamp: new Date().toISOString(),
        level: "error",
        code: "UNHANDLED_ERROR",
        message: e.message,
        stack: e.stack,
        context,
      };
    }
    return {
      timestamp: new Date().toISOString(),
      level: "error",
      code: "UNKNOWN_ERROR",
      message: String(e),
      context,
    };
  }

  private output(report: ErrorReport): void {
    console.error(
      `[${report.level.toUpperCase()}] ${report.timestamp} [${report.code}] ${report.message}`
    );
    if (report.context) {
      console.error("  Context:", JSON.stringify(report.context));
    }
  }

  getLogs(): ErrorReport[] {
    return [...this.logs];
  }
}

// Simulate global handler usage
const globalHandler = GlobalErrorHandler.getInstance();

// Simulating uncaughtException handler (Node.js)
// In real code: process.on('uncaughtException', (e) => globalHandler.handle(e))
// In real code: process.on('unhandledRejection', (e) => globalHandler.handle(e))

globalHandler.handle(new UserNotFoundError("u999"), { endpoint: "GET /api/users/u999" });
globalHandler.handle(new PaymentFailedError("GATEWAY_TIMEOUT", "txn_xyz"), { cartId: "cart_42" });
globalHandler.handle("A raw string was thrown");

console.log(`Global handler recorded ${globalHandler.getLogs().length} errors`);

// =====================================
// LOGGING ERRORS WITH PROPER TYPES
// =====================================

// WHAT IT IS:
//   Structured logging means capturing errors as JSON objects with consistent fields
//   rather than plain text strings. Tools like Datadog, Sentry, and CloudWatch
//   can search, filter, and alert on structured fields.

// WHY IT EXISTS:
//   console.log("Error:", e.message) is hard to search in production.
//   Structured logs with errorCode, userId, traceId, statusCode, etc.
//   make incident response much faster.

console.log("\n--- Logging Errors with Proper Types ---");

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface StructuredLog {
  level: LogLevel;
  timestamp: string;
  message: string;
  error?: {
    name: string;
    code: string;
    message: string;
    stack?: string;
  };
  meta?: Record<string, unknown>;
}

function structuredLog(
  level: LogLevel,
  message: string,
  error?: unknown,
  meta?: Record<string, unknown>
): void {
  const entry: StructuredLog = {
    level,
    timestamp: new Date().toISOString(),
    message,
    meta,
  };

  if (error instanceof BaseAppError) {
    entry.error = {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack,
    };
  } else if (error instanceof Error) {
    entry.error = {
      name: error.name,
      code: "UNCLASSIFIED",
      message: error.message,
      stack: error.stack,
    };
  }

  // In production this would go to a logging service
  console.log(JSON.stringify(entry, null, 2));
}

// Usage in an API handler
function handleGetUser(userId: string): void {
  try {
    const user = findUser(userId);
    structuredLog("info", "User fetched successfully", undefined, {
      userId: user.id,
      userName: user.name,
    });
  } catch (e: unknown) {
    if (e instanceof UserNotFoundError) {
      structuredLog("warn", "User lookup failed", e, { requestedId: userId });
    } else {
      structuredLog("error", "Unexpected error during user fetch", e, { userId });
      throw e; // re-throw unexpected errors
    }
  }
}

handleGetUser("u1");
handleGetUser("u999");

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// JavaScript (no type safety):
// -----------------------------------------
// try {
//   doSomething();
// } catch (e) {
//   console.log(e.message);  // OK in JS, but if e is a string this is undefined
//   console.log(e.statusCode); // undefined, no error — silently broken
// }
//
// function getUser(id) {
//   if (!found) throw { code: 404, msg: "Not found" };
//   // caller has no idea this might throw or what shape the error has
// }

// TypeScript (type safe):
// -----------------------------------------
// try {
//   doSomething();
// } catch (e: unknown) {
//   // MUST narrow before using — TypeScript enforces this
//   if (e instanceof Error) {
//     console.log(e.message);  // safe
//   }
// }
//
// function getUser(id: string): Result<User, UserNotFoundError> {
//   // caller KNOWS this can fail and exactly what type of error they get
// }

// Key differences:
// 1. JS catch (e) → type 'any' — silent bugs
//    TS catch (e) → type 'unknown' — forced narrowing
// 2. JS error types are invisible to callers
//    TS Result<T, E> makes failure part of the function contract
// 3. JS instanceof checks work but offer no compile-time guarantee
//    TS custom error classes + instanceof = compile-time and runtime safety
// 4. JS has no exhaustiveness checking
//    TS discriminated unions + switch + never = compile error if a case is missed

console.log("\n--- JS vs TS comparison logged above as comments ---");

// =====================================
// COMMON MISTAKES
// =====================================

console.log("\n--- Common Mistakes ---");

// MISTAKE 1: Catching and swallowing errors (hiding failures)
// BAD:
function badDivide(a: number, b: number): number {
  try {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  } catch {
    return 0; // silently returns 0 — caller has no idea something went wrong!
  }
}
console.log("Swallowed error result:", badDivide(10, 0)); // 0 — is this right or a hidden bug?

// GOOD: Either re-throw or use Result pattern
function goodDivide(a: number, b: number): Result<number, Error> {
  if (b === 0) return Err(new Error("Division by zero"));
  return Ok(a / b);
}
const divResult = goodDivide(10, 0);
if (!divResult.success) {
  console.log("Explicit failure:", divResult.error.message);
}

// MISTAKE 2: Using 'any' in catch — defeats the purpose
// BAD:
// catch (e: any) {   // 'any' removes all type safety
//   console.log(e.message);  // TypeScript will not warn if e is a string
// }
// GOOD: use 'unknown' and narrow explicitly

// MISTAKE 3: Not setting 'this.name' in custom errors
// BAD:
class BadCustomError extends Error {
  constructor(message: string) {
    super(message);
    // forgot: this.name = "BadCustomError"
  }
}
const bad = new BadCustomError("oops");
console.log("Bad custom error name:", bad.name); // prints "Error" not "BadCustomError"

// GOOD:
class GoodCustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoodCustomError";
    Object.setPrototypeOf(this, GoodCustomError.prototype);
  }
}
const good = new GoodCustomError("oops");
console.log("Good custom error name:", good.name); // prints "GoodCustomError"

// MISTAKE 4: Throwing non-Error values
// BAD: throw "error message"  — loses stack trace, inconsistent type
// BAD: throw { message: "foo" }  — not an Error, instanceof Error is false
// GOOD: always throw instances of Error or subclasses

// MISTAKE 5: Overly broad catch clauses
// BAD: catching Error when you only know how to handle NetworkError
// GOOD: catch specific types, re-throw the rest

// MISTAKE 6: Ignoring error.cause
// BAD: throw new Error("DB failed") — discards the original error
// GOOD: throw new DatabaseError("DB failed", query, originalError) — preserves chain

// =====================================
// BEST PRACTICES
// =====================================

// 1. ALWAYS use 'unknown' in catch (never 'any')
//    Reason: forces you to narrow before use, prevents silent property access bugs

// 2. Create custom error classes for domain errors
//    Reason: structured data on errors, instanceof discrimination, self-documenting code

// 3. Use the Result<T, E> pattern for expected failures
//    Reason: makes failures visible in type signatures, eliminates forgotten try/catch

// 4. Set this.name in custom error constructors
//    Reason: error.name shows the correct class name in logs and stack traces

// 5. Call Object.setPrototypeOf in custom error constructors (when targeting ES5)
//    Reason: fixes instanceof checks broken by ES5 compilation

// 6. Never swallow errors silently
//    Reason: hidden failures are the hardest bugs to diagnose in production

// 7. Re-throw errors you cannot handle
//    Reason: let errors propagate to the correct handler rather than masking them

// 8. Wrap errors with context when re-throwing
//    Reason: preserves the root cause while adding higher-level context

// 9. Use discriminated union errors for serializable/cross-boundary errors
//    Reason: plain objects work across IPC, WebWorkers, API responses

// 10. Use structured logging with typed error fields
//     Reason: searchable, alertable, and much more useful in production incidents

console.log("\n--- Best practices logged above as comments ---");

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: Why is 'e' typed as 'unknown' instead of 'any' in TypeScript catch blocks?
// A: TypeScript 4.0+ (with strict mode) types catch variables as 'unknown' because
//    JavaScript allows throwing ANY value — not just Error objects.
//    'unknown' forces developers to narrow the type before using it (e.g. instanceof Error),
//    preventing bugs where code assumes e.message exists but e was actually a plain string.
//    'any' would disable type checking entirely, defeating the purpose of TypeScript.

// Q2: What is the Result<T, E> pattern and when should you use it?
// A: Result<T, E> is a type that represents either a success (Ok with value T)
//    or a failure (Err with error E). Use it when a failure is a NORMAL, EXPECTED outcome
//    that the caller must explicitly handle (e.g. validation, user lookup, API calls).
//    Benefits: failure is in the type signature (self-documenting), compiler enforces handling,
//    no hidden control flow. Use exceptions for truly UNEXPECTED errors (programming bugs,
//    system failures, out-of-memory).

// Q3: How do you handle exhaustiveness checking with discriminated union errors?
// A: Use a switch statement on the discriminant property and add a 'default' case
//    that assigns the value to a 'never' variable:
//      default:
//        const _: never = error; // TypeScript errors if a case is unhandled
//        return _;
//    When you add a new variant to the union, TypeScript will give a compile error
//    at the switch statement, reminding you to handle the new case.

// Q4: When should you use class-based errors vs discriminated union errors?
// A: Class-based errors are better when:
//    - You need instanceof checks for handling at multiple levels in a call stack
//    - Errors carry behaviour (methods) not just data
//    - You are working within a single process/runtime
//    Discriminated union errors are better when:
//    - Errors need to cross boundaries (serialize to JSON — e.g. API responses, WebWorkers)
//    - You want exhaustiveness checking at the type level
//    - Errors are pure data with no behaviour
//    In practice, combining both (custom error classes that also expose a toJSON() method)
//    is common in production code.

console.log("\n--- Interview questions logged above as comments ---");

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1: Safe File Parser with Result Pattern
// -------------------------------------------------
// Build a parseConfig(filePath: string) function that:
//   - Returns Result<Config, ConfigError> where ConfigError is a custom error
//   - ConfigError has subtypes: FileNotFoundError, ParseError, ValidationError
//   - Config has fields: port (number, 1-65535), host (string), debug (boolean)
//   - Use discriminated union narrowing to handle each error type
//   - Chain multiple validation steps, stopping at the first failure
// Hint: start with type Config = { port: number; host: string; debug: boolean }
//       and type ConfigError = FileNotFoundError | ParseError | ValidationError

// TASK 2: Retry with Typed Errors
// -------------------------------------------------
// Build a retryAsync<T, E extends Error>(
//   fn: () => Promise<Result<T, E>>,
//   maxRetries: number,
//   isRetryable: (error: E) => boolean
// ): Promise<Result<T, E>> function that:
//   - Retries the function up to maxRetries times
//   - Only retries if isRetryable(error) returns true
//   - Returns the last Result if all retries are exhausted
//   - Use it with NetworkError (retryable) and AuthenticationError (not retryable)
//   - Add exponential backoff: wait 2^attempt * 100ms between retries

// TASK 3: Order Processing Pipeline with Full Error Handling
// -------------------------------------------------
// Build an order processing pipeline that:
//   - Takes OrderRequest { userId, items, paymentMethod }
//   - Step 1: validateUser  → Result<User, UserNotFoundError>
//   - Step 2: validateStock → Result<StockReservation, InsufficientStockError>
//   - Step 3: processPayment → Result<PaymentConfirmation, PaymentFailedError>
//   - Step 4: createOrder    → Result<Order, OrderProcessingError>
//   - Each step uses the output of the previous
//   - If any step fails, the pipeline short-circuits and returns that error
//   - Wrap the entire pipeline in a withErrorBoundary for catastrophic failures
//   - Log each successful step and each failure with structuredLog
//   - Use discriminated unions so the caller can switch on the error type

console.log("\n--- Practice tasks logged above as comments ---");
console.log("\n=== 18-error-handling.ts complete ===");
