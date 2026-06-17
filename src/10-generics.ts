// =====================================
// 10 - GENERICS IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers learning TypeScript from scratch.
// This file is self-contained and fully runnable.

// =====================================
// WHAT ARE GENERICS
// =====================================

// Generics are TYPE PARAMETERS — they let you write a function, class, or interface
// ONCE and reuse it with many different types while keeping full type safety.
//
// Think of generics like a placeholder for a type. Instead of writing:
//   function getFirstNumber(arr: number[]): number { ... }
//   function getFirstString(arr: string[]): string { ... }
//
// You write ONE generic version:
//   function getFirst<T>(arr: T[]): T { ... }
//
// The <T> is the type parameter. TypeScript fills it in at compile time based on
// how you call the function.
//
// WHY DO GENERICS EXIST?
//   - Without generics you either duplicate code (one function per type) or you
//     lose type safety by using "any".
//   - Generics give you the REUSABILITY of "any" without throwing away type info.
//   - They let TypeScript infer and track types through transformations.

// =====================================
// JAVASCRIPT vs TYPESCRIPT — GENERICS
// =====================================

// JAVASCRIPT (no generics — no type info at all):
//
//   function identity(arg) {
//     return arg;
//   }
//   const result = identity(42);   // result is "any" — no type knowledge
//   const result2 = identity("hi"); // same function, but we don't know what comes out
//
// TYPESCRIPT (with generics — types are preserved and checked):
//
//   function identity<T>(arg: T): T {
//     return arg;
//   }
//   const result = identity(42);    // TypeScript knows result is number
//   const result2 = identity("hi"); // TypeScript knows result2 is string
//
// At RUNTIME generics disappear — they are erased during compilation.
// Generics are purely a compile-time construct that helps the type checker.
// The compiled JavaScript output is the same plain function you wrote in JS.

// =====================================
// GENERIC FUNCTIONS
// =====================================

// WHAT: A function that accepts a type parameter so it can operate on any type
//       while keeping the relationship between input and output types intact.
//
// WHY: Avoids duplicate functions for each type, and avoids "any" which removes
//      type safety entirely.
//
// SYNTAX:
//   function functionName<T>(param: T): T { ... }
//   The <T> after the function name declares T as a type parameter for this call.

// --- Simple identity function ---
function identity<T>(arg: T): T {
  return arg;
}

// TypeScript INFERS the type parameter from the argument:
const numResult = identity(42);       // T is inferred as number
const strResult = identity("hello");  // T is inferred as string
const boolResult = identity(true);    // T is inferred as boolean

console.log("identity(42):", numResult);       // 42
console.log("identity('hello'):", strResult);  // hello
console.log("identity(true):", boolResult);    // true

// You can also pass the type EXPLICITLY (less common, TypeScript usually infers it):
const explicit = identity<string>("world");
console.log("explicit identity<string>:", explicit); // world

// --- First element of an array ---
// Without generics: function getFirst(arr: any[]): any — loses type info
// With generics:
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirst([10, 20, 30]);   // inferred as number | undefined
const firstStr = getFirst(["a", "b", "c"]); // inferred as string | undefined

console.log("getFirst([10,20,30]):", firstNum); // 10
console.log("getFirst(['a','b','c']):", firstStr); // a

// --- Last element of an array ---
function getLast<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

console.log("getLast([1,2,3]):", getLast([1, 2, 3])); // 3

// =====================================
// GENERIC ARROW FUNCTIONS
// =====================================

// WHAT: Arrow functions can also be generic. The syntax places <T> before
//       the parameter list.
//
// NOTE: In .tsx files (React with JSX) TypeScript can confuse <T> with a JSX tag.
//       The common workaround is <T,> (trailing comma) or <T extends unknown>.

const wrapInArray = <T>(value: T): T[] => [value];

console.log("wrapInArray(5):", wrapInArray(5));         // [5]
console.log("wrapInArray('hi'):", wrapInArray("hi"));   // ['hi']

const reverseArray = <T>(arr: T[]): T[] => [...arr].reverse();

console.log("reverseArray([1,2,3]):", reverseArray([1, 2, 3]));         // [3, 2, 1]
console.log("reverseArray(['a','b']):", reverseArray(["a", "b"]));      // ['b', 'a']

// =====================================
// MULTIPLE TYPE PARAMETERS
// =====================================

// WHAT: A function (or type) can have MORE than one type parameter.
//       Each gets its own letter or name.
//
// WHY: Sometimes you need to express a relationship between two different types —
//      for example, a function that takes a value of type T and a value of type U
//      and combines them.

