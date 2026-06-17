// =====================================
// 04-FUNCTIONS IN TYPESCRIPT
// =====================================
// Topic    : Functions in TypeScript
// Audience : JavaScript developers learning TypeScript from scratch
// Run with : npx ts-node src/04-functions.ts
// =====================================

// ─────────────────────────────────────────────────────────────────────────────
// WHY TYPED FUNCTIONS?
// ─────────────────────────────────────────────────────────────────────────────
// In plain JavaScript, a function will accept any argument silently.
// TypeScript catches wrong argument types, missing arguments, and wrong return
// values AT COMPILE TIME — before the code ever runs in production.
//
// JavaScript:
//   function greet(name) { return "Hello, " + name; }
//   greet(42);          // no error, runs silently
//
// TypeScript:
//   function greet(name: string): string { return "Hello, " + name; }
//   greet(42);          // ERROR: Argument of type 'number' is not assignable to 'string'
// ─────────────────────────────────────────────────────────────────────────────

// =====================================
// SECTION 1 — NAMED FUNCTIONS
// =====================================
// WHAT  : A function declared with the `function` keyword and an explicit name.
// WHY   : Hoisted (can be called before declaration), clear stack-trace names,
//         and easy to annotate with parameter types and a return type.
// SYNTAX: function functionName(param: Type, ...): ReturnType { ... }

// Simple example — typed parameters and return type
function add(a: number, b: number): number {
  return a + b;
}
console.log("add(3, 4) =", add(3, 4)); // 7

// Practical example — calculate item subtotal
function calculateSubtotal(price: number, quantity: number): number {
  return price * quantity;
}
console.log("Subtotal:", calculateSubtotal(29.99, 3)); // 89.97

// Real-world example — validate user credentials format before sending to API
function validateCredentials(email: string, password: string): boolean {
  const emailValid = email.includes("@") && email.includes(".");
  const passwordValid = password.length >= 8;
  return emailValid && passwordValid;
}
console.log("Valid credentials:", validateCredentials("alice@example.com", "secret123")); // true
console.log("Valid credentials:", validateCredentials("bad-email", "123"));               // false

// =====================================
// SECTION 2 — ARROW FUNCTIONS WITH TYPES
// =====================================
// WHAT  : Shorter function syntax using `=>`. Does NOT have its own `this`.
// WHY   : Concise for callbacks, array methods, and one-liners. TypeScript
//         lets you annotate the parameter list and return type just like named
//         functions, or let the compiler infer the return type.
// SYNTAX: const fn = (param: Type): ReturnType => expression;

// Simple example
const multiply = (a: number, b: number): number => a * b;
console.log("multiply(5, 6) =", multiply(5, 6)); // 30

// Practical example — apply a discount percentage
const applyDiscount = (price: number, discountPercent: number): number => {
  const discount = (price * discountPercent) / 100;
  return parseFloat((price - discount).toFixed(2));
};
console.log("Price after 10% discount:", applyDiscount(199.99, 10)); // 179.99

// Real-world example — format product name for display
const formatProductName = (name: string, brand: string): string =>
  `${brand} — ${name}`;
console.log(formatProductName("Running Shoes", "Nike")); // Nike — Running Shoes

// =====================================
// SECTION 3 — FUNCTION TYPE EXPRESSIONS
// =====================================
// WHAT  : A type alias that describes the shape of a function
//         (its parameter types and return type) without providing an implementation.
// WHY   : Lets you type variables, parameters, or object properties that HOLD
//         functions. You can then pass different functions as long as they match
//         the described shape.
// SYNTAX: type Alias = (param: Type) => ReturnType;

// Simple example — a transformer for numbers
type NumberTransformer = (value: number) => number;

const double: NumberTransformer = (n) => n * 2;
const square: NumberTransformer = (n) => n * n;

console.log("double(7) =", double(7));  // 14
console.log("square(7) =", square(7)); // 49

// Practical example — price formatter strategy
type PriceFormatter = (price: number) => string;

const usdFormatter: PriceFormatter = (p) => `$${p.toFixed(2)}`;
const eurFormatter: PriceFormatter = (p) => `€${p.toFixed(2)}`;

function displayPrice(price: number, formatter: PriceFormatter): void {
  console.log("Formatted price:", formatter(price));
}
displayPrice(49.9, usdFormatter); // $49.90
displayPrice(49.9, eurFormatter); // €49.90

