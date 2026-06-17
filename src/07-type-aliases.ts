// =====================================
// 07-TYPE-ALIASES.TS
// Topic: Type Aliases in TypeScript
// Audience: JavaScript developers learning TypeScript from scratch
// =====================================

// =====================================
// WHAT IS A TYPE ALIAS?
// =====================================

// A type alias creates a new NAME for an existing type.
// It does NOT create a new type — it just gives a type a reusable label.
// Use the 'type' keyword to define one.

// WHY IT EXISTS:
// - Avoid repeating complex type definitions everywhere
// - Give meaningful names to raw types
// - Make code more readable and self-documenting
// - Enable composition of complex types

// SYNTAX:
// type AliasName = <some type>

// =====================================
// ALIASING PRIMITIVES
// =====================================

// You can alias primitive types to give them a domain-specific name.
// This improves readability — you communicate intent through the type name.

type UserName = string;
type UserId = number;
type IsActive = boolean;

const username: UserName = "shahnewaz";
const userId: UserId = 42;
const isActive: IsActive = true;

console.log("=== Aliasing Primitives ===");
console.log(username, userId, isActive);

// Practical example — PaymentMethod as a string alias
type PaymentMethod = string;
const payment: PaymentMethod = "credit_card";
console.log("Payment method:", payment);

// NOTE: Aliasing primitives alone is rarely done in real projects.
// More useful when combined with unions (shown below).

// =====================================
// ALIASING OBJECTS
// =====================================

// Instead of repeating the same object shape everywhere,
// define it once as a type alias and reuse it.

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

const user1: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 28,
};

console.log("\n=== Aliasing Objects ===");
console.log("User:", user1);

// Practical example — CartItem type alias
type CartItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

const cartItem: CartItem = {
  productId: 101,
  productName: "TypeScript Handbook",
  quantity: 2,
  unitPrice: 29.99,
};

console.log("Cart item:", cartItem);
console.log("Cart item total:", cartItem.quantity * cartItem.unitPrice);

// =====================================
// ALIASING UNION TYPES
// =====================================

// Union types let a value be ONE of several specific values.
// Aliasing them makes the union reusable and readable throughout the codebase.

// WHY: Without an alias you would repeat "active" | "inactive" | "banned"
// everywhere a status is used — error-prone and hard to update.

type Status = "active" | "inactive" | "banned";

function printStatus(status: Status): void {
  console.log("User status:", status);
}

printStatus("active");
// printStatus("deleted"); // ERROR: "deleted" is not assignable to type Status

// Real-world: UserRole type alias
type UserRole = "admin" | "editor" | "viewer" | "guest";

function getPermissions(role: UserRole): string[] {
  if (role === "admin") return ["read", "write", "delete", "manage_users"];
  if (role === "editor") return ["read", "write"];
  if (role === "viewer") return ["read"];
  return []; // guest
}

console.log("\n=== Aliasing Union Types ===");
console.log("Admin permissions:", getPermissions("admin"));
console.log("Viewer permissions:", getPermissions("viewer"));

// Real-world: OrderStatus type alias
type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

function describeOrder(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    pending: "Waiting for confirmation",
    confirmed: "Order confirmed",
    processing: "Being prepared",
    shipped: "On the way",
    delivered: "Delivered successfully",
    cancelled: "Order was cancelled",
    refunded: "Payment refunded",
  };
  return messages[status];
}

console.log("Order status:", describeOrder("shipped"));
console.log("Order status:", describeOrder("refunded"));

// Real-world: ProductCategory type alias
type ProductCategory =
  | "electronics"
  | "clothing"
  | "books"
  | "food"
  | "furniture"
  | "sports";

function getCategoryTax(category: ProductCategory): number {
  if (category === "food") return 0;
  if (category === "clothing") return 0.05;
  return 0.1;
}

console.log("Electronics tax:", getCategoryTax("electronics"));
console.log("Food tax:", getCategoryTax("food"));

// =====================================
// ALIASING INTERSECTION TYPES
// =====================================

