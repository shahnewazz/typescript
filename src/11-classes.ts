// =====================================
// 11-CLASSES IN TYPESCRIPT
// =====================================
// Target: JavaScript developers learning TypeScript from scratch
// A class is a blueprint for creating objects with shared properties and behavior.
// TypeScript builds on JavaScript classes by adding types, access modifiers, and more.

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// --- JavaScript class (no type safety) ---
// class Product {
//   constructor(name, price) {
//     this.name = name;   // Could be anything
//     this.price = price; // Could be a string by accident
//   }
//   applyDiscount(pct) {
//     return this.price * (1 - pct); // pct could be 50 instead of 0.5 — no warning!
//   }
// }

// --- TypeScript class (types enforced at compile time) ---
// class Product {
//   name: string;
//   price: number;
//   constructor(name: string, price: number) { ... }
//   applyDiscount(pct: number): number { ... }
// }
// TypeScript adds:
//   1. Typed properties and constructor parameters
//   2. Access modifiers: public, private, protected, readonly
//   3. Parameter properties shorthand
//   4. Abstract classes and methods
//   5. Interface implementation enforcement
//   6. Return type annotations on methods

// =====================================
// CLASS BASICS
// =====================================

// =====================================
// 1. CLASS DECLARATION WITH PROPERTIES AND TYPES
// =====================================

// WHAT: A class groups related data (properties) and behavior (methods) together.
// WHY:  Organizes code around real-world concepts; enables code reuse via instantiation.
// SYNTAX: class ClassName { property: type; }

class User {
  // Typed instance properties
  id: number;
  name: string;
  email: string;
  isLoggedIn: boolean;

  // Constructor with typed parameters
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isLoggedIn = false; // default value
  }

  // Instance method with typed parameters and return type
  login(password: string): boolean {
    // Simplified: in real apps you'd verify the password hash
    if (password.length >= 6) {
      this.isLoggedIn = true;
      console.log(`${this.name} logged in successfully.`);
      return true;
    }
    console.log(`Login failed for ${this.name}.`);
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    console.log(`${this.name} logged out.`);
  }

  greet(): string {
    return `Hello, I am ${this.name} (${this.email})`;
  }
}

// Creating instances
const alice = new User(1, "Alice", "alice@example.com");
const bob = new User(2, "Bob", "bob@example.com");

console.log(alice.greet());       // Hello, I am Alice (alice@example.com)
alice.login("securepass");        // Alice logged in successfully.
console.log(alice.isLoggedIn);    // true
alice.logout();                   // Alice logged out.
console.log(alice.isLoggedIn);    // false

// =====================================
// 2. STATIC PROPERTIES AND METHODS
// =====================================

// WHAT: Static members belong to the CLASS itself, not to any instance.
// WHY:  Useful for utility functions, counters, or shared data across all instances.
// SYNTAX: static propertyName: type; / static methodName(): returnType {}

class Product {
  static count: number = 0;             // shared across all Product instances
  static readonly TAX_RATE: number = 0.1; // constant shared by all

  id: number;
  name: string;
  price: number;

  constructor(name: string, price: number) {
    Product.count++;                    // increment shared counter
    this.id = Product.count;
    this.name = name;
    this.price = price;
  }

  // Static method: called on the class, not on an instance
  static getTaxRate(): number {
    return Product.TAX_RATE;
  }

  // Instance method
  applyDiscount(percentOff: number): number {
    if (percentOff < 0 || percentOff > 100) {
      throw new Error("Discount must be between 0 and 100.");
    }
    return this.price * (1 - percentOff / 100);
  }

  getPriceWithTax(): number {
    return this.price * (1 + Product.TAX_RATE);
  }

  describe(): string {
    return `Product #${this.id}: ${this.name} — $${this.price.toFixed(2)}`;
  }
}

const laptop = new Product("Laptop", 1200);
const phone = new Product("Phone", 800);

console.log(Product.count);                    // 2
console.log(Product.getTaxRate());             // 0.1
console.log(laptop.applyDiscount(20));         // 960
console.log(phone.getPriceWithTax());          // 880
console.log(laptop.describe());               // Product #1: Laptop — $1200.00

// =====================================
// 3. READONLY PROPERTIES
// =====================================

// WHAT: readonly properties can only be set once — in the constructor or at declaration.
// WHY:  Prevents accidental mutation of values that should never change after creation.
// SYNTAX: readonly propertyName: type;