// Real-world example — authentication handler type
type AuthHandler = (token: string) => boolean;

const jwtValidator: AuthHandler = (token) => token.startsWith("eyJ"); // simplified check
const apiKeyValidator: AuthHandler = (token) => token.length === 32;

function authenticate(token: string, handler: AuthHandler): string {
  return handler(token) ? "Access granted" : "Access denied";
}
console.log(authenticate("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", jwtValidator)); // Access granted
console.log(authenticate("short-key", apiKeyValidator));                           // Access denied

// =====================================
// SECTION 4 — OPTIONAL PARAMETERS
// =====================================
// WHAT  : A parameter marked with `?` that the caller may omit.
//         Inside the function its type is `T | undefined`.
// WHY   : JavaScript functions already allow fewer arguments than parameters;
//         TypeScript makes that intent explicit and forces you to handle the
//         undefined case, preventing subtle runtime bugs.
// SYNTAX: function fn(required: string, optional?: string): ReturnType

// Simple example
function greetUser(firstName: string, lastName?: string): string {
  return lastName ? `Hello, ${firstName} ${lastName}!` : `Hello, ${firstName}!`;
}
console.log(greetUser("Alice"));          // Hello, Alice!
console.log(greetUser("Alice", "Smith")); // Hello, Alice Smith!

// Practical example — search products with optional category filter
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop",     category: "Electronics", price: 999 },
  { id: 2, name: "T-Shirt",    category: "Clothing",    price: 29  },
  { id: 3, name: "Headphones", category: "Electronics", price: 149 },
  { id: 4, name: "Jeans",      category: "Clothing",    price: 59  },
];

function searchProducts(query: string, category?: string): Product[] {
  return products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
    const categoryMatch = category ? p.category === category : true;
    return nameMatch && categoryMatch;
  });
}

console.log("Search 'a':",              searchProducts("a").map((p) => p.name));
console.log("Search 'a' Electronics:", searchProducts("a", "Electronics").map((p) => p.name));

// Real-world example — generate order confirmation message
interface Order {
  orderId: string;
  total: number;
  userId: string;
}

function generateOrderConfirmation(order: Order, promoCode?: string): string {
  const base = `Order #${order.orderId} confirmed for user ${order.userId}. Total: $${order.total}`;
  return promoCode ? `${base} (Promo applied: ${promoCode})` : base;
}

console.log(generateOrderConfirmation({ orderId: "ORD-001", total: 89.97, userId: "U42" }));
console.log(generateOrderConfirmation({ orderId: "ORD-002", total: 69.97, userId: "U43" }, "SAVE10"));

// =====================================
// SECTION 5 — DEFAULT PARAMETERS
// =====================================
// WHAT  : A parameter with a fallback value used when the caller omits it or
//         passes `undefined`. TypeScript infers the type from the default value.
// WHY   : Cleaner than checking `param = param || default` inside the body;
//         also documented directly in the signature.
// SYNTAX: function fn(param: Type = defaultValue): ReturnType

// Simple example
function createUsername(name: string, prefix: string = "user_"): string {
  return `${prefix}${name.toLowerCase().replace(/\s+/g, "_")}`;
}
console.log(createUsername("Alice Smith"));           // user_alice_smith
console.log(createUsername("Bob Jones", "member_")); // member_bob_jones

// Practical example — paginate product listing
function getProductPage(
  allProducts: Product[],
  page: number = 1,
  pageSize: number = 2
): Product[] {
  const start = (page - 1) * pageSize;
  return allProducts.slice(start, start + pageSize);
}
console.log("Page 1:", getProductPage(products).map((p) => p.name));
console.log("Page 2:", getProductPage(products, 2).map((p) => p.name));

// Real-world example — calculate shipping cost with default carrier
function calculateShipping(
  weightKg: number,
  destinationCountry: string = "US",
  carrier: string = "Standard"
): number {
  const rates: Record<string, Record<string, number>> = {
    US: { Standard: 5.99, Express: 14.99 },
    CA: { Standard: 9.99, Express: 19.99 },
  };
  return rates[destinationCountry]?.[carrier] ?? 24.99;
}
console.log("Shipping US Standard:", calculateShipping(1.5));
console.log("Shipping CA Express:", calculateShipping(1.5, "CA", "Express"));

