// =====================================
// 20-real-world-projects.ts
// Real-World Projects — Complete E-Commerce System
// =====================================
// This is the capstone file. We build a complete mini e-commerce system
// using every TypeScript concept covered in this series:
//   - Enums, interfaces, classes, generics
//   - Access modifiers, utility types, type guards
//   - async/await, custom errors, design patterns (strategy, repository)
//   - Result<T,E> pattern for safe error handling
// =====================================

// =====================================
// SECTION 1: TYPES AND INTERFACES
// =====================================

// --- Enums ---

// UserRole defines what a user is allowed to do in the system.
// Using a string enum makes logs and serialized data human-readable.
enum UserRole {
  Admin = "admin",
  Customer = "customer",
  Guest = "guest",
}

// OrderStatus tracks the lifecycle of an order from placement to delivery.
enum OrderStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

// PaymentStatus tracks whether money has moved.
enum PaymentStatus {
  Pending = "pending",
  Authorized = "authorized",
  Captured = "captured",
  Failed = "failed",
  Refunded = "refunded",
}

// --- Core domain interfaces ---

// User represents an account in the system.
// Optional fields (phone, address) may be filled in later.
interface User {
  readonly id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

// Product represents an item for sale.
interface Product {
  readonly id: string;
  name: string;
  description: string;
  price: number;          // cents, to avoid floating-point issues
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
}

// CartItem ties a product to a requested quantity inside a cart.
interface CartItem {
  product: Product;
  quantity: number;
}

// Cart belongs to a user session. couponCode and discountAmount are optional.
interface Cart {
  readonly id: string;
  userId: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount: number; // cents
  createdAt: Date;
  updatedAt: Date;
}

// OrderItem is an immutable snapshot of a CartItem at purchase time.
// We store price here because the product price can change later.
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;  // cents at time of purchase
}