class Order {
  readonly orderId: string;         // set once, never changed
  readonly createdAt: Date;
  private items: { name: string; price: number; qty: number }[] = [];
  private customerId: number;

  constructor(customerId: number) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.createdAt = new Date();
    this.customerId = customerId;
  }

  addItem(name: string, price: number, qty: number = 1): void {
    const existing = this.items.find((i) => i.name === name);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ name, price, qty });
    }
    console.log(`Added ${qty}x ${name} to order ${this.orderId}`);
  }

  removeItem(name: string): void {
    const index = this.items.findIndex((i) => i.name === name);
    if (index === -1) {
      console.log(`${name} not found in order.`);
      return;
    }
    this.items.splice(index, 1);
    console.log(`Removed ${name} from order ${this.orderId}`);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  getSummary(): string {
    const lines = this.items.map(
      (i) => `  ${i.name} x${i.qty} @ $${i.price.toFixed(2)}`
    );
    return [
      `Order: ${this.orderId}`,
      `Customer: ${this.customerId}`,
      `Items:\n${lines.join("\n")}`,
      `Total: $${this.getTotal().toFixed(2)}`,
    ].join("\n");
  }
}

const order1 = new Order(101);
order1.addItem("Laptop", 1200, 1);
order1.addItem("Mouse", 30, 2);
order1.addItem("Laptop", 1200, 1); // adds qty to existing
console.log(order1.getSummary());

// order1.orderId = "HACK"; // Error! Cannot assign to 'orderId' because it is a read-only property.

// =====================================
// 4. PARAMETER PROPERTIES SHORTHAND
// =====================================

// WHAT: TypeScript lets you declare AND initialize properties directly in the constructor
//       signature by adding an access modifier before the parameter name.
// WHY:  Eliminates boilerplate — no need to declare the property and then assign it.
// SYNTAX: constructor(public name: string, private age: number) {}

// Without shorthand (verbose):
// class PersonVerbose {
//   name: string;
//   private age: number;
//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }
// }

// With shorthand (concise):
class Person {
  constructor(
    public name: string,         // public: accessible everywhere
    private age: number,         // private: only inside this class
    protected city: string,      // protected: this class + subclasses
    readonly id: number          // readonly: can't be changed after construction
  ) {}

  introduce(): string {
    return `I'm ${this.name}, ${this.age} years old, from ${this.city}. ID: ${this.id}`;
  }
}

const charlie = new Person("Charlie", 30, "New York", 42);
console.log(charlie.introduce());    // I'm Charlie, 30 years old, from New York. ID: 42
console.log(charlie.name);           // "Charlie"  (public — accessible)
// console.log(charlie.age);         // Error! 'age' is private
// console.log(charlie.city);        // Error! 'city' is protected

// =====================================
// CLASS FEATURES
// =====================================

// =====================================
// 5. GETTERS AND SETTERS
// =====================================

// WHAT: Special methods that look like property access but run code when you get or set a value.
// WHY:  Lets you add validation, formatting, or computed logic while keeping a clean API.
// SYNTAX: get propName(): type { ... }  /  set propName(value: type) { ... }

class Cart {
  private _items: { name: string; price: number }[] = [];
  private _discountPercent: number = 0;

  // Getter: computed property — looks like reading a property
  get total(): number {
    const subtotal = this._items.reduce((sum, i) => sum + i.price, 0);
    return subtotal * (1 - this._discountPercent / 100);
  }

  get itemCount(): number {
    return this._items.length;
  }

  // Getter for discount
  get discountPercent(): number {
    return this._discountPercent;
  }

  // Setter: validates before assigning
  set discountPercent(value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Discount must be between 0% and 100%.");
    }
    this._discountPercent = value;
  }

  add(name: string, price: number): this {
    this._items.push({ name, price });
    console.log(`Added ${name} ($${price.toFixed(2)}) to cart.`);
    return this;
  }

  remove(name: string): this {
    const index = this._items.findIndex((i) => i.name === name);
    if (index !== -1) {
      this._items.splice(index, 1);
      console.log(`Removed ${name} from cart.`);
    }
    return this;
  }

  clear(): this {
    this._items = [];
    this._discountPercent = 0;
    console.log("Cart cleared.");
    return this;
  }
}

const cart = new Cart();
cart.add("Laptop", 1200).add("Mouse", 30).add("Keyboard", 80);

