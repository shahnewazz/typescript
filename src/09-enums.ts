// =====================================
// 09 - ENUMS IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers learning TypeScript from scratch.
// This file is self-contained and fully runnable.

// =====================================
// WHAT IS AN ENUM
// =====================================

// An enum (short for "enumeration") is a named set of named constants.
//
// WHY IT EXISTS:
//   In JavaScript, developers often use plain strings or numbers as constants:
//     const status = "pending";
//     const role = 1;
//   These are error-prone — nothing stops you from typo-ing "pendign" or passing 9.
//   Enums give those values a descriptive name, a type, and autocomplete support.
//
// KEY BENEFITS:
//   - Self-documenting: OrderStatus.Shipped is clearer than the number 2
//   - Type-safe: TypeScript prevents you from passing invalid values
//   - Centralised: change one place, updated everywhere
//   - IDE autocomplete works perfectly with enums

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// --- JavaScript (before TypeScript enums) ---
// const ORDER_STATUS = {
//   PENDING: "pending",
//   SHIPPED: "shipped",
//   DELIVERED: "delivered",
// };
// function process(status) {         // No type checking
//   if (status === "shiped") { ... } // Typo compiles and runs silently!
// }

// --- TypeScript (with enums) ---
// enum OrderStatus { Pending = "pending", Shipped = "shipped" }
// function process(status: OrderStatus) { ... }  // Compiler enforces valid values
// process("shiped");  // ERROR: Argument of type '"shiped"' is not assignable

console.log("=== 09 - Enums in TypeScript ===\n");

// =====================================
// NUMERIC ENUMS
// =====================================

// WHAT IT IS:
//   The default enum type. Members are assigned integer values starting at 0,
//   auto-incrementing by 1 for each subsequent member.
//
// WHY IT EXISTS:
//   Numeric enums map naturally to things like HTTP status codes, database
//   integer flags, or bit-field permissions.
//
// SYNTAX:
//   enum EnumName { MemberA, MemberB, MemberC }
//   MemberA = 0, MemberB = 1, MemberC = 2  (automatic)
//
//   You can override the starting number:
//   enum EnumName { MemberA = 10, MemberB, MemberC }
//   MemberA = 10, MemberB = 11, MemberC = 12

// --- Simple example ---
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

console.log("=== Numeric Enums ===");
console.log("Direction.Up    =", Direction.Up);    // 0
console.log("Direction.Down  =", Direction.Down);  // 1
console.log("Direction.Left  =", Direction.Left);  // 2
console.log("Direction.Right =", Direction.Right); // 3

// --- HttpStatus enum (custom starting values) ---
enum HttpStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

function getStatusMessage(code: HttpStatus): string {
  switch (code) {
    case HttpStatus.OK:                  return "200 OK — Request succeeded";
    case HttpStatus.Created:             return "201 Created — Resource created";
    case HttpStatus.NoContent:           return "204 No Content — Success, no body";
    case HttpStatus.BadRequest:          return "400 Bad Request — Check your input";
    case HttpStatus.Unauthorized:        return "401 Unauthorized — Login required";
    case HttpStatus.Forbidden:           return "403 Forbidden — Access denied";
    case HttpStatus.NotFound:            return "404 Not Found — Resource missing";
    case HttpStatus.InternalServerError: return "500 Internal Server Error";
    default:                             return `Unknown status: ${code}`;
  }
}

console.log("\n--- HttpStatus numeric enum ---");
console.log(getStatusMessage(HttpStatus.OK));
console.log(getStatusMessage(HttpStatus.NotFound));
console.log(getStatusMessage(HttpStatus.Unauthorized));
console.log("HttpStatus.Created value =", HttpStatus.Created);

// =====================================
// REVERSE MAPPING IN NUMERIC ENUMS
// =====================================

// WHAT IT IS:
//   Numeric enums (and ONLY numeric enums) support reverse mapping.
//   TypeScript compiles them into a bidirectional object:
//     { Up: 0, 0: "Up", Down: 1, 1: "Down", ... }
//   So you can go from a NUMBER back to the member NAME.
//
// WHY IT EXISTS:
//   Useful for debugging — you can print the name of a numeric enum value
//   without maintaining a separate lookup table.
//
// NOTE: String enums do NOT have reverse mapping.

console.log("\n=== Reverse Mapping (Numeric Enums Only) ===");
console.log("Direction[0]  =", Direction[0]);   // "Up"
console.log("Direction[2]  =", Direction[2]);   // "Left"
console.log("HttpStatus[200] =", HttpStatus[200]); // "OK"
console.log("HttpStatus[404] =", HttpStatus[404]); // "NotFound"

