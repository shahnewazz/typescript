// =====================================
// 16 - ASYNC/AWAIT AND PROMISES IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers who know basic TypeScript.
// This file is self-contained and fully runnable.
// All async operations are simulated with setTimeout / Promise.resolve — no HTTP calls.

// =====================================
// SHARED DATA TYPES (used throughout)
// =====================================

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Cart {
  userId: number;
  productIds: number[];
  total: number;
}

interface Order {
  orderId: string;
  userId: number;
  productIds: number[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}

interface PaymentResult {
  transactionId: string;
  amount: number;
  status: "success" | "failed" | "pending";
  timestamp: Date;
}

interface AuthToken {
  token: string;
  expiresAt: Date;
  userId: number;
}

interface InventoryItem {
  productId: number;
  quantity: number;
  warehouse: string;
}

interface Credentials {
  username: string;
  password: string;
}

// =====================================
// PROMISE<T> — TYPE ANNOTATION
// =====================================

// WHAT IS IT?
//   Promise<T> is a generic type that represents a value that will be available
//   in the future. The type parameter T tells TypeScript what the resolved value
//   will be.
//
// WHY DOES IT EXIST?
//   JavaScript Promises already exist for async work. TypeScript wraps them with
//   a type parameter so the compiler knows what type comes out of .then() or
//   await — without this you would get "unknown" or "any" everywhere.
//
// SYNTAX:
//   const p: Promise<string>  — a promise that resolves to a string
//   const p: Promise<User>    — a promise that resolves to a User object
//   const p: Promise<void>    — a promise that resolves with no value

// Simple example — annotating a variable as Promise<number>
const delayedNumber: Promise<number> = new Promise((resolve) => {
  setTimeout(() => resolve(42), 100);
});

delayedNumber.then((value: number) => {
  console.log("Promise<number> resolved to:", value); // 42
});

// =====================================
// CREATING A TYPED PROMISE
// =====================================

// WHAT IS IT?
//   You can type the resolve/reject callbacks by passing a type argument to
//   the Promise constructor: new Promise<T>((resolve, reject) => { ... })
//
// WHY DOES IT EXIST?
//   Without the type argument TypeScript infers the generic as "unknown",
//   which forces you to narrow the type every time you use the value.
//   Providing T upfront gives full type safety inside the executor and downstream.
//
// SYNTAX:
//   new Promise<T>((resolve: (value: T) => void, reject: (reason?: unknown) => void) => { ... })

// Simple example
function getGreeting(name: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!name.trim()) {
      reject(new Error("Name cannot be empty"));
      return;
    }
    setTimeout(() => resolve(`Hello, ${name}!`), 50);
  });
}

getGreeting("Alice").then((msg: string) => console.log("Typed Promise:", msg));
// Hello, Alice!

// Practical example — typed Promise wrapping setTimeout
function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

delay(100).then(() => console.log("Typed Promise<void>: delay finished"));

// =====================================
// PROMISE.RESOLVE() AND PROMISE.REJECT()
// =====================================

// WHAT IS IT?
//   Promise.resolve(value) creates an already-resolved promise.
//   Promise.reject(reason) creates an already-rejected promise.
//   Both are generic: Promise.resolve<T>(value: T): Promise<T>
//
// WHY DO THEY EXIST?
//   They are shortcuts — useful in tests, for converting synchronous values into
//   promises, or for returning early from async chains without writing
//   new Promise(...) boilerplate.
//
// SYNTAX:
//   Promise.resolve<string>("hello")
//   Promise.reject<User>(new Error("not found"))

// Simple examples
const resolvedString: Promise<string> = Promise.resolve<string>("immediate");
resolvedString.then((v) => console.log("Promise.resolve:", v)); // immediate

const rejectedPromise: Promise<number> = Promise.reject<number>(
  new Error("Something went wrong")
);
rejectedPromise.catch((err: Error) =>
  console.log("Promise.reject caught:", err.message)
);
// Something went wrong

// Practical example — conditional early return
function getFromCache(key: string): Promise<string | null> {
  const cache: Record<string, string> = { user_1: "Alice" };
  if (cache[key]) {
    return Promise.resolve(cache[key]); // synchronous hit, still a Promise
  }
  return Promise.resolve(null); // cache miss
}

getFromCache("user_1").then((v) => console.log("Cache hit:", v)); // Alice
getFromCache("user_99").then((v) => console.log("Cache miss:", v)); // null

// =====================================
// CHAINING .THEN() WITH TYPES
// =====================================