// Intersection types combine multiple types into ONE type that has ALL properties.
// Use & to intersect. Think of it as "this AND that".

type Admin = {
  adminLevel: number;
  canDeleteUsers: boolean;
};

// AdminUser has BOTH User properties AND Admin properties
type AdminUser = User & Admin;

const adminUser: AdminUser = {
  id: 99,
  name: "Bob",
  email: "bob@example.com",
  age: 35,
  adminLevel: 1,
  canDeleteUsers: true,
};

console.log("\n=== Aliasing Intersection Types ===");
console.log("Admin user:", adminUser);

// Practical example — AuthPayload type alias
// Combining user info with token info
type TokenInfo = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

type AuthPayload = User & TokenInfo & { role: UserRole };

const authPayload: AuthPayload = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 28,
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  expiresAt: Date.now() + 3600000,
  role: "admin",
};

console.log("Auth payload user:", authPayload.name, "| role:", authPayload.role);
console.log("Token expires at:", new Date(authPayload.expiresAt).toISOString());

// =====================================
// ALIASING FUNCTION TYPES
// =====================================

// You can alias the shape of a function — its parameter types and return type.
// This is useful when the same function signature is used in multiple places.

// SYNTAX: type FuncName = (param: ParamType) => ReturnType

type Formatter = (value: string) => string;
type Predicate = (value: number) => boolean;
type EventHandler = (event: MouseEvent) => void;

const toUpperCase: Formatter = (value) => value.toUpperCase();
const toLowerCase: Formatter = (value) => value.toLowerCase();
const isEven: Predicate = (value) => value % 2 === 0;

console.log("\n=== Aliasing Function Types ===");
console.log(toUpperCase("hello typescript"));
console.log(isEven(4), isEven(7));

// Practical: a logger function type
type Logger = (message: string, level: "info" | "warn" | "error") => void;

const consoleLogger: Logger = (message, level) => {
  const prefix = { info: "[INFO]", warn: "[WARN]", error: "[ERROR]" };
  console.log(`${prefix[level]} ${message}`);
};

consoleLogger("User logged in", "info");
consoleLogger("Session expiring soon", "warn");
consoleLogger("Payment failed", "error");

// =====================================
// ALIASING ARRAY TYPES
// =====================================

// Alias an array of a given type so you don't repeat T[] everywhere.

type UserList = User[];
type ProductCategoryList = ProductCategory[];
type OrderStatusHistory = OrderStatus[];

const users: UserList = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 28 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 35 },
];

const watchedCategories: ProductCategoryList = ["electronics", "books"];
const statusHistory: OrderStatusHistory = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
];

console.log("\n=== Aliasing Array Types ===");
console.log("Users:", users.map((u) => u.name));
console.log("Watched categories:", watchedCategories);
console.log("Status history:", statusHistory);

// =====================================
// ALIASING TUPLE TYPES
// =====================================

// A tuple is an array with a FIXED number of elements, each with a known type.
// Aliasing tuples names the structure and prevents misuse.

type Coordinate = [number, number];       // [longitude, latitude]
type RGB = [number, number, number];      // [red, green, blue]
type NameAgePair = [string, number];

const location: Coordinate = [23.8103, 90.4125]; // Dhaka, Bangladesh
const red: RGB = [255, 0, 0];
const person: NameAgePair = ["Charlie", 25];

console.log("\n=== Aliasing Tuple Types ===");
console.log("Location [lon, lat]:", location);
console.log("Color RGB:", red);
console.log("Person [name, age]:", person[0], "is", person[1], "years old");

// Practical: A result tuple — success flag + data or error
type Result = [boolean, string]; // [success, message]

function processPayment(amount: number): Result {
  if (amount <= 0) return [false, "Amount must be positive"];
  if (amount > 10000) return [false, "Amount exceeds limit"];
  return [true, `Payment of $${amount} processed successfully`];
}

const [success, message] = processPayment(250);
console.log("Payment result:", success, message);

const [fail, failMsg] = processPayment(-50);
console.log("Payment result:", fail, failMsg);

// =====================================
// GENERIC TYPE ALIASES
// =====================================