// Practical use: log the name of a status code at runtime
function logHttpResponse(code: HttpStatus): void {
  const name = HttpStatus[code]; // reverse mapping gives us the name
  console.log(`Received HTTP ${code} (${name})`);
}

logHttpResponse(HttpStatus.Forbidden);      // "Received HTTP 403 (Forbidden)"
logHttpResponse(HttpStatus.InternalServerError); // "Received HTTP 500 (InternalServerError)"

// =====================================
// STRING ENUMS
// =====================================

// WHAT IT IS:
//   Each member is explicitly assigned a string value.
//   String enums do NOT auto-increment — every member MUST have a value.
//
// WHY IT EXISTS / WHY PREFERRED:
//   1. Human-readable at runtime — logs and API responses show "Shipped", not 2
//   2. No accidental overlap — adding a new member between two others
//      breaks numeric values silently; strings are stable
//   3. No reverse mapping ambiguity — string enums are purely one-directional
//   4. Safer serialisation — JSON.stringify(OrderStatus.Shipped) = '"Shipped"'
//      rather than a meaningless number
//
// SYNTAX:
//   enum EnumName { Member = "value" }

// --- OrderStatus enum (most real-world e-commerce apps have exactly this) ---
enum OrderStatus {
  Pending    = "PENDING",
  Processing = "PROCESSING",
  Shipped    = "SHIPPED",
  Delivered  = "DELIVERED",
  Cancelled  = "CANCELLED",
}

console.log("\n=== String Enums ===");
console.log("OrderStatus.Pending   =", OrderStatus.Pending);    // "PENDING"
console.log("OrderStatus.Shipped   =", OrderStatus.Shipped);    // "SHIPPED"
console.log("OrderStatus.Delivered =", OrderStatus.Delivered);  // "DELIVERED"

// --- UserRole enum ---
enum UserRole {
  Admin    = "ADMIN",
  Manager  = "MANAGER",
  Customer = "CUSTOMER",
  Guest    = "GUEST",
}

// --- PaymentStatus enum ---
enum PaymentStatus {
  Pending   = "PENDING",
  Completed = "COMPLETED",
  Failed    = "FAILED",
  Refunded  = "REFUNDED",
}

// --- ProductCategory enum ---
enum ProductCategory {
  Electronics   = "ELECTRONICS",
  Clothing      = "CLOTHING",
  Groceries     = "GROCERIES",
  HomeAndGarden = "HOME_AND_GARDEN",
  Books         = "BOOKS",
  Sports        = "SPORTS",
  Toys          = "TOYS",
}

// --- AuthPermission enum ---
enum AuthPermission {
  Read         = "READ",
  Write        = "WRITE",
  Delete       = "DELETE",
  ManageUsers  = "MANAGE_USERS",
  ManageOrders = "MANAGE_ORDERS",
  ViewReports  = "VIEW_REPORTS",
}

console.log("\n--- UserRole string enum ---");
console.log("UserRole.Admin    =", UserRole.Admin);
console.log("UserRole.Customer =", UserRole.Customer);

// =====================================
// USING ENUMS AS FUNCTION PARAMETERS
// =====================================

// WHY: Functions that accept an enum type ONLY accept valid enum members.
// TypeScript will show a compile error if you pass a raw string that is not
// a member of the enum.

console.log("\n=== Enums as Function Parameters ===");

function describeOrderStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:    return "Your order has been received and is awaiting processing.";
    case OrderStatus.Processing: return "We are preparing your order.";
    case OrderStatus.Shipped:    return "Your order is on the way!";
    case OrderStatus.Delivered:  return "Your order has been delivered. Enjoy!";
    case OrderStatus.Cancelled:  return "This order has been cancelled.";
    default:
      // TypeScript's exhaustiveness check — this line is unreachable if all
      // cases are handled. If you add a new enum member without adding a case,
      // the compiler warns you.
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

console.log(describeOrderStatus(OrderStatus.Pending));
console.log(describeOrderStatus(OrderStatus.Shipped));
console.log(describeOrderStatus(OrderStatus.Delivered));