// =====================================
// SECTION 6 — REST PARAMETERS
// =====================================
// WHAT  : Collects all remaining arguments into a typed array.
//         There can only be ONE rest parameter and it must be LAST.
// WHY   : Replaces the untyped `arguments` object from JavaScript and clearly
//         communicates "this function accepts any number of these."
// SYNTAX: function fn(...items: Type[]): ReturnType

// Simple example
function joinStrings(separator: string, ...words: string[]): string {
  return words.join(separator);
}
console.log(joinStrings(", ", "apple", "banana", "cherry")); // apple, banana, cherry

// Practical example — add multiple items to cart
interface CartItem {
  productId: number;
  quantity: number;
}

function addItemsToCart(cartId: string, ...items: CartItem[]): string {
  const summary = items.map((i) => `product #${i.productId} x${i.quantity}`).join(", ");
  return `Cart ${cartId}: added ${summary}`;
}
console.log(addItemsToCart("CART-1", { productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }));

// Real-world example — bulk update order statuses
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

function bulkUpdateOrders(newStatus: OrderStatus, ...orderIds: string[]): void {
  orderIds.forEach((id) => {
    console.log(`Order ${id} updated to "${newStatus}"`);
  });
}
bulkUpdateOrders("shipped", "ORD-001", "ORD-002", "ORD-003");

// =====================================
// SECTION 7 — VOID RETURN TYPE
// =====================================
// WHAT  : The return type for functions that do NOT return a meaningful value.
//         The function may return `undefined` implicitly but callers should not
//         use the return value.
// WHY   : Documents intent. TypeScript will warn if you accidentally try to use
//         the result of a void function as a value.
// SYNTAX: function fn(): void { ... }

// Simple example
function logMessage(message: string): void {
  console.log(`[LOG] ${message}`);
}
logMessage("Application started");

// Practical example — record a user action for analytics
function trackEvent(eventName: string, metadata: Record<string, unknown>): void {
  console.log(`[ANALYTICS] ${eventName}`, JSON.stringify(metadata));
}
trackEvent("product_viewed", { productId: 1, userId: "U42", timestamp: Date.now() });

// Real-world example — save payment record (side-effect only)
interface PaymentRecord {
  orderId: string;
  amount: number;
  method: string;
  timestamp: Date;
}

function savePaymentRecord(record: PaymentRecord): void {
  // In a real app this would persist to a database; here we just log
  console.log(
    `[PAYMENT] Saved: Order ${record.orderId} — $${record.amount} via ${record.method} at ${record.timestamp.toISOString()}`
  );
}
savePaymentRecord({ orderId: "ORD-001", amount: 89.97, method: "credit_card", timestamp: new Date() });

// =====================================
// SECTION 8 — NEVER RETURN TYPE
// =====================================
// WHAT  : The return type for functions that NEVER successfully return —
//         they always throw an error or run an infinite loop.
//         `never` is a bottom type: no value can be assigned to it.
// WHY   : Lets TypeScript know a code path is unreachable. Enables exhaustive
//         checks in switch statements (if you forget a case, the compiler
//         complains because the value would be assignable to `never`).
// SYNTAX: function fn(): never { throw new Error(...); }

// Simple example — always-throw helper
function fail(message: string): never {
  throw new Error(message);
}

// Practical example — validated accessor (throws on bad input)
function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    // We intentionally return the result of `fail` so TypeScript knows
    // the function exits here — no extra return needed.
    return fail(`Environment variable "${key}" is not set`);
  }
  return value;
}

try {
  const dbUrl = getEnvVariable("DATABASE_URL");
  console.log("DB URL:", dbUrl);
} catch (e) {
  console.log("Caught expected error:", (e as Error).message);
}

// Real-world example — exhaustive status handler
function handleOrderStatus(status: OrderStatus): string {
  switch (status) {
    case "pending":     return "Your order is awaiting confirmation.";
    case "processing":  return "Your order is being prepared.";
    case "shipped":     return "Your order is on its way!";
    case "delivered":   return "Your order has been delivered.";
    case "cancelled":   return "Your order has been cancelled.";
    default:
      // If a new status is added to the union but not handled here,
      // TypeScript will error because `status` is no longer `never`.
      return fail(`Unhandled order status: ${status}`);
  }
}
console.log(handleOrderStatus("shipped")); // Your order is on its way!