// Order is the permanent record created from a Cart after checkout.
interface Order {
  readonly id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;       // cents
  discountAmount: number; // cents
  total: number;          // cents
  status: OrderStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment is the financial record associated with an order.
interface Payment {
  readonly id: string;
  orderId: string;
  amount: number;         // cents
  method: "credit_card" | "paypal";
  status: PaymentStatus;
  transactionId?: string; // returned by the payment gateway
  createdAt: Date;
}

// AuthToken wraps a JWT-like token for authenticated requests.
interface AuthToken {
  token: string;
  userId: string;
  role: UserRole;
  expiresAt: Date;
}

// ApiResponse<T> is a generic envelope for every service response.
// Keeping a consistent shape makes it easy to write generic API clients.
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Result<T, E> is a discriminated union that forces callers to handle both
// the success and failure cases explicitly — no silent swallowing of errors.
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helpers to construct Result values without boilerplate.
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
function fail<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// =====================================
// SECTION 2: CUSTOM ERRORS
// =====================================

// Extending the built-in Error class gives us typed catch blocks
// and lets us distinguish domain errors from generic JavaScript errors.

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`);
    this.name = "NotFoundError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class InsufficientStockError extends Error {
  constructor(productName: string, requested: number, available: number) {
    super(
      `Insufficient stock for "${productName}": requested ${requested}, available ${available}`
    );
    this.name = "InsufficientStockError";
  }
}

class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentError";
  }
}

// =====================================
// SECTION 3: UTILITY HELPERS
// =====================================

// Simple ID generator — good enough for a demo; use uuid in production.
function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Simulate a bcrypt hash — never store plain-text passwords in real apps.
function hashPassword(plain: string): string {
  return `hashed_${plain}_salt`;
}
function verifyPassword(plain: string, hash: string): boolean {
  return hash === `hashed_${plain}_salt`;
}

// Format cents to a human-readable dollar string.
function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// =====================================
// SECTION 4: USER MANAGEMENT
// =====================================

// UserRepository is a simple in-memory data store.
// In a real app this would wrap a database ORM.
// Using generics on the internal map keeps the type safe.
class UserRepository {
  private store: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id

  async create(user: User): Promise<User> {
    if (this.emailIndex.has(user.email)) {
      throw new ValidationError(`Email "${user.email}" is already registered`);
    }
    this.store.set(user.id, user);
    this.emailIndex.set(user.email, user.id);
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.store.get(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const id = this.emailIndex.get(email);
    return id ? this.store.get(id) : undefined;
  }

  async update(id: string, patch: Partial<Omit<User, "id">>): Promise<User> {
    const existing = this.store.get(id);
    if (!existing) throw new NotFoundError("User", id);
    const updated: User = { ...existing, ...patch };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const user = this.store.get(id);
    if (!user) throw new NotFoundError("User", id);
    this.emailIndex.delete(user.email);
    this.store.delete(id);
  }

  async list(): Promise<User[]> {
    return Array.from(this.store.values());
  }
}

// AuthService handles registration, login, logout, and token validation.
// Tokens are stored in memory — use Redis/JWT in production.
class AuthService {
  private tokenStore: Map<string, AuthToken> = new Map();

  constructor(private userRepo: UserRepository) {}

  async register(
    email: string,
    name: string,
    password: string,
    role: UserRole = UserRole.Customer
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepo.create({
        id: generateId("user"),
        email,
        name,
        role,
        passwordHash: hashPassword(password),
        createdAt: new Date(),
      });
      // Never return the password hash to callers.
      const safeUser: User = { ...user, passwordHash: "[hidden]" };
      return { success: true, data: safeUser, timestamp: new Date() };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date(),
      };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthToken>> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return {
        success: false,
        error: "Invalid email or password",
        timestamp: new Date(),
      };
    }
    const token: AuthToken = {
      token: generateId("tok"),
      userId: user.id,
      role: user.role,
      expiresAt: new Date(Date.now() + 3600_000), // 1 hour
    };
    this.tokenStore.set(token.token, token);
    return { success: true, data: token, timestamp: new Date() };
  }

  async logout(token: string): Promise<void> {
    this.tokenStore.delete(token);
  }

  validateToken(token: string): AuthToken | null {
    const record = this.tokenStore.get(token);
    if (!record) return null;
    if (record.expiresAt < new Date()) {
      this.tokenStore.delete(token);
      return null;
    }
    return record;
  }
}

// =====================================
// SECTION 5: PRODUCT CATALOG
// =====================================

class ProductRepository {
  private store: Map<string, Product> = new Map();

  async create(product: Product): Promise<Product> {
    this.store.set(product.id, product);
    return product;
  }

  async findById(id: string): Promise<Product | undefined> {
    return this.store.get(id);
  }

  async update(
    id: string,
    patch: Partial<Omit<Product, "id">>
  ): Promise<Product> {
    const existing = this.store.get(id);
    if (!existing) throw new NotFoundError("Product", id);
    const updated: Product = { ...existing, ...patch };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    if (!this.store.has(id)) throw new NotFoundError("Product", id);
    this.store.delete(id);
  }

  async list(): Promise<Product[]> {
    return Array.from(this.store.values());
  }

  // Full-text search across name and description (case-insensitive).
  async search(query: string): Promise<Product[]> {
    const lower = query.toLowerCase();
    return Array.from(this.store.values()).filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  // Filter by exact category match.
  async filterByCategory(category: string): Promise<Product[]> {
    return Array.from(this.store.values()).filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
}

// InventoryService is a thin wrapper that enforces stock rules.
// Separating this from ProductRepository keeps responsibilities clear.
class InventoryService {
  constructor(private productRepo: ProductRepository) {}

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundError("Product", productId);
    return product.stock >= quantity;
  }

  async updateStock(productId: string, delta: number): Promise<Product> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundError("Product", productId);
    const newStock = product.stock + delta;
    if (newStock < 0) {
      throw new InsufficientStockError(product.name, Math.abs(delta), product.stock);
    }
    return this.productRepo.update(productId, { stock: newStock });
  }

  // Returns products whose stock has fallen below the threshold.
  async getLowStockAlerts(threshold: number = 5): Promise<Product[]> {
    const all = await this.productRepo.list();
    return all.filter((p) => p.stock <= threshold);
  }
}

// =====================================
// SECTION 6: SHOPPING CART
// =====================================

// Available coupons. In production these live in a database.
const COUPONS: Record<string, number> = {
  SAVE10: 10_00,   // $10 off
  SAVE20: 20_00,   // $20 off
  WELCOME: 5_00,   // $5 off
};

class CartService {
  private carts: Map<string, Cart> = new Map();

  // Retrieve or create a cart for the given user.
  async getOrCreateCart(userId: string): Promise<Cart> {
    const existing = this.findCartByUserId(userId);
    if (existing) return existing;
    const cart: Cart = {
      id: generateId("cart"),
      userId,
      items: [],
      discountAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.carts.set(cart.id, cart);
    return cart;
  }

  private findCartByUserId(userId: string): Cart | undefined {
    return Array.from(this.carts.values()).find((c) => c.userId === userId);
  }

  async addItem(
    userId: string,
    product: Product,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }
    cart.updatedAt = new Date();
    return cart;
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((i) => i.product.id !== productId);
    cart.updatedAt = new Date();
    return cart;
  }

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    if (quantity <= 0) return this.removeItem(userId, productId);
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) throw new NotFoundError("CartItem", productId);
    item.quantity = quantity;
    cart.updatedAt = new Date();
    return cart;
  }

  async applyCoupon(
    userId: string,
    couponCode: string
  ): Promise<Result<Cart, string>> {
    const discount = COUPONS[couponCode.toUpperCase()];
    if (discount === undefined) {
      return fail(`Coupon "${couponCode}" is not valid`);
    }
    const cart = await this.getOrCreateCart(userId);
    cart.couponCode = couponCode.toUpperCase();
    cart.discountAmount = discount;
    cart.updatedAt = new Date();
    return ok(cart);
  }

  // Returns subtotal in cents (before discount).
  calculateSubtotal(cart: Cart): number {
    return cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  // Returns total in cents (after discount, floored at 0).
  calculateTotal(cart: Cart): number {
    return Math.max(0, this.calculateSubtotal(cart) - cart.discountAmount);
  }

  async clear(userId: string): Promise<void> {
    const cart = this.findCartByUserId(userId);
    if (cart) {
      cart.items = [];
      cart.couponCode = undefined;
      cart.discountAmount = 0;
      cart.updatedAt = new Date();
    }
  }
}

// =====================================
// SECTION 7: ORDER MANAGEMENT
// =====================================

class OrderRepository {
  private store: Map<string, Order> = new Map();

  async create(order: Order): Promise<Order> {
    this.store.set(order.id, order);
    return order;
  }

  async findById(id: string): Promise<Order | undefined> {
    return this.store.get(id);
  }

  async update(
    id: string,
    patch: Partial<Omit<Order, "id">>
  ): Promise<Order> {
    const existing = this.store.get(id);
    if (!existing) throw new NotFoundError("Order", id);
    const updated: Order = { ...existing, ...patch };
    this.store.set(id, updated);
    return updated;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.store.values()).filter(
      (o) => o.userId === userId
    );
  }

  async list(): Promise<Order[]> {
    return Array.from(this.store.values());
  }
}

class OrderService {
  constructor(private orderRepo: OrderRepository) {}

  async createFromCart(
    userId: string,
    cart: Cart,
    subtotal: number,
    total: number
  ): Promise<Order> {
    const items: OrderItem[] = cart.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }));

    const order: Order = {
      id: generateId("order"),
      userId,
      items,
      subtotal,
      discountAmount: cart.discountAmount,
      total,
      status: OrderStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.orderRepo.create(order);
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Order> {
    return this.orderRepo.update(orderId, {
      status,
      updatedAt: new Date(),
    });
  }

  async getOrderHistory(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    return this.orderRepo.findById(orderId);
  }
}

// =====================================
// SECTION 8: PAYMENT PROCESSING (STRATEGY PATTERN)
// =====================================

// IPaymentProcessor defines the contract every payment gateway must satisfy.
// This is the "strategy interface" — callers depend on the abstraction, not
// the concrete implementation, so we can swap gateways without changing callers.
interface IPaymentProcessor {
  readonly name: string;
  charge(amount: number, metadata: Record<string, string>): Promise<Payment>;
  refund(payment: Payment): Promise<Payment>;
}

class CreditCardProcessor implements IPaymentProcessor {
  readonly name = "credit_card";

  async charge(
    amount: number,
    metadata: Record<string, string>
  ): Promise<Payment> {
    console.log(
      `  [CreditCard] Charging ${formatCents(amount)} for order ${metadata.orderId}`
    );
    // Simulate a ~5% failure rate so demos can show error handling.
    if (Math.random() < 0.00) { // set to 0 so the demo always succeeds
      throw new PaymentError("Credit card declined");
    }
    const payment: Payment = {
      id: generateId("pay"),
      orderId: metadata.orderId,
      amount,
      method: "credit_card",
      status: PaymentStatus.Captured,
      transactionId: `cc_txn_${generateId()}`,
      createdAt: new Date(),
    };
    return payment;
  }

  async refund(payment: Payment): Promise<Payment> {
    console.log(`  [CreditCard] Refunding payment ${payment.id}`);
    return { ...payment, status: PaymentStatus.Refunded };
  }
}

class PayPalProcessor implements IPaymentProcessor {
  readonly name = "paypal";

  async charge(
    amount: number,
    metadata: Record<string, string>
  ): Promise<Payment> {
    console.log(
      `  [PayPal] Charging ${formatCents(amount)} for order ${metadata.orderId}`
    );
    const payment: Payment = {
      id: generateId("pay"),
      orderId: metadata.orderId,
      amount,
      method: "paypal",
      status: PaymentStatus.Captured,
      transactionId: `pp_txn_${generateId()}`,
      createdAt: new Date(),
    };
    return payment;
  }

  async refund(payment: Payment): Promise<Payment> {
    console.log(`  [PayPal] Refunding payment ${payment.id}`);
    return { ...payment, status: PaymentStatus.Refunded };
  }
}

// PaymentService selects the right processor at runtime (strategy pattern).
// Registering processors in a map makes adding new gateways a one-liner.
class PaymentService {
  private processors: Map<string, IPaymentProcessor> = new Map();
  private payments: Map<string, Payment> = new Map();

  registerProcessor(processor: IPaymentProcessor): void {
    this.processors.set(processor.name, processor);
  }

  async charge(
    method: "credit_card" | "paypal",
    amount: number,
    metadata: Record<string, string>
  ): Promise<Result<Payment, string>> {
    const processor = this.processors.get(method);
    if (!processor) {
      return fail(`Payment processor "${method}" is not registered`);
    }
    try {
      const payment = await processor.charge(amount, metadata);
      this.payments.set(payment.id, payment);
      return ok(payment);
    } catch (err) {
      return fail(err instanceof Error ? err.message : String(err));
    }
  }

  async refund(paymentId: string): Promise<Result<Payment, string>> {
    const payment = this.payments.get(paymentId);
    if (!payment) return fail(`Payment "${paymentId}" not found`);
    const processor = this.processors.get(payment.method);
    if (!processor) return fail(`Processor for "${payment.method}" not registered`);
    try {
      const refunded = await processor.refund(payment);
      this.payments.set(refunded.id, refunded);
      return ok(refunded);
    } catch (err) {
      return fail(err instanceof Error ? err.message : String(err));
    }
  }

  findPaymentById(id: string): Payment | undefined {
    return this.payments.get(id);
  }
}

// =====================================
// SECTION 9: CHECKOUT SERVICE
// =====================================

// CheckoutResult packages everything the caller needs after a successful checkout.
interface CheckoutResult {
  order: Order;
  payment: Payment;
  message: string;
}

// CheckoutService orchestrates the full purchase flow.
// It depends on every other service — a good candidate for dependency injection
// in a real app (or an IoC container like InversifyJS).
class CheckoutService {
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private inventoryService: InventoryService,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  // checkout() returns a Result so callers get a typed success/failure value
  // instead of needing a try/catch for every possible failure mode.
  async checkout(
    token: string,
    paymentMethod: "credit_card" | "paypal"
  ): Promise<Result<CheckoutResult, string>> {

    // Step a: Validate the user is authenticated.
    const authToken = this.authService.validateToken(token);
    if (!authToken) {
      return fail("Invalid or expired authentication token");
    }
    const userId = authToken.userId;

    // Step b: Validate the cart is not empty.
    const cart = await this.cartService.getOrCreateCart(userId);
    if (cart.items.length === 0) {
      return fail("Cannot checkout with an empty cart");
    }

    // Step c: Check inventory for every item.
    for (const item of cart.items) {
      const sufficient = await this.inventoryService.checkStock(
        item.product.id,
        item.quantity
      );
      if (!sufficient) {
        return fail(
          `Insufficient stock for "${item.product.name}": ` +
          `requested ${item.quantity}, available ${item.product.stock}`
        );
      }
    }

    // Compute totals before creating the order.
    const subtotal = this.cartService.calculateSubtotal(cart);
    const total = this.cartService.calculateTotal(cart);

    // Step e: Create the order (status = Pending).
    let order = await this.orderService.createFromCart(
      userId,
      cart,
      subtotal,
      total
    );

    // Step d: Process payment.
    const paymentResult = await this.paymentService.charge(
      paymentMethod,
      total,
      { orderId: order.id, userId }
    );
    if (!paymentResult.ok) {
      // Payment failed — cancel the order so inventory is not touched.
      await this.orderService.updateStatus(order.id, OrderStatus.Cancelled);
      return fail(`Payment failed: ${paymentResult.error}`);
    }
    const payment = paymentResult.value;

    // Link the payment to the order and mark it as confirmed.
    order = await this.orderService.updateStatus(order.id, OrderStatus.Confirmed);
    await this.orderService["orderRepo"].update(order.id, {
      paymentId: payment.id,
      updatedAt: new Date(),
    });

    // Step f: Deduct stock for each purchased item.
    for (const item of cart.items) {
      await this.inventoryService.updateStock(item.product.id, -item.quantity);
    }

    // Step g: Clear the cart.
    await this.cartService.clear(userId);

    // Step h: Return the order confirmation.
    return ok({
      order,
      payment,
      message: `Order ${order.id} confirmed! Total charged: ${formatCents(total)}`,
    });
  }
}

// =====================================
// SECTION 10: TYPE GUARDS (for runtime safety)
// =====================================

// Type guards let us narrow types at runtime — essential when data arrives
// from the outside world (API responses, localStorage, etc.).

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    "role" in value
  );
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "price" in value &&
    "stock" in value
  );
}

function isAuthToken(value: unknown): value is AuthToken {
  return (
    typeof value === "object" &&
    value !== null &&
    "token" in value &&
    "userId" in value &&
    "expiresAt" in value
  );
}

// =====================================
// SECTION 11: SYSTEM BOOTSTRAP
// =====================================

// Bootstrap wires all services together and seeds initial data.
// In a real app this lives in a dependency injection container.
async function bootstrapSystem() {
  // Repositories (data layer)
  const userRepo = new UserRepository();
  const productRepo = new ProductRepository();
  const orderRepo = new OrderRepository();

  // Domain services (business logic layer)
  const authService = new AuthService(userRepo);
  const inventoryService = new InventoryService(productRepo);
  const cartService = new CartService();
  const orderService = new OrderService(orderRepo);

  // Payment service — register processors at startup.
  const paymentService = new PaymentService();
  paymentService.registerProcessor(new CreditCardProcessor());
  paymentService.registerProcessor(new PayPalProcessor());

  // Checkout orchestrator
  const checkoutService = new CheckoutService(
    authService,
    cartService,
    inventoryService,
    orderService,
    paymentService
  );

  // Seed product catalog
  const laptop = await productRepo.create({
    id: generateId("prod"),
    name: "Pro Laptop 15",
    description: "High-performance laptop for developers",
    price: 1_299_99,  // $1,299.99
    category: "electronics",
    stock: 10,
    createdAt: new Date(),
  });

  const mouse = await productRepo.create({
    id: generateId("prod"),
    name: "Ergonomic Mouse",
    description: "Wireless ergonomic mouse with long battery life",
    price: 49_99,     // $49.99
    category: "electronics",
    stock: 50,
    createdAt: new Date(),
  });

  const desk = await productRepo.create({
    id: generateId("prod"),
    name: "Standing Desk",
    description: "Electric height-adjustable standing desk",
    price: 699_99,    // $699.99
    category: "furniture",
    stock: 3,
    createdAt: new Date(),
  });

  return {
    repos: { userRepo, productRepo, orderRepo },
    services: {
      authService,
      inventoryService,
      cartService,
      orderService,
      paymentService,
      checkoutService,
    },
    products: { laptop, mouse, desk },
  };
}

// =====================================
// SECTION 12: DEMO — COMPLETE E-COMMERCE FLOW
// =====================================

async function runDemo(): Promise<void> {
  console.log("=".repeat(60));
  console.log("  E-Commerce System Demo");
  console.log("=".repeat(60));

  const { services, products } = await bootstrapSystem();
  const {
    authService,
    cartService,
    inventoryService,
    orderService,
    paymentService,
    checkoutService,
  } = services;
  const { laptop, mouse, desk } = products;

  // --------------------------------------------------
  // DEMO STEP 1: Register a new user
  // --------------------------------------------------
  console.log("\n--- Step 1: User Registration ---");
  const registerResult = await authService.register(
    "alice@example.com",
    "Alice Smith",
    "securePass123"
  );
  if (!registerResult.success) {
    console.error("Registration failed:", registerResult.error);
    return;
  }
  console.log(`Registered: ${registerResult.data?.name} (${registerResult.data?.email})`);
  console.log(`Role: ${registerResult.data?.role}`);

  // --------------------------------------------------
  // DEMO STEP 2: Log in
  // --------------------------------------------------
  console.log("\n--- Step 2: Login ---");
  const loginResult = await authService.login("alice@example.com", "securePass123");
  if (!loginResult.success || !loginResult.data) {
    console.error("Login failed:", loginResult.error);
    return;
  }
  const token = loginResult.data;
  console.log(`Logged in. Token: ${token.token.slice(0, 20)}...`);
  console.log(`Token expires at: ${token.expiresAt.toISOString()}`);

  // --------------------------------------------------
  // DEMO STEP 3: Browse products
  // --------------------------------------------------
  console.log("\n--- Step 3: Browse Products ---");
  const electronics = await services.repos.productRepo.filterByCategory("electronics");
  console.log("Electronics category:");
  electronics.forEach((p) =>
    console.log(`  - ${p.name}: ${formatCents(p.price)} (stock: ${p.stock})`)
  );

  const searchResults = await services.repos.productRepo.search("desk");
  console.log(`\nSearch "desk": found ${searchResults.length} result(s)`);
  searchResults.forEach((p) => console.log(`  - ${p.name}`));

  // --------------------------------------------------
  // DEMO STEP 4: Add products to cart
  // --------------------------------------------------
  console.log("\n--- Step 4: Add to Cart ---");
  const userId = token.userId;
  await cartService.addItem(userId, laptop, 1);
  await cartService.addItem(userId, mouse, 2);
  let cart = await cartService.getOrCreateCart(userId);
  console.log(`Cart has ${cart.items.length} item(s):`);
  cart.items.forEach((item) =>
    console.log(
      `  - ${item.product.name} x${item.quantity} = ${formatCents(item.product.price * item.quantity)}`
    )
  );
  console.log(`Subtotal: ${formatCents(cartService.calculateSubtotal(cart))}`);

  // --------------------------------------------------
  // DEMO STEP 5: Apply a coupon
  // --------------------------------------------------
  console.log("\n--- Step 5: Apply Coupon (SAVE10) ---");
  const couponResult = await cartService.applyCoupon(userId, "SAVE10");
  if (couponResult.ok) {
    cart = couponResult.value;
    console.log(`Coupon "${cart.couponCode}" applied: -${formatCents(cart.discountAmount)}`);
    console.log(`New total: ${formatCents(cartService.calculateTotal(cart))}`);
  } else {
    console.log("Coupon error:", couponResult.error);
  }

  // Attempt an invalid coupon to demonstrate the Result pattern.
  const badCoupon = await cartService.applyCoupon(userId, "FAKE99");
  if (!badCoupon.ok) {
    console.log(`Invalid coupon attempt: ${badCoupon.error}`);
  }

  // --------------------------------------------------
  // DEMO STEP 6: Checkout with credit card
  // --------------------------------------------------
  console.log("\n--- Step 6: Checkout ---");
  const checkoutResult = await checkoutService.checkout(token.token, "credit_card");
  if (!checkoutResult.ok) {
    console.error("Checkout failed:", checkoutResult.error);
    return;
  }
  const { order, payment, message } = checkoutResult.value;
  console.log(message);
  console.log(`Order ID:    ${order.id}`);
  console.log(`Order status: ${order.status}`);
  console.log(`Payment ID:  ${payment.id}`);
  console.log(`Transaction: ${payment.transactionId}`);

  // --------------------------------------------------
  // DEMO STEP 7: Verify cart was cleared
  // --------------------------------------------------
  console.log("\n--- Step 7: Cart After Checkout ---");
  const clearedCart = await cartService.getOrCreateCart(userId);
  console.log(`Cart items after checkout: ${clearedCart.items.length} (should be 0)`);

  // --------------------------------------------------
  // DEMO STEP 8: Verify inventory was decremented
  // --------------------------------------------------
  console.log("\n--- Step 8: Inventory After Purchase ---");
  const updatedLaptop = await services.repos.productRepo.findById(laptop.id);
  const updatedMouse = await services.repos.productRepo.findById(mouse.id);
  console.log(`${updatedLaptop?.name} stock: ${updatedLaptop?.stock} (was 10, bought 1)`);
  console.log(`${updatedMouse?.name} stock: ${updatedMouse?.stock} (was 50, bought 2)`);

  // --------------------------------------------------
  // DEMO STEP 9: View order history
  // --------------------------------------------------
  console.log("\n--- Step 9: Order History ---");
  const history = await orderService.getOrderHistory(userId);
  console.log(`Total orders for user: ${history.length}`);
  history.forEach((o) => {
    console.log(`  Order ${o.id}`);
    console.log(`    Status:  ${o.status}`);
    console.log(`    Subtotal: ${formatCents(o.subtotal)}`);
    console.log(`    Discount: -${formatCents(o.discountAmount)}`);
    console.log(`    Total:    ${formatCents(o.total)}`);
    o.items.forEach((item) =>
      console.log(`    - ${item.productName} x${item.quantity} @ ${formatCents(item.unitPrice)}`)
    );
  });

  // --------------------------------------------------
  // DEMO STEP 10: Process a refund
  // --------------------------------------------------
  console.log("\n--- Step 10: Refund ---");
  const refundResult = await paymentService.refund(payment.id);
  if (refundResult.ok) {
    console.log(`Refund successful. Payment status: ${refundResult.value.status}`);
    await orderService.updateStatus(order.id, OrderStatus.Refunded);
    const refundedOrder = await orderService.getOrderById(order.id);
    console.log(`Order status updated to: ${refundedOrder?.status}`);
  } else {
    console.log("Refund failed:", refundResult.error);
  }

  // --------------------------------------------------
  // DEMO STEP 11: Low stock alert
  // --------------------------------------------------
  console.log("\n--- Step 11: Low Stock Alerts ---");
  const lowStock = await inventoryService.getLowStockAlerts(5);
  if (lowStock.length > 0) {
    console.log("Low stock products:");
    lowStock.forEach((p) =>
      console.log(`  - ${p.name}: ${p.stock} remaining`)
    );
  } else {
    console.log("No low stock alerts.");
  }

  // --------------------------------------------------
  // DEMO STEP 12: Token validation type guard
  // --------------------------------------------------
  console.log("\n--- Step 12: Type Guard Demo ---");
  const unknownData: unknown = token;
  if (isAuthToken(unknownData)) {
    console.log(`Type guard confirmed: token belongs to user ${unknownData.userId}`);
  }

  // --------------------------------------------------
  // DEMO STEP 13: Logout
  // --------------------------------------------------
  console.log("\n--- Step 13: Logout ---");
  await authService.logout(token.token);
  const invalidToken = authService.validateToken(token.token);
  console.log(`Token valid after logout: ${invalidToken !== null} (should be false)`);

  console.log("\n" + "=".repeat(60));
  console.log("  Demo complete.");
  console.log("=".repeat(60));
}

// Run the demo immediately.
runDemo().catch(console.error);

// =====================================
// SECTION 13: WHAT YOU HAVE LEARNED
// =====================================

// Throughout this series and in this capstone you have used:
//
// 1.  ENUMS            — UserRole, OrderStatus, PaymentStatus
//                        (string enums for readable serialization)
//
// 2.  INTERFACES        — User, Product, Cart, Order, Payment, ApiResponse<T>
//                        (contracts that multiple classes must satisfy)
//
// 3.  GENERICS          — ApiResponse<T>, Result<T,E>, Map<K,V>
//                        (reusable code that works over many types)
//
// 4.  UTILITY TYPES     — Partial<Omit<User,"id">> in update methods
//                        (compose complex types from simpler ones)
//
// 5.  ACCESS MODIFIERS  — private store, private tokenStore
//                        (encapsulation — callers only see the public API)
//
// 6.  READONLY          — readonly id on every domain entity
//                        (prevents accidental mutation of primary keys)
//
// 7.  TYPE GUARDS       — isUser(), isProduct(), isAuthToken()
//                        (narrow unknown at runtime safely)
//
// 8.  CLASSES           — Repository, Service, and Processor classes
//                        (encapsulate state + behavior together)
//
// 9.  INTERFACES AS CONTRACTS — IPaymentProcessor
//                        (strategy pattern: swap implementations freely)
//
// 10. ASYNC/AWAIT       — every service method is async
//                        (works naturally with databases, HTTP calls, etc.)
//
// 11. CUSTOM ERRORS     — NotFoundError, AuthenticationError, etc.
//                        (typed catch blocks and clear error messages)
//
// 12. RESULT PATTERN    — Result<T,E> with ok() and fail() helpers
//                        (force callers to handle both success and failure)
//
// 13. DISCRIMINATED UNIONS — the Result type itself
//                        (TypeScript narrows the type based on the .ok field)

// =====================================
// NEXT STEPS
// =====================================

// 1. REACT + TYPESCRIPT
//    - Use this domain model directly in React components.
//    - Prop types replace interfaces you already know.
//    - React Query / TanStack Query for async data fetching.
//    - Zustand or Redux Toolkit for typed global state.
//    - Resources: https://react-typescript-cheatsheet.netlify.app/
//
// 2. NODE.JS + TYPESCRIPT (REST API)
//    - Express + ts-node, or Fastify with built-in TypeScript support.
//    - Replace in-memory repositories with Prisma (type-safe ORM).
//    - Add Zod for request validation — schemas generate TypeScript types.
//    - Resources: https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html
//
// 3. TESTING WITH TYPESCRIPT
//    - Vitest or Jest with ts-jest for unit tests.
//    - Type-safe mocks with vi.fn() / jest.fn().
//    - Integration tests with Supertest for HTTP endpoints.
//
// 4. ADVANCED TYPESCRIPT
//    - Conditional types: type IsArray<T> = T extends any[] ? true : false
//    - Mapped types: type Readonly<T> = { readonly [K in keyof T]: T[K] }
//    - Template literal types: type EventName = `on${Capitalize<string>}`
//    - Declaration merging and module augmentation.
//    - Resources: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: WHY use interfaces over type aliases for domain objects?
//     Interfaces support declaration merging — libraries (e.g., Express) use
//     this to let you add fields to Request without forking the package.
//     Interfaces also produce cleaner error messages. Type aliases shine for
//     union types, mapped types, and conditional types.
//
// Q2: EXPLAIN the strategy pattern in PaymentService.
//     Instead of a giant if/switch on payment method, we define a shared
//     IPaymentProcessor interface. Each concrete processor (CreditCard, PayPal)
//     implements it independently. PaymentService selects the right one at
//     runtime. Adding a new gateway = writing a new class + one registerProcessor()
//     call. Nothing else changes — this satisfies the Open/Closed Principle.
//
// Q3: WHAT is the benefit of the Result<T,E> type over throw/catch?
//     throw is dynamically typed — TypeScript cannot tell you what exceptions
//     a function might throw. Result makes both success and failure explicit
//     in the function signature. Callers are forced to handle both branches at
//     compile time (the discriminated union narrows the type), which eliminates
//     a whole class of "forgot to handle the error" bugs.
//
// Q4: HOW would you scale this system for a production environment?
//     - Replace in-memory repositories with a database (Prisma + PostgreSQL).
//     - Extract services into separate microservices (Order, Payment, Inventory).
//     - Add a message broker (RabbitMQ / Kafka) for inter-service events
//       (e.g., "OrderCreated" triggers inventory deduction asynchronously).
//     - Use Redis for session/token storage and cart caching.
//     - Add an API gateway (rate limiting, authentication middleware).
//     - Use OpenTelemetry for distributed tracing across services.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1: Product Reviews
//   Add a Review interface { id, userId, productId, rating: 1|2|3|4|5, comment, createdAt }.
//   Build a ReviewService with addReview(), getProductReviews(), and
//   getAverageRating(). Prevent a user from reviewing the same product twice.
//   Challenge: compute a weighted average that favours recent reviews.
//
// TASK 2: Admin Dashboard
//   Create an AdminService that:
//     - Lists all orders across all users (only callable with UserRole.Admin token).
//     - Returns revenue totals by product category.
//     - Identifies the top-5 best-selling products.
//   Use TypeScript utility types (Pick, Record, ReturnType) to avoid duplication.
//
// TASK 3: Wishlist + Back-in-Stock Notifications
//   Add a WishlistService (add/remove/list products per user).
//   When InventoryService.updateStock() raises a product's stock from 0 to > 0,
//   emit a "BackInStock" event. Collect all users whose wishlist contains that
//   product and log a notification for each.
//   Model events as a discriminated union and use a typed event emitter.