// A generic type alias works like a function but for types.
// The <T> is a type parameter — a placeholder for any type.
// When you use the alias, you pass in the actual type.

// WHY: Write one alias that works for many different data shapes.

// SYNTAX: type AliasName<T> = { ... }

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: string;
};

// Usage: plug in the specific data type
type UserResponse = ApiResponse<User>;
type OrderListResponse = ApiResponse<OrderStatus[]>;
type StringResponse = ApiResponse<string>;

const userResponse: UserResponse = {
  data: { id: 1, name: "Alice", email: "alice@example.com", age: 28 },
  status: 200,
  message: "Success",
  timestamp: new Date().toISOString(),
};

const orderListResponse: OrderListResponse = {
  data: ["pending", "confirmed", "shipped"],
  status: 200,
  message: "Orders fetched",
  timestamp: new Date().toISOString(),
};

console.log("\n=== Generic Type Aliases ===");
console.log("User API response:", userResponse.status, userResponse.data.name);
console.log("Order list response:", orderListResponse.data);

// Generic with multiple type parameters
type PaginatedResponse<T, Meta = Record<string, unknown>> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  meta?: Meta;
};

type CartMeta = { currency: string; discount: number };
type CartResponse = PaginatedResponse<CartItem, CartMeta>;

const cart: CartResponse = {
  items: [
    { productId: 1, productName: "Keyboard", quantity: 1, unitPrice: 89.99 },
    { productId: 2, productName: "Mouse", quantity: 2, unitPrice: 29.99 },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
  meta: { currency: "USD", discount: 0.1 },
};

console.log("Cart items:", cart.items.length, "| Currency:", cart.meta?.currency);

// Generic helper function using the alias
function createApiResponse<T>(data: T, status: number = 200): ApiResponse<T> {
  return {
    data,
    status,
    message: status === 200 ? "OK" : "Error",
    timestamp: new Date().toISOString(),
  };
}

const roleResponse = createApiResponse<UserRole>("admin");
console.log("Role response:", roleResponse.data, "| Status:", roleResponse.status);

// =====================================
// RECURSIVE TYPE ALIASES
// =====================================

// A recursive type alias references ITSELF in its own definition.
// Useful for tree structures, nested menus, file systems, etc.

type NestedObject = {
  value: string;
  children?: NestedObject[]; // references itself
};

const tree: NestedObject = {
  value: "root",
  children: [
    {
      value: "child-1",
      children: [
        { value: "grandchild-1-1" },
        { value: "grandchild-1-2" },
      ],
    },
    {
      value: "child-2",
    },
  ],
};

console.log("\n=== Recursive Type Aliases ===");
console.log("Tree root:", tree.value);
console.log("First child:", tree.children?.[0].value);
console.log("Grandchild:", tree.children?.[0].children?.[1].value);

// Practical: Navigation menu (common in web apps)
type MenuItem = {
  label: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
};

const navMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
  },
  {
    label: "Products",
    href: "/products",
    icon: "box",
    children: [
      { label: "All Products", href: "/products/all" },
      { label: "Add Product", href: "/products/add" },
      {
        label: "Categories",
        href: "/products/categories",
        children: [
          { label: "Electronics", href: "/products/categories/electronics" },
          { label: "Clothing", href: "/products/categories/clothing" },
        ],
      },
    ],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: "shopping-cart",
  },
];

function printMenu(items: MenuItem[], depth: number = 0): void {
  for (const item of items) {
    console.log("  ".repeat(depth) + `- ${item.label} (${item.href})`);
    if (item.children) {
      printMenu(item.children, depth + 1);
    }
  }
}

console.log("Navigation menu:");
printMenu(navMenu);

// =====================================
// MAPPED TYPE ALIASES
// =====================================

// Mapped types create new types by transforming EVERY property of an existing type.
// They use a syntax similar to index signatures: { [K in keyof T]: ... }

// WHY: Avoid manually redefining all properties of a type with small modifications.