// =====================================
// SECTION 9 — FUNCTION OVERLOADS
// =====================================
// WHAT  : Multiple function signatures for the SAME function name, followed by
//         a SINGLE implementation signature that handles all cases.
//         The overload signatures are what callers see; the implementation is
//         internal.
// WHY   : Some functions legitimately accept different argument shapes and
//         return different types depending on input. Overloads document each
//         valid call shape explicitly rather than using confusing union types.
// SYNTAX:
//   function fn(a: string): string;         // overload 1
//   function fn(a: number): number;         // overload 2
//   function fn(a: string | number): string | number { ... }  // implementation

// Simple example — parse a value as either a number or a Date
function parseValue(value: string): number;
function parseValue(value: number): string;
function parseValue(value: string | number): number | string {
  if (typeof value === "string") return parseFloat(value);
  return value.toString();
}
console.log("parseValue('3.14'):", parseValue("3.14")); // 3.14  (number)
console.log("parseValue(42):", parseValue(42));          // "42"  (string)

// Practical example — find a product by id (number) or name (string)
function findProduct(id: number): Product | undefined;
function findProduct(name: string): Product[];
function findProduct(query: number | string): Product | undefined | Product[] {
  if (typeof query === "number") {
    return products.find((p) => p.id === query);
  }
  return products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
}
console.log("findProduct(1):", findProduct(1));
console.log("findProduct('shoes'):", findProduct("shoes"));

// Real-world example — create a user session token with overloads
interface UserSession {
  token: string;
  expiresAt: Date;
  userId: string;
}

function createSession(userId: string): UserSession;
function createSession(userId: string, ttlSeconds: number): UserSession;
function createSession(userId: string, ttlSeconds: number = 3600): UserSession {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  const token = `tok_${userId}_${Date.now()}`;
  return { token, expiresAt, userId };
}

const session1 = createSession("U42");
const session2 = createSession("U43", 7200);
console.log("Session 1 token:", session1.token);
console.log("Session 2 expires:", session2.expiresAt.toISOString());

// =====================================
// SECTION 10 — GENERIC FUNCTIONS
// =====================================
// WHAT  : Functions parameterised by a TYPE variable (written as <T>).
//         The type variable is resolved at the call site, giving you
//         full type safety without duplicating code for every type.
// WHY   : Avoids the loss of type information that comes with `any`.
//         A generic function lets the compiler track types through
//         transformations and return the correct type automatically.
// SYNTAX: function identity<T>(arg: T): T { return arg; }

// Simple example — identity function
function identity<T>(arg: T): T {
  return arg;
}
console.log("identity(42):", identity(42));           // number
console.log("identity('hi'):", identity("hi"));       // string

// Practical example — first item of any array
function firstItem<T>(arr: T[]): T | undefined {
  return arr[0];
}
console.log("First product:", firstItem(products)?.name);
console.log("First number:", firstItem([10, 20, 30]));

// Practical example — wrap a value in an API response shape
interface ApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: string;
}

function createApiResponse<T>(data: T, success: boolean = true): ApiResponse<T> {
  return { data, success, timestamp: new Date().toISOString() };
}

const productResponse = createApiResponse(products[0]);
const errorResponse = createApiResponse<string>("Not found", false);
console.log("API response product:", productResponse.data.name);
console.log("API error response:", errorResponse.data);

// Real-world example — generic cart that works with any item type
function filterByPrice<T extends { price: number }>(
  items: T[],
  maxPrice: number
): T[] {
  return items.filter((item) => item.price <= maxPrice);
}

console.log(
  "Products under $100:",
  filterByPrice(products, 100).map((p) => p.name)
);

// =====================================
// SECTION 11 — CALLBACK FUNCTION TYPES
// =====================================
// WHAT  : Typing a function parameter that is itself a function (a callback).
// WHY   : Without explicit callback types, TypeScript cannot verify that the
//         callback receives the correct arguments or returns the right type.
//         Typed callbacks catch misuse at compile time.
// SYNTAX: function fn(callback: (arg: Type) => ReturnType): void