function checkUserPermission(role: UserRole, permission: AuthPermission): boolean {
  const rolePermissions: Record<UserRole, AuthPermission[]> = {
    [UserRole.Admin]:    [AuthPermission.Read, AuthPermission.Write, AuthPermission.Delete, AuthPermission.ManageUsers, AuthPermission.ManageOrders, AuthPermission.ViewReports],
    [UserRole.Manager]:  [AuthPermission.Read, AuthPermission.Write, AuthPermission.ManageOrders, AuthPermission.ViewReports],
    [UserRole.Customer]: [AuthPermission.Read],
    [UserRole.Guest]:    [],
  };
  return rolePermissions[role].includes(permission);
}

console.log("\n--- Permission checks ---");
console.log("Admin can ManageUsers?  ", checkUserPermission(UserRole.Admin,    AuthPermission.ManageUsers));  // true
console.log("Manager can Delete?     ", checkUserPermission(UserRole.Manager,  AuthPermission.Delete));       // false
console.log("Customer can Read?      ", checkUserPermission(UserRole.Customer, AuthPermission.Read));         // true
console.log("Guest can Write?        ", checkUserPermission(UserRole.Guest,    AuthPermission.Write));        // false

// =====================================
// USING ENUMS IN SWITCH STATEMENTS
// =====================================

console.log("\n=== Enums in Switch Statements ===");

function processPayment(status: PaymentStatus): void {
  switch (status) {
    case PaymentStatus.Pending:
      console.log("Payment is pending. Waiting for confirmation...");
      break;
    case PaymentStatus.Completed:
      console.log("Payment completed successfully! Sending receipt...");
      break;
    case PaymentStatus.Failed:
      console.log("Payment failed. Please check your payment details.");
      break;
    case PaymentStatus.Refunded:
      console.log("Payment has been refunded to your account.");
      break;
    default:
      const _check: never = status; // exhaustiveness guard
      console.log("Unknown payment status:", _check);
  }
}

processPayment(PaymentStatus.Pending);
processPayment(PaymentStatus.Completed);
processPayment(PaymentStatus.Failed);
processPayment(PaymentStatus.Refunded);

// =====================================
// USING ENUMS WITH OBJECTS AND INTERFACES
// =====================================

console.log("\n=== Enums with Objects and Interfaces ===");

// Interfaces can use enum types as property types
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  inStock: boolean;
}

interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: Product[];
  total: number;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: AuthPermission[];
}

// Practical example: creating typed objects
const laptopProduct: Product = {
  id: "prod-001",
  name: "Pro Laptop 15",
  category: ProductCategory.Electronics,
  price: 1299.99,
  inStock: true,
};

const shirtProduct: Product = {
  id: "prod-002",
  name: "Classic Cotton Shirt",
  category: ProductCategory.Clothing,
  price: 29.99,
  inStock: true,
};

const customerUser: User = {
  id: "user-001",
  name: "Alice Johnson",
  email: "alice@example.com",
  role: UserRole.Customer,
  permissions: [AuthPermission.Read],
};

const adminUser: User = {
  id: "user-002",
  name: "Bob Smith",
  email: "bob@example.com",
  role: UserRole.Admin,
  permissions: [
    AuthPermission.Read,
    AuthPermission.Write,
    AuthPermission.Delete,
    AuthPermission.ManageUsers,
    AuthPermission.ManageOrders,
    AuthPermission.ViewReports,
  ],
};

const customerOrder: Order = {
  id: "order-001",
  customerId: customerUser.id,
  status: OrderStatus.Processing,
  paymentStatus: PaymentStatus.Completed,
  items: [laptopProduct],
  total: laptopProduct.price,
  createdAt: new Date("2024-03-15"),
};

console.log("Product:", laptopProduct.name, "| Category:", laptopProduct.category);
console.log("Order:", customerOrder.id, "| Status:", customerOrder.status, "| Payment:", customerOrder.paymentStatus);
console.log("User:", customerUser.name, "| Role:", customerUser.role);

// =====================================
// ENUM AS A KEY FOR RECORD TYPES
// =====================================

// WHAT IT IS:
//   TypeScript's Record<K, V> utility type creates an object type where
//   keys are from K and values are of type V.
//   Using an enum as K forces the Record to have an entry for EVERY enum member.
//
// WHY IT EXISTS:
//   Exhaustive maps — if you add a new enum member, TypeScript forces you to
//   add the corresponding key to every Record using that enum.

console.log("\n=== Enum as Record Key ===");

