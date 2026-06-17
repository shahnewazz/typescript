// =====================================
// UNION AND INTERSECTION TYPES IN TYPESCRIPT
// =====================================
// Target: JavaScript developers learning TypeScript from scratch
// Topic: Union (A | B) and Intersection (A & B) types
// =====================================

// =====================================
// PART 1: UNION TYPES
// =====================================

// =====================================
// 1.1 WHAT ARE UNION TYPES?
// =====================================
// A union type means a value can be ONE of several types.
// Think of it as "either/or" — the value can be type A OR type B.
// Syntax: TypeA | TypeB
//
// WHY IT EXISTS:
// In JavaScript, functions often accept multiple types of values.
// Union types let you express that flexibility in a type-safe way
// without losing all type information.

// =====================================
// 1.2 BASIC UNION: string | number
// =====================================

// JavaScript (no type safety):
// function formatId(id) {
//   return "ID-" + id;
// }

// TypeScript equivalent:
function formatId(id: string | number): string {
  return "ID-" + id;
}

console.log(formatId(101));       // "ID-101"
console.log(formatId("abc-99")); // "ID-abc-99"

// A variable can also hold a union type:
let userId: string | number;
userId = 42;
userId = "user_xyz";
// userId = true; // Error: boolean is not assignable to string | number

// Practical example — database ID that can come from different sources:
function getUserById(id: string | number): string {
  if (typeof id === "number") {
    return `Fetching user with numeric ID: ${id}`;
  }
  return `Fetching user with string ID: ${id}`;
}

console.log(getUserById(7));
console.log(getUserById("usr_a3b7"));

// =====================================
// 1.3 UNION WITH LITERAL TYPES
// =====================================
// Literal types restrict a value to an exact set of allowed values.
// Union of literals is extremely useful for known finite sets.

// WHY IT EXISTS:
// Instead of using plain string (which allows any string), you can
// lock the value to only the strings that make sense in your domain.

type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "crypto";

function processPayment(amount: number, method: PaymentMethod): string {
  return `Processing $${amount} via ${method}`;
}

console.log(processPayment(99.99, "paypal"));
console.log(processPayment(250, "crypto"));
// processPayment(50, "venmo"); // Error: "venmo" is not a valid PaymentMethod

// Practical example — order status tracking:
type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

function getStatusMessage(status: OrderStatus): string {
  switch (status) {
    case "pending":    return "Your order is awaiting confirmation.";
    case "confirmed":  return "Order confirmed! We are preparing it.";
    case "processing": return "Your order is being processed.";
    case "shipped":    return "Your order is on the way!";
    case "delivered":  return "Your order has been delivered.";
    case "cancelled":  return "Your order has been cancelled.";
    case "refunded":   return "Your refund has been processed.";
  }
}

console.log(getStatusMessage("shipped"));
console.log(getStatusMessage("delivered"));

// =====================================
// 1.4 UNION OF OBJECT TYPES
// =====================================
// Union types work with objects too. The value can be one of
// several object shapes.

type CreditCardPayment = {
  method: "credit_card";
  cardNumber: string;
  cvv: string;
  expiryDate: string;
};

type PaypalPayment = {
  method: "paypal";
  email: string;
};

type CryptoPayment = {
  method: "crypto";
  walletAddress: string;
  currency: string;
};

// Union of the above object types:
type PaymentDetails = CreditCardPayment | PaypalPayment | CryptoPayment;

// When using a union of objects, TypeScript only allows access to
// properties that exist on ALL members (the common properties).
function logPaymentMethod(payment: PaymentDetails): void {
  console.log("Payment method used:", payment.method);
  // console.log(payment.email); // Error: 'email' may not exist on CreditCardPayment
}

const myPayment: PaymentDetails = {
  method: "paypal",
  email: "user@example.com",
};

logPaymentMethod(myPayment);

// =====================================
// 1.5 DISCRIMINATED UNIONS
// =====================================
// A discriminated union is a union where each member has a common
// "discriminant" property — a literal type — that uniquely identifies
// which variant it is. This is the most powerful pattern in TypeScript.
//
// WHY IT EXISTS:
// When you have a union of object types, TypeScript can use the
// discriminant property to narrow the type within if/switch blocks,
// giving you full type safety for each variant.
//
// Common discriminant property names: "kind", "type", "tag", "status"