// Simple example
function processNumber(value: number, callback: (result: number) => void): void {
  const result = value * 2;
  callback(result);
}
processNumber(21, (r) => console.log("Processed:", r)); // 42

// Practical example — map over products with a typed transformer
function transformProducts<T>(
  items: Product[],
  transformer: (product: Product) => T
): T[] {
  return items.map(transformer);
}

const productNames = transformProducts(products, (p) => p.name);
const discountedPrices = transformProducts(products, (p) => ({
  name: p.name,
  salePrice: applyDiscount(p.price, 15),
}));
console.log("Product names:", productNames);
console.log("Discounted prices:", discountedPrices);

// Real-world example — async-style order processor with success/error callbacks
type SuccessCallback = (orderId: string) => void;
type ErrorCallback = (error: string) => void;

function processOrder(
  order: Order,
  onSuccess: SuccessCallback,
  onError: ErrorCallback
): void {
  if (order.total <= 0) {
    onError(`Invalid total for order ${order.orderId}`);
    return;
  }
  // Simulate processing
  console.log(`Processing order ${order.orderId}...`);
  onSuccess(order.orderId);
}

processOrder(
  { orderId: "ORD-010", total: 149.99, userId: "U42" },
  (id) => console.log(`Order ${id} successfully processed`),
  (err) => console.log(`Error: ${err}`)
);

processOrder(
  { orderId: "ORD-011", total: -5, userId: "U43" },
  (id) => console.log(`Order ${id} successfully processed`),
  (err) => console.log(`Error: ${err}`)
);

// =====================================
// SECTION 12 — HIGHER-ORDER FUNCTIONS
// =====================================
// WHAT  : Functions that either TAKE a function as an argument OR
//         RETURN a function as their result (or both).
// WHY   : Core to functional programming patterns: composition, currying,
//         middleware pipelines, factory functions. TypeScript ensures that
//         both the input function and the returned function are correctly typed.

// Simple example — function factory (returns a function)
function createMultiplier(factor: number): (value: number) => number {
  return (value) => value * factor;
}
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);
console.log("triple(7):", triple(7));      // 21
console.log("quadruple(7):", quadruple(7)); // 28

// Practical example — compose two transformers
type Transformer<T> = (value: T) => T;

function compose<T>(first: Transformer<T>, second: Transformer<T>): Transformer<T> {
  return (value) => second(first(value));
}

const addTax = (price: number): number => parseFloat((price * 1.08).toFixed(2));
const roundUp = (price: number): number => Math.ceil(price);

const finalPrice = compose(addTax, roundUp);
console.log("Final price for $29.99:", finalPrice(29.99)); // 33

// Real-world example — middleware-style authentication wrapper
type RequestHandler = (userId: string, payload: unknown) => string;

function withAuthentication(handler: RequestHandler): RequestHandler {
  return (userId, payload) => {
    if (!userId || userId.trim() === "") {
      return "401: Unauthorized — missing user ID";
    }
    console.log(`[AUTH] Authenticated request from ${userId}`);
    return handler(userId, payload);
  };
}

function updateCartHandler(userId: string, payload: unknown): string {
  return `Cart updated for user ${userId} with data: ${JSON.stringify(payload)}`;
}

const secureUpdateCart = withAuthentication(updateCartHandler);
console.log(secureUpdateCart("U42", { productId: 2, quantity: 1 }));
console.log(secureUpdateCart("", { productId: 2, quantity: 1 }));

// =====================================
// SECTION 13 — DESTRUCTURED PARAMETERS WITH TYPES
// =====================================
// WHAT  : Destructuring an object or array directly in a function's parameter
//         list, with inline type annotations for the extracted values.
// WHY   : Named parameters make call sites self-documenting and eliminate
//         argument-order bugs. TypeScript verifies the shape of the passed
//         object, catching typos in property names at compile time.
// SYNTAX: function fn({ prop1, prop2 }: { prop1: Type; prop2: Type }): ReturnType

// Simple example — named config object
function createButton({
  label,
  color = "blue",
  disabled = false,
}: {
  label: string;
  color?: string;
  disabled?: boolean;
}): string {
  return `<button color="${color}" disabled="${disabled}">${label}</button>`;
}
console.log(createButton({ label: "Buy Now" }));
console.log(createButton({ label: "Checkout", color: "green", disabled: false }));