function pair<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

const p1 = pair(1, "one");          // [number, string]
const p2 = pair(true, [1, 2, 3]);   // [boolean, number[]]

console.log("pair(1, 'one'):", p1);         // [1, 'one']
console.log("pair(true, [1,2,3]):", p2);    // [true, [1, 2, 3]]

// --- Swap the values of a pair ---
function swap<T, U>(a: T, b: U): [U, T] {
  return [b, a];
}

console.log("swap('x', 99):", swap("x", 99)); // [99, 'x']

// --- Map with a transform function (like Array.map but explicit) ---
function mapValue<T, U>(value: T, transform: (val: T) => U): U {
  return transform(value);
}

const doubled = mapValue(5, (n) => n * 2);           // number
const stringified = mapValue(42, (n) => String(n));   // string
const parsed = mapValue("3.14", (s) => parseFloat(s)); // number

console.log("mapValue(5, x=>x*2):", doubled);        // 10
console.log("mapValue(42, String):", stringified);    // '42'
console.log("mapValue('3.14', parseFloat):", parsed); // 3.14

// =====================================
// GENERIC CONSTRAINTS
// =====================================

// WHAT: By default a type parameter T can be ANYTHING. A constraint narrows down
//       what T can be, letting you safely access properties or methods that exist
//       on the constrained type.
//
// WHY: If T is totally unconstrained, TypeScript won't let you call .length on it
//      because not every type has .length. A constraint tells TypeScript "T must
//      have at least these properties" so you can access them safely.
//
// SYNTAX:
//   function fn<T extends SomeType>(arg: T): ...
//   "extends" here means "is assignable to" — a subset, not a class extension.

// --- Constraint: must have .length ---
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

console.log("getLength('hello'):", getLength("hello"));      // 5
console.log("getLength([1,2,3]):", getLength([1, 2, 3]));    // 3
console.log("getLength({length:7}):", getLength({ length: 7 })); // 7
// getLength(42) — ERROR: number does not have .length

// --- Constraint: must have .name and .age ---
interface HasNameAndAge {
  name: string;
  age: number;
}

function greet<T extends HasNameAndAge>(entity: T): string {
  return `Hello, ${entity.name}! You are ${entity.age} years old.`;
}

const greeting = greet({ name: "Alice", age: 30, role: "admin" }); // extra props are fine
console.log(greeting); // Hello, Alice! You are 30 years old.

// --- Constraint: T must be an object ---
function cloneObject<T extends object>(obj: T): T {
  return { ...obj } as T;
}

const original = { x: 1, y: 2 };
const cloned = cloneObject(original);
console.log("cloneObject:", cloned); // { x: 1, y: 2 }

// =====================================
// DEFAULT TYPE PARAMETERS
// =====================================

// WHAT: Just like JavaScript function parameters can have defaults, TypeScript
//       type parameters can have DEFAULT TYPES that are used when no type is
//       supplied and inference fails.
//
// WHY: Makes generic types easier to use when there is a "most common" type.
//      Useful in library code where you want a sensible fallback.
//
// SYNTAX:
//   function fn<T = DefaultType>(...)
//   type MyType<T = DefaultType> = { ... }

function createArray<T = string>(length: number, fill: T): T[] {
  return Array(length).fill(fill);
}

const strings = createArray(3, "x");   // T inferred as string from argument
const numbers = createArray(3, 0);     // T inferred as number from argument
const explicit2 = createArray<boolean>(2, true); // T explicitly boolean

console.log("createArray(3,'x'):", strings);      // ['x', 'x', 'x']
console.log("createArray(3, 0):", numbers);        // [0, 0, 0]
console.log("createArray<boolean>(2,true):", explicit2); // [true, true]

// Default type in a generic type alias:
type Nullable<T = string> = T | null;

const maybeStr: Nullable = null;       // T defaults to string
const maybeNum: Nullable<number> = 42; // T is number

console.log("Nullable default:", maybeStr); // null
console.log("Nullable<number>:", maybeNum); // 42

// =====================================
// GENERIC INTERFACES
// =====================================

// WHAT: An interface can have type parameters, making it reusable across many
//       value types.
//
// WHY: You want to describe a shape (contract) that works with multiple data types.
//      For example, a data container, a result wrapper, a repository.

interface Box<T> {
  value: T;
  label: string;
}

const numberBox: Box<number> = { value: 42, label: "The answer" };
const stringBox: Box<string> = { value: "hello", label: "A greeting" };