console.log(`Items: ${cart.itemCount}`);        // Items: 3
console.log(`Total: $${cart.total.toFixed(2)}`); // Total: $1310.00

cart.discountPercent = 10;
console.log(`After 10% discount: $${cart.total.toFixed(2)}`); // $1179.00

cart.remove("Mouse");
console.log(`Items: ${cart.itemCount}`);   // Items: 2

// cart.discountPercent = 150; // Runtime Error! Discount must be between 0% and 100%.

// =====================================
// 6. METHOD CHAINING (returning this)
// =====================================

// WHAT: Methods return `this` so calls can be chained in a fluent interface.
// WHY:  Produces readable, sentence-like code — especially useful for builders and carts.
// SYNTAX: methodName(): this { ...; return this; }

class ShoppingCart {
  private items: { product: string; qty: number; price: number }[] = [];
  private couponCode: string | null = null;
  private shippingMethod: string = "standard";

  addProduct(product: string, price: number, qty: number = 1): this {
    const existing = this.items.find((i) => i.product === product);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ product, qty, price });
    }
    return this;
  }

  applyCoupon(code: string): this {
    this.couponCode = code;
    console.log(`Coupon "${code}" applied.`);
    return this;
  }

  setShipping(method: "standard" | "express" | "overnight"): this {
    this.shippingMethod = method;
    return this;
  }

  checkout(): void {
    const subtotal = this.items.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingCost =
      this.shippingMethod === "express"
        ? 15
        : this.shippingMethod === "overnight"
        ? 30
        : 5;
    const discount = this.couponCode === "SAVE10" ? subtotal * 0.1 : 0;
    const total = subtotal - discount + shippingCost;

    console.log("=== Checkout Summary ===");
    this.items.forEach((i) =>
      console.log(`  ${i.product} x${i.qty}: $${(i.price * i.qty).toFixed(2)}`)
    );
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    if (discount > 0) console.log(`Discount: -$${discount.toFixed(2)}`);
    console.log(`Shipping (${this.shippingMethod}): $${shippingCost.toFixed(2)}`);
    console.log(`Total: $${total.toFixed(2)}`);
  }
}

// Method chaining in action — reads like a sentence
new ShoppingCart()
  .addProduct("Laptop", 1200)
  .addProduct("Mouse", 30, 2)
  .addProduct("USB Hub", 45)
  .applyCoupon("SAVE10")
  .setShipping("express")
  .checkout();

// =====================================
// 7. CLASS IMPLEMENTING AN INTERFACE
// =====================================

// WHAT: A class can promise to fulfill an interface contract using the `implements` keyword.
// WHY:  Enforces that a class has the required shape; enables polymorphism — different
//       classes can be used interchangeably when they share an interface.
// SYNTAX: class MyClass implements MyInterface { ... }

interface IPayable {
  process(amount: number): boolean;
  refund(transactionId: string, amount: number): boolean;
  getTransactionHistory(): string[];
}

interface ILoggable {
  log(message: string): void;
}

// A class can implement multiple interfaces
class Payment implements IPayable, ILoggable {
  private transactions: { id: string; amount: number; type: string }[] = [];
  private balance: number;

  constructor(private readonly provider: string, initialBalance: number) {
    this.balance = initialBalance;
  }

  process(amount: number): boolean {
    if (amount <= 0) {
      this.log(`Invalid amount: $${amount}`);
      return false;
    }
    if (amount > this.balance) {
      this.log(`Insufficient balance for $${amount}`);
      return false;
    }
    const txId = `TX-${Date.now()}`;
    this.balance -= amount;
    this.transactions.push({ id: txId, amount, type: "charge" });
    this.log(`Charged $${amount.toFixed(2)} via ${this.provider}. TxID: ${txId}`);
    return true;
  }

  refund(transactionId: string, amount: number): boolean {
    const tx = this.transactions.find((t) => t.id === transactionId);
    if (!tx) {
      this.log(`Transaction ${transactionId} not found.`);
      return false;
    }
    this.balance += amount;
    this.transactions.push({ id: `REF-${transactionId}`, amount, type: "refund" });
    this.log(`Refunded $${amount.toFixed(2)} for ${transactionId}.`);
    return true;
  }

  getTransactionHistory(): string[] {
    return this.transactions.map(
      (t) => `[${t.type.toUpperCase()}] ${t.id}: $${t.amount.toFixed(2)}`
    );
  }