// Practical example — register user with destructured input
interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  role?: "customer" | "admin";
}

function registerUser({ email, password, fullName, role = "customer" }: RegisterInput): string {
  if (!validateCredentials(email, password)) {
    return "Registration failed: invalid email or weak password";
  }
  const username = createUsername(fullName);
  return `User registered — username: ${username}, email: ${email}, role: ${role}`;
}

console.log(registerUser({ email: "bob@example.com", password: "Secure1234", fullName: "Bob Marley" }));
console.log(registerUser({ email: "bad", password: "123", fullName: "Eve" }));

// Real-world example — place an order with a destructured order request
interface OrderRequest {
  userId: string;
  items: CartItem[];
  promoCode?: string;
  shippingCountry?: string;
}

function placeOrder({
  userId,
  items,
  promoCode,
  shippingCountry = "US",
}: OrderRequest): Order {
  const baseTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const discountedTotal = promoCode ? applyDiscount(baseTotal, 10) : baseTotal;
  const shipping = calculateShipping(1, shippingCountry);
  const finalTotal = parseFloat((discountedTotal + shipping).toFixed(2));

  const orderId = `ORD-${Date.now()}`;
  console.log(`Order placed for user ${userId}: $${finalTotal} (shipping to ${shippingCountry})`);
  return { orderId, total: finalTotal, userId };
}

placeOrder({
  userId: "U42",
  items: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }],
  promoCode: "SAVE10",
  shippingCountry: "CA",
});

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

console.log("\n--- JS vs TS Comparison ---");

// JavaScript — no type safety
// function jsCalculateTotal(items, taxRate) {
//   return items.reduce((sum, item) => sum + item.price * item.qty, 0) * (1 + taxRate);
// }
// jsCalculateTotal([{price: "10", qty: 2}], "0.1");  // NaN — no error thrown

// TypeScript — compile-time safety
interface LineItem {
  price: number;
  qty: number;
}

function tsCalculateTotal(items: LineItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return parseFloat((subtotal * (1 + taxRate)).toFixed(2));
}
// tsCalculateTotal([{price: "10", qty: 2}], 0.1);  // ERROR at compile time
console.log("Total with tax:", tsCalculateTotal([{ price: 10, qty: 2 }], 0.08)); // 21.6

// =====================================
// COMMON MISTAKES
// =====================================

console.log("\n--- Common Mistakes ---");

// MISTAKE 1: Forgetting the return type annotation on a public function
// Bad:
function getBadPrice(base: number) {
  // TypeScript infers `number` here, but if you accidentally return a string
  // in one branch, inference can silently widen the return type.
  return base + 0;
}
// Good: annotate explicitly
function getGoodPrice(base: number): number {
  return base + 0;
}
console.log("Good price:", getGoodPrice(99));

// MISTAKE 2: Using `any` to avoid typing a callback
// Bad:
function badProcess(callback: any): void {
  callback(42, "extra arg"); // no error even if callback only accepts 1 arg
}
// Good: type the callback precisely
function goodProcess(callback: (value: number) => void): void {
  callback(42);
}
goodProcess((v) => console.log("Processed value:", v));

// MISTAKE 3: Optional parameter before required parameter (TypeScript error)
// Bad:
// function badOrder(optional?: string, required: string): void {}  // ERROR
// Good: optional always comes after required
function goodOrder(required: string, optional?: string): void {
  console.log(required, optional ?? "(none)");
}
goodOrder("hello");
goodOrder("hello", "world");

// MISTAKE 4: Ignoring `undefined` for optional parameters
// Bad (runtime crash risk):
function badGreet(name?: string): string {
  // return `Hello, ${name.toUpperCase()}`; // ERROR: name is possibly undefined
  return `Hello, ${name?.toUpperCase() ?? "stranger"}`;
}
// Good: guard against undefined
function safeGreet(name?: string): string {
  return `Hello, ${name !== undefined ? name.toUpperCase() : "Stranger"}`;
}
console.log(badGreet());           // Hello, stranger
console.log(safeGreet("alice"));   // Hello, ALICE

// =====================================
// BEST PRACTICES
// =====================================

console.log("\n--- Best Practices ---");

// 1. Always annotate parameters and return types for PUBLIC functions
//    (functions exported or part of an API surface).
export function publicSearch(query: string, limit: number = 10): Product[] {
  return products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, limit);
}