// WHAT IS IT?
//   .then(callback) returns a new Promise whose type is inferred from the
//   callback's return type. Each link in the chain can transform the value.
//
// WHY DOES IT EXIST?
//   Chaining lets you compose async steps without nesting. TypeScript tracks
//   the type at every step so mistakes (e.g., treating a number like a string)
//   are caught at compile time.
//
// SYNTAX:
//   promise
//     .then((value: A): B => transform(value))   // Promise<B>
//     .then((value: B): C => transform(value))   // Promise<C>
//     .catch((err: unknown) => fallback)

// Simple example — chain that transforms types
Promise.resolve(5)
  .then((n: number): string => `The number is ${n}`)   // Promise<string>
  .then((s: string): string[] => s.split(" "))          // Promise<string[]>
  .then((words: string[]) => {
    console.log("Chained .then():", words);
    // ["The", "number", "is", "5"]
  });

// Practical example — parse a raw API-like response
interface RawUserPayload {
  id: string;
  full_name: string;
  email_address: string;
}

function getRawPayload(): Promise<RawUserPayload> {
  return Promise.resolve({
    id: "42",
    full_name: "Bob Smith",
    email_address: "bob@example.com",
  });
}

getRawPayload()
  .then((raw: RawUserPayload): User => ({
    id: parseInt(raw.id, 10),
    name: raw.full_name,
    email: raw.email_address,
  }))
  .then((user: User) => {
    console.log("Chained .then() — transformed User:", user);
    // { id: 42, name: "Bob Smith", email: "bob@example.com" }
  });

// =====================================
// PROMISE.ALL()
// =====================================

// WHAT IS IT?
//   Promise.all(promises) runs all promises CONCURRENTLY and resolves when ALL
//   of them resolve. If ANY rejects, the whole thing rejects immediately.
//   TypeScript infers the tuple type of the results.
//
// WHY DOES IT EXIST?
//   Sequential awaits force operations to run one after another even when they
//   are independent. Promise.all runs them in parallel, saving time.
//
// SYNTAX:
//   const [a, b]: [A, B] = await Promise.all([promiseA, promiseB]);

// Simple example
async function runAll(): Promise<void> {
  const [name, age]: [string, number] = await Promise.all([
    Promise.resolve("Alice"),
    Promise.resolve(30),
  ]);
  console.log("Promise.all simple:", name, age); // Alice 30
}
runAll();

// =====================================
// PROMISE.ALLSETTLED()
// =====================================

// WHAT IS IT?
//   Promise.allSettled(promises) waits for ALL promises to finish regardless of
//   success or failure and returns an array of result objects each with a
//   "status" of "fulfilled" or "rejected".
//
// WHY DOES IT EXIST?
//   Promise.all bails on the first rejection. allSettled lets you inspect every
//   outcome — useful when you want partial results or you need to report
//   failures without losing successes.
//
// SYNTAX:
//   const results: PromiseSettledResult<T>[] = await Promise.allSettled(promises);
//   results[i].status === "fulfilled" => results[i].value: T
//   results[i].status === "rejected"  => results[i].reason: unknown

async function runAllSettled(): Promise<void> {
  const results = await Promise.allSettled([
    Promise.resolve("ok"),
    Promise.reject(new Error("fail")),
    Promise.resolve(42),
  ]);

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      console.log(`Promise.allSettled[${i}] fulfilled:`, result.value);
    } else {
      console.log(`Promise.allSettled[${i}] rejected:`, (result.reason as Error).message);
    }
  });
  // [0] fulfilled: ok
  // [1] rejected:  fail
  // [2] fulfilled: 42
}
runAllSettled();

// =====================================
// PROMISE.RACE()
// =====================================

// WHAT IS IT?
//   Promise.race(promises) resolves or rejects as soon as THE FIRST promise
//   settles — the result type is the union of all input types.
//
// WHY DOES IT EXIST?
//   Useful for timeouts: race a real operation against a "too slow" timer
//   promise. Also useful when you want whichever result arrives first.
//
// SYNTAX:
//   const winner: A | B = await Promise.race([promiseA, promiseB]);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

async function runRace(): Promise<void> {
  const fast = new Promise<string>((resolve) =>
    setTimeout(() => resolve("fast result"), 50)
  );
  const slow = new Promise<string>((resolve) =>
    setTimeout(() => resolve("slow result"), 300)
  );

  const winner = await Promise.race([fast, slow]);
  console.log("Promise.race winner:", winner); // fast result
}
runRace();

// =====================================
// PROMISE.ANY()
// =====================================