  log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

const payment = new Payment("Stripe", 5000);
payment.process(1200);
payment.process(800);
console.log("Balance:", payment.getBalance());    // 3000
console.log("History:", payment.getTransactionHistory());

// =====================================
// 8. ABSTRACT CLASSES AND ABSTRACT METHODS
// =====================================

// WHAT: An abstract class is a base class that CANNOT be instantiated directly.
//       Abstract methods have no implementation — subclasses MUST provide one.
// WHY:  Defines a common contract and shared code for a family of related classes,
//       while forcing each subclass to implement its own specific behavior.
// SYNTAX: abstract class Base { abstract method(): returnType; }

abstract class PaymentProcessor {
  protected transactionLog: string[] = [];

  // Abstract method — no body here, subclasses must implement
  abstract processPayment(amount: number): boolean;
  abstract getProviderName(): string;

  // Concrete method — shared by all subclasses
  protected logTransaction(message: string): void {
    const entry = `[${this.getProviderName()}] ${new Date().toISOString()}: ${message}`;
    this.transactionLog.push(entry);
    console.log(entry);
  }

  getTransactionLog(): string[] {
    return [...this.transactionLog];
  }

  // Template method pattern — defines the skeleton, calls abstract methods
  charge(amount: number): void {
    console.log(`Attempting $${amount.toFixed(2)} via ${this.getProviderName()}...`);
    const success = this.processPayment(amount);
    if (success) {
      this.logTransaction(`SUCCESS: $${amount.toFixed(2)}`);
    } else {
      this.logTransaction(`FAILED: $${amount.toFixed(2)}`);
    }
  }
}

class StripeProcessor extends PaymentProcessor {
  getProviderName(): string {
    return "Stripe";
  }

  processPayment(amount: number): boolean {
    // Stripe-specific logic (simplified)
    if (amount > 10000) {
      console.log("Stripe: amount exceeds single-charge limit.");
      return false;
    }
    console.log(`Stripe: processing $${amount.toFixed(2)}...`);
    return true;
  }
}

class PayPalProcessor extends PaymentProcessor {
  getProviderName(): string {
    return "PayPal";
  }

  processPayment(amount: number): boolean {
    // PayPal-specific logic (simplified)
    console.log(`PayPal: routing $${amount.toFixed(2)} through PayPal gateway...`);
    return amount > 0;
  }
}

// const proc = new PaymentProcessor(); // Error! Cannot create instance of abstract class.

const stripe = new StripeProcessor();
const paypal = new PayPalProcessor();

stripe.charge(500);
paypal.charge(250);
stripe.charge(15000); // fails limit check

// Polymorphism: both treated as PaymentProcessor
const processors: PaymentProcessor[] = [stripe, paypal];
processors.forEach((p) => p.charge(100));

// =====================================
// 9. PRIVATE FIELDS: # vs private keyword
// =====================================

// WHAT:
//   - `private` keyword: TypeScript-only enforcement. At runtime (compiled JS),
//     the property is accessible — it's erased by the compiler.
//   - `#` (hash prefix): JavaScript-native private field. Enforced at runtime too.
//     Even in plain JS, you cannot access it outside the class.
// WHY:
//   - Use `private` when you want type-level safety and simpler syntax.
//   - Use `#` when you need true runtime privacy (e.g., in libraries, security-sensitive code).

class AccountWithKeyword {
  private balance: number; // TS-only private — erased in compiled JS

