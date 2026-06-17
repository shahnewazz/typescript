// =====================================
// 06-INTERFACES IN TYPESCRIPT
// =====================================
// Target: JavaScript developers learning TypeScript from scratch
// An interface defines a "contract" — the shape that an object must conform to.
// Think of it as a blueprint or a specification, not an implementation.

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// --- JavaScript (no contracts, no safety) ---
// function greetUser(user) {
//   console.log("Hello, " + user.name); // What if user has no .name? Runtime error!
// }

// --- TypeScript (interface enforces shape) ---
// interface IUser { name: string; }
// function greetUser(user: IUser) {
//   console.log("Hello, " + user.name); // Compiler guarantees .name exists
// }

// =====================================
// BASIC INTERFACE
// =====================================

// WHAT: An interface declares the shape (property names + types) an object must have.
// WHY:  Gives you compile-time safety. Every object that claims to be this type
//       must have exactly these properties with the correct types.
// SYNTAX: interface InterfaceName { property: type; }

interface IUser {
  id: number;
  name: string;
  email: string;
}

const user1: IUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

console.log("Basic interface:", user1.name); // Alice

// =====================================
// OPTIONAL PROPERTIES (?:)
// =====================================

// WHAT: A property marked with ? is not required when creating an object.
// WHY:  Real-world data is often incomplete. A user might not have a phone number yet.
// SYNTAX: propertyName?: type;

interface IUserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;       // optional
  avatarUrl?: string;   // optional
  bio?: string;         // optional
}

const minimalUser: IUserProfile = { id: 2, name: "Bob", email: "bob@example.com" };
const fullUser: IUserProfile = {
  id: 3,
  name: "Carol",
  email: "carol@example.com",
  phone: "+1-555-0100",
  avatarUrl: "https://cdn.example.com/carol.jpg",
  bio: "Full-stack developer",
};

console.log("Optional props - minimal:", minimalUser.phone);    // undefined
console.log("Optional props - full:",    fullUser.phone);       // +1-555-0100

// =====================================
// READONLY PROPERTIES
// =====================================

// WHAT: A readonly property can be set when the object is created but never changed after.
// WHY:  Prevents accidental mutation of data that should be immutable (e.g., IDs, tokens).
// SYNTAX: readonly propertyName: type;

