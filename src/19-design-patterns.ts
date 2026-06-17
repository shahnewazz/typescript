// =====================================
// DESIGN PATTERNS IN TYPESCRIPT
// =====================================
// Design patterns are reusable solutions to commonly occurring problems in
// software design. They are not code recipes — they are templates for solving
// problems that can be adapted to many different situations.
//
// TypeScript makes patterns significantly safer and more expressive than plain
// JavaScript by adding interfaces, access modifiers, generics, and strict typing.
//
// TARGET: JavaScript developers with intermediate TypeScript knowledge.
// =====================================

// =====================================
// SECTION 1: WHY PATTERNS MATTER IN TYPESCRIPT
// =====================================
//
// JavaScript allows patterns but cannot enforce their contracts.
// TypeScript enforces contracts through:
//   - Interfaces (define what a pattern participant MUST look like)
//   - Access modifiers (private, protected, readonly)
//   - Generics (type-safe, reusable implementations)
//   - Abstract classes (partial implementations with enforced overrides)
//
// JavaScript version of Singleton (no enforcement):
//   let instance = null;
//   function getInstance() { if (!instance) instance = {}; return instance; }
//
// TypeScript version: private constructor, static method, typed instance.
// The compiler prevents you from calling new MyClass() directly.

// =====================================
// SINGLETON PATTERN
// =====================================
// PROBLEM: Ensure a class has only one instance and provide a global access
//          point to it. Useful for shared resources like DB connections or
//          application configuration.
//
// WHEN TO USE:
//   - Database connection pools (expensive to create, should be shared)
//   - Application config loaded once from environment
//   - Logger instances
//   - Cache managers
//
// CAUTION: Singletons are often overused. They introduce global state, which
//          makes testing harder. Prefer dependency injection when possible.

class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private connectionString: string;
  private isConnected: boolean = false;
  private queryCount: number = 0;

  // Private constructor prevents external instantiation
  private constructor(connectionString: string) {
    this.connectionString = connectionString;
    console.log(`[DB] Initializing connection to: ${connectionString}`);
  }

  static getInstance(connectionString?: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      if (!connectionString) {
        throw new Error("Connection string required for first initialization.");
      }
      DatabaseConnection.instance = new DatabaseConnection(connectionString);
    }
    return DatabaseConnection.instance;
  }

  connect(): void {
    if (!this.isConnected) {
      this.isConnected = true;
      console.log(`[DB] Connected to ${this.connectionString}`);
    } else {
      console.log("[DB] Already connected. Reusing existing connection.");
    }
  }

  query(sql: string): string {
    if (!this.isConnected) throw new Error("Not connected to database.");
    this.queryCount++;
    return `[DB] Query #${this.queryCount} executed: "${sql}"`;
  }

  getStats(): { queryCount: number; connectionString: string } {
    return { queryCount: this.queryCount, connectionString: this.connectionString };
  }

  // Reset for testing purposes (use carefully)
  static reset(): void {
    DatabaseConnection.instance = null;
  }
}

interface AppConfig {
  apiUrl: string;
  timeout: number;
  debug: boolean;
  version: string;
}

class ConfigService {
  private static instance: ConfigService | null = null;
  private config: AppConfig;

  private constructor() {
    // In a real app, this would load from process.env or a config file
    this.config = {
      apiUrl: "https://api.example.com",
      timeout: 5000,
      debug: true,
      version: "1.0.0",
    };
    console.log("[Config] Configuration loaded.");
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
  }

  getAll(): Readonly<AppConfig> {
    return Object.freeze({ ...this.config });
  }
}

console.log("\n--- SINGLETON PATTERN ---");
const db1 = DatabaseConnection.getInstance("postgres://localhost:5432/mydb");
const db2 = DatabaseConnection.getInstance(); // returns same instance
console.log("db1 === db2:", db1 === db2); // true

db1.connect();
db2.connect(); // says "already connected" because it's the same object

console.log(db1.query("SELECT * FROM users"));
console.log(db1.query("SELECT * FROM products"));
console.log("DB Stats:", db1.getStats());

const config1 = ConfigService.getInstance();
const config2 = ConfigService.getInstance();
console.log("config1 === config2:", config1 === config2); // true
console.log("API URL:", config1.get("apiUrl"));
config1.set("debug", false);
console.log("Debug after set:", config2.get("debug")); // false — same instance

// =====================================
// FACTORY PATTERN
// =====================================
// PROBLEM: Create objects without specifying the exact class to create.
//          The factory decides which class to instantiate based on input.
//
// WHEN TO USE:
//   - When the exact type of object needed is determined at runtime
//   - When you want to centralize object creation logic
//   - When object creation is complex (involves setup steps)
//
// JS vs TS: In JS, a factory is just a function returning different objects.
//           In TS, we enforce that all returned objects conform to an interface,
//           so callers always know what methods/properties are available.

interface PaymentProcessor {
  processPayment(amount: number): string;
  validateDetails(details: Record<string, string>): boolean;
  getProcessorName(): string;
  getFeePercentage(): number;
}

class CreditCardProcessor implements PaymentProcessor {
  processPayment(amount: number): string {
    const fee = amount * this.getFeePercentage();
    return `[CreditCard] Charged $${(amount + fee).toFixed(2)} (fee: $${fee.toFixed(2)})`;
  }

  validateDetails(details: Record<string, string>): boolean {
    return !!(details.cardNumber && details.cvv && details.expiry);
  }

  getProcessorName(): string {
    return "CreditCard";
  }

  getFeePercentage(): number {
    return 0.029; // 2.9%
  }
}

class PayPalProcessor implements PaymentProcessor {
  processPayment(amount: number): string {
    const fee = amount * this.getFeePercentage();
    return `[PayPal] Transferred $${amount.toFixed(2)} via PayPal (fee: $${fee.toFixed(2)})`;
  }

  validateDetails(details: Record<string, string>): boolean {
    return !!(details.email && details.password);
  }

  getProcessorName(): string {
    return "PayPal";
  }

  getFeePercentage(): number {
    return 0.034; // 3.4%
  }
}

class CryptoProcessor implements PaymentProcessor {
  private readonly currency: string;

  constructor(currency: string = "BTC") {
    this.currency = currency;
  }

  processPayment(amount: number): string {
    const fee = amount * this.getFeePercentage();
    return `[Crypto] Sent $${amount.toFixed(2)} in ${this.currency} (network fee: $${fee.toFixed(2)})`;
  }

  validateDetails(details: Record<string, string>): boolean {
    return !!(details.walletAddress);
  }