console.log("Box<number>:", numberBox); // { value: 42, label: 'The answer' }
console.log("Box<string>:", stringBox); // { value: 'hello', label: 'A greeting' }

// --- Generic Stack interface ---
interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
}

// Implementing the generic interface:
class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const numStack = new ArrayStack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log("Stack peek:", numStack.peek()); // 3
console.log("Stack pop:", numStack.pop());   // 3
console.log("Stack size:", numStack.size()); // 2

// =====================================
// GENERIC TYPE ALIASES
// =====================================

// WHAT: type aliases (the "type" keyword) can also accept type parameters,
//       just like interfaces.
//
// WHY: Often used for union types, mapped types, and utility types that
//      need to be parameterized.

// A simple wrapper:
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
  loading: boolean;
};

// A success result wrapper:
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Paginated response:
type PaginatedResponse<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Using ApiResponse<T>:
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Order {
  id: number;
  userId: number;
  products: Product[];
  total: number;
  status: "pending" | "shipped" | "delivered";
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  error: null,
  status: 200,
  loading: false,
};

const productResponse: ApiResponse<Product[]> = {
  data: [
    { id: 1, name: "Laptop", price: 999, category: "electronics" },
    { id: 2, name: "Desk", price: 299, category: "furniture" },
  ],
  error: null,
  status: 200,
  loading: false,
};

const failedOrderResponse: ApiResponse<Order> = {
  data: null,
  error: "Order not found",
  status: 404,
  loading: false,
};

console.log("User response data:", userResponse.data?.name); // Alice
console.log("Product count:", productResponse.data?.length); // 2
console.log("Failed order error:", failedOrderResponse.error); // Order not found

// Using Result<T>:
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { success: false, error: "Division by zero" };
  return { success: true, value: a / b };
}

const r1 = divide(10, 2);
const r2 = divide(5, 0);

if (r1.success) console.log("10 / 2 =", r1.value); // 5
if (!r2.success) console.log("Divide error:", r2.error); // Division by zero

// =====================================
// GENERIC CLASSES
// =====================================

// WHAT: A class can declare type parameters in angle brackets after the class name.
//       All methods and properties within the class can then use those parameters.
//
// WHY: Useful for data structures (stacks, queues, linked lists) and patterns like
//      Repository, Cache, or EventEmitter that are type-agnostic but need to stay
//      consistent about what type they work with.

class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get length(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

const taskQueue = new Queue<string>();
taskQueue.enqueue("send-email");
taskQueue.enqueue("process-payment");
taskQueue.enqueue("update-inventory");

console.log("Queue peek:", taskQueue.peek());           // send-email
console.log("Queue dequeue:", taskQueue.dequeue());     // send-email
console.log("Queue remaining:", taskQueue.toArray());   // ['process-payment', 'update-inventory']

// =====================================
// KEYOF CONSTRAINT
// =====================================

// WHAT: "keyof T" produces a union of all the KEYS of type T.
//       Combined with a generic constraint "K extends keyof T", it lets you
//       write functions that accept a key of an object and return the right
//       value type for that key.
//
// WHY: Without this you'd need to use "any" or write overloads. With it,
//      TypeScript knows exactly which value type corresponds to which key.

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "Bob", email: "bob@example.com" };

const userName = getProperty(user, "name");   // TypeScript knows this is string
const userId = getProperty(user, "id");       // TypeScript knows this is number

console.log("getProperty name:", userName); // Bob
console.log("getProperty id:", userId);     // 1
// getProperty(user, "foo") — ERROR: 'foo' is not a key of User

// --- setProperty: type-safe object mutation ---
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const updatedUser = setProperty(user, "name", "Robert");
console.log("setProperty name:", updatedUser.name); // Robert
// setProperty(user, "name", 42) — ERROR: 42 is not assignable to string

// --- Pick subset of keys ---
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const publicUser = pick(user, ["id", "name"]);
console.log("pick id,name:", publicUser); // { id: 1, name: 'Bob' }

// =====================================
// PRACTICAL GENERIC PATTERNS
// =====================================

// =====================================
// PATTERN 1 — GENERIC REPOSITORY
// =====================================

// WHAT: A Repository encapsulates all data access for one entity type.
//       Making it generic means you write the pattern once and use it for
//       User, Product, Order, etc.
//
// WHY: Keeps data access code DRY and consistently typed.

interface Identifiable {
  id: number;
}

class Repository<T extends Identifiable> {
  private store: Map<number, T> = new Map();
  private nextId: number = 1;

  create(item: Omit<T, "id">): T {
    const newItem = { ...item, id: this.nextId++ } as T;
    this.store.set(newItem.id, newItem);
    return newItem;
  }