interface IProduct {
  readonly id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const laptop: IProduct = {
  id: 101,
  name: "ThinkPad X1",
  price: 1299.99,
  category: "Electronics",
  inStock: true,
};

laptop.price = 1199.99; // OK — price can change (sale!)
// laptop.id = 999;     // ERROR: Cannot assign to 'id' because it is a read-only property.

console.log("Readonly - product id:", laptop.id);
console.log("Readonly - updated price:", laptop.price);

// =====================================
// INDEX SIGNATURES IN INTERFACES
// =====================================

// WHAT: An index signature allows an object to have any number of properties
//       with keys of a specified type (usually string or number).
// WHY:  When you know the value type but not all the key names ahead of time.
//       e.g., a dictionary of settings, a map of feature flags.
// SYNTAX: [key: string]: valueType;

interface IInventory {
  warehouseId: string;
  [productId: string]: number | string; // any extra key must be number or string
}

const warehouse: IInventory = {
  warehouseId: "WH-001",
  "prod-101": 50,   // 50 units of product 101
  "prod-202": 0,    // out of stock
  "prod-303": 120,
};

console.log("Index signature - prod-101 qty:", warehouse["prod-101"]); // 50

// Simpler example — feature flags
interface IFeatureFlags {
  [featureName: string]: boolean;
}

const flags: IFeatureFlags = {
  darkMode: true,
  betaCheckout: false,
  newDashboard: true,
};

console.log("Feature flags - darkMode:", flags.darkMode); // true

// =====================================
// METHOD SIGNATURES IN INTERFACES
// =====================================

// WHAT: Interfaces can describe methods (functions on objects), not just data properties.
// WHY:  Enforces that any implementing object provides those methods with correct signatures.
// SYNTAX: methodName(param: type): returnType;
//   OR    methodName: (param: type) => returnType;

interface ICart {
  readonly cartId: string;
  userId: number;
  items: IOrderItem[];
  addItem(productId: number, quantity: number): void;
  removeItem(productId: number): void;
  getTotal(): number;
  clear(): void;
}

// We will implement ICart in a class later — see the "implements" section below.

// Quick demo of an inline object satisfying a method-signature interface:
interface ICalculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calc: ICalculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

console.log("Method signature - add:", calc.add(10, 5));       // 15
console.log("Method signature - subtract:", calc.subtract(10, 5)); // 5

// =====================================
// INTERFACE FOR FUNCTION TYPES
// =====================================

// WHAT: An interface can describe a standalone function's signature.
// WHY:  Gives reusable, named function-type contracts (alternative to type aliases for functions).
// SYNTAX: interface IFnName { (param: type): returnType; }

interface IAuthValidator {
  (token: string, secret: string): boolean;
}

const validateToken: IAuthValidator = (token, secret) => {
  // Simplified — real impl would verify JWT signature
  return token.startsWith("Bearer ") && secret.length > 0;
};

console.log("Function interface:", validateToken("Bearer abc123", "mysecret")); // true

// Another example — a formatter function type
interface IFormatter {
  (value: number, currency: string): string;
}

const formatPrice: IFormatter = (value, currency) =>
  `${currency}${value.toFixed(2)}`;

console.log("Function interface - price:", formatPrice(49.9, "$")); // $49.90

// =====================================
// INTERFACE FOR ARRAY TYPES
// =====================================

// WHAT: An interface can describe the shape of an array (each element's type).
// WHY:  Useful when you want to name and reuse an array contract.
// SYNTAX: interface IArrayName { [index: number]: ElementType; }

interface IProductList {
  [index: number]: IProduct;
  length: number;       // arrays have length
}

const products: IProductList = [
  { id: 1, name: "Mouse",    price: 29.99, category: "Electronics", inStock: true },
  { id: 2, name: "Keyboard", price: 79.99, category: "Electronics", inStock: false },
];

console.log("Array interface - first product:", products[0].name); // Mouse
console.log("Array interface - length:", products.length);         // 2

// =====================================
// ORDER ITEM INTERFACE (supporting type)
// =====================================

interface IOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// =====================================
// EXTENDING INTERFACES (single)
// =====================================

// WHAT: An interface can extend another, inheriting all its properties.
// WHY:  Reuse common structure. An admin IS a user — no need to repeat user fields.
// SYNTAX: interface Child extends Parent { ... }

interface IUserBase {
  id: number;
  name: string;
  email: string;
}

interface IAdminUser extends IUserBase {
  role: "admin" | "superadmin";
  permissions: string[];
  canDeleteUsers: boolean;
}

const admin: IAdminUser = {
  id: 10,
  name: "Dan",
  email: "dan@example.com",
  role: "superadmin",
  permissions: ["read", "write", "delete"],
  canDeleteUsers: true,
};

console.log("Extend single - admin name:", admin.name);        // Dan
console.log("Extend single - admin role:", admin.role);        // superadmin

// =====================================
// EXTENDING MULTIPLE INTERFACES
// =====================================

// WHAT: A single interface can extend multiple parent interfaces at once.
// WHY:  Compose complex types from smaller, focused pieces.
// SYNTAX: interface Child extends A, B, C { ... }

interface ITimestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface ISoftDeletable {
  deletedAt?: Date;
  isDeleted: boolean;
}

// IOrder extends ITimestamped AND ISoftDeletable AND gets its own fields
interface IOrder extends ITimestamped, ISoftDeletable {
  readonly orderId: string;
  userId: number;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
}

const order1: IOrder = {
  orderId: "ORD-20260617-001",
  userId: 1,
  items: [
    {
      productId: 101,
      productName: "ThinkPad X1",
      quantity: 1,
      unitPrice: 1299.99,
      subtotal: 1299.99,
    },
  ],
  totalAmount: 1299.99,
  status: "confirmed",
  shippingAddress: "123 Main St, Springfield",
  createdAt: new Date("2026-06-17"),
  updatedAt: new Date("2026-06-17"),
  isDeleted: false,
};

console.log("Extend multiple - orderId:", order1.orderId);     // ORD-20260617-001
console.log("Extend multiple - status:", order1.status);       // confirmed
console.log("Extend multiple - createdAt:", order1.createdAt.toISOString().slice(0, 10)); // 2026-06-17

// =====================================
// INTERFACE MERGING (DECLARATION MERGING)
// =====================================

// WHAT: If you declare an interface with the same name twice, TypeScript MERGES them.
//       Both declarations are combined into one interface.
// WHY:  Useful for augmenting third-party library types without modifying their source.
//       e.g., adding properties to Express's Request object.
// NOTE: This does NOT work with type aliases — interfaces are unique in this regard.

interface IAuthToken {
  token: string;
  tokenType: "Bearer" | "Basic";
  expiresAt: Date;
}

// Later in the codebase (or in a .d.ts augmentation file):
interface IAuthToken {
  refreshToken?: string;   // merged in — both declarations now form one interface
  scope?: string[];
}

// TypeScript sees IAuthToken as having ALL properties from both declarations:
const authToken: IAuthToken = {
  token: "eyJhbGciOiJIUzI1NiJ9.payload.signature",
  tokenType: "Bearer",
  expiresAt: new Date("2026-12-31"),
  refreshToken: "refresh_abc123",
  scope: ["read:profile", "write:orders"],
};

console.log("Declaration merging - token type:", authToken.tokenType);       // Bearer
console.log("Declaration merging - scope:", authToken.scope);                // ["read:profile", "write:orders"]
console.log("Declaration merging - refresh token:", authToken.refreshToken); // refresh_abc123

// =====================================
// IMPLEMENTING INTERFACES IN CLASSES
// =====================================

// WHAT: A class can declare that it "implements" an interface.
//       TypeScript then verifies the class provides all required members.
// WHY:  Enforces a contract at the class level. Multiple classes can implement
//       the same interface while providing different logic (polymorphism).
// SYNTAX: class MyClass implements IMyInterface { ... }

// Let's implement ICart from earlier:
class ShoppingCart implements ICart {
  readonly cartId: string;
  userId: number;
  items: IOrderItem[];