// Map every OrderStatus to a human-readable label and CSS colour class
const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
  [OrderStatus.Pending]:    { label: "Pending",    color: "gray"   },
  [OrderStatus.Processing]: { label: "Processing", color: "blue"   },
  [OrderStatus.Shipped]:    { label: "Shipped",    color: "orange" },
  [OrderStatus.Delivered]:  { label: "Delivered",  color: "green"  },
  [OrderStatus.Cancelled]:  { label: "Cancelled",  color: "red"    },
};

// Map every UserRole to an array of default permissions
const defaultPermissions: Record<UserRole, AuthPermission[]> = {
  [UserRole.Admin]:    [AuthPermission.Read, AuthPermission.Write, AuthPermission.Delete, AuthPermission.ManageUsers, AuthPermission.ManageOrders, AuthPermission.ViewReports],
  [UserRole.Manager]:  [AuthPermission.Read, AuthPermission.Write, AuthPermission.ManageOrders, AuthPermission.ViewReports],
  [UserRole.Customer]: [AuthPermission.Read],
  [UserRole.Guest]:    [],
};

// Map HttpStatus codes to whether they indicate an error
const isErrorStatus: Record<HttpStatus, boolean> = {
  [HttpStatus.OK]:                  false,
  [HttpStatus.Created]:             false,
  [HttpStatus.Accepted]:            false,
  [HttpStatus.NoContent]:           false,
  [HttpStatus.BadRequest]:          true,
  [HttpStatus.Unauthorized]:        true,
  [HttpStatus.Forbidden]:           true,
  [HttpStatus.NotFound]:            true,
  [HttpStatus.InternalServerError]: true,
};

console.log("Order status config for Shipped:", orderStatusConfig[OrderStatus.Shipped]);
console.log("Default permissions for Manager:", defaultPermissions[UserRole.Manager]);
console.log("Is 404 an error?", isErrorStatus[HttpStatus.NotFound]);
console.log("Is 200 an error?", isErrorStatus[HttpStatus.OK]);

function renderOrderBadge(status: OrderStatus): string {
  const config = orderStatusConfig[status];
  return `[${config.color.toUpperCase()}] ${config.label}`;
}

console.log("\n--- Order badge rendering ---");
Object.values(OrderStatus).forEach((s) => {
  console.log(renderOrderBadge(s as OrderStatus));
});

// =====================================
// COMPUTED AND CONSTANT MEMBERS
// =====================================

// WHAT IT IS:
//   Enum members can be:
//     CONSTANT — evaluated at compile time (literals, arithmetic on other constants)
//     COMPUTED  — evaluated at runtime (function calls, non-literal expressions)
//
// IMPORTANT: Computed members must come at the END of the enum (after all
// constant members), otherwise TypeScript will error.

console.log("\n=== Computed and Constant Members ===");

function getDefaultCategoryScore(): number {
  return 50;
}

enum CategoryPriority {
  // Constant members (compile-time)
  None     = 0,
  Low      = 10,
  Medium   = Low * 2,   // 20 — arithmetic on another constant member
  High     = Medium * 2, // 40 — still constant
  Critical = 100,

  // Computed member (runtime) — must come last if mixing
  Default  = getDefaultCategoryScore(), // function call = computed
}

console.log("CategoryPriority.None     =", CategoryPriority.None);
console.log("CategoryPriority.Low      =", CategoryPriority.Low);
console.log("CategoryPriority.Medium   =", CategoryPriority.Medium);
console.log("CategoryPriority.High     =", CategoryPriority.High);
console.log("CategoryPriority.Critical =", CategoryPriority.Critical);
console.log("CategoryPriority.Default  =", CategoryPriority.Default);

// =====================================
// CONST ENUMS
// =====================================

// WHAT IT IS:
//   A const enum is prefixed with the "const" keyword.
//   At compile time, TypeScript inlines every use of the enum as its literal value.
//   NO runtime object is created — the enum disappears entirely from the output JS.
//
// WHY IT EXISTS:
//   Performance — no property lookup at runtime, just literal numbers/strings.
//   Smaller bundle — no object created in the compiled JS.
//
// TRADE-OFF:
//   You cannot iterate over a const enum's values at runtime (no object exists).
//   You cannot use reverse mapping on a const enum.
//   Avoid in library code distributed as .d.ts — consumers cannot access the values.
//
// SYNTAX:
//   const enum EnumName { Member = value }

const enum LogLevel {
  Debug   = 0,
  Info    = 1,
  Warning = 2,
  Error   = 3,
  Fatal   = 4,
}