// Make all properties optional
type Partial_<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties readonly
type Readonly_<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties required (removes optional ?)
type Required_<T> = {
  [K in keyof T]-?: T[K];
};

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type PartialUser = Partial_<User>;     // all User fields are optional
type ReadonlyUser = Readonly_<User>;   // all User fields are readonly
type NullableUser = Nullable<User>;    // all User fields can be null

const partialUser: PartialUser = { name: "Dave" }; // only name is required
const readonlyUser: ReadonlyUser = { id: 1, name: "Eve", email: "eve@example.com", age: 22 };
// readonlyUser.name = "New"; // ERROR: cannot assign to 'name' because it is read-only

console.log("\n=== Mapped Type Aliases ===");
console.log("Partial user:", partialUser);
console.log("Readonly user:", readonlyUser);

// Practical: FormFields mapped type — converts every value to a form field descriptor
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

type UserForm = FormFields<Pick<User, "name" | "email">>;

const userForm: UserForm = {
  name: { value: "Alice", error: null, touched: true },
  email: { value: "", error: "Email is required", touched: true },
};

console.log("Name field:", userForm.name);
console.log("Email field:", userForm.email);

// =====================================
// CONDITIONAL TYPE ALIASES (BASIC)
// =====================================

// Conditional types choose between two types based on a condition.
// SYNTAX: T extends U ? TypeIfTrue : TypeIfFalse
// Think of it like a ternary operator but for types.

// WHY: Write types that adapt depending on what type is passed in.

// IsString<T> resolves to true if T is string, false otherwise
type IsString<T> = T extends string ? true : false;

// IsArray<T> resolves to "yes" if T is an array, "no" otherwise
type IsArray<T> = T extends unknown[] ? "yes" : "no";

// Unwrap the element type from an array
type UnwrapArray<T> = T extends (infer Item)[] ? Item : T;

type Test1 = IsString<string>;     // true
type Test2 = IsString<number>;     // false
type Test3 = IsArray<string[]>;    // "yes"
type Test4 = IsArray<number>;      // "no"
type Test5 = UnwrapArray<User[]>;  // User
type Test6 = UnwrapArray<string>;  // string (not an array, returns as-is)

// We can demonstrate at runtime using a function that mirrors the logic:
function isStringValue(val: unknown): val is string {
  return typeof val === "string";
}

console.log("\n=== Conditional Type Aliases (Basic) ===");
console.log('isStringValue("hello"):', isStringValue("hello"));
console.log("isStringValue(42):", isStringValue(42));

// Practical: NonNullable equivalent
type NonNull<T> = T extends null | undefined ? never : T;

type SafeUser = NonNull<User | null | undefined>; // resolves to User

// Practical: Extract only function properties from a type
type FunctionProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// =====================================
// TEMPLATE LITERAL TYPE ALIASES
// =====================================

// Template literal types create string types using template literal syntax.
// They combine string literal types and produce new string patterns.

// SYNTAX: type T = `prefix${OtherType}`

// WHY: Enforce string patterns at the type level — no more typos in event names,
// route strings, CSS class names, or any patterned string.

type EventName = `on${string}`;

const clickEvent: EventName = "onClick";
const changeEvent: EventName = "onChange";
const submitEvent: EventName = "onSubmit";
// const invalid: EventName = "click"; // ERROR: must start with "on"

console.log("\n=== Template Literal Type Aliases ===");
console.log("Events:", clickEvent, changeEvent, submitEvent);

// Combining with union types — creates all combinations
type Direction = "left" | "right" | "top" | "bottom";
type CSSProperty = `margin-${Direction}` | `padding-${Direction}`;

const marginLeft: CSSProperty = "margin-left";
const paddingTop: CSSProperty = "padding-top";
console.log("CSS properties:", marginLeft, paddingTop);

// HTTP method + route pattern
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ApiRoute = `/api/${string}`;
type RouteKey = `${HttpMethod} ${ApiRoute}`;

const getUsers: RouteKey = "GET /api/users";
const createOrder: RouteKey = "POST /api/orders";
console.log("Routes:", getUsers, createOrder);