  constructor(cartId: string, userId: number) {
    this.cartId = cartId;
    this.userId = userId;
    this.items = [];
  }

  addItem(productId: number, quantity: number): void {
    // Simplified — real impl would look up product details from a store/API
    const existing = this.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.unitPrice * existing.quantity;
    } else {
      const unitPrice = 9.99; // placeholder price
      this.items.push({
        productId,
        productName: `Product-${productId}`,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
      });
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  clear(): void {
    this.items = [];
  }
}

const cart = new ShoppingCart("CART-001", 42);
cart.addItem(101, 2);
cart.addItem(202, 1);
console.log("implements - cart total:", cart.getTotal().toFixed(2)); // 29.97
cart.removeItem(202);
console.log("implements - after remove total:", cart.getTotal().toFixed(2)); // 19.98

// A class can implement MULTIPLE interfaces:
interface ISerializable {
  serialize(): string;
}

interface ILoggable {
  log(): void;
}

class AuditableCart extends ShoppingCart implements ISerializable, ILoggable {
  serialize(): string {
    return JSON.stringify({ cartId: this.cartId, items: this.items });
  }

  log(): void {
    console.log(`[Cart ${this.cartId}] Items: ${this.items.length}, Total: $${this.getTotal().toFixed(2)}`);
  }
}

const auditCart = new AuditableCart("CART-002", 99);
auditCart.addItem(303, 3);
auditCart.log(); // [Cart CART-002] Items: 1, Total: $29.97
console.log("Serialized cart:", auditCart.serialize());

// =====================================
// GENERIC INTERFACES
// =====================================

// WHAT: A generic interface uses a type parameter (T) so it can work with any type.
// WHY:  Write one interface that handles many types safely, instead of duplicating.
//       e.g., one IApiResponse<T> that wraps a user, product, order, etc.
// SYNTAX: interface IMyInterface<T> { property: T; }

interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  statusCode: number;
  timestamp: string;
  errors?: string[];
}

// Use IApiResponse<IUser> for a user endpoint:
const userResponse: IApiResponse<IUser> = {
  success: true,
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  message: "User fetched successfully",
  statusCode: 200,
  timestamp: new Date().toISOString(),
};

// Use IApiResponse<IProduct[]> for a products endpoint:
const productsResponse: IApiResponse<IProduct[]> = {
  success: true,
  data: [
    { id: 1, name: "Mouse", price: 29.99, category: "Electronics", inStock: true },
  ],
  message: "Products fetched",
  statusCode: 200,
  timestamp: new Date().toISOString(),
};

// Use IApiResponse<null> for an error:
const errorResponse: IApiResponse<null> = {
  success: false,
  data: null,
  message: "Not found",
  statusCode: 404,
  timestamp: new Date().toISOString(),
  errors: ["Resource with given ID does not exist"],
};

console.log("Generic - user response:", userResponse.data?.name);         // Alice
console.log("Generic - products count:", productsResponse.data?.length);  // 1
console.log("Generic - error:", errorResponse.errors?.[0]);               // Resource with given ID...

// Generic interface with a constraint:
interface IRepository<T extends { id: number }> {
  findById(id: number): T | undefined;
  findAll(): T[];
  save(entity: T): T;
  delete(id: number): boolean;
}

// A concrete implementation for products:
class ProductRepository implements IRepository<IProduct> {
  private store: IProduct[] = [];