  constructor(initial: number) {
    this.balance = initial;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

class AccountWithHash {
  #balance: number; // JS-native private — truly private at runtime

  constructor(initial: number) {
    this.#balance = initial;
  }

  deposit(amount: number): void {
    this.#balance += amount;
  }

  getBalance(): number {
    return this.#balance;
  }
}

const acc1 = new AccountWithKeyword(1000);
acc1.deposit(500);
console.log(acc1.getBalance()); // 1500
// console.log(acc1.balance);   // TS Error — but compiled JS would allow it at runtime

const acc2 = new AccountWithHash(1000);
acc2.deposit(500);
console.log(acc2.getBalance()); // 1500
// console.log(acc2.#balance);  // Error at both compile time AND runtime

// =====================================
// DESIGN PATTERNS WITH CLASSES
// =====================================

// =====================================
// 10. SINGLETON PATTERN
// =====================================

// WHAT: Ensures that a class has only ONE instance throughout the application.
// WHY:  Useful for shared resources: database connections, config managers, loggers.
// HOW:  Private constructor + static instance + static getInstance() method.

class AppConfig {
  private static instance: AppConfig | null = null;

  private readonly settings: Map<string, string>;

  // Private constructor prevents `new AppConfig()` from outside
  private constructor() {
    this.settings = new Map([
      ["apiUrl", "https://api.example.com"],
      ["timeout", "5000"],
      ["theme", "dark"],
    ]);
    console.log("AppConfig initialized (this should appear only ONCE).");
  }

  // The only way to get the instance
  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  get(key: string): string | undefined {
    return this.settings.get(key);
  }

  set(key: string, value: string): void {
    this.settings.set(key, value);
  }
}

const config1 = AppConfig.getInstance();
const config2 = AppConfig.getInstance();

console.log(config1 === config2);           // true — same instance
console.log(config1.get("apiUrl"));         // https://api.example.com
config1.set("theme", "light");
console.log(config2.get("theme"));          // light — same object!

// new AppConfig(); // Error! Constructor is private.

// =====================================
// 11. BUILDER PATTERN (method chaining)
// =====================================

// WHAT: Constructs a complex object step-by-step using a fluent API.
// WHY:  Avoids constructors with many parameters; makes object creation readable.
// HOW:  Each setter method returns `this`, enabling chaining. A final build() returns the product.

class OrderBuilder {
  private customerId: number = 0;
  private items: { name: string; price: number; qty: number }[] = [];
  private shippingAddress: string = "";
  private shippingMethod: "standard" | "express" = "standard";
  private coupon: string | null = null;
  private notes: string = "";

  forCustomer(customerId: number): this {
    this.customerId = customerId;
    return this;
  }

  addItem(name: string, price: number, qty: number = 1): this {
    this.items.push({ name, price, qty });
    return this;
  }

  shipTo(address: string): this {
    this.shippingAddress = address;
    return this;
  }

  withShipping(method: "standard" | "express"): this {
    this.shippingMethod = method;
    return this;
  }

  withCoupon(code: string): this {
    this.coupon = code;
    return this;
  }

  withNotes(notes: string): this {
    this.notes = notes;
    return this;
  }

  build(): {
    customerId: number;
    items: { name: string; price: number; qty: number }[];
    shippingAddress: string;
    shippingMethod: string;
    coupon: string | null;
    notes: string;
    total: number;
  } {
    if (!this.customerId) throw new Error("Customer ID is required.");
    if (this.items.length === 0) throw new Error("Order must have at least one item.");
    if (!this.shippingAddress) throw new Error("Shipping address is required.");

    const subtotal = this.items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = this.coupon === "SAVE15" ? subtotal * 0.15 : 0;
    const shipping = this.shippingMethod === "express" ? 20 : 5;

    return {
      customerId: this.customerId,
      items: this.items,
      shippingAddress: this.shippingAddress,
      shippingMethod: this.shippingMethod,
      coupon: this.coupon,
      notes: this.notes,
      total: subtotal - discount + shipping,
    };
  }
}

const builtOrder = new OrderBuilder()
  .forCustomer(42)
  .addItem("Laptop", 1200, 1)
  .addItem("Laptop Bag", 60, 1)
  .addItem("HDMI Cable", 15, 2)
  .shipTo("123 Main St, Springfield")
  .withShipping("express")
  .withCoupon("SAVE15")
  .withNotes("Please leave at the door.")
  .build();

console.log("Built order total: $" + builtOrder.total.toFixed(2));
console.log("Shipped to:", builtOrder.shippingAddress);

// =====================================
// 12. FACTORY PATTERN
// =====================================

// WHAT: A static (or standalone) method that decides which class to instantiate
//       based on input, hiding the creation logic from the caller.
// WHY:  Decouples object creation from usage. The caller doesn't need to know
//       which concrete class to use — just asks the factory.

abstract class Discount {
  abstract apply(price: number): number;
  abstract describe(): string;
}

class PercentageDiscount extends Discount {
  constructor(private percent: number) {
    super();
  }
  apply(price: number): number {
    return price * (1 - this.percent / 100);
  }
  describe(): string {
    return `${this.percent}% off`;
  }
}

class FixedDiscount extends Discount {
  constructor(private amount: number) {
    super();
  }
  apply(price: number): number {
    return Math.max(0, price - this.amount);
  }
  describe(): string {
    return `$${this.amount.toFixed(2)} off`;
  }
}

class NoDiscount extends Discount {
  apply(price: number): number {
    return price;
  }
  describe(): string {
    return "no discount";
  }
}

// Factory: decides which Discount subclass to create
class DiscountFactory {
  static create(couponCode: string): Discount {
    switch (couponCode.toUpperCase()) {
      case "SAVE10": return new PercentageDiscount(10);
      case "SAVE20": return new PercentageDiscount(20);
      case "FLAT50": return new FixedDiscount(50);
      case "FLAT100": return new FixedDiscount(100);
      default:
        console.log(`Unknown coupon "${couponCode}", applying no discount.`);
        return new NoDiscount();
    }
  }
}

// Caller doesn't know or care which subclass it gets
const codes = ["SAVE10", "FLAT50", "SAVE20", "MYSTERY"];
const basePrice = 300;

codes.forEach((code) => {
  const discount = DiscountFactory.create(code);
  const finalPrice = discount.apply(basePrice);
  console.log(
    `Coupon "${code}" (${discount.describe()}): $${basePrice} -> $${finalPrice.toFixed(2)}`
  );
});

// =====================================
// PUTTING IT ALL TOGETHER
// =====================================
// Real-world mini e-commerce flow using all the classes above

console.log("\n=== Full E-Commerce Flow ===");

// 1. Load config (singleton)
const appConfig = AppConfig.getInstance();
console.log("API URL:", appConfig.get("apiUrl"));

// 2. Create a user and log in
const customer = new User(10, "Diana", "diana@shop.com");
customer.login("mypassword123");

// 3. Build an order using the builder
const finalOrder = new OrderBuilder()
  .forCustomer(customer.id)
  .addItem("Phone", 800, 1)
  .addItem("Case", 25, 2)
  .shipTo("456 Oak Ave, Shelbyville")
  .withShipping("express")
  .withCoupon("SAVE20")
  .build();

console.log(`Order total for ${customer.name}: $${finalOrder.total.toFixed(2)}`);

// 4. Process payment via abstract processor
const processor: PaymentProcessor = new StripeProcessor();
processor.charge(finalOrder.total);

// 5. Log out
customer.logout();

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1: Forgetting `this` inside methods
// class BadCounter {
//   count: number = 0;
//   increment() {
//     count++; // Error! 'count' is not defined — you forgot `this.count`
//   }
// }

// MISTAKE 2: Not using parameter properties (writing boilerplate manually)
// class Verbose {
//   name: string;
//   age: number;
//   constructor(name: string, age: number) {
//     this.name = name; // redundant
//     this.age = age;   // redundant
//   }
// }
// Better:
// class Concise { constructor(public name: string, public age: number) {} }

// MISTAKE 3: Calling `this` in a detached callback
// class Timer {
//   seconds: number = 0;
//   start() {
//     setInterval(function() {
//       this.seconds++; // `this` is undefined or wrong here!
//     }, 1000);
//     // Fix: use an arrow function — it captures `this` from the surrounding scope:
//     // setInterval(() => { this.seconds++; }, 1000);
//   }
// }

// MISTAKE 4: Mutating a readonly property after construction
// const p = new Product("Watch", 300);
// p.id = 99; // Error! Cannot assign to 'id' because it is a read-only property.

// MISTAKE 5: Instantiating an abstract class directly
// const proc = new PaymentProcessor(); // Error! Cannot create instance of abstract class.

// MISTAKE 6: Forgetting to call super() in a subclass constructor
// class ExtendedUser extends User {
//   role: string;
//   constructor(id: number, name: string, email: string, role: string) {
//     // super(id, name, email); // Must call this BEFORE using `this`
//     this.role = role; // Error! 'super' must be called before accessing 'this'
//   }
// }

// =====================================
// BEST PRACTICES
// =====================================

// 1. Use parameter properties shorthand to reduce boilerplate.
// 2. Prefer readonly for properties that should not change after construction.
// 3. Use access modifiers (private, protected) to enforce encapsulation —
//    expose only what callers need.
// 4. Use getters for computed/derived values instead of public methods that return data.
// 5. Use abstract classes to define shared contracts and share base behavior.
// 6. Use interfaces (implements) for structural contracts, especially when multiple
//    unrelated classes share the same shape.
// 7. Prefer composition over inheritance for complex hierarchies — deep inheritance
//    chains become hard to maintain.
// 8. Use # for runtime privacy in libraries or security-sensitive code;
//    use private for everyday TypeScript code.
// 9. Keep constructors simple — avoid heavy logic; use factory methods if setup is complex.
// 10. Name classes as nouns (User, Order, Cart), methods as verbs (login, addItem, getTotal).

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between `private` and `#` (hash) private fields in TypeScript?
// A: `private` is a TypeScript compile-time-only keyword — the TypeScript compiler
//    will raise an error if you try to access a `private` member from outside the class,
//    but the compiled JavaScript has no enforcement. The `#` syntax is a JavaScript
//    native private field — it is enforced at runtime in all environments, meaning even
//    plain JavaScript cannot access a `#` field from outside the class.

// Q2: What is an abstract class and when would you use it over an interface?
// A: An abstract class can contain both abstract methods (no implementation, must be
//    overridden by subclasses) and concrete methods (with shared implementations).
//    Unlike an interface, an abstract class can hold state and share logic.
//    Use an abstract class when classes in a family share both structure AND behavior.
//    Use an interface when you only need to enforce a structural contract, especially
//    across unrelated classes (e.g., IPayable could be implemented by CreditCard,
//    PayPal, or CryptoWallet — they share a shape but not a common ancestor).

// Q3: What are parameter properties and why are they useful?
// A: Parameter properties are a TypeScript shorthand that lets you declare and
//    initialize a class property directly in the constructor signature by prefixing
//    the parameter with an access modifier (public, private, protected, or readonly).
//    Example: constructor(public name: string) {} is equivalent to declaring
//    `name: string` and then `this.name = name` inside the constructor body.
//    They reduce boilerplate and keep the class concise.

// Q4: How does method chaining work and what enables it in TypeScript?
// A: Method chaining works by having each method return `this` — a reference to the
//    current instance. The return type is annotated as `this` (or the class type),
//    which tells TypeScript that the return value is the same instance. This allows
//    subsequent calls on the same object in a single expression, e.g.:
//    cart.add("Laptop", 1200).applyCoupon("SAVE10").setShipping("express").checkout();
//    It is commonly used in Builder patterns, query builders (like ORM query APIs),
//    and fluent configuration APIs.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — Product Inventory Manager
// Create a class `Inventory` that:
//   - Has a private array of products (each with id, name, price, stock: number)
//   - Has a static property `lowStockThreshold` (default: 5)
//   - Has methods: addProduct, restock(id, qty), sell(id, qty), getLowStockItems()
//   - Uses a getter `totalValue` that returns price * stock summed across all products
//   - Throws descriptive errors when selling more than available stock
// Example usage:
// const inv = new Inventory();
// inv.addProduct(1, "Laptop", 1200, 10).addProduct(2, "Mouse", 30, 3);
// inv.sell(1, 4);
// console.log(inv.getLowStockItems()); // [{ id: 2, name: "Mouse", stock: 3 }]
// console.log(inv.totalValue);

// TASK 2 — Abstract Shape Hierarchy
// Create an abstract class `Shape` with:
//   - Abstract methods: area(): number, perimeter(): number
//   - A concrete method: describe() that prints name, area, and perimeter
// Implement three subclasses: Circle, Rectangle, Triangle.
// Create a function `totalArea(shapes: Shape[]): number` that sums their areas.
// Example usage:
// const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4, 5)];
// shapes.forEach(s => s.describe());
// console.log("Total area:", totalArea(shapes));

// TASK 3 — User Session Manager (Singleton + Factory)
// Create a Singleton `SessionManager` that:
//   - Stores active user sessions as a Map<userId: number, { user: User; loginTime: Date }>
//   - Has methods: createSession(user), endSession(userId), getActiveUsers(),
//     isActive(userId): boolean
// Create a UserFactory with a static method create(role: "admin" | "guest" | "member")
//   that returns a User pre-configured with default properties for that role.
// Wire them together:
// const mgr = SessionManager.getInstance();
// const admin = UserFactory.create("admin");
// mgr.createSession(admin);
// console.log(mgr.isActive(admin.id));   // true
// console.log(mgr.getActiveUsers());
// mgr.endSession(admin.id);
// console.log(mgr.isActive(admin.id));   // false