// Real-world example: API state machine
type ApiState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string; code: number };

function renderApiState(state: ApiState<string[]>): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      // TypeScript knows state.data is string[] here
      return `Items: ${state.data.join(", ")}`;
    case "error":
      // TypeScript knows state.message and state.code are available here
      return `Error ${state.code}: ${state.message}`;
  }
}

const loadingState: ApiState<string[]> = { status: "loading" };
const successState: ApiState<string[]> = { status: "success", data: ["Apple", "Banana", "Cherry"] };
const errorState: ApiState<string[]> = { status: "error", message: "Not Found", code: 404 };

console.log(renderApiState(loadingState));
console.log(renderApiState(successState));
console.log(renderApiState(errorState));

// Discriminated union for authentication state:
type AuthState =
  | { kind: "unauthenticated" }
  | { kind: "authenticating"; progress: number }
  | { kind: "authenticated"; userId: string; token: string; role: "admin" | "user" }
  | { kind: "error"; reason: string };

function describeAuthState(state: AuthState): string {
  switch (state.kind) {
    case "unauthenticated":
      return "Please log in.";
    case "authenticating":
      return `Logging in... ${state.progress}% complete`;
    case "authenticated":
      return `Welcome, user ${state.userId} (${state.role})`;
    case "error":
      return `Authentication failed: ${state.reason}`;
  }
}

console.log(describeAuthState({ kind: "unauthenticated" }));
console.log(describeAuthState({ kind: "authenticating", progress: 75 }));
console.log(describeAuthState({ kind: "authenticated", userId: "u42", token: "tok_abc", role: "admin" }));
console.log(describeAuthState({ kind: "error", reason: "Invalid credentials" }));

// Redux-like action discriminated union:
type CartAction =
  | { type: "ADD_ITEM";    payload: { productId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: { code: string } };

function cartReducer(state: string[], action: CartAction): string[] {
  switch (action.type) {
    case "ADD_ITEM":
      console.log(`Adding ${action.payload.quantity}x product ${action.payload.productId}`);
      return [...state, action.payload.productId];
    case "REMOVE_ITEM":
      console.log(`Removing product ${action.payload.productId}`);
      return state.filter(id => id !== action.payload.productId);
    case "CLEAR_CART":
      console.log("Clearing cart");
      return [];
    case "APPLY_COUPON":
      console.log(`Applying coupon: ${action.payload.code}`);
      return state;
  }
}

let cart: string[] = [];
cart = cartReducer(cart, { type: "ADD_ITEM", payload: { productId: "prod_1", quantity: 2 } });
cart = cartReducer(cart, { type: "ADD_ITEM", payload: { productId: "prod_2", quantity: 1 } });
cart = cartReducer(cart, { type: "REMOVE_ITEM", payload: { productId: "prod_1" } });
console.log("Cart contents:", cart);

// =====================================
// 1.6 NARROWING UNION TYPES
// =====================================
// TypeScript narrows a union type when you add conditional checks.
// Inside the branch, TypeScript knows the exact type.
//
// THREE MAIN NARROWING TECHNIQUES:
// 1. typeof   — for primitives (string, number, boolean, etc.)
// 2. instanceof — for class instances
// 3. in operator — for checking if a property exists on an object

// --- typeof narrowing ---
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows value is string here
  }
  if (typeof value === "number") {
    return value.toFixed(2);   // TypeScript knows value is number here
  }
  return value ? "YES" : "NO"; // TypeScript knows value is boolean here
}

console.log(formatValue("hello"));    // "HELLO"
console.log(formatValue(3.14159));   // "3.14"
console.log(formatValue(true));      // "YES"

// --- instanceof narrowing ---
class BankTransfer {
  constructor(public fromAccount: string, public toAccount: string, public amount: number) {}
  describe(): string {
    return `Transfer $${this.amount} from ${this.fromAccount} to ${this.toAccount}`;
  }
}

class CardPayment {
  constructor(public cardLast4: string, public amount: number) {}
  describe(): string {
    return `Card payment of $${this.amount} with card ending in ${this.cardLast4}`;
  }
}

type Transaction = BankTransfer | CardPayment;