  find(id: number): T | undefined {
    return this.store.get(id);
  }

  findAll(): T[] {
    return Array.from(this.store.values());
  }

  findWhere(predicate: (item: T) => boolean): T[] {
    return this.findAll().filter(predicate);
  }

  update(id: number, changes: Partial<Omit<T, "id">>): T | undefined {
    const existing = this.store.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...changes };
    this.store.set(id, updated);
    return updated;
  }

  delete(id: number): boolean {
    return this.store.delete(id);
  }

  count(): number {
    return this.store.size;
  }
}

// Using Repository<User>
const userRepo = new Repository<User>();

const alice = userRepo.create({ name: "Alice", email: "alice@example.com" });
const bob = userRepo.create({ name: "Bob", email: "bob@example.com" });
const carol = userRepo.create({ name: "Carol", email: "carol@example.com" });

console.log("\n--- Repository<User> ---");
console.log("Created users:", userRepo.count());          // 3
console.log("Find id=1:", userRepo.find(1)?.name);        // Alice
console.log("All users:", userRepo.findAll().map(u => u.name)); // ['Alice','Bob','Carol']

const updatedAlice = userRepo.update(1, { name: "Alicia" });
console.log("Updated Alice:", updatedAlice?.name);        // Alicia

userRepo.delete(3);
console.log("After delete:", userRepo.count());           // 2

// Using Repository<Product>
const productRepo = new Repository<Product>();

productRepo.create({ name: "Laptop", price: 999, category: "electronics" });
productRepo.create({ name: "Phone", price: 599, category: "electronics" });
productRepo.create({ name: "Desk", price: 299, category: "furniture" });

const electronics = productRepo.findWhere(p => p.category === "electronics");
console.log("\n--- Repository<Product> ---");
console.log("Electronics count:", electronics.length); // 2
console.log("Electronics names:", electronics.map(p => p.name)); // ['Laptop','Phone']

// =====================================
// PATTERN 2 — GENERIC API RESPONSE WRAPPER
// =====================================

// WHAT: A helper function that wraps fetch results in a consistent ApiResponse<T>.
//       The function is generic so the caller specifies what type the data will be.
//
// WHY: All API calls share the same loading/error/data shape, making it easy to
//      write one handler pattern across the whole application.

// Simulates an async API call:
async function fetchData<T>(
  url: string,
  mockData: T
): Promise<ApiResponse<T>> {
  // In a real app you would: const res = await fetch(url); const data = await res.json();
  const shouldFail = url.includes("error");
  if (shouldFail) {
    return { data: null, error: "Network error", status: 500, loading: false };
  }
  return { data: mockData, error: null, status: 200, loading: false };
}

// Helper to handle an ApiResponse:
function handleResponse<T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError: (error: string) => void
): void {
  if (response.error) {
    onError(response.error);
  } else if (response.data !== null) {
    onSuccess(response.data);
  }
}

// Example usage:
const mockUser: User = { id: 1, name: "Alice", email: "alice@example.com" };
const mockProducts: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
];

(async () => {
  console.log("\n--- Generic API Response Wrapper ---");

  const userRes = await fetchData<User>("/api/users/1", mockUser);
  handleResponse(
    userRes,
    (u) => console.log("Fetched user:", u.name),    // Alice
    (e) => console.log("User error:", e)
  );

  const prodRes = await fetchData<Product[]>("/api/products", mockProducts);
  handleResponse(
    prodRes,
    (products) => console.log("Fetched products:", products.length), // 1
    (e) => console.log("Product error:", e)
  );

  const failRes = await fetchData<Order>("/api/error/orders", {} as Order);
  handleResponse(
    failRes,
    (o) => console.log("Order:", o.id),
    (e) => console.log("Order error:", e) // Network error
  );
})();

// =====================================
// PATTERN 3 — GENERIC FORM STATE
// =====================================

// WHAT: A type that represents the state of a form where T is the shape of
//       the form data. Tracks values, touched fields, validation errors, and
//       submission state.
//
// WHY: Every form in an app needs the same wrapper logic (dirty tracking,
//      errors, submission) but with different field shapes.

type FormField<T> = {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
};

type FormState<T> = {
  fields: { [K in keyof T]: FormField<T[K]> };
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
};

function createFormField<T>(value: T): FormField<T> {
  return { value, error: null, touched: false, dirty: false };
}