// 2. Let TypeScript INFER return types for simple private/local helpers.
//    The inferred type is visible via IDE hover and equally type-safe.
const sumPrices = (items: Product[]) => items.reduce((s, p) => s + p.price, 0);
console.log("Sum of all prices:", sumPrices(products));

// 3. Prefer named function types (type aliases) for reusable callback shapes.
type SortComparator<T> = (a: T, b: T) => number;
const byPriceAsc: SortComparator<Product> = (a, b) => a.price - b.price;
const byPriceDesc: SortComparator<Product> = (a, b) => b.price - a.price;

console.log("Cheapest first:", [...products].sort(byPriceAsc).map((p) => `${p.name}($${p.price})`));
console.log("Priciest first:", [...products].sort(byPriceDesc).map((p) => `${p.name}($${p.price})`));

// 4. Use generics instead of `any` to preserve type information.
function safeFirst<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}
const firstProduct = safeFirst(products); // type: Product | undefined
console.log("Safe first:", firstProduct?.name);

// 5. Use destructured object parameters for functions with 3+ parameters
//    to improve call-site readability and allow adding parameters non-breakingly.
function createOrder({
  userId,
  productId,
  quantity,
  coupon = "",
}: {
  userId: string;
  productId: number;
  quantity: number;
  coupon?: string;
}): string {
  return `Order: user=${userId}, product=${productId}, qty=${quantity}, coupon="${coupon}"`;
}
console.log(createOrder({ userId: "U1", productId: 2, quantity: 3 }));

// =====================================
// INTERVIEW QUESTIONS & ANSWERS
// =====================================

/*
Q1: What is the difference between `void` and `never` as return types?
A:  `void` means the function completes normally but returns no meaningful value
    (it implicitly returns `undefined`). `never` means the function NEVER returns
    at all — it always throws an exception or enters an infinite loop. A `never`
    function's return type is the bottom type: nothing is assignable to it.

Q2: When should you use function overloads vs a union-type parameter?
A:  Use overloads when the return type differs based on the argument type, or
    when you need to document distinct valid call signatures (e.g., string input
    returns string[], number input returns a single item). Use union parameters
    when the function uniformly accepts multiple types and always returns the same
    type, keeping the implementation simpler.

Q3: What is the difference between a generic function and a function that uses `any`?
A:  A generic function preserves and propagates the specific type through the
    function — the compiler tracks that the output type relates to the input type.
    Using `any` discards type information entirely: the return type becomes `any`,
    breaking downstream type checking. Generics provide the flexibility of `any`
    without sacrificing safety.

Q4: Can an optional parameter appear before a required parameter?
A:  No. TypeScript (and JavaScript) require optional parameters to appear AFTER
    all required parameters in the parameter list. If you need an "optional"
    argument early, either use function overloads, pass `undefined` explicitly,
    or restructure as a single options object with optional properties.
*/

// =====================================
// PRACTICE TASKS
// =====================================

/*
TASK 1 — Product Discount Engine
  Write a generic function `applyTransformation<T extends { price: number }>(
    items: T[], transform: (item: T) => T
  ): T[]`
  that applies a transformation to every item and returns the modified array.
  Use it to:
  a) Apply a 20% discount to all Electronics products.
  b) Apply a $5 flat reduction to all Clothing products.
  Verify the output with console.log.

TASK 2 — Authenticated Order Placement
  Create a higher-order function `withRateLimit(maxPerMinute: number, handler: RequestHandler): RequestHandler`
  that wraps any RequestHandler and rejects calls (returning "429: Too Many Requests")
  once `maxPerMinute` calls have been made in the same minute.
  Use it to protect the `updateCartHandler` defined earlier.
  Test it by calling the wrapped handler more times than the limit allows.

TASK 3 — Overloaded Payment Calculator
  Write a function `calculatePayment` with two overloads:
    - (orderId: string) => number   — looks up the order total from a local map and returns it.
    - (amount: number, method: "card" | "wallet") => number — applies a 1.5% surcharge for "card"
      or no surcharge for "wallet", returning the final charge.
  Implement both cases in the single implementation signature.
  Demonstrate both call patterns with console.log.
*/

console.log("\n04-functions.ts loaded successfully.");