  findById(id: number): IProduct | undefined {
    return this.store.find((p) => p.id === id);
  }

  findAll(): IProduct[] {
    return [...this.store];
  }

  save(product: IProduct): IProduct {
    const index = this.store.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      this.store[index] = product;
    } else {
      this.store.push(product);
    }
    return product;
  }

  delete(id: number): boolean {
    const before = this.store.length;
    this.store = this.store.filter((p) => p.id !== id);
    return this.store.length < before;
  }
}

const productRepo = new ProductRepository();
productRepo.save({ id: 1, name: "Webcam", price: 89.99, category: "Electronics", inStock: true });
productRepo.save({ id: 2, name: "Headset", price: 149.99, category: "Electronics", inStock: true });
console.log("Generic repo - all products:", productRepo.findAll().map((p) => p.name)); // ["Webcam", "Headset"]
console.log("Generic repo - find by id:", productRepo.findById(2)?.name);               // Headset

// =====================================
// PAYMENT INTERFACE (real-world example)
// =====================================

interface IPaymentMethod {
  type: "credit_card" | "debit_card" | "paypal" | "crypto" | "bank_transfer";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

interface IPayment {
  readonly paymentId: string;
  orderId: string;
  userId: number;
  amount: number;
  currency: string;
  method: IPaymentMethod;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  processedAt?: Date;
  failureReason?: string;
  process(): Promise<boolean>;
  refund(amount?: number): Promise<boolean>;
}

// A simple (non-network) implementation for demonstration:
class MockPayment implements IPayment {
  readonly paymentId: string;
  orderId: string;
  userId: number;
  amount: number;
  currency: string;
  method: IPaymentMethod;
  status: IPayment["status"];
  processedAt?: Date;
  failureReason?: string;

  constructor(data: Omit<IPayment, "process" | "refund">) {
    this.paymentId = data.paymentId;
    this.orderId    = data.orderId;
    this.userId     = data.userId;
    this.amount     = data.amount;
    this.currency   = data.currency;
    this.method     = data.method;
    this.status     = data.status;
  }

  async process(): Promise<boolean> {
    this.status = "processing";
    // Simulate async payment gateway call
    await Promise.resolve();
    this.status = "completed";
    this.processedAt = new Date();
    return true;
  }