function describeTransaction(tx: Transaction): string {
  if (tx instanceof BankTransfer) {
    // TypeScript knows tx is BankTransfer here
    return tx.describe();
  }
  // TypeScript knows tx is CardPayment here
  return tx.describe();
}

const tx1 = new BankTransfer("ACC-001", "ACC-002", 500);
const tx2 = new CardPayment("4242", 99.99);
console.log(describeTransaction(tx1));
console.log(describeTransaction(tx2));

// --- in operator narrowing ---
type DigitalProduct = {
  name: string;
  downloadUrl: string;
  fileSize: number;
};

type PhysicalProduct = {
  name: string;
  weight: number;
  shippingClass: string;
};

type Product = DigitalProduct | PhysicalProduct;

function getShippingInfo(product: Product): string {
  if ("downloadUrl" in product) {
    // TypeScript knows product is DigitalProduct here
    return `Digital product — download at: ${product.downloadUrl}`;
  }
  // TypeScript knows product is PhysicalProduct here
  return `Physical product — ships via ${product.shippingClass} (${product.weight}kg)`;
}

const ebook: Product = { name: "TypeScript Mastery", downloadUrl: "https://cdn.example.com/ts.pdf", fileSize: 5 };
const laptop: Product = { name: "ThinkPad X1", weight: 1.4, shippingClass: "standard" };

console.log(getShippingInfo(ebook));
console.log(getShippingInfo(laptop));

// =====================================
// 1.7 EXHAUSTIVE CHECKING WITH never
// =====================================
// After narrowing all known variants of a union, what's left should be
// type never (impossible). If TypeScript shows an error that you're
// assigning to never, it means you missed a case — a compile-time safety net.
//
// WHY IT EXISTS:
// As your codebase grows, union types gain new members. Exhaustive
// checking ensures every switch/if chain handles the new case.

type Shape =
  | { kind: "circle";    radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle";  base: number; height: number };

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      // If you add a new shape to the union but forget to add a case here,
      // TypeScript will error: "Argument of type '...' is not assignable to 'never'"
      return assertNever(shape);
  }
}

console.log(calculateArea({ kind: "circle", radius: 5 }));              // ~78.54
console.log(calculateArea({ kind: "rectangle", width: 4, height: 6 })); // 24
console.log(calculateArea({ kind: "triangle", base: 3, height: 8 }));   // 12

// =====================================
// PART 2: INTERSECTION TYPES
// =====================================

// =====================================
// 2.1 WHAT ARE INTERSECTION TYPES?
// =====================================
// An intersection type combines multiple types into one.
// The result must satisfy ALL of the combined types simultaneously.
// Think of it as "and" — the value must be type A AND type B.
// Syntax: TypeA & TypeB
//
// WHY IT EXISTS:
// When you want a value that has the properties of multiple types
// merged together, intersection types let you compose types without
// duplicating property definitions.

// =====================================
// 2.2 COMBINING OBJECT TYPES: User & Admin
// =====================================

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type Admin = {
  adminLevel: 1 | 2 | 3;
  permissions: string[];
  canDeleteUsers: boolean;
};

// Intersection: AdminUser must have ALL properties from both User and Admin
type AdminUser = User & Admin;

const adminUser: AdminUser = {
  id: "usr_001",
  name: "Alice Chen",
  email: "alice@company.com",
  createdAt: new Date("2023-01-15"),
  adminLevel: 2,
  permissions: ["read", "write", "delete"],
  canDeleteUsers: true,
};