function createFormState<T extends Record<string, unknown>>(
  initialValues: T
): FormState<T> {
  const fields = Object.fromEntries(
    Object.entries(initialValues).map(([key, value]) => [
      key,
      createFormField(value),
    ])
  ) as FormState<T>["fields"];

  return {
    fields,
    isSubmitting: false,
    isValid: true,
    submitCount: 0,
  };
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ProductForm {
  name: string;
  price: number;
  category: string;
}

const loginFormState = createFormState<LoginForm>({
  email: "",
  password: "",
  rememberMe: false,
});

const productFormState = createFormState<ProductForm>({
  name: "",
  price: 0,
  category: "electronics",
});

console.log("\n--- Generic Form State ---");
console.log("Login form email field:", loginFormState.fields.email);
// { value: '', error: null, touched: false, dirty: false }
console.log("Product form price field:", productFormState.fields.price);
// { value: 0, error: null, touched: false, dirty: false }

// =====================================
// PATTERN 4 — GENERIC PAGINATED RESPONSE
// =====================================

// WHAT: A container that holds one page of results of any item type T, along
//       with pagination metadata.
//
// WHY: Pagination logic is always the same regardless of whether you are
//      paginating Users, Products, Orders, or Comments.

function paginate<T>(
  allItems: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  const items = allItems.slice(start, start + pageSize);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

const allProducts: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
  category: i % 2 === 0 ? "electronics" : "furniture",
}));

const page1 = paginate<Product>(allProducts, 1, 10);
const page3 = paginate<Product>(allProducts, 3, 10);

console.log("\n--- Generic Paginated Response ---");
console.log("Page 1 count:", page1.items.length);          // 10
console.log("Total pages:", page1.totalPages);             // 3
console.log("Has next page:", page1.hasNextPage);          // true
console.log("Has prev page:", page1.hasPreviousPage);      // false
console.log("Page 3 count:", page3.items.length);          // 5  (last page)
console.log("Page 3 hasNext:", page3.hasNextPage);         // false
console.log("Page 3 hasPrev:", page3.hasPreviousPage);     // true

const allUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Carol", email: "carol@example.com" },
];

const userPage = paginate<User>(allUsers, 1, 2);
console.log("User page 1 names:", userPage.items.map(u => u.name)); // ['Alice','Bob']
console.log("User page 1 hasNext:", userPage.hasNextPage);           // true

// =====================================
// PATTERN 5 — GENERIC EVENT EMITTER
// =====================================

// WHAT: A typed event emitter where T is a map of event-name to payload type.
//       This ensures listeners receive the correct payload type for each event.
//
// WHY: Standard event emitters are stringly-typed and return "any" for payload.
//      A generic version gives full IntelliSense and type checking on events.

type EventMap = Record<string, unknown>;

class TypedEventEmitter<T extends EventMap> {
  private listeners: {
    [K in keyof T]?: Array<(payload: T[K]) => void>;
  } = {};

  on<K extends keyof T>(event: K, listener: (payload: T[K]) => void): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return this;
  }

  off<K extends keyof T>(event: K, listener: (payload: T[K]) => void): this {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter(l => l !== listener) as typeof eventListeners;
    }
    return this;
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(payload));
    }
  }
}

// Define your event map:
interface AppEvents {
  "user:login": { userId: number; timestamp: Date };
  "user:logout": { userId: number };
  "cart:updated": { itemCount: number; total: number };
  "order:placed": { orderId: number; userId: number; total: number };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("user:login", ({ userId, timestamp }) => {
  console.log(`\nUser ${userId} logged in at ${timestamp.toISOString()}`);
});

emitter.on("cart:updated", ({ itemCount, total }) => {
  console.log(`Cart updated: ${itemCount} items, total $${total}`);
});

emitter.on("order:placed", ({ orderId, userId, total }) => {
  console.log(`Order #${orderId} placed by user ${userId} for $${total}`);
});

console.log("\n--- Generic Event Emitter ---");
emitter.emit("user:login", { userId: 1, timestamp: new Date("2024-01-15") });
emitter.emit("cart:updated", { itemCount: 3, total: 149.99 });
emitter.emit("order:placed", { orderId: 101, userId: 1, total: 149.99 });
// emitter.emit("cart:updated", { wrong: "shape" }) — ERROR: type mismatch

// =====================================
// PATTERN 6 — GENERIC CART
// =====================================

// WHAT: A Cart class constrained to items that implement the CartItem interface.
//       T extends CartItem ensures every item has id, name, and price.
//
// WHY: The cart logic (add, remove, total) is the same for physical products,
//      digital downloads, subscriptions, etc. The constraint guarantees the
//      minimum required fields are present.

interface CartItem {
  id: number;
  name: string;
  price: number;
}

interface PhysicalProduct extends CartItem {
  weight: number; // kg
  dimensions: { width: number; height: number; depth: number };
}

interface DigitalProduct extends CartItem {
  downloadUrl: string;
  licenseKey: string;
}

class Cart<T extends CartItem> {
  private items: Map<number, { item: T; quantity: number }> = new Map();