  getProcessorName(): string {
    return `Crypto(${this.currency})`;
  }

  getFeePercentage(): number {
    return 0.001; // 0.1% network fee
  }
}

type PaymentMethod = "creditcard" | "paypal" | "crypto";

class PaymentProcessorFactory {
  static create(method: PaymentMethod, options?: { currency?: string }): PaymentProcessor {
    switch (method) {
      case "creditcard":
        return new CreditCardProcessor();
      case "paypal":
        return new PayPalProcessor();
      case "crypto":
        return new CryptoProcessor(options?.currency ?? "BTC");
      default:
        // TypeScript exhaustiveness check — this should never happen
        const _exhaustive: never = method;
        throw new Error(`Unknown payment method: ${_exhaustive}`);
    }
  }

  static getSupportedMethods(): PaymentMethod[] {
    return ["creditcard", "paypal", "crypto"];
  }
}

console.log("\n--- FACTORY PATTERN ---");
const methods: PaymentMethod[] = ["creditcard", "paypal", "crypto"];
methods.forEach((method) => {
  const processor = PaymentProcessorFactory.create(method);
  console.log(processor.processPayment(100));
  console.log(`  Processor: ${processor.getProcessorName()}, Fee: ${processor.getFeePercentage() * 100}%`);
});

const ethProcessor = PaymentProcessorFactory.create("crypto", { currency: "ETH" });
console.log(ethProcessor.processPayment(250));

// =====================================
// BUILDER PATTERN
// =====================================
// PROBLEM: Constructing complex objects step-by-step. Avoids constructors
//          with many parameters (the "telescoping constructor" anti-pattern).
//
// WHEN TO USE:
//   - When an object has many optional fields
//   - When construction requires multiple steps in a specific order
//   - When you want a fluent, readable API for building objects
//
// KEY FEATURE: Method chaining (fluent interface) — each setter returns `this`.
// In TypeScript, the return type `this` enables proper type inference in
// subclasses (see QueryBuilder below for an example).

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  discountCode?: string;
  discountAmount: number;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  priority: "standard" | "express" | "overnight";
  createdAt: Date;
}

class OrderBuilder {
  private order: Partial<Order> = {
    items: [],
    discountAmount: 0,
    priority: "standard",
  };

  setCustomer(customerId: string): this {
    this.order.customerId = customerId;
    return this;
  }

  addItem(item: OrderItem): this {
    this.order.items!.push(item);
    return this;
  }

  setShippingAddress(address: ShippingAddress): this {
    this.order.shippingAddress = address;
    return this;
  }

  applyDiscountCode(code: string, amount: number): this {
    this.order.discountCode = code;
    this.order.discountAmount = amount;
    return this;
  }

  setNotes(notes: string): this {
    this.order.notes = notes;
    return this;
  }

  setPriority(priority: Order["priority"]): this {
    this.order.priority = priority;
    return this;
  }

  build(): Order {
    // Validate required fields
    if (!this.order.customerId) throw new Error("Customer ID is required.");
    if (!this.order.shippingAddress) throw new Error("Shipping address is required.");
    if (!this.order.items || this.order.items.length === 0) {
      throw new Error("Order must have at least one item.");
    }

    const subtotal = this.order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const discountedSubtotal = subtotal - (this.order.discountAmount ?? 0);
    const tax = discountedSubtotal * 0.08; // 8% tax
    const total = discountedSubtotal + tax;

    return {
      ...(this.order as Omit<Order, "orderId" | "subtotal" | "tax" | "total" | "createdAt">),
      orderId: `ORD-${Date.now()}`,
      subtotal,
      tax,
      total,
      createdAt: new Date(),
      discountAmount: this.order.discountAmount ?? 0,
      priority: this.order.priority ?? "standard",
    } as Order;
  }

  reset(): this {
    this.order = { items: [], discountAmount: 0, priority: "standard" };
    return this;
  }
}

// Bonus: Generic QueryBuilder demonstrating the `this` return type
class QueryBuilder {
  protected conditions: string[] = [];
  protected selectedFields: string[] = ["*"];
  protected tableName: string = "";
  protected limitValue?: number;
  protected orderByField?: string;
  protected orderDirection: "ASC" | "DESC" = "ASC";

  from(table: string): this {
    this.tableName = table;
    return this;
  }

  select(...fields: string[]): this {
    this.selectedFields = fields;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): this {
    this.orderByField = field;
    this.orderDirection = direction;
    return this;
  }