// WHAT IS IT?
//   Promise.any(promises) resolves with the FIRST promise that fulfills.
//   It only rejects if ALL promises reject (throws AggregateError).
//
// WHY DOES IT EXIST?
//   Unlike race(), it ignores rejections. Good for "try multiple sources,
//   use whichever works first" patterns (e.g., redundant endpoints).
//
// SYNTAX:
//   const result: T = await Promise.any([p1, p2, p3]);

async function runAny(): Promise<void> {
  const p1 = Promise.reject<string>(new Error("source 1 failed"));
  const p2 = new Promise<string>((resolve) =>
    setTimeout(() => resolve("source 2 succeeded"), 60)
  );
  const p3 = new Promise<string>((resolve) =>
    setTimeout(() => resolve("source 3 succeeded"), 200)
  );

  const result = await Promise.any([p1, p2, p3]);
  console.log("Promise.any first success:", result); // source 2 succeeded
}
runAny();

// =====================================
// ASYNC FUNCTION RETURN TYPE (always Promise<T>)
// =====================================

// WHAT IS IT?
//   Marking a function with "async" automatically wraps its return value in
//   Promise<T>. You annotate the return type as Promise<T> — TypeScript enforces
//   that the value you return is of type T.
//
// WHY DOES IT EXIST?
//   Without the annotation the return type is inferred, which can be overly
//   broad. Explicit return types serve as documentation and catch bugs where
//   you accidentally return the wrong shape.
//
// SYNTAX:
//   async function name(): Promise<T> { return value; }
//   const name = async (): Promise<T> => value;
//
// KEY RULE: An async function ALWAYS returns a Promise, even if you write
//   "return 42" — TypeScript wraps it as Promise<number>.

// Simple example — return type enforced
async function double(n: number): Promise<number> {
  return n * 2; // TypeScript knows the resolved type is number
}

double(7).then((v: number) => console.log("async return type:", v)); // 14

// =====================================
// AWAIT KEYWORD AND TYPE UNWRAPPING
// =====================================

// WHAT IS IT?
//   The "await" keyword pauses an async function until a Promise resolves and
//   then UNWRAPS it — giving you the inner type T from Promise<T>.
//
// WHY DOES IT EXIST?
//   Without await you would have to use .then() chains. await makes async code
//   read like synchronous code while TypeScript still tracks types correctly.
//
// SYNTAX:
//   const value: T = await somePromise; // T is unwrapped from Promise<T>
//
// TYPE UNWRAPPING:
//   Promise<string>     — await gives string
//   Promise<User>       — await gives User
//   Promise<User[]>     — await gives User[]
//   Promise<void>       — await gives void (nothing usable)

async function demonstrateUnwrapping(): Promise<void> {
  const str: string = await Promise.resolve("hello");     // unwrapped string
  const num: number = await Promise.resolve(100);          // unwrapped number
  const user: User = await Promise.resolve<User>({
    id: 1,
    name: "Alice",
    email: "alice@example.com",
  });

  console.log("await unwrapping — string:", str);
  console.log("await unwrapping — number:", num);
  console.log("await unwrapping — User:", user.name);
}
demonstrateUnwrapping();

// =====================================
// TRY/CATCH WITH ASYNC/AWAIT
// =====================================

// WHAT IS IT?
//   When a Promise rejects inside an async function, the rejection becomes a
//   thrown exception that can be caught with a standard try/catch block.
//
// WHY DOES IT EXIST?
//   .catch() chains are awkward for complex flows — you have to add a handler
//   to every chain. try/catch handles ALL rejections in a block in one place,
//   the same as synchronous error handling.
//
// SYNTAX:
//   async function foo(): Promise<void> {
//     try {
//       const value = await riskyOperation();
//     } catch (err: unknown) {
//       // err is unknown — narrow before using
//     } finally {
//       // always runs
//     }
//   }
//
// NOTE: TypeScript types caught errors as "unknown" (since TS 4.0 strict mode).
//   Always narrow before accessing properties.

async function demonstrateTryCatch(): Promise<void> {
  try {
    const value = await Promise.reject<number>(new Error("Boom!"));
    console.log("This line is never reached:", value);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("try/catch — caught:", err.message); // Boom!
    }
  } finally {
    console.log("try/catch — finally always runs");
  }
}
demonstrateTryCatch();

// =====================================
// PARALLEL EXECUTION vs SEQUENTIAL AWAIT
// =====================================