  add(item: T, quantity: number = 1): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.set(item.id, { item, quantity });
    }
  }

  remove(itemId: number): void {
    this.items.delete(itemId);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const entry = this.items.get(itemId);
    if (entry) {
      if (quantity <= 0) {
        this.remove(itemId);
      } else {
        entry.quantity = quantity;
      }
    }
  }

  getItems(): Array<{ item: T; quantity: number }> {
    return Array.from(this.items.values());
  }

  getTotal(): number {
    return this.getItems().reduce(
      (sum, { item, quantity }) => sum + item.price * quantity,
      0
    );
  }

  getItemCount(): number {
    return this.getItems().reduce((sum, { quantity }) => sum + quantity, 0);
  }

  clear(): void {
    this.items.clear();
  }

  isEmpty(): boolean {
    return this.items.size === 0;
  }
}

// Physical product cart:
const physicalCart = new Cart<PhysicalProduct>();

physicalCart.add(
  { id: 1, name: "Laptop", price: 999, weight: 1.8, dimensions: { width: 35, height: 2, depth: 24 } },
  1
);
physicalCart.add(
  { id: 2, name: "Mouse", price: 49, weight: 0.1, dimensions: { width: 12, height: 4, depth: 6 } },
  2
);

console.log("\n--- Generic Cart<PhysicalProduct> ---");
console.log("Item count:", physicalCart.getItemCount()); // 3
console.log("Total:", physicalCart.getTotal());          // 1097

physicalCart.updateQuantity(2, 1);
console.log("After update total:", physicalCart.getTotal()); // 1048

// Digital product cart:
const digitalCart = new Cart<DigitalProduct>();

digitalCart.add({
  id: 10,
  name: "TypeScript Course",
  price: 29.99,
  downloadUrl: "https://example.com/ts-course",
  licenseKey: "TS-XXXX-YYYY",
});

console.log("Digital cart total:", digitalCart.getTotal()); // 29.99

// =====================================
// REAL-WORLD EXAMPLE — PUTTING IT ALL TOGETHER
// =====================================

// An e-commerce application slice that uses all the patterns above:

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

const orderRepo = new Repository<Order>();

// Create some orders:
const order1 = orderRepo.create({
  userId: 1,
  products: [{ id: 1, name: "Laptop", price: 999, category: "electronics" }],
  total: 999,
  status: "pending",
});

const order2 = orderRepo.create({
  userId: 1,
  products: [{ id: 2, name: "Mouse", price: 49, category: "electronics" }],
  total: 49,
  status: "shipped",
});

const order3 = orderRepo.create({
  userId: 2,
  products: [{ id: 3, name: "Desk", price: 299, category: "furniture" }],
  total: 299,
  status: "delivered",
});

console.log("\n--- Real-World Composed Example ---");

// Paginate orders for user 1:
const userOrders = orderRepo.findWhere(o => o.userId === 1);
const paginatedOrders = paginate<Order>(userOrders, 1, 5);
console.log("User 1 orders:", paginatedOrders.items.length); // 2

// Wrap in ApiResponse:
const ordersApiResponse: ApiResponse<PaginatedResponse<Order>> = {
  data: paginatedOrders,
  error: null,
  status: 200,
  loading: false,
};

if (ordersApiResponse.data) {
  console.log("API orders total:", ordersApiResponse.data.totalItems); // 2
  console.log("First order status:", ordersApiResponse.data.items[0].status); // pending
}

// Update order status:
orderRepo.update(order1.id, { status: "shipped" });
const updatedOrder = orderRepo.find(order1.id);
console.log("Updated order status:", updatedOrder?.status); // shipped

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