function printAdminProfile(admin: AdminUser): void {
  console.log(`Admin: ${admin.name} (Level ${admin.adminLevel})`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Permissions: ${admin.permissions.join(", ")}`);
  console.log(`  Can delete users: ${admin.canDeleteUsers}`);
}

printAdminProfile(adminUser);

// =====================================
// 2.3 MERGING INTERFACES VIA INTERSECTION
// =====================================
// You can also use intersection to merge existing interface definitions.

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletable {
  deletedAt: Date | null;
  isDeleted: boolean;
}

interface BaseProduct {
  id: string;
  name: string;
  price: number;
  sku: string;
}

// A fully-featured product type merges all three:
type FullProduct = BaseProduct & Timestamped & SoftDeletable;

const product: FullProduct = {
  id: "prod_abc",
  name: "Wireless Headphones",
  price: 149.99,
  sku: "WH-BLK-001",
  createdAt: new Date("2024-03-01"),
  updatedAt: new Date("2024-06-10"),
  deletedAt: null,
  isDeleted: false,
};

console.log(`Product: ${product.name} — $${product.price} (SKU: ${product.sku})`);
console.log(`Created: ${product.createdAt.toDateString()}, Deleted: ${product.isDeleted}`);

// =====================================
// 2.4 INTERSECTION WITH OPTIONAL PROPERTIES
// =====================================
// Optional properties in one type remain optional in the intersection.

type ProductBase = {
  id: string;
  name: string;
  price: number;
};

type ProductVariants = {
  variants?: {
    color?: string;
    size?: string;
    material?: string;
  };
  inStock?: boolean;
};

type ProductWithVariants = ProductBase & ProductVariants;

const simpleProduct: ProductWithVariants = {
  id: "prod_001",
  name: "Plain T-Shirt",
  price: 19.99,
};

const variantProduct: ProductWithVariants = {
  id: "prod_002",
  name: "Premium Hoodie",
  price: 79.99,
  variants: {
    color: "Navy Blue",
    size: "L",
    material: "Cotton-Poly Blend",
  },
  inStock: true,
};

console.log(`${simpleProduct.name}: $${simpleProduct.price} (variants: ${simpleProduct.variants ?? "none"})`);
console.log(`${variantProduct.name}: $${variantProduct.price}, Color: ${variantProduct.variants?.color}`);

// =====================================
// 2.5 DIFFERENCE BETWEEN extends AND intersection (&)
// =====================================
// Both let you build on existing types, but they differ in important ways.
//
// INTERFACE EXTENDS:
// - Only works with interfaces (and classes)
// - Stricter: a property in the child cannot redefine the parent property
//   with an incompatible type — TypeScript will error
// - More explicit, better tooling/error messages in some IDEs
//
// INTERSECTION (&):
// - Works with any types (interfaces, type aliases, primitives, etc.)
// - More flexible: compatible with generics and conditional types
// - If two merged types have the same property with conflicting types,
//   the result is never for that property (a common gotcha!)

// Using extends:
interface Vehicle {
  brand: string;
  speed: number;
}

interface ElectricVehicle extends Vehicle {
  batteryCapacity: number;
  chargingTime: number;
}

// Using intersection:
type Gasoline = { brand: string; speed: number };
type Electric = { batteryCapacity: number; chargingTime: number };
type ElectricCar = Gasoline & Electric;

const tesla: ElectricCar = {
  brand: "Tesla",
  speed: 250,
  batteryCapacity: 100,
  chargingTime: 30,
};

console.log(`${tesla.brand} — top speed: ${tesla.speed}km/h, battery: ${tesla.batteryCapacity}kWh`);

// GOTCHA: Conflicting property types in intersection result in never
type A = { value: string };
type B = { value: number };
type C = A & B;
// C.value is now (string & number) which equals never
// This means you CANNOT create a valid object of type C
// const badObj: C = { value: "hello" }; // Error
// const badObj2: C = { value: 42 };     // Also Error

// =====================================
// PART 3: PRACTICAL PATTERNS
// =====================================

// =====================================
// 3.1 API STATE PATTERN (loading | success | error)
// =====================================
// A very common and powerful real-world use of discriminated unions
// is modeling async API call states.

type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; timestamp: number }
  | { status: "error"; message: string; retryable: boolean };

type Order = {
  orderId: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
};

function renderOrderState(state: FetchState<Order>): void {
  switch (state.status) {
    case "idle":
      console.log("[UI] Awaiting fetch trigger...");
      break;
    case "loading":
      console.log("[UI] Spinner visible — loading order...");
      break;
    case "success":
      const { orderId, total, status, paymentMethod } = state.data;
      console.log(`[UI] Order ${orderId} — $${total} — ${status} — paid via ${paymentMethod}`);
      console.log(`[UI] Data fetched at: ${new Date(state.timestamp).toISOString()}`);
      break;
    case "error":
      console.log(`[UI] Error: ${state.message} ${state.retryable ? "(tap to retry)" : "(contact support)"}`);
      break;
  }
}

renderOrderState({ status: "idle" });
renderOrderState({ status: "loading" });
renderOrderState({
  status: "success",
  data: { orderId: "ORD-9001", total: 189.50, status: "shipped", paymentMethod: "credit_card" },
  timestamp: Date.now(),
});
renderOrderState({ status: "error", message: "Order not found", retryable: false });

// =====================================
// 3.2 DISCRIMINATED UNIONS FOR ACTIONS (Redux-like pattern)
// =====================================
// Each action has a unique 'type' literal. The reducer switches on it.

type CheckoutAction =
  | { type: "SET_PAYMENT_METHOD"; method: PaymentMethod }
  | { type: "SET_SHIPPING_ADDRESS"; address: { street: string; city: string; zip: string } }
  | { type: "APPLY_DISCOUNT"; discountPercent: number }
  | { type: "SUBMIT_ORDER" }
  | { type: "RESET" };

type CheckoutState = {
  paymentMethod: PaymentMethod | null;
  shippingAddress: { street: string; city: string; zip: string } | null;
  discountPercent: number;
  submitted: boolean;
};

const initialCheckoutState: CheckoutState = {
  paymentMethod: null,
  shippingAddress: null,
  discountPercent: 0,
  submitted: false,
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.method };
    case "SET_SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.address };
    case "APPLY_DISCOUNT":
      return { ...state, discountPercent: action.discountPercent };
    case "SUBMIT_ORDER":
      return { ...state, submitted: true };
    case "RESET":
      return initialCheckoutState;
  }
}

let checkoutState = initialCheckoutState;
checkoutState = checkoutReducer(checkoutState, { type: "SET_PAYMENT_METHOD", method: "crypto" });
checkoutState = checkoutReducer(checkoutState, {
  type: "SET_SHIPPING_ADDRESS",
  address: { street: "123 Main St", city: "New York", zip: "10001" },
});
checkoutState = checkoutReducer(checkoutState, { type: "APPLY_DISCOUNT", discountPercent: 15 });
checkoutState = checkoutReducer(checkoutState, { type: "SUBMIT_ORDER" });

console.log("Checkout state:", JSON.stringify(checkoutState, null, 2));

// =====================================
// 3.3 USING INTERSECTIONS TO COMPOSE TYPES
// =====================================
// Instead of one giant type, compose smaller focused types.

type Identifiable = { id: string };
type Named       = { name: string };
type Priced      = { price: number; currency: string };
type Categorized = { category: string; tags: string[] };

// A catalog item is all four composed together:
type CatalogItem = Identifiable & Named & Priced & Categorized;

const catalogItem: CatalogItem = {
  id: "item_555",
  name: "Noise Cancelling Earbuds",
  price: 199.99,
  currency: "USD",
  category: "Electronics",
  tags: ["audio", "wireless", "noise-cancelling"],
};

function formatCatalogItem(item: CatalogItem): string {
  return `[${item.id}] ${item.name} — ${item.currency} ${item.price} | ${item.category} | ${item.tags.join(", ")}`;
}

console.log(formatCatalogItem(catalogItem));

// You can write utility functions that only care about a subset:
function printPrice(item: Identifiable & Named & Priced): void {
  console.log(`${item.name} (${item.id}): ${item.currency} ${item.price}`);
}

printPrice(catalogItem); // Works because CatalogItem satisfies the requirement

// =====================================
// PART 4: JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// JAVASCRIPT — no type safety, runtime errors possible:
// function getPaymentLabel(method) {
//   if (method === "credit_card") return "Credit Card";
//   if (method === "paypal")      return "PayPal";
//   return method; // any string passes, including typos like "credot_card"
// }

// TYPESCRIPT — compiler catches issues before runtime:
function getPaymentLabel(method: PaymentMethod): string {
  switch (method) {
    case "credit_card": return "Credit Card";
    case "debit_card":  return "Debit Card";
    case "paypal":      return "PayPal";
    case "crypto":      return "Cryptocurrency";
  }
}

console.log(getPaymentLabel("paypal"));
// getPaymentLabel("venmo"); // Compile error — not a valid PaymentMethod

// JAVASCRIPT — union semantics are invisible:
// function merge(a, b) { return { ...a, ...b }; }

// TYPESCRIPT — you know exactly what you'll get back:
function mergeUserAndAdmin(user: User, adminProps: Admin): AdminUser {
  return { ...user, ...adminProps };
}

const baseUser: User = {
  id: "u99",
  name: "Bob Smith",
  email: "bob@example.com",
  createdAt: new Date(),
};

const adminProps: Admin = {
  adminLevel: 1,
  permissions: ["read"],
  canDeleteUsers: false,
};

const newAdmin = mergeUserAndAdmin(baseUser, adminProps);
console.log(`New admin: ${newAdmin.name}, level ${newAdmin.adminLevel}`);

// =====================================
// PART 5: COMMON MISTAKES
// =====================================

// MISTAKE 1: Confusing union semantics (A OR B, not A AND B)
// Union: a value that is EITHER A or B (not both simultaneously)
// Wrong mental model: "a union type has the properties of A plus the properties of B"
// That's what INTERSECTION does!

type Cat = { meow: () => void };
type Dog = { bark: () => void };

// Union: can be either a cat OR a dog — only the common properties are safe to use
type Pet = Cat | Dog;
// const pet: Pet = { meow: () => {}, bark: () => {} }; // This actually works, but...
// pet.meow(); // Error: meow may not exist (TypeScript doesn't know which branch you're on)

// Intersection: must be BOTH a cat AND a dog — you have access to ALL properties
type CatDog = Cat & Dog;
const catdog: CatDog = { meow: () => console.log("meow"), bark: () => console.log("bark") };
catdog.meow();
catdog.bark();

// MISTAKE 2: Not narrowing before accessing union-specific properties
type StringOrArray = string | string[];

function getLength(value: StringOrArray): number {
  // WRONG: value.length — this actually works because both string and array have .length
  // But for properties that don't overlap, you must narrow first:
  if (Array.isArray(value)) {
    return value.length; // TypeScript knows it's string[] here
  }
  return value.length;   // TypeScript knows it's string here
}

console.log(getLength("hello"));           // 5
console.log(getLength(["a", "b", "c"]));  // 3

// MISTAKE 3: Intersection with conflicting property types produces never
type HasStringId = { id: string };
type HasNumberId = { id: number };
type Conflict = HasStringId & HasNumberId;
// Conflict.id is type (string & number) = never
// You CANNOT assign any value to it. Avoid conflicting property names in intersections.

// MISTAKE 4: Forgetting that union members can share properties
// If all members of a union have a common property, it's safe to access
// without narrowing (TypeScript sees the intersection of all members' properties):
type Circle    = { kind: "circle";    area: number; radius: number };
type Rectangle = { kind: "rectangle"; area: number; width: number; height: number };
type AnyShape  = Circle | Rectangle;

function showArea(shape: AnyShape): void {
  // 'area' and 'kind' exist on ALL members, so it's safe without narrowing:
  console.log(`Shape ${shape.kind} has area: ${shape.area}`);
  // shape.radius would error — only exists on Circle
}

showArea({ kind: "circle", area: 78.5, radius: 5 });
showArea({ kind: "rectangle", area: 24, width: 4, height: 6 });

// =====================================
// PART 6: BEST PRACTICES
// =====================================

// 1. USE DISCRIMINATED UNIONS for complex variant types
//    Always add a literal "type" or "kind" property as a discriminant.
//    It makes narrowing easy, exhaustive checks reliable, and code readable.

// 2. PREFER LITERAL UNIONS over plain string/number for known sets
//    Bad:  paymentMethod: string
//    Good: paymentMethod: "credit_card" | "debit_card" | "paypal" | "crypto"

// 3. USE EXHAUSTIVE CHECKING with never in switch statements
//    If you add a new union member, the compiler will tell you exactly
//    which switch/if blocks need to be updated.

// 4. COMPOSE TYPES with intersections instead of duplicating properties
//    Bad:  type AdminUser = { id: string; name: string; email: string; adminLevel: number; ... }
//    Good: type AdminUser = User & Admin

// 5. AVOID WIDE UNIONS — if your union has too many members, consider
//    a discriminated union or a more structured hierarchy.

// 6. KEEP UNION MEMBERS STRUCTURALLY CONSISTENT — each variant should
//    have the discriminant property and all required fields for that case.

// 7. USE type for unions/intersections, interface for extensible object shapes
//    type Status = "active" | "inactive"   // ✓ union — use type
//    interface User { ... }                 // ✓ object shape — use interface
//    type AdminUser = User & Admin          // ✓ composition — use type

// =====================================
// PART 7: INTERVIEW QUESTIONS & ANSWERS
// =====================================

// Q1: What is the difference between a union type and an intersection type?
// A: A union type (A | B) means the value can be EITHER type A or type B.
//    You can only safely access properties common to all members without narrowing.
//    An intersection type (A & B) means the value must satisfy BOTH types simultaneously
//    and you can access ALL properties from both types.

// Q2: What is a discriminated union and when should you use it?
// A: A discriminated union is a union of object types where each member has a
//    shared "discriminant" property with a unique literal type value (e.g., type: "circle").
//    TypeScript uses this property to narrow the type inside conditionals/switch statements.
//    Use it whenever you have a finite set of variants (API states, action types, shapes)
//    and need type-safe access to variant-specific properties.

// Q3: How do you handle exhaustive checks in a union type?
// A: Use a helper function that accepts never as its argument:
//      function assertNever(x: never): never { throw new Error("Unhandled: " + x); }
//    Place a call to assertNever in the default branch of your switch statement.
//    If a union member is not handled, TypeScript will produce a compile-time error
//    because the unhandled type is not assignable to never.

// Q4: What happens when you intersect two types that have a property with conflicting types?
// A: The conflicting property becomes type never (the intersection of incompatible types).
//    For example:  type A = { id: string }; type B = { id: number }; type C = A & B;
//    In type C, the property id is (string & number) = never, so no valid value can be
//    assigned to it. This is a common gotcha — always check for property name conflicts
//    when using intersection types.

// =====================================
// PART 8: PRACTICE TASKS
// =====================================

// TASK 1:
// Create a discriminated union type called `NotificationEvent` with three variants:
// - "email":   { recipient: string; subject: string; body: string }
// - "sms":     { phoneNumber: string; message: string }
// - "push":    { deviceToken: string; title: string; payload: object }
// Write a function `sendNotification(event: NotificationEvent): void` that logs
// the appropriate details for each notification type.
// Add exhaustive checking so adding a new type will produce a compile error.

// EXAMPLE SOLUTION (uncomment to run):
// type NotificationEvent =
//   | { channel: "email"; recipient: string; subject: string; body: string }
//   | { channel: "sms";   phoneNumber: string; message: string }
//   | { channel: "push";  deviceToken: string; title: string; payload: object };
//
// function sendNotification(event: NotificationEvent): void {
//   switch (event.channel) {
//     case "email":
//       console.log(`Sending email to ${event.recipient}: "${event.subject}"`);
//       break;
//     case "sms":
//       console.log(`Sending SMS to ${event.phoneNumber}: "${event.message}"`);
//       break;
//     case "push":
//       console.log(`Pushing to device ${event.deviceToken}: "${event.title}"`);
//       break;
//     default:
//       assertNever(event);
//   }
// }
//
// sendNotification({ channel: "email", recipient: "a@b.com", subject: "Hi", body: "Hello!" });
// sendNotification({ channel: "sms", phoneNumber: "+1234567890", message: "Your code is 1234" });
// sendNotification({ channel: "push", deviceToken: "tok_xyz", title: "Sale!", payload: {} });

// TASK 2:
// Build a type-safe product catalog using intersections.
// Define three small types: Identifiable, Reviewable, and Shippable.
// - Identifiable: { id: string; sku: string }
// - Reviewable:   { averageRating: number; reviewCount: number }
// - Shippable:    { weightKg: number; dimensionsCm: [number, number, number] }
// Create a type PhysicalCatalogProduct = Identifiable & Reviewable & Shippable & { name: string; price: number }
// Write a function that accepts a PhysicalCatalogProduct and logs a formatted summary.

// TASK 3:
// Model a payment processing workflow using discriminated unions.
// Create a PaymentState type with these variants:
// - "draft":      no extra fields
// - "pending":    { paymentId: string; method: PaymentMethod; amount: number }
// - "processing": { paymentId: string; processorRef: string }
// - "completed":  { paymentId: string; receiptUrl: string; completedAt: Date }
// - "failed":     { paymentId: string; errorCode: string; retryAllowed: boolean }
// Write a function that transitions from one state to the next (draft -> pending -> processing -> completed)
// and logs the state at each step.