  async refund(amount?: number): Promise<boolean> {
    const refundAmount = amount ?? this.amount;
    console.log(`Refunding ${this.currency}${refundAmount} for payment ${this.paymentId}`);
    this.status = "refunded";
    return true;
  }
}

const payment = new MockPayment({
  paymentId: "PAY-001",
  orderId: "ORD-20260617-001",
  userId: 1,
  amount: 1299.99,
  currency: "$",
  method: { type: "credit_card", last4: "4242", expiryMonth: 12, expiryYear: 2028 },
  status: "pending",
});

payment.process().then(() => {
  console.log("Payment status:", payment.status);         // completed
  console.log("Processed at:", payment.processedAt?.toISOString().slice(0, 10)); // 2026-06-17
});

// =====================================
// INTERFACE vs TYPE ALIAS
// =====================================

// Key differences (choose based on use case):
//
// +------------------------------------------+-----------------------------+---------------------------+
// | Feature                                  | interface                   | type alias                |
// +------------------------------------------+-----------------------------+---------------------------+
// | Declaration merging                      | YES (can reopen/merge)      | NO (error if redeclared)  |
// | Extending/inheriting                     | extends keyword             | & (intersection)          |
// | Implementing in classes                  | YES (implements)            | YES (implements)          |
// | Describing primitives/unions/tuples      | NO                          | YES                       |
// | Generic support                          | YES                         | YES                       |
// | Better error messages (generally)        | YES (named shape)           | Sometimes verbose         |
// | When to use                              | Object shapes, class ctrs   | Unions, tuples, complex   |
// +------------------------------------------+-----------------------------+---------------------------+

// Example: type alias can express things interface cannot:
type StringOrNumber = string | number;           // union — only type alias
type Pair = [string, number];                    // tuple — only type alias
type AdminOrUser = IAdminUser | IUserBase;        // union of interfaces — only type alias

// Both can describe an object shape:
interface IPointInterface { x: number; y: number; }
type PointType = { x: number; y: number };

// RULE OF THUMB:
// - Use interface for objects/classes (especially in libraries and OOP code).
// - Use type for unions, intersections, tuples, or when you need mapped/conditional types.

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1: Treating an interface like a class (interfaces have NO runtime presence)
// -----------------------------------------------------------------------
// interface IAnimal { speak(): void; }
// const a = new IAnimal(); // ERROR: 'IAnimal' only refers to a type, not a value.
//
// Fix: Use a class that implements the interface, or an object literal.

// MISTAKE 2: Forgetting the `implements` keyword
// -----------------------------------------------------------------------
// class Dog { bark() { console.log("Woof"); } }
// const d: IAnimal = new Dog(); // ERROR: Dog is missing speak()
// No compiler error at class definition — you only catch it when you try to assign.
//
// Fix: Always declare `class Dog implements IAnimal { ... }` so the compiler
//      catches missing methods right at the class definition.

// MISTAKE 3: Mutating a readonly property
// -----------------------------------------------------------------------
// const p: IProduct = { id: 1, name: "X", price: 10, category: "Y", inStock: true };
// p.id = 2; // ERROR: Cannot assign to 'id' because it is a read-only property.

// MISTAKE 4: Assuming optional means "any type"
// -----------------------------------------------------------------------
// interface IFoo { bar?: string; }
// const f: IFoo = { bar: 42 }; // ERROR: Type 'number' is not assignable to type 'string | undefined'.
//
// Optional (?) only means the property can be ABSENT — it still must be the declared type when present.

// MISTAKE 5: Confusing index signatures with regular properties
// -----------------------------------------------------------------------
// interface IMixed {
//   count: number;
//   [key: string]: string; // ERROR: 'count' (number) is not assignable to index signature (string)
// }
//
// Fix: The index signature value type must be a supertype of all explicit properties:
// interface IMixed { count: number; [key: string]: number | string; }

// =====================================
// BEST PRACTICES
// =====================================

// 1. NAMING: The "I" prefix (IUser, IProduct) is a popular convention (from Java/.NET).
//    Microsoft's own TypeScript guidelines now recommend AGAINST the prefix for user code,
//    but many teams still use it. Pick one convention and be consistent.
//    Libraries: User, Product  |  Enterprise/teams: IUser, IProduct

// 2. Keep interfaces small and focused (Interface Segregation Principle).
//    Instead of one giant IEntity with 30 properties, compose smaller interfaces.

// 3. Prefer interface over type for object shapes you expect classes to implement,
//    because the error messages are cleaner and declaration merging is available.

// 4. Use readonly on IDs and any property that should not change after creation.

// 5. Use generic interfaces (IApiResponse<T>, IRepository<T>) to avoid duplication.

// 6. Don't put implementation logic in interfaces — that is what classes are for.

// =====================================
// INTERVIEW QUESTIONS & ANSWERS
// =====================================

// Q1: What is the difference between an interface and a type alias?
// A:  Interfaces support declaration merging (reopening) and are generally preferred
//     for object shapes and class contracts. Type aliases support unions, intersections,
//     and tuples which interfaces cannot express. Both can describe object shapes and
//     be implemented by classes.

// Q2: Can a class implement multiple interfaces?
// A:  Yes. Syntax: class MyClass implements IFoo, IBar, IBaz { ... }
//     The class must provide all members declared by every interface.

// Q3: What is declaration merging and when would you use it?
// A:  When two interface declarations share the same name, TypeScript merges their
//     properties into one interface. It is commonly used to augment third-party types
//     (e.g., adding custom properties to Express's Request interface in a .d.ts file)
//     without modifying the library's source.

// Q4: Is an interface available at runtime?
// A:  No. Interfaces are erased during compilation to JavaScript. They are purely a
//     compile-time construct and add zero overhead to the runtime bundle.
//     You cannot use typeof or instanceof checks against an interface directly.

// =====================================
// FULL REAL-WORLD EXAMPLE — E-COMMERCE
// =====================================

// Bringing all the interfaces together in a realistic mini-scenario:

interface IUserAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ICustomer extends IUserBase {
  phone?: string;
  defaultAddress?: IUserAddress;
  loyaltyPoints: number;
}

interface IStoreProduct extends IProduct {
  sku: string;
  weight: number;     // kg
  stock: number;
}

interface ICheckoutSummary {
  customer: ICustomer;
  cart: { items: IOrderItem[]; total: number };
  payment: { method: IPaymentMethod; amount: number };
  delivery: IUserAddress;
  estimatedDelivery: string;
}

// Factory function that returns a typed summary:
function buildCheckoutSummary(
  customer: ICustomer,
  cartItems: IOrderItem[],
  method: IPaymentMethod,
  delivery: IUserAddress
): ICheckoutSummary {
  const total = cartItems.reduce((s, i) => s + i.subtotal, 0);
  return {
    customer,
    cart: { items: cartItems, total },
    payment: { method, amount: total },
    delivery,
    estimatedDelivery: "2026-06-20",
  };
}

const customer: ICustomer = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  phone: "+1-555-0101",
  loyaltyPoints: 450,
  defaultAddress: {
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    postalCode: "62701",
    country: "US",
  },
};