// PROBLEM: write a function that returns the first element of any array.
//
// ---- JAVASCRIPT APPROACH 1: just accept anything ----
//
//   function getFirst(arr) {
//     return arr[0];
//   }
//   const first = getFirst([1, 2, 3]);
//   first.toUpperCase(); // No error at compile time, crashes at runtime!
//                        // number does not have .toUpperCase()
//
// ---- JAVASCRIPT APPROACH 2: JSDoc (partial help) ----
//
//   /** @template T @param {T[]} arr @returns {T | undefined} */
//   function getFirst(arr) { return arr[0]; }
//   // Better, but no enforcement. You can ignore the JSDoc.
//
// ---- TYPESCRIPT APPROACH: generics ----
//
//   function getFirst<T>(arr: T[]): T | undefined { return arr[0]; }
//   const first = getFirst([1, 2, 3]);  // first: number | undefined
//   first?.toUpperCase();               // ERROR at compile time!
//                                       // Property 'toUpperCase' does not exist on type 'number'
//
// KEY INSIGHT:
//   TypeScript generics have ZERO runtime cost. After compilation the JS output is
//   identical to the plain JS function. Generics only exist during type checking.
//   They are a compile-time safety net, not a runtime feature.

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1: Using "any" instead of a generic
//
//   BAD:
//   function echo(value: any): any { return value; }
//   const result = echo(42);
//   result.toUpperCase(); // No error! any disables all type checking.
//
//   GOOD:
//   function echo<T>(value: T): T { return value; }
//   const result = echo(42);
//   result.toUpperCase(); // ERROR: number does not have toUpperCase

// MISTAKE 2: Not constraining generics enough
//
//   BAD:
//   function processItem<T>(item: T): void {
//     console.log(item.id); // ERROR: T might not have .id
//   }
//
//   GOOD:
//   function processItem<T extends { id: number }>(item: T): void {
//     console.log(item.id); // Safe — we know T has .id
//   }

// MISTAKE 3: Overusing generics — making simple things complex
//
//   BAD (over-engineered):
//   function addNumbers<T extends number>(a: T, b: T): T {
//     return (a + b) as T;  // Using generics for no benefit
//   }
//
//   GOOD (just use the type directly):
//   function addNumbers(a: number, b: number): number {
//     return a + b;
//   }
//   Rule: only use generics when you need to PRESERVE and RELATE types.
//   If there's no relationship between input and output types, skip generics.

// MISTAKE 4: Forgetting that generics are erased at runtime
//
//   BAD (impossible — cannot check generic type at runtime):
//   function createInstance<T>(): T {
//     return new T(); // ERROR: T only exists at compile time
//   }
//
//   GOOD (pass the constructor explicitly):
//   function createInstance<T>(ctor: new () => T): T {
//     return new ctor();
//   }
//   class Dog { bark() { return "woof"; } }
//   const dog = createInstance(Dog);
//   console.log(dog.bark()); // woof

class Dog { bark() { return "woof"; } }
function createInstance<T>(ctor: new () => T): T {
  return new ctor();
}
const dog = createInstance(Dog);
console.log("\nMistake 4 example:", dog.bark()); // woof

// MISTAKE 5: Naming type params poorly
//
//   BAD:
//   function transform<A, B, C>(arr: A[], fn: (item: A) => B, seed: C): B[] { ... }
//   // What are A, B, C? Hard to read.
//
//   GOOD (descriptive names for complex generics):
//   function transform<TItem, TResult, TSeed>(
//     arr: TItem[],
//     fn: (item: TItem) => TResult,
//     seed: TSeed
//   ): TResult[] { ... }
//   // Immediately clear what each type parameter represents.
//   //
//   // Convention: single letter (T, U, K, V) for simple cases;
//   //             descriptive TXxx name for complex cases with 3+ params.

// =====================================
// BEST PRACTICES
// =====================================

// 1. LET TYPESCRIPT INFER THE TYPE PARAMETER
//    Call identity(42) not identity<number>(42).
//    Only be explicit when inference fails or is ambiguous.
//
// 2. USE MEANINGFUL NAMES FOR TYPE PARAMETERS
//    T for a general single type parameter is fine.
//    K for key, V for value, E for error, TItem/TResult for clarity.
//
// 3. APPLY THE MINIMUM NECESSARY CONSTRAINT
//    <T extends { id: number }> only when you need .id.
//    Do not constrain to a full interface when you only need one property.
//
// 4. PREFER GENERIC FUNCTIONS OVER GENERIC CLASSES WHEN POSSIBLE
//    Generic functions are simpler and easier to compose.
//    Use generic classes for stateful patterns (Repository, Queue, Cache).
//
// 5. DO NOT SPREAD GENERICS EVERYWHERE
//    If a function always returns string regardless of input, it does not need
//    a generic. Only use generics to express type RELATIONSHIPS.
//
// 6. COMBINE WITH UTILITY TYPES
//    Generics compose beautifully with Partial<T>, Required<T>, Pick<T, K>,
//    Omit<T, K>, Readonly<T>, Record<K, V>. Learn both together.
//
// 7. GENERIC DEFAULTS ARE GREAT FOR LIBRARY CODE
//    function createState<T = string>() allows callers to skip the type arg
//    in the common case while still supporting other types.

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between using "any" and a generic type parameter?
//
// A: "any" completely opts out of type checking — TypeScript treats values as
//    having no known type and will not report errors on any operations. A generic
//    type parameter (T) is a placeholder that is filled in at compile time with
//    a REAL type, preserving full type information. The caller's type is tracked
//    all the way through the function or class. Generics give you the flexibility
//    of "any" while keeping type safety. After compilation both produce identical
//    JavaScript — the difference is only in what the type checker enforces.