// At runtime, LogLevel.Warning is replaced with the literal 2 by the compiler.
// No LogLevel object exists in the compiled JavaScript.
function log(level: LogLevel, message: string): void {
  const prefix = level >= LogLevel.Error ? "[ALERT]" : "[LOG]";
  console.log(`${prefix} Level ${level}: ${message}`);
}

console.log("\n=== Const Enums ===");
log(LogLevel.Info,    "Server started on port 3000");
log(LogLevel.Warning, "Memory usage is high");
log(LogLevel.Error,   "Database connection failed");
log(LogLevel.Fatal,   "Unhandled exception — shutting down");

// Compiled output would look like:
// log(1, "Server started on port 3000");
// log(2, "Memory usage is high");
// log(3, "Database connection failed");
// — no LogLevel object anywhere in the JS

// =====================================
// HETEROGENEOUS ENUMS (AVOID IN PRACTICE)
// =====================================

// WHAT IT IS:
//   An enum with both string and numeric members mixed together.
//
// WHY IT EXISTS:
//   Technically allowed by TypeScript for edge cases (e.g., interop with JS code
//   that mixes types).
//
// WHY TO AVOID:
//   - Hard to reason about (inconsistent types)
//   - Partial reverse mapping (only numeric members have it)
//   - Usually a sign of a design problem
//   - TypeScript documentation itself says to avoid heterogeneous enums

console.log("\n=== Heterogeneous Enums (Avoid!) ===");

enum MixedBag {
  No  = 0,      // numeric
  Yes = "YES",  // string
}

// This compiles, but it's confusing and rarely useful.
console.log("MixedBag.No  =", MixedBag.No);
console.log("MixedBag.Yes =", MixedBag.Yes);
// Only numeric members get reverse mapping:
console.log("MixedBag[0]  =", MixedBag[0]);  // "No" — reverse mapping works
// MixedBag["YES"] — does NOT exist (no reverse mapping for strings)
console.log("Prefer separate enums or a single type over mixed enums.");

// =====================================
// WHY STRING ENUMS ARE PREFERRED
// =====================================

// Comparison: numeric vs string for OrderStatus
//
// NUMERIC:
//   enum OrderStatus { Pending, Processing, Shipped, Delivered, Cancelled }
//   JSON output: { "status": 2 }     <- What is 2? You need a lookup table.
//   Logs: "Order status changed to 2" <- Useless without context.
//   Adding a member in the MIDDLE renumbers everything after it — breaks databases!
//
// STRING:
//   enum OrderStatus { Pending = "PENDING", Shipped = "SHIPPED", ... }
//   JSON output: { "status": "SHIPPED" }  <- Self-documenting!
//   Logs: "Order status changed to SHIPPED"  <- Clear immediately.
//   Adding a member anywhere is always safe — values never change.

console.log("\n=== Why String Enums Are Preferred ===");

// Numeric enum: safe to serialise?
enum NumericOrderStatus { Pending, Processing, Shipped, Delivered, Cancelled }

// String enum: safe to serialise
const order1 = { id: "001", status: OrderStatus.Shipped };
const order2 = { id: "002", status: NumericOrderStatus.Shipped };

console.log("String enum in JSON:", JSON.stringify(order1));
// { "id": "001", "status": "SHIPPED" }  <-- readable

console.log("Numeric enum in JSON:", JSON.stringify(order2));
// { "id": "002", "status": 2 }          <-- meaningless to consumers

// =====================================
// ALTERNATIVES TO ENUMS
// =====================================

// =====================================
// ALTERNATIVE 1: CONST OBJECTS (as const)
// =====================================

// WHAT IT IS:
//   A plain JS object marked "as const" so TypeScript narrows every value
//   to its literal type (e.g. "ADMIN" instead of string).
//   You then derive the type using typeof and keyof.
//
// WHY USE IT:
//   - Works the same as string enums at runtime
//   - Easier to iterate (Object.values works naturally)
//   - No special TypeScript syntax — pure JS
//   - Better compatibility with bundlers, tree-shaking, and isolatedModules
//   - The community trend (React, Zod, tRPC) is moving toward const objects

console.log("\n=== Alternative 1: Const Objects (as const) ===");

const ROLES = {
  Admin:    "ADMIN",
  Manager:  "MANAGER",
  Customer: "CUSTOMER",
  Guest:    "GUEST",
} as const;

// Derive the type: "ADMIN" | "MANAGER" | "CUSTOMER" | "GUEST"
type Role = (typeof ROLES)[keyof typeof ROLES];