// Practical: typed event emitter keys
type UserEvent = `user:${"created" | "updated" | "deleted" | "logged_in"}`;
type OrderEvent = `order:${"placed" | "confirmed" | "shipped" | "delivered"}`;
type AppEvent = UserEvent | OrderEvent;

function emit(event: AppEvent, payload?: unknown): void {
  console.log(`Event emitted: ${event}`, payload ? JSON.stringify(payload) : "");
}

emit("user:created", { id: 1, name: "Frank" });
emit("order:shipped", { orderId: 99, trackingCode: "TRK123" });
// emit("user:banned"); // ERROR: not a valid UserEvent

// =====================================
// REAL-WORLD COMBINED EXAMPLE
// =====================================

// Bringing it all together with a small e-commerce domain model.

console.log("\n=== Real-World Combined Example ===");

// --- Domain types ---

type ProductId = number;
type CustomerId = number;
type OrderId = number;

type Address = {
  street: string;
  city: string;
  country: string;
  zipCode: string;
};

type Product = {
  id: ProductId;
  name: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
};

type Order = {
  id: OrderId;
  customerId: CustomerId;
  items: CartItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
};

// Generic API response in use
type OrderResponse = ApiResponse<Order>;
type ProductListResponse = ApiResponse<Product[]>;

// --- Sample data ---

const product: Product = {
  id: 1,
  name: "Mechanical Keyboard",
  price: 129.99,
  category: "electronics",
  inStock: true,
};