// WHAT IS IT?
//   Sequential: each await waits for the previous to finish before starting.
//   Parallel:   start all promises first, THEN await all results.
//
// WHY DOES IT EXIST?
//   Sequential awaits are simple but slow when operations are independent.
//   Parallel execution via Promise.all() runs them concurrently, cutting
//   total time to the duration of the LONGEST operation (not the sum of all).
//
// SYNTAX:
//   // Sequential (slow — total = A + B)
//   const a = await opA();
//   const b = await opB();
//
//   // Parallel (fast — total = max(A, B))
//   const [a, b] = await Promise.all([opA(), opB()]);

function fakeDelay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function sequentialExample(): Promise<void> {
  const start = Date.now();
  const a = await fakeDelay("A", 100);
  const b = await fakeDelay("B", 100);
  console.log(`Sequential: ${a}, ${b} — took ~${Date.now() - start}ms`);
  // ~200ms total
}

async function parallelExample(): Promise<void> {
  const start = Date.now();
  const [a, b] = await Promise.all([fakeDelay("A", 100), fakeDelay("B", 100)]);
  console.log(`Parallel: ${a}, ${b} — took ~${Date.now() - start}ms`);
  // ~100ms total
}

sequentialExample();
parallelExample();

// =====================================
// CORE ASYNC API FUNCTIONS (simulated)
// =====================================

// These simulate real-world async operations using setTimeout.
// All return typed Promises matching the interfaces defined at the top.

const USERS_DB: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Carol White", email: "carol@example.com" },
];

const PRODUCTS_DB: Product[] = [
  { id: 101, name: "Laptop", price: 999.99, stock: 5 },
  { id: 102, name: "Keyboard", price: 79.99, stock: 20 },
  { id: 103, name: "Monitor", price: 349.99, stock: 8 },
];

const INVENTORY_DB: InventoryItem[] = [
  { productId: 101, quantity: 5, warehouse: "WH-A" },
  { productId: 102, quantity: 20, warehouse: "WH-B" },
  { productId: 103, quantity: 8, warehouse: "WH-A" },
];

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS_DB.find((u) => u.id === id);
      if (user) {
        resolve(user);
      } else {
        reject(new Error(`User with id ${id} not found`));
      }
    }, 80);
  });
}

function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...PRODUCTS_DB]), 60);
  });
}

function placeOrder(cart: Cart): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order: Order = {
        orderId: `ORD-${Date.now()}`,
        userId: cart.userId,
        productIds: cart.productIds,
        total: cart.total,
        status: "confirmed",
        createdAt: new Date(),
      };
      resolve(order);
    }, 120);
  });
}