  build(): string {
    if (!this.tableName) throw new Error("Table name is required.");
    let query = `SELECT ${this.selectedFields.join(", ")} FROM ${this.tableName}`;
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(" AND ")}`;
    }
    if (this.orderByField) {
      query += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
    }
    if (this.limitValue !== undefined) {
      query += ` LIMIT ${this.limitValue}`;
    }
    return query;
  }
}

console.log("\n--- BUILDER PATTERN ---");
const order = new OrderBuilder()
  .setCustomer("CUST-001")
  .addItem({ productId: "P1", productName: "TypeScript Handbook", quantity: 2, unitPrice: 29.99 })
  .addItem({ productId: "P2", productName: "Node.js Guide", quantity: 1, unitPrice: 49.99 })
  .setShippingAddress({ street: "123 Main St", city: "Austin", state: "TX", zip: "78701", country: "USA" })
  .applyDiscountCode("SAVE10", 10)
  .setPriority("express")
  .setNotes("Please leave at the front door.")
  .build();

console.log("Order ID:", order.orderId);
console.log("Customer:", order.customerId);
console.log("Items:", order.items.length);
console.log(`Subtotal: $${order.subtotal.toFixed(2)}`);
console.log(`Discount: -$${order.discountAmount.toFixed(2)}`);
console.log(`Tax: $${order.tax.toFixed(2)}`);
console.log(`Total: $${order.total.toFixed(2)}`);
console.log("Priority:", order.priority);

const query = new QueryBuilder()
  .from("users")
  .select("id", "name", "email")
  .where("active = true")
  .where("age > 18")
  .orderBy("name", "ASC")
  .limit(10)
  .build();

console.log("\nBuilt SQL Query:", query);

// =====================================
// ABSTRACT FACTORY PATTERN
// =====================================
// PROBLEM: Create families of related objects without specifying their concrete
//          classes. The abstract factory defines an interface for creating each
//          product type, and concrete factories implement that interface.
//
// WHEN TO USE:
//   - When you need to create related objects that belong together
//   - When you want to switch between families of objects (e.g., UI themes,
//     different database vendors, test doubles vs real implementations)
//
// DIFFERENCE FROM FACTORY: Factory creates ONE type of product. Abstract
// Factory creates a FAMILY of related products.

interface Button {
  render(): string;
  onClick(): void;
}

interface TextInput {
  render(): string;
  getValue(): string;
}

interface Modal {
  render(title: string, content: string): string;
}

// Abstract Factory interface
interface UIComponentFactory {
  createButton(label: string): Button;
  createTextInput(placeholder: string): TextInput;
  createModal(): Modal;
}

// Concrete Factory 1: Light theme
class LightThemeButton implements Button {
  constructor(private label: string) {}
  render(): string {
    return `<button style="background:#fff;color:#000;border:1px solid #ccc">${this.label}</button>`;
  }
  onClick(): void {
    console.log(`[Light] Button "${this.label}" clicked`);
  }
}

class LightThemeInput implements TextInput {
  private value: string = "";
  constructor(private placeholder: string) {}
  render(): string {
    return `<input style="background:#fff;border:1px solid #ccc" placeholder="${this.placeholder}" />`;
  }
  getValue(): string {
    return this.value;
  }
}

class LightThemeModal implements Modal {
  render(title: string, content: string): string {
    return `<div style="background:#fff;border:1px solid #eee"><h2>${title}</h2><p>${content}</p></div>`;
  }
}

class LightThemeFactory implements UIComponentFactory {
  createButton(label: string): Button {
    return new LightThemeButton(label);
  }
  createTextInput(placeholder: string): TextInput {
    return new LightThemeInput(placeholder);
  }
  createModal(): Modal {
    return new LightThemeModal();
  }
}

// Concrete Factory 2: Dark theme
class DarkThemeButton implements Button {
  constructor(private label: string) {}
  render(): string {
    return `<button style="background:#333;color:#fff;border:1px solid #555">${this.label}</button>`;
  }
  onClick(): void {
    console.log(`[Dark] Button "${this.label}" clicked`);
  }
}

class DarkThemeInput implements TextInput {
  private value: string = "";
  constructor(private placeholder: string) {}
  render(): string {
    return `<input style="background:#222;color:#fff;border:1px solid #444" placeholder="${this.placeholder}" />`;
  }
  getValue(): string {
    return this.value;
  }
}

class DarkThemeModal implements Modal {
  render(title: string, content: string): string {
    return `<div style="background:#1a1a1a;color:#fff;border:1px solid #333"><h2>${title}</h2><p>${content}</p></div>`;
  }
}

class DarkThemeFactory implements UIComponentFactory {
  createButton(label: string): Button {
    return new DarkThemeButton(label);
  }
  createTextInput(placeholder: string): TextInput {
    return new DarkThemeInput(placeholder);
  }
  createModal(): Modal {
    return new DarkThemeModal();
  }
}

function buildLoginForm(factory: UIComponentFactory): void {
  const emailInput = factory.createTextInput("Enter your email");
  const passwordInput = factory.createTextInput("Enter your password");
  const submitButton = factory.createButton("Log In");
  const modal = factory.createModal();

  console.log("Email field:", emailInput.render());
  console.log("Password field:", passwordInput.render());
  console.log("Submit button:", submitButton.render());
  console.log("Success modal:", modal.render("Welcome!", "You are now logged in."));
  submitButton.onClick();
}

console.log("\n--- ABSTRACT FACTORY PATTERN ---");
console.log("\n[Light Theme]");
buildLoginForm(new LightThemeFactory());

console.log("\n[Dark Theme]");
buildLoginForm(new DarkThemeFactory());

// =====================================
// REPOSITORY PATTERN
// =====================================
// PROBLEM: Abstract the data access layer. Application code works against an
//          interface, not a specific database or ORM. This makes it easy to
//          swap implementations (e.g., use InMemory for tests, SQL for prod).
//
// WHEN TO USE:
//   - Any application with persistent data
//   - When you want to unit-test business logic without a real database
//   - When you may need to switch data sources in the future
//
// This is one of the most important patterns in enterprise applications.
// TypeScript's interfaces make this pattern very clean and type-safe.

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
  isActive: boolean;
}

// The contract — all repository implementations must satisfy this
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: Partial<Pick<User, "role" | "isActive">>): Promise<User[]>;
  create(data: Omit<User, "id" | "createdAt">): Promise<User>;
  update(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

// In-memory implementation (great for testing and prototyping)
class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();
  private idCounter = 1;

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findAll(filters?: Partial<Pick<User, "role" | "isActive">>): Promise<User[]> {
    let users = Array.from(this.users.values());
    if (filters?.role !== undefined) {
      users = users.filter((u) => u.role === filters.role);
    }
    if (filters?.isActive !== undefined) {
      users = users.filter((u) => u.isActive === filters.isActive);
    }
    return users;
  }

  async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new Error(`User with email "${data.email}" already exists.`);

    const user: User = {
      ...data,
      id: `USR-${String(this.idCounter++).padStart(4, "0")}`,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated: User = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async count(): Promise<number> {
    return this.users.size;
  }
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  findInStock(): Promise<Product[]>;
  create(data: Omit<Product, "id">): Promise<Product>;
  updateStock(id: string, quantity: number): Promise<Product | null>;
}

class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();
  private idCounter = 1;

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.category === category);
  }

  async findInStock(): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.stock > 0);
  }

  async create(data: Omit<Product, "id">): Promise<Product> {
    const product: Product = {
      ...data,
      id: `PROD-${String(this.idCounter++).padStart(4, "0")}`,
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;
    const updated: Product = { ...product, stock: Math.max(0, product.stock + quantity) };
    this.products.set(id, updated);
    return updated;
  }
}

async function demonstrateRepository(): Promise<void> {
  console.log("\n--- REPOSITORY PATTERN ---");
  const userRepo: IUserRepository = new InMemoryUserRepository();

  const alice = await userRepo.create({ name: "Alice", email: "alice@example.com", role: "admin", isActive: true });
  const bob = await userRepo.create({ name: "Bob", email: "bob@example.com", role: "user", isActive: true });
  const charlie = await userRepo.create({ name: "Charlie", email: "charlie@example.com", role: "user", isActive: false });

  console.log("Created users:", (await userRepo.findAll()).map((u) => u.name));
  console.log("Active users:", (await userRepo.findAll({ isActive: true })).map((u) => u.name));
  console.log("Admin users:", (await userRepo.findAll({ role: "admin" })).map((u) => u.name));
  console.log("Find by email:", (await userRepo.findByEmail("bob@example.com"))?.name);

  await userRepo.update(bob.id, { role: "moderator" });
  console.log("Bob's new role:", (await userRepo.findById(bob.id))?.role);
  console.log("Total users:", await userRepo.count());

  const productRepo: IProductRepository = new InMemoryProductRepository();
  const book1 = await productRepo.create({ name: "Clean Code", price: 35, stock: 10, category: "books" });
  const book2 = await productRepo.create({ name: "Refactoring", price: 45, stock: 0, category: "books" });
  await productRepo.create({ name: "Mechanical Keyboard", price: 150, stock: 5, category: "hardware" });

  console.log("Books:", (await productRepo.findByCategory("books")).map((p) => p.name));
  console.log("In stock:", (await productRepo.findInStock()).map((p) => p.name));

  await productRepo.updateStock(book2.id, 3);
  console.log("In stock after restock:", (await productRepo.findInStock()).map((p) => p.name));
}

demonstrateRepository();

// =====================================
// DECORATOR PATTERN
// =====================================
// PROBLEM: Add behavior to objects dynamically without modifying their class.
//          Decorators wrap an object to add functionality, stacking cleanly.
//
// WHEN TO USE:
//   - Adding cross-cutting concerns: logging, caching, validation, authorization
//   - When subclassing would lead to an explosion of subclasses
//   - When you want to add or remove responsibilities at runtime
//
// TypeScript class decorators (@decorator) are one application of this.
// Here we use the structural decorator pattern (wrapping objects via interface).

interface IOrderService {
  placeOrder(userId: string, productId: string, quantity: number): Promise<string>;
  cancelOrder(orderId: string): Promise<boolean>;
}

class OrderService implements IOrderService {
  async placeOrder(userId: string, productId: string, quantity: number): Promise<string> {
    // Simulate some async work
    const orderId = `ORD-${Date.now()}`;
    return orderId;
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    return true;
  }
}

// Decorator 1: Logging
class LoggingOrderService implements IOrderService {
  constructor(private wrapped: IOrderService) {}

  async placeOrder(userId: string, productId: string, quantity: number): Promise<string> {
    const start = Date.now();
    console.log(`[LOG] placeOrder called — userId: ${userId}, productId: ${productId}, qty: ${quantity}`);
    const result = await this.wrapped.placeOrder(userId, productId, quantity);
    console.log(`[LOG] placeOrder completed in ${Date.now() - start}ms — orderId: ${result}`);
    return result;
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    console.log(`[LOG] cancelOrder called — orderId: ${orderId}`);
    const result = await this.wrapped.cancelOrder(orderId);
    console.log(`[LOG] cancelOrder result: ${result}`);
    return result;
  }
}

// Decorator 2: Validation
class ValidatingOrderService implements IOrderService {
  constructor(private wrapped: IOrderService) {}

  async placeOrder(userId: string, productId: string, quantity: number): Promise<string> {
    if (!userId || userId.trim() === "") throw new Error("User ID cannot be empty.");
    if (!productId || productId.trim() === "") throw new Error("Product ID cannot be empty.");
    if (quantity <= 0) throw new Error("Quantity must be greater than 0.");
    if (quantity > 100) throw new Error("Cannot order more than 100 items at once.");
    return this.wrapped.placeOrder(userId, productId, quantity);
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    if (!orderId.startsWith("ORD-")) throw new Error("Invalid order ID format.");
    return this.wrapped.cancelOrder(orderId);
  }
}

// Decorator 3: Caching (simple cache for cancelOrder results)
class CachingOrderService implements IOrderService {
  private cancelCache: Map<string, { result: boolean; timestamp: number }> = new Map();
  private readonly cacheTTLMs = 60_000; // 1 minute

  constructor(private wrapped: IOrderService) {}

  async placeOrder(userId: string, productId: string, quantity: number): Promise<string> {
    return this.wrapped.placeOrder(userId, productId, quantity);
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const cached = this.cancelCache.get(orderId);
    if (cached && Date.now() - cached.timestamp < this.cacheTTLMs) {
      console.log(`[CACHE] Returning cached cancel result for ${orderId}`);
      return cached.result;
    }
    const result = await this.wrapped.cancelOrder(orderId);
    this.cancelCache.set(orderId, { result, timestamp: Date.now() });
    return result;
  }
}

async function demonstrateDecorator(): Promise<void> {
  console.log("\n--- DECORATOR PATTERN ---");

  // Stack decorators: Validation -> Logging -> Core service
  // Order matters: outermost decorator runs first
  const service: IOrderService = new ValidatingOrderService(
    new LoggingOrderService(
      new CachingOrderService(
        new OrderService()
      )
    )
  );

  const orderId = await service.placeOrder("USR-001", "PROD-0042", 3);
  console.log("Placed order:", orderId);

  await service.cancelOrder(orderId);
  await service.cancelOrder(orderId); // Second call — hits cache

  try {
    await service.placeOrder("", "PROD-0001", 1); // Validation error
  } catch (e: unknown) {
    if (e instanceof Error) console.log("Validation caught:", e.message);
  }

  try {
    await service.placeOrder("USR-001", "PROD-0001", 200); // Over limit
  } catch (e: unknown) {
    if (e instanceof Error) console.log("Validation caught:", e.message);
  }
}

demonstrateDecorator();

// =====================================
// ADAPTER PATTERN
// =====================================
// PROBLEM: Allow incompatible interfaces to work together. The adapter
//          converts the interface of a class into another interface the
//          client expects. Also called a "wrapper."
//
// WHEN TO USE:
//   - Integrating third-party libraries that do not match your interface
//   - Migrating from one API to another without changing client code
//   - When you cannot modify the source of the class you need to adapt

// Imagine this is a third-party shipping SDK you cannot modify
class FedExShippingSDK {
  calculateRate(originZip: string, destZip: string, weightLbs: number, dimensions: [number, number, number]): number {
    // Complex proprietary calculation
    const base = 5.0;
    const distanceFactor = Math.abs(parseInt(destZip) - parseInt(originZip)) / 100000;
    const weightFactor = weightLbs * 0.75;
    const volumeFactor = (dimensions[0] * dimensions[1] * dimensions[2]) / 10000;
    return parseFloat((base + distanceFactor + weightFactor + volumeFactor).toFixed(2));
  }

  createShipment(data: {
    from: string;
    to: string;
    weight: number;
    length: number;
    width: number;
    height: number;
  }): { trackingNumber: string; estimatedDelivery: string } {
    return {
      trackingNumber: `FEDEX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toDateString(),
    };
  }
}