const order: Order = {
  id: 1001,
  customerId: 42,
  items: [
    { productId: 1, productName: "Mechanical Keyboard", quantity: 1, unitPrice: 129.99 },
  ],
  status: "confirmed",
  paymentMethod: "credit_card",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    country: "USA",
    zipCode: "10001",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const orderApiResponse: OrderResponse = createApiResponse(order);

console.log("Product:", product.name, "- $" + product.price);
console.log("Order ID:", orderApiResponse.data.id, "| Status:", orderApiResponse.data.status);
console.log("API response status:", orderApiResponse.status);

// =====================================
// TYPE ALIAS vs INTERFACE
// =====================================

// Both type aliases and interfaces can describe object shapes.
// They have important differences:

console.log("\n=== Type Alias vs Interface ===");

// INTERFACE: can be extended with 'extends', can be merged (declaration merging)
interface IProduct {
  id: number;
  name: string;
}

interface IProduct {
  price: number; // declaration merging: this ADDS to the existing interface
}

// IProduct now has: id, name, price
const iProduct: IProduct = { id: 1, name: "Book", price: 15 };
console.log("Interface with merging:", iProduct);

// TYPE ALIAS: cannot be merged — redeclaring the same name is an ERROR
type TProduct = {
  id: number;
  name: string;
};
// type TProduct = { price: number }; // ERROR: Duplicate identifier 'TProduct'

// EXTENDING:
// Interface uses 'extends':
interface IAdmin extends IProduct {
  role: UserRole;
}

// Type alias uses intersection &:
type TAdmin = TProduct & { role: UserRole };

// WHEN TO USE WHICH:
// Use 'interface' when:
// - Defining the shape of classes or objects meant to be implemented/extended
// - Working with object-oriented patterns
// - You want declaration merging (e.g., extending third-party library types)
// - The shape represents a "contract" to be implemented

// Use 'type' when:
// - Creating union types:   type Status = "a" | "b"
// - Creating intersection types: type A = B & C
// - Creating mapped types, conditional types, template literals
// - Aliasing primitives, tuples, function signatures
// - Creating generic utility types

// RULE OF THUMB: For simple objects that represent entities, either works.
// Prefer 'interface' for public API surfaces. Prefer 'type' for complex compositions.

const tAdmin: TAdmin = { id: 99, name: "Root", role: "admin" };
const iAdmin: IAdmin = { id: 99, name: "Root", price: 0, role: "admin" };
console.log("Type alias admin:", tAdmin.role);
console.log("Interface admin:", iAdmin.role);

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

console.log("\n=== JS vs TS Comparison ===");

// JAVASCRIPT — no type aliases, everything is duck-typed
// You hope objects have the right shape. No compile-time help.

// function processOrderJS(order) {
//   // Is order.status a valid status? Is order.items an array? Unknown at compile time.
//   return order.status === "shipped";
// }

// TYPESCRIPT — type aliases enforce shape at compile time
function processOrderTS(order: Order): boolean {
  // TypeScript knows EXACTLY what properties exist and their types
  // Auto-completion works, refactoring is safe, typos are caught
  return order.status === "shipped";
}

console.log("Order shipped?", processOrderTS(order));

// JS: function accepts anything — prone to runtime errors
// function applyDiscount(item, discount) {
//   return item.price * (1 - discount); // what if item has no price?
// }

// TS: function is explicit and safe
function applyDiscount(item: CartItem, discount: number): number {
  return item.unitPrice * item.quantity * (1 - discount);
}

const discountedTotal = applyDiscount(cartItem, 0.1);
console.log("Discounted cart total:", discountedTotal.toFixed(2));

// =====================================
// COMMON MISTAKES
// =====================================

console.log("\n=== Common Mistakes (see code comments) ===");

// MISTAKE 1: Confusing type alias with creating a new/distinct type
// A type alias is just a NAME. 'UserName' and 'string' are the same type.
type Kg = number;
type Lbs = number;
const weight: Kg = 70;
// const otherWeight: Lbs = weight; // This is ALLOWED — both are just 'number'
// To get truly distinct types, use "branded types" (advanced pattern)
console.log("Kg and Lbs are both number — interchangeable (common confusion)");

// MISTAKE 2: Forgetting that mapped/conditional types are types, not values
// You cannot do 'const x = Partial<User>' — Partial<User> is a TYPE, not a value.

// MISTAKE 3: Circular type aliases (usually an error)
// type A = B; // ERROR if B references A at the same level
// Recursive types are OK because they use optional/array references (not direct cycles)

// MISTAKE 4: Overusing type aliases for simple things
// BAD: type MyString = string; (adds no value)
// GOOD: type OrderStatus = "pending" | "shipped" | ...; (meaningful constraint)

// MISTAKE 5: Using 'type' for class-based inheritance where 'interface' fits better
// If you need 'implements' in a class, use 'interface', not 'type'

// MISTAKE 6: Forgetting the semicolon (not a hard error, but convention)
type GoodStyle = { id: number }; // semicolons after properties — this is correct
// type BadStyle = { id: number } // missing semicolon on last property — TypeScript allows it, but inconsistent

console.log("See code comments for common mistakes");

// =====================================
// BEST PRACTICES
// =====================================

console.log("\n=== Best Practices (see code comments) ===");

// 1. Use PascalCase for all type aliases
type GoodName = string;       // GOOD
// type badName = string;     // BAD

// 2. Name aliases after WHAT they represent, not HOW they look
type OrderStatus_ = "pending" | "shipped";  // GOOD — describes domain concept
// type StringUnion = "pending" | "shipped"; // BAD — describes structure, not meaning

// 3. Co-locate type aliases with the code that uses them
// Define UserRole near the user-related code, not in a global types file

// 4. Export type aliases that are part of your public API
// export type ApiResponse<T> = { data: T; status: number };

// 5. Prefer 'interface' for extendable object shapes (classes, public APIs)
//    Prefer 'type' for unions, intersections, mapped types, generic utilities

// 6. Avoid deep nesting in type aliases — break into smaller named aliases
// BAD:
type Deeply = { a: { b: { c: { d: string } } } };
// GOOD: break it up
type Level3 = { d: string };
type Level2 = { c: Level3 };
type Level1 = { b: Level2 };
type Flat = { a: Level1 };

// 7. Use generic aliases (ApiResponse<T>) instead of duplicating shapes

// 8. Document complex type aliases with a comment explaining intent
/** Represents the status of an order through its lifecycle */
type FinalOrderStatus = "pending" | "delivered" | "cancelled";

console.log("See code comments for best practices");

// =====================================
// INTERVIEW QUESTIONS & ANSWERS
// =====================================

console.log("\n=== Interview Questions ===");

/*
Q1: What is the difference between a type alias and an interface in TypeScript?
A: Both can describe object shapes, but:
   - Interfaces support declaration merging (you can reopen them to add properties).
   - Type aliases support unions, intersections, mapped types, conditional types, and template literals.
   - Interfaces use 'extends' for inheritance; type aliases use '&' (intersection).
   - For classes, 'implements' works with both, but 'interface' is more idiomatic.
   - Use 'interface' for extendable object shapes; use 'type' for complex compositions.
*/

/*
Q2: Can a type alias be recursive? Give an example.
A: Yes. A type alias can reference itself as long as the recursion is through
   an optional or array property (not a direct infinite expansion).
   Example:
     type TreeNode = { value: string; children?: TreeNode[] };
   This works because 'children' is optional and is an array reference, not
   a direct self-reference that would expand infinitely at compile time.
*/

/*
Q3: What is a generic type alias and why is it useful?
A: A generic type alias takes type parameters (like <T>) and uses them in the
   alias definition, similar to how a generic function works but at the type level.
   Example: type ApiResponse<T> = { data: T; status: number }
   It is useful because it allows you to write one reusable type shape that works
   for many different data types (ApiResponse<User>, ApiResponse<Order[]>, etc.)
   without duplicating the structure.
*/

/*
Q4: What is a mapped type alias and what problem does it solve?
A: A mapped type alias transforms every property of an existing type by iterating
   over its keys with [K in keyof T]. It solves the problem of manually rewriting
   a type with a small modification to all properties — for example, making every
   property optional (Partial<T>), readonly (Readonly<T>), or adding metadata to
   each field. Built-in TypeScript utilities like Partial, Required, Readonly, and
   Record are all implemented as mapped types.
*/

// =====================================
// PRACTICE TASKS
// =====================================

console.log("\n=== Practice Tasks ===");

/*
PRACTICE TASK 1:
-----------------
Create a type alias for a "Product Review" system.
Requirements:
- A ReviewRating type that only allows numbers 1 through 5 as a union type
- A Review type alias with: id (number), productId (number), authorName (string),
  rating (ReviewRating), comment (string), createdAt (string), isVerified (boolean)
- A ReviewSummary type alias with: averageRating (number), totalReviews (number),
  ratingBreakdown as a mapped type from ReviewRating to number
- A generic ApiResponse<T> usage: create a type ReviewListResponse = ApiResponse<Review[]>
- Write a function that takes a Review[] and returns ReviewSummary
- Test it with at least 3 sample reviews
*/

/*
PRACTICE TASK 2:
-----------------
Build a type-safe notification system using type aliases.
Requirements:
- A NotificationType union: "email" | "sms" | "push" | "in_app"
- A NotificationStatus union: "queued" | "sent" | "delivered" | "failed" | "read"
- A NotificationPriority union: "low" | "normal" | "high" | "urgent"
- A Notification type alias with all relevant fields (id, type, status, priority,
  recipient, subject, body, createdAt, sentAt?)
- A template literal type: NotificationEventKey = `notification:${NotificationStatus}`
- A generic NotificationQueue<T extends Notification> type alias
- A function to create a notification, a function to update its status
- Use the EventName template literal type for a typed event emitter
*/

/*
PRACTICE TASK 3:
-----------------
Design the type aliases for a user authentication module.
Requirements:
- UserRole and Permission union type aliases (at least 5 permissions)
- A RolePermissionMap mapped type that maps each UserRole to Permission[]
- A LoginCredentials type alias (email, password)
- A RegisterInput type alias (name, email, password, confirmPassword, role)
- A JWTPayload type alias with standard JWT fields plus custom user fields
- An AuthState conditional type: if the user is logged in, includes user + token;
  if not, includes only a redirectUrl
- A RefreshTokenResponse generic alias
- Write a mock login function that returns AuthPayload and a mock logout function
- Add at least one example of a template literal type for auth-related event names
*/

console.log("Practice tasks defined above — implement them to test your understanding!");
console.log("\nFile complete. All examples are self-contained and runnable.");