const ORDER_STATUS = {
  Pending:    "PENDING",
  Processing: "PROCESSING",
  Shipped:    "SHIPPED",
  Delivered:  "DELIVERED",
  Cancelled:  "CANCELLED",
} as const;

type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

function handleRole(role: Role): void {
  if (role === ROLES.Admin) {
    console.log("Full admin access granted.");
  } else if (role === ROLES.Guest) {
    console.log("Read-only guest access.");
  } else {
    console.log(`Role "${role}" assigned.`);
  }
}

handleRole(ROLES.Admin);
handleRole(ROLES.Customer);
// handleRole("SUPERUSER"); // ERROR — "SUPERUSER" is not assignable to Role

// Iteration works perfectly with const objects
console.log("All roles:", Object.values(ROLES));
console.log("All order statuses:", Object.values(ORDER_STATUS));

// =====================================
// ALTERNATIVE 2: UNION LITERAL TYPES
// =====================================

// WHAT IT IS:
//   A TypeScript type alias that is a union of string (or number) literals.
//   No runtime object at all — purely a compile-time construct.
//
// WHY USE IT:
//   - Zero runtime overhead — disappears completely after compilation
//   - Simplest syntax for small, stable sets of values
//   - Ideal for function parameters and props

console.log("\n=== Alternative 2: Union Literal Types ===");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Environment = "development" | "staging" | "production";
type SortDirection = "asc" | "desc";

function fetchData(url: string, method: HttpMethod): void {
  console.log(`Fetching ${url} via ${method}`);
}

function configureApp(env: Environment): void {
  console.log(`Configuring for environment: ${env}`);
}

fetchData("/api/orders", "GET");
fetchData("/api/orders", "POST");
configureApp("production");
// fetchData("/api/orders", "CONNECT"); // ERROR — "CONNECT" is not in HttpMethod

// You can also use union types for a domain concept
type PaymentStatusLiteral = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

function describePayment(status: PaymentStatusLiteral): string {
  switch (status) {
    case "COMPLETED": return "Payment successful";
    case "FAILED":    return "Payment failed";
    case "REFUNDED":  return "Amount refunded";
    default:          return "Awaiting payment";
  }
}

console.log(describePayment("COMPLETED"));
console.log(describePayment("FAILED"));

// =====================================
// WHEN TO USE ENUM vs CONST OBJECT vs UNION
// =====================================

// USE ENUM WHEN:
//   - You want a true named type with a centralised definition
//   - You need reverse mapping (numeric enums only)
//   - You are on a TypeScript-only project and your team prefers enum syntax
//   - You need const enum for performance (compile-time inlining)
//
// USE CONST OBJECT (as const) WHEN:
//   - You need to iterate over values at runtime (Object.values, Object.keys)
//   - You are building a library used in both JS and TS projects
//   - You use isolatedModules (required by Vite, esbuild, swc) — const enums
//     are not compatible; regular enums work but const objects are simpler
//   - The team is more comfortable with plain JS objects
//
// USE UNION LITERAL TYPES WHEN:
//   - The set of values is small (2-5 values) and unlikely to grow
//   - You do not need to iterate over the values at runtime
//   - You want zero runtime overhead
//   - The values are used in function signatures or component props

console.log("\n=== When to use Enum vs Const Object vs Union ===");
console.log("Enum          → centralised, named, supports reverse mapping");
console.log("Const object  → iterable at runtime, JS-friendly, isolatedModules-safe");
console.log("Union type    → zero runtime cost, simple, ideal for small stable sets");

// =====================================
// REAL-WORLD COMBINED EXAMPLE
// =====================================

console.log("\n=== Real-World Combined Example: E-Commerce Order Pipeline ===");

// Using string enums for domain concepts
enum ShippingCarrier {
  FedEx = "FEDEX",
  UPS   = "UPS",
  USPS  = "USPS",
  DHL   = "DHL",
}

interface OrderEvent {
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  timestamp: Date;
  performedBy: UserRole;
}

interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  carrier?: ShippingCarrier;
}

// Allowed status transitions (business rules encoded with enums)
const allowedTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.Pending]:    [OrderStatus.Processing, OrderStatus.Cancelled],
  [OrderStatus.Processing]: [OrderStatus.Shipped,    OrderStatus.Cancelled],
  [OrderStatus.Shipped]:    [OrderStatus.Delivered],
  [OrderStatus.Delivered]:  [],
  [OrderStatus.Cancelled]:  [],
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  const allowed = allowedTransitions[from] ?? [];
  return allowed.includes(to);
}