function processPayment(amount: number): Promise<PaymentResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount <= 0) {
        reject(new Error("Payment amount must be positive"));
        return;
      }
      const result: PaymentResult = {
        transactionId: `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        amount,
        status: "success",
        timestamp: new Date(),
      };
      resolve(result);
    }, 100);
  });
}

function authenticateUser(credentials: Credentials): Promise<AuthToken> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.username === "admin" &&
        credentials.password === "secret"
      ) {
        const token: AuthToken = {
          token: `jwt.${Buffer.from(credentials.username).toString("base64")}.signature`,
          expiresAt: new Date(Date.now() + 3_600_000),
          userId: 1,
        };
        resolve(token);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 90);
  });
}

function fetchInventory(): Promise<InventoryItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...INVENTORY_DB]), 70);
  });
}

// =====================================
// TYPING FETCH RESPONSES
// =====================================

// WHAT IS IT?
//   When you receive data from an external source (API, DB) the compiler cannot
//   verify its shape at runtime. You must tell TypeScript what shape you EXPECT
//   by casting or using a type guard.
//
// WHY DOES IT EXIST?
//   fetch() returns Promise<Response> and .json() returns Promise<unknown>.
//   Without explicit typing every property access would be a compile error.
//
// SYNTAX:
//   const data = (await response.json()) as MyType;
//   // OR create a typed wrapper:
//   async function typedFetch<T>(url: string): Promise<T> { ... }
//
// NOTE: These examples use Promise.resolve to simulate fetch — in real code
//   you would use the global fetch() with the same typing pattern.

// Simulated typed fetch helper
async function simulatedTypedFetch<T>(mockData: T): Promise<T> {
  // In real code: const res = await fetch(url); return res.json() as Promise<T>;
  return new Promise<T>((resolve) =>
    setTimeout(() => resolve(mockData), 50)
  );
}

async function demonstrateTypedFetch(): Promise<void> {
  // Simulate fetching a User
  const user = await simulatedTypedFetch<User>({
    id: 1,
    name: "Alice",
    email: "alice@example.com",
  });
  console.log("Typed fetch — User:", user.name, user.email);

  // Simulate fetching a Product array
  const products = await simulatedTypedFetch<Product[]>([
    { id: 101, name: "Laptop", price: 999, stock: 5 },
  ]);
  console.log("Typed fetch — Products:", products[0].name);
}
demonstrateTypedFetch();

// =====================================
// GENERIC ASYNC FUNCTIONS
// =====================================

// WHAT IS IT?
//   Async functions can be generic — the type parameter flows through the
//   async/await machinery just like in synchronous generics.
//
// WHY DOES IT EXIST?
//   Lets you write reusable async utilities (retry, cache, timeout wrappers)
//   that work with any data type while preserving full type information.
//
// SYNTAX:
//   async function wrapper<T>(fn: () => Promise<T>): Promise<T> { ... }

// Generic retry utility
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      console.log(`  retry: attempt ${attempt} failed`);
    }
  }
  throw lastError;
}

// Generic cache wrapper
async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cache = new Map<string, T>();
  if (cache.has(key)) {
    console.log(`  cache hit for "${key}"`);
    return cache.get(key) as T;
  }
  const value = await fetcher();
  cache.set(key, value);
  return value;
}

async function demonstrateGenerics(): Promise<void> {
  // retry a flaky operation — succeeds on first try here
  const user = await retry(() => fetchUser(1), 3);
  console.log("Generic retry — got user:", user.name);

  // cache a product list
  const products = await withCache("all-products", fetchProducts);
  console.log("Generic cache — product count:", products.length);
}
demonstrateGenerics();

// =====================================
// ASYNC CLASS METHODS
// =====================================

// WHAT IS IT?
//   Class methods can be marked async. Their return type annotation uses
//   Promise<T> and they work identically to async standalone functions.
//
// WHY DOES IT EXIST?
//   Classes encapsulate related behavior. Making methods async lets you keep
//   async logic (DB calls, API calls) alongside the data they operate on.
//
// SYNTAX:
//   class MyClass {
//     async methodName(): Promise<T> { return await something(); }
//   }

class UserService {
  private cache: Map<number, User> = new Map();

  async getUser(id: number): Promise<User> {
    if (this.cache.has(id)) {
      return this.cache.get(id) as User;
    }
    const user = await fetchUser(id);
    this.cache.set(id, user);
    return user;
  }

  async getUsersByIds(ids: number[]): Promise<User[]> {
    const promises = ids.map((id) => this.getUser(id));
    return Promise.all(promises);
  }

  async updateEmail(id: number, newEmail: string): Promise<User> {
    const user = await this.getUser(id);
    // Simulate saving
    await new Promise<void>((resolve) => setTimeout(resolve, 30));
    const updated: User = { ...user, email: newEmail };
    this.cache.set(id, updated);
    return updated;
  }
}

async function demonstrateAsyncClass(): Promise<void> {
  const service = new UserService();

  const user = await service.getUser(1);
  console.log("Async class method — getUser:", user.name);

  const users = await service.getUsersByIds([1, 2]);
  console.log("Async class method — getUsersByIds:", users.map((u) => u.name).join(", "));

  const updated = await service.updateEmail(1, "newalice@example.com");
  console.log("Async class method — updateEmail:", updated.email);
}
demonstrateAsyncClass();

// =====================================
// ASYNC ARROW FUNCTIONS
// =====================================

// WHAT IS IT?
//   Arrow functions can be async. The type annotation pattern is slightly
//   different from function declarations.
//
// WHY DOES IT EXIST?
//   Arrow functions are common in TypeScript for callbacks, event handlers,
//   and functional patterns. You need async arrows for callbacks inside
//   .then(), array .map(), or when assigning to typed variables.
//
// SYNTAX:
//   const fn = async (): Promise<T> => { ... };
//   const fn: () => Promise<T> = async () => { ... };
//   const fn: (arg: A) => Promise<T> = async (arg) => { ... };

// Simple async arrow
const getProductCount = async (): Promise<number> => {
  const products = await fetchProducts();
  return products.length;
};

getProductCount().then((count) =>
  console.log("Async arrow — product count:", count)
);

// Async arrow as a callback in array methods
async function demonstrateAsyncArrows(): Promise<void> {
  const userIds = [1, 2, 3];

  // map + Promise.all with async arrow
  const users: User[] = await Promise.all(
    userIds.map(async (id): Promise<User> => {
      return fetchUser(id);
    })
  );

  console.log("Async arrow in map:", users.map((u) => u.name).join(", "));

  // Async arrow stored in a typed variable
  const priceOf: (productId: number) => Promise<number | undefined> = async (
    productId
  ) => {
    const products = await fetchProducts();
    return products.find((p) => p.id === productId)?.price;
  };

  const price = await priceOf(101);
  console.log("Async arrow typed variable — Laptop price:", price);
}
demonstrateAsyncArrows();

// =====================================
// ERROR HANDLING PATTERNS
// =====================================

// WHAT IS IT?
//   Several patterns exist for handling async errors cleanly in TypeScript:
//   1. try/catch (standard — errors typed as unknown)
//   2. .catch() chaining
//   3. Result/Either type pattern (never throws — returns error as value)
//   4. Custom error classes
//
// WHY DO THEY EXIST?
//   Different contexts suit different patterns. Server endpoints need to
//   translate errors to responses. Library code should never swallow errors.
//   The Result pattern avoids exceptions entirely for expected failures.

// Pattern 1: try/catch with type narrowing
async function pattern1TryCatch(): Promise<void> {
  try {
    const user = await fetchUser(999); // does not exist
    console.log("Pattern 1 — unexpected success:", user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Pattern 1 — try/catch:", err.message);
    }
  }
}
pattern1TryCatch();

// Pattern 2: .catch() chaining
fetchUser(999)
  .then((u) => console.log("Pattern 2 — unexpected:", u))
  .catch((err: Error) => console.log("Pattern 2 — .catch():", err.message));

// Pattern 3: Result type — never throw, return error as value
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function safeAsyncOp<T>(
  operation: () => Promise<T>
): Promise<Result<T>> {
  try {
    const value = await operation();
    return { ok: true, value };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

async function demonstrateResultPattern(): Promise<void> {
  const goodResult = await safeAsyncOp(() => fetchUser(1));
  if (goodResult.ok) {
    console.log("Pattern 3 Result — success:", goodResult.value.name);
  }

  const badResult = await safeAsyncOp(() => fetchUser(999));
  if (!badResult.ok) {
    console.log("Pattern 3 Result — failure:", badResult.error.message);
  }
}
demonstrateResultPattern();

// Pattern 4: Custom error classes
class NotFoundError extends Error {
  constructor(public readonly resource: string, public readonly id: number) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

class PaymentError extends Error {
  constructor(
    public readonly reason: string,
    public readonly amount: number
  ) {
    super(`Payment of $${amount} failed: ${reason}`);
    this.name = "PaymentError";
  }
}

async function demonstrateCustomErrors(): Promise<void> {
  try {
    throw new NotFoundError("User", 999);
  } catch (err: unknown) {
    if (err instanceof NotFoundError) {
      console.log(
        `Pattern 4 Custom Error — ${err.name}: resource=${err.resource} id=${err.id}`
      );
    }
  }
}
demonstrateCustomErrors();

// =====================================
// REAL-WORLD WORKFLOW: E-COMMERCE CHECKOUT
// =====================================

// Combines all concepts: typed functions, try/catch, parallel execution,
// async class methods, generic helpers.

async function checkout(userId: number, productIds: number[]): Promise<void> {
  console.log("\n--- Checkout Flow ---");

  // Step 1: Authenticate
  let authToken: AuthToken;
  try {
    authToken = await authenticateUser({ username: "admin", password: "secret" });
    console.log("Checkout — authenticated, token expires:", authToken.expiresAt.toISOString());
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Checkout — auth failed:", err.message);
    }
    return;
  }

  // Step 2: Parallel — fetch user and products at the same time
  const [user, products] = await Promise.all([
    fetchUser(userId),
    fetchProducts(),
  ]);
  console.log(`Checkout — loaded user "${user.name}" and ${products.length} products in parallel`);

  // Step 3: Also parallel — fetch inventory while building cart
  const [inventory, _] = await Promise.all([
    fetchInventory(),
    Promise.resolve(null), // placeholder for other parallel work
  ]);

  // Step 4: Validate stock
  const selectedProducts = products.filter((p) => productIds.includes(p.id));
  for (const product of selectedProducts) {
    const inv = inventory.find((i) => i.productId === product.id);
    if (!inv || inv.quantity === 0) {
      console.log(`Checkout — out of stock: ${product.name}`);
      return;
    }
    console.log(`Checkout — ${product.name} available (stock: ${inv.quantity})`);
  }

  // Step 5: Build cart and place order
  const cart: Cart = {
    userId: user.id,
    productIds: selectedProducts.map((p) => p.id),
    total: selectedProducts.reduce((sum, p) => sum + p.price, 0),
  };

  const order = await placeOrder(cart);
  console.log(`Checkout — order placed: ${order.orderId}, total: $${order.total.toFixed(2)}`);

  // Step 6: Process payment
  const paymentResult = await processPayment(order.total);
  if (paymentResult.status === "success") {
    console.log(`Checkout — payment success: ${paymentResult.transactionId}`);
  } else {
    console.log("Checkout — payment failed");
  }

  console.log("--- Checkout Complete ---\n");
}

checkout(1, [101, 102]);

// =====================================
// REAL-WORLD WORKFLOW: PARALLEL DATA LOAD
// =====================================

// Fetch user profile + products simultaneously — common dashboard load pattern.

async function loadDashboard(userId: number): Promise<void> {
  console.log("\n--- Dashboard Load (parallel) ---");
  const start = Date.now();

  const [user, products, inventory] = await Promise.all([
    fetchUser(userId),
    fetchProducts(),
    fetchInventory(),
  ]);

  console.log(`Dashboard — loaded in ~${Date.now() - start}ms`);
  console.log(`  User: ${user.name} <${user.email}>`);
  console.log(`  Products: ${products.map((p) => p.name).join(", ")}`);
  console.log(`  Total inventory items: ${inventory.length}`);
  console.log("--- Dashboard Load Complete ---\n");
}

loadDashboard(2);

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// JavaScript — no type annotations, no compile-time safety
//
//   async function fetchUserJS(id) {
//     const response = await fetch(`/api/users/${id}`);
//     return response.json(); // returns any — no type info
//   }
//
//   fetchUserJS(1).then(user => {
//     console.log(user.naem); // typo — no error at compile time, silently undefined
//   });
//
// --------------------------------------------------------
// TypeScript — annotated, type-safe
//
//   async function fetchUserTS(id: number): Promise<User> {
//     const response = await fetch(`/api/users/${id}`);
//     return response.json() as Promise<User>; // explicit cast
//   }
//
//   fetchUserTS(1).then((user: User) => {
//     console.log(user.naem); // compile error: Property 'naem' does not exist on type 'User'
//   });
//
// SAME async behaviour — TypeScript adds:
//   - Return type annotations on async functions
//   - Typed resolve values from await
//   - Compile-time checks on resolved data shapes
//   - Typed .then() / .catch() callbacks

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1: Forgetting await — getting a Promise instead of the value

async function mistakeForgotAwait(): Promise<void> {
  // BAD — missing await, "user" is Promise<User> not User
  // const user = fetchUser(1);
  // console.log(user.name); // compile error: Property 'name' does not exist on type 'Promise<User>'

  // GOOD
  const user: User = await fetchUser(1);
  console.log("Mistake 1 fixed — user name:", user.name);
}
mistakeForgotAwait();

// MISTAKE 2: Not handling rejections — unhandled promise rejection

// BAD — no catch:
//   fetchUser(999); // Promise rejects, nothing handles it — crashes in Node.js

// GOOD — always handle:
fetchUser(999).catch((err: Error) =>
  console.log("Mistake 2 fixed — rejection handled:", err.message)
);

// MISTAKE 3: Wrong return type — returning T instead of Promise<T> annotation

// BAD — claiming to return string synchronously from async function
// async function getNameWrong(): string { // compile error: string is not a valid return type
//   return "Alice";
// }

// GOOD
async function getNameRight(): Promise<string> {
  return "Alice"; // TypeScript wraps this in Promise<string> automatically
}
getNameRight().then((n) => console.log("Mistake 3 fixed — name:", n));

// MISTAKE 4: Sequential awaits when operations are independent

async function mistakeSequential(): Promise<void> {
  const start = Date.now();
  // BAD — waits for user, THEN starts fetching products
  const user = await fetchUser(1);      // ~80ms
  const products = await fetchProducts(); // ~60ms more (total ~140ms)
  console.log(`Mistake 4 — sequential took ~${Date.now() - start}ms`);
  void user; void products;
}

async function fixedParallel(): Promise<void> {
  const start = Date.now();
  // GOOD — both start at the same time
  const [user, products] = await Promise.all([fetchUser(1), fetchProducts()]);
  console.log(`Mistake 4 fixed — parallel took ~${Date.now() - start}ms`);
  void user; void products;
}

mistakeSequential();
fixedParallel();

// MISTAKE 5: Using async inside forEach — async callbacks in forEach are not awaited

async function mistakeAsyncForEach(): Promise<void> {
  const ids = [1, 2, 3];

  // BAD — forEach does NOT await the async callbacks
  // The function returns before any of these complete
  // ids.forEach(async (id) => {
  //   const user = await fetchUser(id); // these run but are not waited on
  //   console.log(user.name);
  // });

  // GOOD — use Promise.all + map
  const users = await Promise.all(ids.map((id) => fetchUser(id)));
  console.log(
    "Mistake 5 fixed — async map:",
    users.map((u) => u.name).join(", ")
  );
}
mistakeAsyncForEach();

// =====================================
// BEST PRACTICES
// =====================================

// 1. ALWAYS annotate async function return types explicitly.
//    async function load(): Promise<User>  — not just "async function load()"
//    This serves as documentation and catches wrong return shapes early.

// 2. Use Promise.all() for independent concurrent operations.
//    Sequential awaits are the #1 async performance mistake in TypeScript.

// 3. Type caught errors as "unknown" and narrow with instanceof.
//    catch (err: unknown) { if (err instanceof Error) { ... } }
//    Never use catch (err: any) — you lose safety.

// 4. Prefer async/await over .then() chains for complex flows.
//    .then() chains are fine for simple transforms but become hard to read
//    when you have branching logic or need to share values across steps.

// 5. Use Promise.allSettled() when you want all results, not fail-fast.
//    Promise.all() throws on the first rejection.
//    Promise.allSettled() gives you every outcome.

// 6. Never float async operations — always await or .catch() every Promise.
//    Floating promises (fire-and-forget without error handling) cause
//    unhandled rejection crashes in Node.js and silent bugs in browsers.

// 7. Use the Result<T, E> pattern for expected failures (validation, not found).
//    Reserve exceptions for truly unexpected errors (network down, DB crash).

// 8. Avoid Promise constructors when you already have a Promise.
//    BAD:  new Promise((resolve) => somePromise.then(resolve))
//    GOOD: somePromise  (just use it directly)

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the return type of an async function that returns a number?
//
//   Answer: Promise<number>. The async keyword always wraps the return value
//   in a Promise. Even if you write "return 42", TypeScript types it as
//   Promise<number> and the caller must await it or use .then().

// Q2: What is the difference between Promise.all() and Promise.allSettled()?
//
//   Answer: Promise.all() fails fast — if any promise rejects, the whole thing
//   rejects immediately and you lose other results. Promise.allSettled() always
//   waits for every promise and returns an array of {status, value | reason}
//   objects so you can inspect successes and failures independently.

// Q3: How does TypeScript type the value inside a catch block?
//
//   Answer: Since TypeScript 4.0 in strict mode, caught values are typed as
//   "unknown" (not "any") because anything can be thrown in JavaScript — not
//   just Error objects. You must narrow the type with instanceof or typeof
//   before accessing properties: if (err instanceof Error) { err.message }

// Q4: Why does async/await not automatically make code run in parallel?
//
//   Answer: await pauses the current function until the awaited promise
//   settles. Writing two sequential awaits means the second operation does
//   not even START until the first finishes. To run in parallel, start all
//   promises FIRST (by calling the functions without await), then await all
//   results via Promise.all(). The key insight: calling an async function
//   starts the operation immediately — await just waits for the result.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — Order Status Poller
//   Write an async function "pollOrderStatus(orderId: string, maxPolls: number)"
//   that polls an order every 200ms up to maxPolls times. On each poll, simulate
//   a status check with Promise.resolve. If the status becomes "shipped",
//   return the order. If maxPolls is exhausted, throw a TimeoutError.
//   Use the Order interface. Log each polling attempt.

// TASK 2 — Parallel User Enrichment
//   Write an async function "enrichUsers(userIds: number[])" that:
//     - Fetches all users in parallel (use fetchUser + Promise.all)
//     - For each user, fetches their associated products (simulate with fetchProducts)
//     - Returns an array of { user: User, products: Product[] } objects
//   Use Promise.allSettled so a single failed user fetch does not abort the rest.
//   Log how many users were successfully enriched vs failed.

// TASK 3 — Typed Async Pipeline
//   Build a generic async pipeline function:
//     async function pipeline<T>(
//       initialValue: T,
//       steps: Array<(input: T) => Promise<T>>
//     ): Promise<T>
//   It should run each step sequentially, passing the output of one step as
//   input to the next. Use it to build a number-processing pipeline that:
//     - Doubles the number (async, 50ms delay)
//     - Adds 10 (async, 30ms delay)
//     - Clamps to a max of 100 (async, immediate)
//   Log the result after each step and the final value.