// Another third-party SDK
class UPSShippingAPI {
  getQuote(params: {
    sourcePostalCode: string;
    targetPostalCode: string;
    packageWeight: number; // kilograms
    serviceLevel: "ground" | "air" | "express";
  }): { cost: number; currency: string; transitDays: number } {
    const baseCost = params.serviceLevel === "express" ? 25 : params.serviceLevel === "air" ? 15 : 8;
    return {
      cost: parseFloat((baseCost + params.packageWeight * 0.5).toFixed(2)),
      currency: "USD",
      transitDays: params.serviceLevel === "express" ? 1 : params.serviceLevel === "air" ? 2 : 5,
    };
  }

  shipPackage(details: {
    from: string;
    to: string;
    weight: number;
    serviceLevel: "ground" | "air" | "express";
  }): string {
    return `1Z${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
  }
}

// OUR unified shipping interface (what our application expects)
interface IShippingProvider {
  getRate(originZip: string, destZip: string, weightKg: number): number;
  ship(originZip: string, destZip: string, weightKg: number): { trackingNumber: string; estimatedDelivery: string };
  getProviderName(): string;
}

// Adapter for FedEx
class FedExAdapter implements IShippingProvider {
  private sdk = new FedExShippingSDK();

  getRate(originZip: string, destZip: string, weightKg: number): number {
    const weightLbs = weightKg * 2.205; // kg to lbs
    const defaultDimensions: [number, number, number] = [10, 8, 6]; // inches
    return this.sdk.calculateRate(originZip, destZip, weightLbs, defaultDimensions);
  }

  ship(originZip: string, destZip: string, weightKg: number): { trackingNumber: string; estimatedDelivery: string } {
    const weightLbs = weightKg * 2.205;
    return this.sdk.createShipment({
      from: originZip,
      to: destZip,
      weight: weightLbs,
      length: 10,
      width: 8,
      height: 6,
    });
  }

  getProviderName(): string {
    return "FedEx";
  }
}

// Adapter for UPS
class UPSAdapter implements IShippingProvider {
  private api = new UPSShippingAPI();

  getRate(originZip: string, destZip: string, weightKg: number): number {
    const result = this.api.getQuote({
      sourcePostalCode: originZip,
      targetPostalCode: destZip,
      packageWeight: weightKg,
      serviceLevel: "ground",
    });
    return result.cost;
  }

  ship(originZip: string, destZip: string, weightKg: number): { trackingNumber: string; estimatedDelivery: string } {
    const trackingNumber = this.api.shipPackage({
      from: originZip,
      to: destZip,
      weight: weightKg,
      serviceLevel: "ground",
    });
    return {
      trackingNumber,
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toDateString(),
    };
  }

  getProviderName(): string {
    return "UPS";
  }
}

// Our application code works with IShippingProvider — it never knows about FedEx or UPS SDKs
function getBestShippingRate(
  providers: IShippingProvider[],
  originZip: string,
  destZip: string,
  weightKg: number
): { provider: string; rate: number } {
  let best = { provider: "", rate: Infinity };
  for (const provider of providers) {
    const rate = provider.getRate(originZip, destZip, weightKg);
    if (rate < best.rate) {
      best = { provider: provider.getProviderName(), rate };
    }
  }
  return best;
}

console.log("\n--- ADAPTER PATTERN ---");
const providers: IShippingProvider[] = [new FedExAdapter(), new UPSAdapter()];
const origin = "78701";
const destination = "10001";
const weightKg = 2.5;

providers.forEach((p) => {
  const rate = p.getRate(origin, destination, weightKg);
  console.log(`${p.getProviderName()} rate: $${rate}`);
});

const best = getBestShippingRate(providers, origin, destination, weightKg);
console.log(`Best rate: ${best.provider} at $${best.rate}`);

const shipResult = new FedExAdapter().ship(origin, destination, weightKg);
console.log("FedEx shipment:", shipResult);

// =====================================
// OBSERVER PATTERN (EVENT EMITTER)
// =====================================
// PROBLEM: Define a one-to-many dependency between objects so that when one
//          object (the subject) changes state, all dependents (observers) are
//          notified and updated automatically.
//
// WHEN TO USE:
//   - Decoupling producers and consumers of events
//   - When multiple parts of the system care about the same state changes
//   - UI event systems, real-time updates, logging pipelines
//
// TypeScript adds generic typing to events, so listeners receive the correct
// payload type automatically. No more casting from `any`.

// Typed event map — defines every event name and its payload type
interface CartEvents {
  "item:added": { productId: string; productName: string; quantity: number; price: number };
  "item:removed": { productId: string; productName: string };
  "item:quantity-changed": { productId: string; oldQty: number; newQty: number };
  "cart:cleared": { itemCount: number; totalValue: number };
  "cart:checkout-started": { items: CartItem[]; total: number };
}

type EventListener<T> = (payload: T) => void;

// Generic typed event emitter
class TypedEventEmitter<Events extends Record<string, unknown>> {
  private listeners: { [K in keyof Events]?: Array<EventListener<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    const list = this.listeners[event];
    if (list) {
      this.listeners[event] = list.filter((l) => l !== listener) as Array<EventListener<Events[K]>>;
    }
    return this;
  }

  once<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    const wrapper: EventListener<Events[K]> = (payload) => {
      listener(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const list = this.listeners[event];
    if (list) {
      list.forEach((listener) => listener(payload));
    }
  }
}

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

class CartEventEmitter extends TypedEventEmitter<CartEvents> {
  private items: Map<string, CartItem> = new Map();

  addItem(productId: string, productName: string, quantity: number, price: number): void {
    const existing = this.items.get(productId);
    if (existing) {
      const oldQty = existing.quantity;
      existing.quantity += quantity;
      this.emit("item:quantity-changed", { productId, oldQty, newQty: existing.quantity });
    } else {
      this.items.set(productId, { productId, productName, quantity, unitPrice: price });
      this.emit("item:added", { productId, productName, quantity, price });
    }
  }

  removeItem(productId: string): void {
    const item = this.items.get(productId);
    if (item) {
      this.items.delete(productId);
      this.emit("item:removed", { productId, productName: item.productName });
    }
  }

  clear(): void {
    const itemCount = this.items.size;
    const totalValue = this.getTotal();
    this.items.clear();
    this.emit("cart:cleared", { itemCount, totalValue });
  }

  checkout(): void {
    const items = Array.from(this.items.values());
    this.emit("cart:checkout-started", { items, total: this.getTotal() });
  }

  getTotal(): number {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.quantity * item.unitPrice;
    }
    return total;
  }

  getItemCount(): number {
    return this.items.size;
  }
}

console.log("\n--- OBSERVER / EVENT EMITTER PATTERN ---");
const cart = new CartEventEmitter();

// Attach observers (listeners)
cart.on("item:added", ({ productName, quantity, price }) => {
  console.log(`[Cart] Added: ${productName} x${quantity} @ $${price}`);
});

cart.on("item:quantity-changed", ({ productId, oldQty, newQty }) => {
  console.log(`[Cart] Qty changed for ${productId}: ${oldQty} -> ${newQty}`);
});

cart.on("item:removed", ({ productName }) => {
  console.log(`[Cart] Removed: ${productName}`);
});

cart.on("cart:cleared", ({ itemCount, totalValue }) => {
  console.log(`[Cart] Cart cleared — had ${itemCount} items worth $${totalValue.toFixed(2)}`);
});

// Analytics observer — only cares about checkout
cart.on("cart:checkout-started", ({ items, total }) => {
  console.log(`[Analytics] Checkout started — ${items.length} items, total: $${total.toFixed(2)}`);
});

// one-time listener
cart.once("cart:checkout-started", () => {
  console.log("[Promo] First checkout detected — here is a coupon!");
});

cart.addItem("P001", "TypeScript Handbook", 1, 29.99);
cart.addItem("P002", "Node.js Guide", 2, 19.99);
cart.addItem("P001", "TypeScript Handbook", 1, 29.99); // triggers qty-changed
cart.removeItem("P002");
cart.checkout(); // triggers checkout listeners (both regular and once)
cart.checkout(); // triggers only regular listener (once already removed)
cart.clear();

// =====================================
// STRATEGY PATTERN
// =====================================
// PROBLEM: Define a family of algorithms, encapsulate each one, and make
//          them interchangeable. Strategy lets the algorithm vary independently
//          from clients that use it.
//
// WHEN TO USE:
//   - When you have multiple ways to do the same thing (sort algorithms,
//     shipping rate calculation, payment processing, validation rules)
//   - When you want to switch algorithms at runtime
//   - To replace complex if/else or switch statements

interface ShippingStrategy {
  getName(): string;
  calculateCost(weightKg: number, distanceKm: number): number;
  getEstimatedDays(): number;
}

class StandardShipping implements ShippingStrategy {
  getName(): string {
    return "Standard Shipping";
  }
  calculateCost(weightKg: number, distanceKm: number): number {
    return parseFloat((2.5 + weightKg * 0.5 + distanceKm * 0.001).toFixed(2));
  }
  getEstimatedDays(): number {
    return 5;
  }
}

class ExpressShipping implements ShippingStrategy {
  getName(): string {
    return "Express Shipping";
  }
  calculateCost(weightKg: number, distanceKm: number): number {
    return parseFloat((8.0 + weightKg * 1.2 + distanceKm * 0.003).toFixed(2));
  }
  getEstimatedDays(): number {
    return 2;
  }
}

class OvernightShipping implements ShippingStrategy {
  getName(): string {
    return "Overnight Shipping";
  }
  calculateCost(weightKg: number, distanceKm: number): number {
    return parseFloat((20.0 + weightKg * 2.5 + distanceKm * 0.008).toFixed(2));
  }
  getEstimatedDays(): number {
    return 1;
  }
}

class FreeShipping implements ShippingStrategy {
  getName(): string {
    return "Free Shipping";
  }
  calculateCost(_weightKg: number, _distanceKm: number): number {
    return 0;
  }
  getEstimatedDays(): number {
    return 7;
  }
}

class ShippingCalculator {
  private strategy: ShippingStrategy;

  constructor(strategy: ShippingStrategy = new StandardShipping()) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ShippingStrategy): void {
    this.strategy = strategy;
    console.log(`[Shipping] Switched to: ${strategy.getName()}`);
  }

  calculate(weightKg: number, distanceKm: number): {
    method: string;
    cost: number;
    estimatedDays: number;
  } {
    return {
      method: this.strategy.getName(),
      cost: this.strategy.calculateCost(weightKg, distanceKm),
      estimatedDays: this.strategy.getEstimatedDays(),
    };
  }

  // Pick best strategy based on criteria
  static getBestValueStrategy(
    strategies: ShippingStrategy[],
    weightKg: number,
    distanceKm: number,
    maxBudget: number
  ): ShippingStrategy {
    const affordable = strategies.filter(
      (s) => s.calculateCost(weightKg, distanceKm) <= maxBudget
    );
    if (affordable.length === 0) throw new Error("No strategy within budget.");
    // Pick fastest affordable option
    return affordable.reduce((best, s) =>
      s.getEstimatedDays() < best.getEstimatedDays() ? s : best
    );
  }
}

console.log("\n--- STRATEGY PATTERN ---");
const calculator = new ShippingCalculator();
const weightKg = 2;
const distanceKm = 500;

const strategies: ShippingStrategy[] = [
  new StandardShipping(),
  new ExpressShipping(),
  new OvernightShipping(),
  new FreeShipping(),
];

strategies.forEach((strategy) => {
  calculator.setStrategy(strategy);
  const result = calculator.calculate(weightKg, distanceKm);
  console.log(`${result.method}: $${result.cost} (${result.estimatedDays} days)`);
});

const bestValue = ShippingCalculator.getBestValueStrategy(strategies, weightKg, distanceKm, 20);
console.log("Best within $20 budget:", bestValue.getName());

// =====================================
// COMMAND PATTERN
// =====================================
// PROBLEM: Encapsulate a request as an object. This lets you parameterize
//          clients with different requests, queue requests, log them, and
//          support undo/redo operations.
//
// WHEN TO USE:
//   - When you need undo/redo functionality
//   - When you want to queue or schedule operations
//   - When you want to log all actions performed on an object
//   - When implementing transactions that can be rolled back

interface ICommand {
  execute(): Promise<string>;
  undo(): Promise<string>;
  getDescription(): string;
}

interface OrderRecord {
  orderId: string;
  customerId: string;
  items: string[];
  total: number;
  status: "pending" | "placed" | "cancelled" | "refunded";
  createdAt: Date;
}

// Simple in-memory order store (would be a repository in real code)
class OrderStore {
  private orders: Map<string, OrderRecord> = new Map();

  save(order: OrderRecord): void {
    this.orders.set(order.orderId, order);
  }

  findById(orderId: string): OrderRecord | undefined {
    return this.orders.get(orderId);
  }

  update(orderId: string, changes: Partial<OrderRecord>): void {
    const existing = this.orders.get(orderId);
    if (existing) {
      this.orders.set(orderId, { ...existing, ...changes });
    }
  }

  getAll(): OrderRecord[] {
    return Array.from(this.orders.values());
  }
}

const orderStore = new OrderStore();

class PlaceOrderCommand implements ICommand {
  private createdOrderId?: string;

  constructor(
    private customerId: string,
    private items: string[],
    private total: number
  ) {}

  async execute(): Promise<string> {
    const orderId = `ORD-${Date.now()}`;
    const order: OrderRecord = {
      orderId,
      customerId: this.customerId,
      items: this.items,
      total: this.total,
      status: "placed",
      createdAt: new Date(),
    };
    orderStore.save(order);
    this.createdOrderId = orderId;
    return `Order ${orderId} placed successfully for customer ${this.customerId}. Total: $${this.total}`;
  }

  async undo(): Promise<string> {
    if (!this.createdOrderId) return "Nothing to undo.";
    orderStore.update(this.createdOrderId, { status: "cancelled" });
    return `Order ${this.createdOrderId} undone (cancelled).`;
  }

  getDescription(): string {
    return `Place order for customer ${this.customerId} — items: [${this.items.join(", ")}]`;
  }
}

class CancelOrderCommand implements ICommand {
  private previousStatus?: OrderRecord["status"];

  constructor(private orderId: string) {}

  async execute(): Promise<string> {
    const order = orderStore.findById(this.orderId);
    if (!order) return `Order ${this.orderId} not found.`;
    if (order.status === "cancelled") return `Order ${this.orderId} is already cancelled.`;
    this.previousStatus = order.status;
    orderStore.update(this.orderId, { status: "cancelled" });
    return `Order ${this.orderId} cancelled.`;
  }

  async undo(): Promise<string> {
    if (!this.previousStatus) return "Nothing to undo.";
    orderStore.update(this.orderId, { status: this.previousStatus });
    return `Cancellation of order ${this.orderId} reversed. Status restored to "${this.previousStatus}".`;
  }

  getDescription(): string {
    return `Cancel order ${this.orderId}`;
  }
}

class RefundOrderCommand implements ICommand {
  private refundApplied: boolean = false;

  constructor(private orderId: string, private refundAmount?: number) {}

  async execute(): Promise<string> {
    const order = orderStore.findById(this.orderId);
    if (!order) return `Order ${this.orderId} not found.`;
    if (order.status === "refunded") return `Order ${this.orderId} already refunded.`;
    const amount = this.refundAmount ?? order.total;
    orderStore.update(this.orderId, { status: "refunded" });
    this.refundApplied = true;
    return `Refund of $${amount} issued for order ${this.orderId}.`;
  }

  async undo(): Promise<string> {
    if (!this.refundApplied) return "Nothing to undo.";
    // In a real system, you would reverse the payment. Here we restore to cancelled.
    orderStore.update(this.orderId, { status: "cancelled" });
    this.refundApplied = false;
    return `Refund for order ${this.orderId} reversed.`;
  }

  getDescription(): string {
    return `Refund order ${this.orderId}${this.refundAmount ? ` ($${this.refundAmount})` : " (full)"}`;
  }
}

// The Invoker — manages command execution, history, and undo
class OrderCommandHandler {
  private history: ICommand[] = [];
  private undoStack: ICommand[] = [];

  async execute(command: ICommand): Promise<string> {
    console.log(`[CMD] Executing: ${command.getDescription()}`);
    const result = await command.execute();
    this.history.push(command);
    this.undoStack = []; // Clear redo stack on new command
    return result;
  }

  async undo(): Promise<string> {
    const command = this.history.pop();
    if (!command) return "Nothing to undo.";
    const result = await command.undo();
    this.undoStack.push(command);
    console.log(`[CMD] Undid: ${command.getDescription()}`);
    return result;
  }

  async redo(): Promise<string> {
    const command = this.undoStack.pop();
    if (!command) return "Nothing to redo.";
    const result = await command.execute();
    this.history.push(command);
    console.log(`[CMD] Redid: ${command.getDescription()}`);
    return result;
  }

  getHistory(): string[] {
    return this.history.map((c) => c.getDescription());
  }
}

async function demonstrateCommand(): Promise<void> {
  console.log("\n--- COMMAND PATTERN ---");
  const handler = new OrderCommandHandler();

  const placeCmd = new PlaceOrderCommand("CUST-007", ["TypeScript Book", "Node.js Course"], 79.98);
  let result = await handler.execute(placeCmd);
  console.log("Result:", result);

  const orders = orderStore.getAll();
  const placedOrder = orders[0];
  console.log("Order in store:", placedOrder.orderId, "Status:", placedOrder.status);

  const cancelCmd = new CancelOrderCommand(placedOrder.orderId);
  result = await handler.execute(cancelCmd);
  console.log("Result:", result);
  console.log("Status after cancel:", orderStore.findById(placedOrder.orderId)?.status);

  result = await handler.undo();
  console.log("After undo:", result);
  console.log("Status after undo:", orderStore.findById(placedOrder.orderId)?.status);

  result = await handler.redo();
  console.log("After redo:", result);
  console.log("Status after redo:", orderStore.findById(placedOrder.orderId)?.status);

  const refundCmd = new RefundOrderCommand(placedOrder.orderId, 40);
  result = await handler.execute(refundCmd);
  console.log("Result:", result);
  console.log("Status after refund:", orderStore.findById(placedOrder.orderId)?.status);

  console.log("\nCommand History:");
  handler.getHistory().forEach((desc, i) => console.log(`  ${i + 1}. ${desc}`));
}

demonstrateCommand();

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================
//
// All patterns exist in JavaScript, but TypeScript makes them safer:
//
// SINGLETON
//   JS:  No enforcement. Anyone can do `new MyClass()` by mistake.
//   TS:  `private constructor` — the compiler literally prevents `new MyClass()`.
//        TypeScript catches misuse at compile time.
//
// FACTORY
//   JS:  Factory returns `any` — callers have no idea what methods are available.
//   TS:  Factory return type is `PaymentProcessor` (interface) — callers get
//        full autocomplete and type checking on the returned object.
//
// REPOSITORY
//   JS:  Interface doesn't exist — you can "use" the interface pattern but nothing
//        enforces it. Implementations can diverge silently.
//   TS:  `implements IUserRepository` — the compiler tells you immediately if an
//        implementation is missing a method or has the wrong signature.
//
// OBSERVER
//   JS:  Event names are strings, payloads are `any`. Typos in event names cause
//        silent bugs. Listeners receive unknown data and must cast/guess.
//   TS:  `TypedEventEmitter<CartEvents>` — if you misspell "item:added" as
//        "item:adedd", the compiler throws an error. The listener receives the
//        exact payload type automatically.
//
// STRATEGY
//   JS:  The strategy interface is a mental contract — nothing stops you from
//        assigning an incompatible function.
//   TS:  `implements ShippingStrategy` — you MUST implement `getName`,
//        `calculateCost`, and `getEstimatedDays` with the correct signatures.
//
// COMMAND
//   JS:  `execute` and `undo` could return anything, take any parameters.
//   TS:  `ICommand` interface enforces the contract. The `CommandHandler` knows
//        every command supports both `execute()` and `undo()`.

// =====================================
// COMMON MISTAKES
// =====================================
//
// 1. SINGLETON OVERUSE
//    Problem: Using Singleton for everything creates global mutable state.
//             Makes code hard to test (you cannot easily swap dependencies).
//    Solution: Use dependency injection. Pass dependencies as constructor
//              arguments. Use Singleton only for truly shared, stateless services
//              (config) or expensive resources (DB connection pool).
//
// 2. SKIPPING INTERFACES WITH PATTERNS
//    Problem: Using concrete classes instead of interfaces with Repository,
//             Strategy, and Factory. Tightly couples your code to implementations.
//    // BAD: depends on the concrete class
//    function processPayment(p: CreditCardProcessor) { ... }
//    // GOOD: depends on the interface
//    function processPayment(p: PaymentProcessor) { ... }
//
// 3. NOT MAKING BUILDER IMMUTABLE
//    Problem: Sharing a builder instance across calls leads to state leaking
//             between builds. Always call `reset()` or create a new builder.
//    Solution: The `build()` method can call `reset()` internally, or
//              return a new builder instance each time.
//
// 4. DECORATOR ORDERING MISTAKES
//    Problem: Wrapping decorators in the wrong order.
//    // Logs AFTER validation throws — never logs invalid calls:
//    new LoggingService(new ValidatingService(core))
//    // Logs BEFORE validation — logs invalid calls too:
//    new ValidatingService(new LoggingService(core))
//    Solution: Think about which layer should see which behavior.
//
// 5. OBSERVER MEMORY LEAKS
//    Problem: Adding listeners without ever removing them. Common in React
//             components or class instances that get destroyed.
//    Solution: Always call `.off()` in cleanup / componentWillUnmount.
//              Use `.once()` for one-time listeners.
//
// 6. COMMAND WITHOUT UNDO PLANNING
//    Problem: Implementing commands without thinking about undo from the start.
//             Undoable state must be captured in `execute()` before changes.
//    Solution: Store previous state in the command instance during `execute`.

// =====================================
// BEST PRACTICES
// =====================================
//
// 1. ALWAYS code to interfaces, not implementations (Dependency Inversion Principle).
// 2. Keep patterns focused: a Repository should only handle data access, not
//    business logic. A Factory should only create objects.
// 3. Use generics to make patterns reusable across types (see TypedEventEmitter).
// 4. For Singleton: consider whether a module-level exported instance is
//    simpler than a class-based singleton (often it is).
// 5. Name your patterns: `UserRepository`, `PaymentStrategy`, `OrderBuilder` —
//    names communicate intent immediately.
// 6. Test patterns with the InMemory implementation (Repository, Command).
//    Swap in real implementations in production without changing tests.
// 7. Prefer composition over inheritance. Decorator and Strategy both favor
//    composition — they are often better than deep inheritance hierarchies.
// 8. Document WHY a pattern was chosen in comments, not just WHAT it is.

// =====================================
// INTERVIEW QUESTIONS
// =====================================
//
// Q1: What is the difference between Factory and Abstract Factory?
// A1: Factory creates one type of product (a single PaymentProcessor).
//     Abstract Factory creates families of related products (a full UI theme:
//     Button + Input + Modal that all belong together). Abstract Factory
//     coordinates the creation of multiple related types.
//
// Q2: Why would you use the Repository pattern when you could just call
//     the database directly?
// A2: Repository abstracts data access behind an interface. This enables:
//     (1) easy testing with InMemory implementations (no real DB needed),
//     (2) ability to switch databases without changing business logic,
//     (3) centralized query logic (no scattered raw SQL/ORM calls),
//     (4) cleaner separation of concerns.
//
// Q3: How does the Decorator pattern differ from inheritance?
// A3: Inheritance is static (set at compile time) and creates an "is-a"
//     relationship. Decorators are dynamic (can be added/removed at runtime)
//     and create a "wraps-a" relationship. Decorators can be stacked in any
//     order and combined freely, while deep inheritance hierarchies become
//     rigid and hard to change. Decorators also avoid the combinatorial
//     explosion of subclasses (LoggingCachingValidatingService etc).
//
// Q4: When would you choose Strategy over a simple if/else?
// A4: Choose Strategy when: the algorithms are complex enough to deserve their
//     own class, when you need to switch algorithms at runtime (user selects
//     shipping method), when new algorithms will be added frequently (Open/Closed
//     Principle — add a new class without modifying existing code), or when you
//     want to test each algorithm in isolation without testing the whole context.

// =====================================
// PRACTICE TASKS
// =====================================
//
// TASK 1 — COMBINED SINGLETON + FACTORY:
// Create a `NotificationService` Singleton that uses a Factory to create
// different notification channels (Email, SMS, Push). The service should have a
// method `send(channel: "email" | "sms" | "push", message: string, to: string)`.
// Each channel should implement an `INotificationChannel` interface with a
// `send(message: string, to: string): Promise<void>` method.
// Add a Decorator that logs every notification sent (timestamp, channel, recipient).
//
// TASK 2 — OBSERVER + COMMAND:
// Build a `TodoList` class that uses the Observer pattern to emit events
// ("todo:added", "todo:completed", "todo:deleted") and the Command pattern
// for add/complete/delete operations (so they can be undone). The command
// handler should maintain a history of the last 10 commands.
// Use TypedEventEmitter<TodoEvents> for full type safety.
//
// TASK 3 — REPOSITORY + BUILDER + STRATEGY:
// Build a `ReportGenerator` that:
// - Uses a `ReportBuilder` to construct reports with optional sections
//   (header, summary, charts, data table, footer) via fluent API.
// - Uses a `ReportRepository` interface to save/load reports.
// - Uses a `FormattingStrategy` interface to format reports as
//   plain text, HTML, or Markdown, selectable at build time.
// - Demonstrates saving to InMemoryReportRepository and retrieving
//   a saved report, then re-formatting it with a different strategy.