function transitionOrder(
  order: Order,
  newStatus: OrderStatus,
  performedBy: UserRole
): OrderEvent | null {
  if (!canTransition(order.status, newStatus)) {
    console.log(`  BLOCKED: Cannot move from ${order.status} to ${newStatus}`);
    return null;
  }

  const event: OrderEvent = {
    orderId:        order.id,
    previousStatus: order.status,
    newStatus,
    timestamp:      new Date(),
    performedBy,
  };

  order.status = newStatus;
  console.log(`  OK: Order ${order.id} moved to ${newStatus} by ${performedBy}`);
  return event;
}

// Simulate an order lifecycle
const myOrder: Order = {
  id:            "order-999",
  customerId:    "user-001",
  status:        OrderStatus.Pending,
  paymentStatus: PaymentStatus.Pending,
  items:         [laptopProduct, shirtProduct],
  total:         laptopProduct.price + shirtProduct.price,
  createdAt:     new Date(),
};

console.log("\nInitial order status:", myOrder.status);
transitionOrder(myOrder, OrderStatus.Processing, UserRole.Manager);
transitionOrder(myOrder, OrderStatus.Delivered,  UserRole.Manager); // blocked
transitionOrder(myOrder, OrderStatus.Shipped,    UserRole.Manager);
transitionOrder(myOrder, OrderStatus.Delivered,  UserRole.Manager);
transitionOrder(myOrder, OrderStatus.Cancelled,  UserRole.Admin);   // blocked
console.log("Final order status:", myOrder.status);

// Payment processing with enum
const payment: PaymentRecord = {
  id:      "pay-001",
  orderId: myOrder.id,
  amount:  myOrder.total,
  status:  PaymentStatus.Pending,
};

console.log("\nProcessing payment...");
payment.status = PaymentStatus.Completed;
console.log("Payment status:", payment.status);
console.log("Payment amount: $" + payment.amount.toFixed(2));

// Assigning a shipping carrier
const shipment: PaymentRecord = {
  ...payment,
  carrier: ShippingCarrier.FedEx,
};
console.log("Shipping via:", shipment.carrier);

// =====================================
// COMMON MISTAKES
// =====================================

console.log("\n=== Common Mistakes ===");

// MISTAKE 1: Using numeric enums when string enums are safer
// BAD:
enum BadStatus { Pending, Shipped, Delivered } // 0, 1, 2

// If you add "Processing" in the middle:
// enum BadStatus { Pending, Processing, Shipped, Delivered }
// Now Shipped = 2, Delivered = 3 — DIFFERENT from what you stored in the database!
// Anything that persisted "2" for Shipped now points to Delivered.

// GOOD: String enums never renumber
// enum OrderStatus { Pending = "PENDING", Shipped = "SHIPPED" }
// Adding Processing in any position doesn't affect other values.

console.log("Mistake 1: numeric enums renumber when members are inserted.");
console.log("Solution: always use string enums for persisted/serialised values.");

// MISTAKE 2: Comparing enum to raw string
// TypeScript will NOT allow this at the type level:
// if (OrderStatus.Pending === "PENDING") — fine at runtime but type error
// Solution: always compare enum member to enum member.

console.log("\nMistake 2: comparing enum value to raw string literal.");
console.log("Solution: compare enum member to enum member, or use the enum value.");

// MISTAKE 3: Using const enum in a library
// const enum members are inlined by the TypeScript compiler.
// If a consumer of your library uses a different compilation step (babel, esbuild),
// they will not inline the values and will get "undefined" references.
// Solution: use regular enums or const objects in library code.

console.log("\nMistake 3: using const enum in a shared library.");
console.log("Solution: use regular enum or const object (as const) in libraries.");

// MISTAKE 4: Forgetting exhaustiveness checks in switch statements
// Without a default or never-check, adding a new enum member is silently missed.
// Solution: use the "never" trick shown earlier in this file.

console.log("\nMistake 4: non-exhaustive switch over enum members.");
console.log("Solution: add a `default: const _: never = status;` guard.");

// =====================================
// BEST PRACTICES
// =====================================