const cartItems: IOrderItem[] = [
  { productId: 1, productName: "ThinkPad X1", quantity: 1, unitPrice: 1299.99, subtotal: 1299.99 },
  { productId: 2, productName: "USB-C Hub",   quantity: 2, unitPrice: 39.99,  subtotal: 79.98  },
];

const payMethod: IPaymentMethod = { type: "credit_card", last4: "4242", expiryMonth: 12, expiryYear: 2028 };
const deliveryAddr: IUserAddress = customer.defaultAddress!;

const summary = buildCheckoutSummary(customer, cartItems, payMethod, deliveryAddr);

console.log("--- Checkout Summary ---");
console.log("Customer:", summary.customer.name);
console.log("Items:", summary.cart.items.length);
console.log("Total: $" + summary.cart.total.toFixed(2));
console.log("Payment:", summary.payment.method.type, "****" + summary.payment.method.last4);
console.log("Deliver to:", summary.delivery.city, summary.delivery.state);
console.log("Estimated delivery:", summary.estimatedDelivery);

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — Extend and implement
// -------------------------------------------------
// a) Create an interface IEmployee with: id, name, email, department, salary.
// b) Extend it with IManager that adds: teamSize: number, directReports: IEmployee[].
// c) Create a class TeamManager that implements IManager and adds a method
//    getAverageSalary() that returns the average salary of its directReports.
// d) Instantiate it with at least 2 direct reports and log the average salary.

// TASK 2 — Generic interface
// -------------------------------------------------
// a) Create a generic interface IPaginatedResponse<T> with:
//    data: T[], page: number, pageSize: number, totalItems: number, totalPages: number.
// b) Write a function paginateArray<T>(items: T[], page: number, pageSize: number): IPaginatedResponse<T>
//    that slices the array and fills in the pagination metadata.
// c) Use it to paginate an array of 25 IProduct objects (you can use placeholder data)
//    and log page 2 with a page size of 10.

// TASK 3 — Declaration merging in practice
// -------------------------------------------------
// a) Declare an interface IConfig with: apiBaseUrl: string, timeout: number.
// b) In a "separate module" (just below the first declaration in the same file),
//    reopen IConfig to add: retryCount: number, debugMode: boolean.
// c) Create a const appConfig: IConfig that satisfies BOTH declarations (all four properties).
// d) Write a function applyConfig(config: IConfig): void that logs each property.
//    Call it with appConfig.