// Q2: What does "T extends keyof U" mean?
//
// A: "keyof U" produces a union type of all the property names (keys) of U.
//    "T extends keyof U" constrains T so it can only be one of those keys.
//    This allows you to write functions where the key and the corresponding
//    value type are linked — for example:
//      function get<U, T extends keyof U>(obj: U, key: T): U[T]
//    The return type U[T] is looked up from the object type, so TypeScript knows
//    exactly what type the value will be for each specific key.

// Q3: Why can't you use "instanceof" or "typeof" to check a generic type at runtime?
//
// A: TypeScript generics are completely erased during compilation — they are a
//    compile-time construct only and produce no JavaScript output. At runtime
//    there is no T to check against. The compiled JS is just a plain function
//    with no type information. If you need runtime type discrimination with
//    generics, you must pass additional runtime information — for example, a
//    constructor function, a type guard function, or a discriminant string.

// Q4: When should you use a generic interface vs a generic type alias?
//
// A: Both can express generic shapes. The practical differences are:
//    - Interfaces can be EXTENDED with "extends" and merged with declaration merging.
//      Use interfaces when defining a contract that classes will implement or that
//      may need to be extended (e.g., Repository<T>, Stack<T>).
//    - Type aliases can express UNION types, INTERSECTION types, conditional types,
//      and mapped types — things interfaces cannot do.
//      Use type aliases for computed types (ApiResponse<T>, Result<T, E>,
//      PaginatedResponse<T>) and for types built with type operators.
//    In practice, either works for simple object shapes. Follow your project's
//    convention and use type aliases when you need union/conditional/mapped types.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — Generic Cache
// ---------------------
// Implement a generic Cache<T> class with:
//   - set(key: string, value: T, ttlSeconds?: number): void
//   - get(key: string): T | undefined  (returns undefined if expired)
//   - has(key: string): boolean
//   - delete(key: string): void
//   - clear(): void
//   - size(): number
//
// Requirements:
//   - If ttlSeconds is provided, the entry should expire after that many seconds.
//   - get() on an expired entry should remove it and return undefined.
//   - Use Cache<User> and Cache<Product> to demonstrate it works for different types.
//
// Hint: Store { value: T; expiresAt: number | null } internally.

// TASK 2 — Generic Validator
// --------------------------
// Create a generic validation system:
//
//   type ValidationRule<T> = {
//     validate: (value: T) => boolean;
//     message: string;
//   };
//
//   class Validator<T> {
//     private rules: ValidationRule<T>[] = [];
//     addRule(rule: ValidationRule<T>): this { ... }
//     validate(value: T): { valid: boolean; errors: string[] } { ... }
//   }
//
// Then create specific validators:
//   - A string validator with: minLength, maxLength, matches(regex) rules
//   - A number validator with: min, max, isInteger rules
//   - Use them to validate a signup form { email: string; age: number; username: string }

// TASK 3 — Generic State Machine
// -------------------------------
// Implement a generic StateMachine<TState, TEvent> where:
//   - TState is a union of valid states (e.g., "idle" | "loading" | "success" | "error")
//   - TEvent is a union of valid events (e.g., "FETCH" | "RESOLVE" | "REJECT" | "RESET")
//
//   class StateMachine<TState extends string, TEvent extends string> {
//     constructor(
//       private currentState: TState,
//       private transitions: Partial<Record<TState, Partial<Record<TEvent, TState>>>>
//     ) {}
//
//     getState(): TState { ... }
//     send(event: TEvent): TState { ... }  // transitions state, returns new state
//     can(event: TEvent): boolean { ... }  // returns true if transition is valid
//   }
//
// Use it to model:
//   1. A fetch state machine: idle → (FETCH) → loading → (RESOLVE) → success
//                                                       → (REJECT) → error
//                             success/error → (RESET) → idle
//   2. A traffic light: red → (NEXT) → green → (NEXT) → yellow → (NEXT) → red