console.log("\n=== Best Practices ===");
console.log(`
1. PREFER STRING ENUMS over numeric enums for anything serialised
   (API payloads, databases, logs).

2. USE PascalCase for enum names, PascalCase for member names.
   enum OrderStatus, not order_status or ORDER_STATUS.

3. ALWAYS ADD EXHAUSTIVENESS CHECKS in switch statements using the "never" trick.

4. USE Record<EnumType, ...> to create lookup tables that TypeScript
   keeps in sync when enum members are added or removed.

5. CONSIDER CONST OBJECTS (as const) when you need to iterate values at runtime
   or when using isolatedModules (Vite, esbuild, swc).

6. AVOID CONST ENUM in library code — it breaks consumers that use transpile-only
   tools (Babel, esbuild) instead of the TypeScript compiler.

7. AVOID HETEROGENEOUS ENUMS (mixed string + numeric) — always pick one type.

8. DO NOT use numeric enums for domain statuses stored in a database — a new
   enum member inserted in the middle will silently shift all subsequent values.

9. USE UNION LITERAL TYPES for small, stable, read-only sets (3-5 values max)
   that are never iterated at runtime.

10. GROUP RELATED PERMISSIONS in an enum (AuthPermission) and use Record to map
    roles to their allowed permissions — type-safe and exhaustive by construction.
`);

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between a numeric enum and a string enum?
//
// A: Numeric enums auto-assign integer values (0, 1, 2, ...) and support reverse
//    mapping (you can look up a member name from its value). String enums require
//    explicit string values for every member and do NOT support reverse mapping.
//    String enums are preferred because their values are self-documenting,
//    serialise safely to JSON, and do not silently renumber when a member is
//    inserted in the middle.

// Q2: What is a const enum and when should you avoid it?
//
// A: A const enum is inlined at compile time — every reference to a const enum
//    member is replaced with its literal value; no runtime object is created.
//    You should AVOID const enums in library code (.d.ts distributions) because
//    tools that only transpile (Babel, esbuild, swc) without running the full
//    TypeScript compiler cannot inline the values, leaving consumers with
//    "undefined" references. For application code compiled entirely with tsc,
//    const enums are safe and offer a minor bundle-size advantage.

// Q3: What is reverse mapping and which enum types support it?
//
// A: Reverse mapping lets you get the name of an enum member from its value.
//    TypeScript compiles numeric enums into a bidirectional object:
//      Direction[0] === "Up"   and   Direction.Up === 0
//    ONLY numeric (non-const) enums support reverse mapping.
//    String enums and const enums do NOT generate a reverse mapping.

// Q4: When should you use a const object (as const) instead of an enum?
//
// A: Use a const object when:
//    (a) You need to iterate the values at runtime (Object.values works on objects
//        but not on const enums, which have no runtime object).
//    (b) You are writing library code — avoids the const enum pitfall.
//    (c) Your build tool uses isolatedModules (Vite, esbuild) — const enums
//        are incompatible; regular enums work but const objects are simpler.
//    (d) You want pure-JS feel with TypeScript safety via
//        `type T = (typeof OBJ)[keyof typeof OBJ]`.

// =====================================
// PRACTICE TASKS
// =====================================

console.log("\n=== Practice Tasks ===");
console.log(`
TASK 1 — Expand the permission system
  - Add a new AuthPermission member "ExportData".
  - Update the defaultPermissions Record so Manager also gets ExportData.
  - Add a function hasAllPermissions(user: User, required: AuthPermission[]): boolean
    that returns true only if the user has every permission in the required list.
  - Test it with adminUser (should return true for all) and
    customerUser (should return false for Write).

TASK 2 — Product category discount engine
  - Create a Record<ProductCategory, number> called categoryDiscount
    that maps each category to a discount percentage (0–50).
  - Write a function calculateFinalPrice(product: Product): number
    that applies the discount for the product's category.
  - Write a function listDiscountedProducts(products: Product[]): Product[]
    that returns only products whose category discount is greater than 0.
  - Test with an array containing laptopProduct, shirtProduct, and at least
    one Groceries and one Books product.

TASK 3 — HTTP response handler
  - Using the HttpStatus numeric enum, write a function
    classifyResponse(code: HttpStatus): "success" | "client-error" | "server-error"
    that returns the appropriate category.
  - Write a function retryable(code: HttpStatus): boolean that returns true
    only for 500-level errors (server errors worth retrying).
  - Write a function buildApiResponse<T>(data: T, code: HttpStatus):
    { data: T; status: HttpStatus; statusName: string; isError: boolean }
    using reverse mapping to fill in statusName and isErrorStatus to fill isError.
  - Test with HttpStatus.OK, HttpStatus.NotFound, and HttpStatus.InternalServerError.
`);

console.log("=== End of 09-enums.ts ===");
