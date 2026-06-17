// =====================================
// 14 - UTILITY TYPES IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers who know basic TypeScript.
// This file is self-contained and fully runnable.

// TypeScript ships with a set of built-in UTILITY TYPES.
// These are generic types that transform existing types into new ones.
// They let you derive types from other types without repeating yourself.
//
// Categories covered:
//   OBJECT UTILITIES : Partial, Required, Readonly, Pick, Omit, Record
//   FUNCTION/TYPE    : ReturnType, Parameters, ConstructorParameters, InstanceType
//   SET/LOGIC        : Exclude, Extract, NonNullable, Awaited

// =====================================
// BASE TYPES USED THROUGHOUT THIS FILE
// =====================================

// These interfaces are shared by all examples below so you can see every
// utility type applied to realistic, consistent data shapes.

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  salt: string;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface OrderDraft {
  userId?: number;
  items?: { productId: number; quantity: number }[];
  shippingAddress?: string;
  paymentMethodId?: string;
  couponCode?: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  billingAddress: string;
}

interface Order {
  id: number;
  userId: number;
  items: { productId: number; quantity: number; unitPrice: number }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  createdAt: Date;
}

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

// JAVASCRIPT — you have to manually track which fields are optional.
// There is nothing stopping you from accidentally sending a password hash
// to the client, or mutating payment card data mid-flight.
//
// const updateUser = (id, data) => {
//   // data could have anything — TypeScript cannot help here
// };
//
// TYPESCRIPT WITH UTILITY TYPES — the compiler enforces the shape for you.
//
// const updateUser = (id: number, data: Partial<User>) => { ... };
// Now data can only have valid User keys, all of them optional.
// The compiler rejects typos, extra keys, and wrong value types.

// =====================================
// PARTIAL<T>
// =====================================

// WHAT IT IS
// ----------
// Partial<T> takes a type T and makes every property in it optional (adds ?).
//
// PROBLEM IT SOLVES
// -----------------
// When you build an UPDATE endpoint you rarely update every field at once.
// Without Partial you would have to write a separate UpdateUser interface
// that duplicates all the same properties but marks them optional — pure noise.
//
// SYNTAX
// ------
// type Result = Partial<SomeType>;
//
// Equivalent to writing every property as: property?: type

// Simple example
interface Config {
  theme: string;
  language: string;
  notifications: boolean;
}

type PartialConfig = Partial<Config>;
// { theme?: string; language?: string; notifications?: boolean; }

const defaultConfig: Config = {
  theme: "dark",
  language: "en",
  notifications: true,
};

function applyConfig(base: Config, overrides: Partial<Config>): Config {
  return { ...base, ...overrides };
}

const userConfig = applyConfig(defaultConfig, { theme: "light" });
console.log("Applied config:", userConfig);
// { theme: 'light', language: 'en', notifications: true }

// Practical example — PATCH endpoint payload
function updateUserInDb(id: number, data: Partial<User>): void {
  // data may contain any subset of User properties
  console.log(`Updating user ${id} with:`, data);
}

updateUserInDb(1, { name: "Alice", email: "alice@example.com" });
// Only name and email — perfectly valid. No need to send all User fields.

// Real-world example — User CRUD (partial update)
type UserUpdatePayload = Partial<User>;

function patchUser(id: number, payload: UserUpdatePayload): void {
  // Simulates a PATCH /users/:id handler
  const allowedKeys: Array<keyof User> = ["name", "email", "role"];
  const sanitized = Object.fromEntries(
    Object.entries(payload).filter(([k]) => allowedKeys.includes(k as keyof User))
  );
  console.log(`PATCH /users/${id}`, sanitized);
}

patchUser(42, { name: "Bob", role: "editor" });

// =====================================
// REQUIRED<T>
// =====================================

// WHAT IT IS
// ----------
// Required<T> is the opposite of Partial<T>.
// It makes every property in T required (removes the ? from all properties).
//
// PROBLEM IT SOLVES
// -----------------
// You may have a "draft" type where everything is optional (users save as they go).
// Before submission you need to verify ALL fields are present.
// Required<DraftType> gives you that fully-filled-out shape.
//
// SYNTAX
// ------
// type Result = Required<SomeType>;

// Simple example
interface UserPreferences {
  theme?: string;
  fontSize?: number;
  sidebar?: boolean;
}

type CompleteUserPreferences = Required<UserPreferences>;
// { theme: string; fontSize: number; sidebar: boolean; }

function savePreferences(prefs: Required<UserPreferences>): void {
  console.log("Saving complete preferences:", prefs);
}

savePreferences({ theme: "dark", fontSize: 14, sidebar: true });
// All three fields must be provided — compiler error if any is missing.

// Practical example — form validation before API call
function isOrderComplete(draft: OrderDraft): draft is Required<OrderDraft> {
  return (
    draft.userId !== undefined &&
    draft.items !== undefined &&
    draft.shippingAddress !== undefined &&
    draft.paymentMethodId !== undefined
  );
}

// Real-world example — Order management (submitting a draft)
function submitOrder(draft: OrderDraft): void {
  if (!isOrderComplete(draft)) {
    console.log("Order is incomplete, cannot submit.");
    return;
  }
  // TypeScript now knows draft is Required<OrderDraft>
  const completeOrder: Required<OrderDraft> = draft;
  console.log("Submitting order for user:", completeOrder.userId);
}

const incompleteDraft: OrderDraft = { userId: 7 };
submitOrder(incompleteDraft); // "Order is incomplete, cannot submit."

const completeDraft: OrderDraft = {
  userId: 7,
  items: [{ productId: 3, quantity: 2 }],
  shippingAddress: "123 Main St",
  paymentMethodId: "pm_abc123",
};
submitOrder(completeDraft); // "Submitting order for user: 7"

// =====================================
// READONLY<T>
// =====================================

// WHAT IT IS
// ----------
// Readonly<T> makes every property in T immutable.
// Attempting to assign to any property after creation is a compile-time error.
//
// PROBLEM IT SOLVES
// -----------------
// Payment card details should never be mutated in transit.
// Configuration loaded at startup should not change at runtime.
// Readonly<T> makes these intentions explicit and compiler-enforced.
//
// SYNTAX
// ------
// type Result = Readonly<SomeType>;

// Simple example
interface Point {
  x: number;
  y: number;
}

const origin: Readonly<Point> = { x: 0, y: 0 };
// origin.x = 5; // Error: Cannot assign to 'x' because it is a read-only property.

console.log("Origin:", origin);

// Practical example — freezing configuration
const APP_CONFIG: Readonly<Config> = {
  theme: "dark",
  language: "en",
  notifications: true,
};

// APP_CONFIG.theme = "light"; // Compile error — good!
console.log("App config (immutable):", APP_CONFIG);

// Real-world example — Payment processing
function processPayment(details: Readonly<PaymentDetails>): void {
  // We cannot accidentally mutate card data inside this function.
  // details.cvv = "000"; // Compile error — intentional protection.
  console.log(`Processing payment for: ${details.cardHolderName}`);
  console.log(`Card ending in: ${details.cardNumber.slice(-4)}`);
}

const payment: Readonly<PaymentDetails> = {
  cardNumber: "4111111111111234",
  cardHolderName: "Jane Doe",
  expiryMonth: 12,
  expiryYear: 2027,
  cvv: "123",
  billingAddress: "456 Elm St",
};

processPayment(payment);

// =====================================
// PICK<T, K>
// =====================================

// WHAT IT IS
// ----------
// Pick<T, K> creates a new type by selecting only the properties K from T.
// K must be a union of keys that exist in T (enforced at compile time).
//
// PROBLEM IT SOLVES
// -----------------
// You need a "summary" or "preview" version of a large type.
// Instead of writing a separate interface by hand, Pick derives it automatically.
// If the source type changes, your Pick'd type updates for free.
//
// SYNTAX
// ------
// type Result = Pick<SomeType, "key1" | "key2">;

// Simple example
type UserPreview = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

const userPreview: UserPreview = { id: 1, name: "Alice", email: "alice@example.com" };
console.log("User preview:", userPreview);

// Practical example — search result card
type ProductSummary = Pick<Product, "id" | "name" | "price">;

function renderProductCard(product: ProductSummary): void {
  console.log(`[CARD] ${product.name} — $${product.price.toFixed(2)} (id: ${product.id})`);
}

const card: ProductSummary = { id: 5, name: "Wireless Mouse", price: 29.99 };
renderProductCard(card);

// Real-world example — Product catalog listing page
function formatCatalogList(products: ProductSummary[]): string {
  return products
    .map((p) => `${p.id}: ${p.name} ($${p.price})`)
    .join("\n");
}

const catalogItems: ProductSummary[] = [
  { id: 1, name: "Mechanical Keyboard", price: 89.99 },
  { id: 2, name: "USB-C Hub", price: 49.99 },
  { id: 3, name: "Webcam HD", price: 74.99 },
];

console.log("Product catalog:\n" + formatCatalogList(catalogItems));

// Pick is also useful for forms — only pick the fields a form touches:
type LoginForm = Pick<User, "email" | "password">;

function handleLogin(form: LoginForm): void {
  console.log(`Login attempt for: ${form.email}`);
}

handleLogin({ email: "bob@example.com", password: "secret123" });

// =====================================
// OMIT<T, K>
// =====================================

// WHAT IT IS
// ----------
// Omit<T, K> creates a new type with all properties of T EXCEPT the ones listed in K.
// It is the inverse of Pick — you say what you want to remove rather than keep.
//
// PROBLEM IT SOLVES
// -----------------
// You want to expose a type without sensitive fields (password, salt, cvv).
// Omit<User, "password" | "salt"> gives you a safe public-facing User shape.
//
// SYNTAX
// ------
// type Result = Omit<SomeType, "key1" | "key2">;

// Simple example
type PublicUser = Omit<User, "password" | "salt">;
// All User fields except password and salt.

const publicUser: PublicUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "editor",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
};
console.log("Public user profile:", publicUser);

// Practical example — API response type that never leaks secrets
function getUserProfile(id: number): Omit<User, "password" | "salt"> {
  // Simulate DB fetch
  const user: User = {
    id,
    name: "Alice",
    email: "alice@example.com",
    password: "hashed_password_xyz",
    salt: "random_salt_abc",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // Destructure to strip secrets before returning
  const { password, salt, ...safeUser } = user;
  return safeUser;
}

console.log("Profile response:", getUserProfile(1));

// Real-world example — Authentication (JWT payload)
type JwtPayload = Omit<User, "password" | "salt">;

function createJwtPayload(user: User): JwtPayload {
  const { password, salt, ...payload } = user;
  return payload;
}

const fullUser: User = {
  id: 99,
  name: "Carol",
  email: "carol@example.com",
  password: "bcrypt_hash",
  salt: "random_salt",
  role: "viewer",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const payload = createJwtPayload(fullUser);
console.log("JWT payload (no secrets):", payload);

// Omit is also handy for building creation payloads that exclude auto-generated fields:
type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;

function createUser(data: CreateUserPayload): User {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const newUser = createUser({
  name: "Dave",
  email: "dave@example.com",
  password: "hashed",
  salt: "salt",
  role: "viewer",
});
console.log("Created user id:", newUser.id);

// =====================================
// RECORD<K, V>
// =====================================

// WHAT IT IS
// ----------
// Record<K, V> constructs an object type whose keys are of type K and values of type V.
// K must be string, number, symbol, or a union of string literals.
//
// PROBLEM IT SOLVES
// -----------------
// When you want a typed dictionary / map / lookup table.
// Without Record you would write { [key: string]: SomeType } — Record is cleaner
// and also lets you constrain the keys to a specific union.
//
// SYNTAX
// ------
// type Result = Record<KeyType, ValueType>;

// Simple example — status label map
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Awaiting Confirmation",
  confirmed: "Order Confirmed",
  shipped: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

console.log("Shipped label:", statusLabels["shipped"]);

// Practical example — product lookup by id
type ProductCatalog = Record<number, Product>;

const catalog: ProductCatalog = {
  1: { id: 1, name: "Keyboard", description: "Mech keyboard", price: 89.99, stock: 50, category: "peripherals", imageUrl: "kb.jpg" },
  2: { id: 2, name: "Mouse", description: "Wireless mouse", price: 29.99, stock: 200, category: "peripherals", imageUrl: "mouse.jpg" },
};

function getProductById(id: number, store: ProductCatalog): Product | undefined {
  return store[id];
}

console.log("Product 1:", getProductById(1, catalog)?.name);

// Real-world example — API response dictionary of products
type ApiProductResponse = Record<string, Product>;

function normalizeApiResponse(products: Product[]): ApiProductResponse {
  return products.reduce<ApiProductResponse>((acc, p) => {
    acc[`product_${p.id}`] = p;
    return acc;
  }, {});
}

const productList: Product[] = [
  { id: 1, name: "Keyboard", description: "Mech", price: 89.99, stock: 50, category: "peripherals", imageUrl: "kb.jpg" },
  { id: 2, name: "Mouse", description: "Wireless", price: 29.99, stock: 200, category: "peripherals", imageUrl: "mouse.jpg" },
];

const normalized = normalizeApiResponse(productList);
console.log("Normalized keys:", Object.keys(normalized));

// Record with literal key union — constrains exactly which keys are allowed:
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RouteHandlers = Record<HttpMethod, (path: string) => void>;

const handlers: RouteHandlers = {
  GET: (path) => console.log(`GET ${path}`),
  POST: (path) => console.log(`POST ${path}`),
  PUT: (path) => console.log(`PUT ${path}`),
  PATCH: (path) => console.log(`PATCH ${path}`),
  DELETE: (path) => console.log(`DELETE ${path}`),
};

handlers.GET("/users");
handlers.POST("/orders");

// =====================================
// RETURNTYPE<T>
// =====================================

// WHAT IT IS
// ----------
// ReturnType<T> extracts the return type of a function type T.
// T must be a function type (or a generic extending a function type).
//
// PROBLEM IT SOLVES
// -----------------
// You call a function from a library that does not export its return type.
// Instead of manually declaring a matching interface, ReturnType infers it for you.
// Your type stays in sync with the function automatically.
//
// SYNTAX
// ------
// type Result = ReturnType<typeof someFunction>;

// Simple example
function getUser() {
  return { id: 1, name: "Alice", email: "alice@example.com" };
}

type GetUserResult = ReturnType<typeof getUser>;
// { id: number; name: string; email: string; }

const fetchedUser: GetUserResult = getUser();
console.log("Fetched user:", fetchedUser);

// Practical example — reusing a factory return type
function createOrderSummary(order: Order) {
  return {
    orderId: order.id,
    total: order.total,
    status: order.status,
    itemCount: order.items.length,
  };
}

type OrderSummary = ReturnType<typeof createOrderSummary>;

function displayOrderSummary(summary: OrderSummary): void {
  console.log(`Order #${summary.orderId}: ${summary.status} — $${summary.total} (${summary.itemCount} items)`);
}

const sampleOrder: Order = {
  id: 101,
  userId: 5,
  items: [{ productId: 1, quantity: 2, unitPrice: 89.99 }],
  total: 179.98,
  status: "confirmed",
  shippingAddress: "789 Oak Ave",
  createdAt: new Date(),
};

displayOrderSummary(createOrderSummary(sampleOrder));

// Real-world example — Redux-style action creators
function fetchProducts() {
  return { type: "FETCH_PRODUCTS" as const, payload: null };
}

function setProducts(products: ProductSummary[]) {
  return { type: "SET_PRODUCTS" as const, payload: products };
}

type FetchProductsAction = ReturnType<typeof fetchProducts>;
type SetProductsAction = ReturnType<typeof setProducts>;
type ProductAction = FetchProductsAction | SetProductsAction;

function productReducer(state: ProductSummary[] = [], action: ProductAction): ProductSummary[] {
  switch (action.type) {
    case "SET_PRODUCTS":
      return action.payload;
    default:
      return state;
  }
}

const newState = productReducer([], setProducts(catalogItems));
console.log("Reducer state length:", newState.length);

// =====================================
// PARAMETERS<T>
// =====================================

// WHAT IT IS
// ----------
// Parameters<T> extracts the parameter types of a function as a tuple.
// T must be a function type.
//
// PROBLEM IT SOLVES
// -----------------
// You want to store, pass, or replay function arguments with correct types.
// Useful for middleware, memoization, debounce wrappers, and logging utilities.
//
// SYNTAX
// ------
// type Result = Parameters<typeof someFunction>;
// Result is a tuple: [param1Type, param2Type, ...]

// Simple example
function add(a: number, b: number): number {
  return a + b;
}

type AddParams = Parameters<typeof add>;
// [number, number]

function callWithArgs(fn: typeof add, args: AddParams): number {
  return fn(...args);
}

console.log("add(3, 4):", callWithArgs(add, [3, 4]));

// Practical example — generic debounce that preserves argument types
function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function searchProducts(query: string, category: string): void {
  console.log(`Searching for "${query}" in category "${category}"`);
}

const debouncedSearch = debounce(searchProducts, 300);
debouncedSearch("keyboard", "peripherals");

// Real-world example — logging wrapper that records arguments
function logCall<T extends (...args: never[]) => unknown>(
  fnName: string,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log(`Calling ${fnName} with:`, args);
    const result = fn(...args) as ReturnType<T>;
    console.log(`${fnName} returned:`, result);
    return result;
  };
}

function placeOrder(userId: number, productId: number, quantity: number): string {
  return `order_${userId}_${productId}_${quantity}`;
}

const loggedPlaceOrder = logCall("placeOrder", placeOrder);
loggedPlaceOrder(7, 3, 2);

// =====================================
// CONSTRUCTORPARAMETERS<T>
// =====================================

// WHAT IT IS
// ----------
// ConstructorParameters<T> extracts the parameter types from a class constructor
// as a tuple. T must be a constructor type (class).
//
// PROBLEM IT SOLVES
// -----------------
// When you need to store or forward constructor arguments generically
// (factory functions, dependency injection containers, test helpers).
//
// SYNTAX
// ------
// type Result = ConstructorParameters<typeof SomeClass>;

// Simple example
class ApiClient {
  constructor(
    public baseUrl: string,
    public apiKey: string,
    public timeout: number
  ) {}

  get(path: string): void {
    console.log(`GET ${this.baseUrl}${path} (timeout: ${this.timeout}ms)`);
  }
}

type ApiClientArgs = ConstructorParameters<typeof ApiClient>;
// [string, string, number]

function createApiClient(args: ApiClientArgs): ApiClient {
  return new ApiClient(...args);
}

const client = createApiClient(["https://api.example.com", "sk-abc123", 5000]);
client.get("/products");

// Practical example — generic class factory
function construct<T extends new (...args: never[]) => unknown>(
  Cls: T,
  args: ConstructorParameters<T>
): InstanceType<T> {
  return new Cls(...args) as InstanceType<T>;
}

class ProductService {
  constructor(
    private readonly catalogUrl: string,
    private readonly defaultCurrency: string
  ) {}

  fetchAll(): void {
    console.log(`Fetching products from ${this.catalogUrl} in ${this.defaultCurrency}`);
  }
}

type ProductServiceArgs = ConstructorParameters<typeof ProductService>;

const serviceArgs: ProductServiceArgs = ["https://catalog.example.com", "USD"];
const productService = construct(ProductService, serviceArgs);
productService.fetchAll();

// Real-world example — dependency injection style container
class OrderRepository {
  constructor(
    private readonly dbHost: string,
    private readonly dbPort: number,
    private readonly dbName: string
  ) {}

  findById(id: number): void {
    console.log(`Querying ${this.dbHost}:${this.dbPort}/${this.dbName} for order ${id}`);
  }
}

type OrderRepoConfig = ConstructorParameters<typeof OrderRepository>;

const repoConfig: OrderRepoConfig = ["localhost", 5432, "orders_db"];
const repo = new OrderRepository(...repoConfig);
repo.findById(101);

// =====================================
// INSTANCETYPE<T>
// =====================================

// WHAT IT IS
// ----------
// InstanceType<T> extracts the type of the instance produced by a constructor.
// T must be a constructor type (class).
//
// PROBLEM IT SOLVES
// -----------------
// When you have a class constructor stored in a variable (rather than a type name),
// you cannot directly annotate "an instance of this class" — InstanceType<T> solves that.
//
// SYNTAX
// ------
// type Result = InstanceType<typeof SomeClass>;

// Simple example
class UserService {
  constructor(private readonly apiUrl: string) {}

  getUser(id: number): PublicUser {
    console.log(`Fetching user ${id} from ${this.apiUrl}`);
    return { id, name: "Test", email: "test@example.com", role: "viewer", createdAt: new Date(), updatedAt: new Date() };
  }
}

type UserServiceInstance = InstanceType<typeof UserService>;

function useService(service: UserServiceInstance): void {
  service.getUser(1);
}

const userService = new UserService("https://api.example.com");
useService(userService);

// Practical example — service registry / container
type ServiceConstructor = new (...args: never[]) => unknown;
type ServiceRegistry = Map<string, ServiceConstructor>;

function resolve<T extends ServiceConstructor>(
  registry: ServiceRegistry,
  name: string
): InstanceType<T> | null {
  const Ctor = registry.get(name) as T | undefined;
  if (!Ctor) return null;
  return new Ctor() as InstanceType<T>;
}

// Real-world example — plugin system where plugins are registered as classes
class EmailPlugin {
  send(to: string, subject: string): void {
    console.log(`Email to ${to}: ${subject}`);
  }
}

class SmsPlugin {
  send(to: string, message: string): void {
    console.log(`SMS to ${to}: ${message}`);
  }
}

type NotificationPlugin = InstanceType<typeof EmailPlugin> | InstanceType<typeof SmsPlugin>;

function dispatchNotification(plugin: NotificationPlugin, to: string, content: string): void {
  plugin.send(to, content);
}

const emailPlugin = new EmailPlugin();
const smsPlugin = new SmsPlugin();

dispatchNotification(emailPlugin, "user@example.com", "Your order has shipped!");
dispatchNotification(smsPlugin, "+15551234567", "Order shipped");

// =====================================
// EXCLUDE<T, U>
// =====================================

// WHAT IT IS
// ----------
// Exclude<T, U> removes from the union T every member that is assignable to U.
// It operates on union types, not object types.
//
// PROBLEM IT SOLVES
// -----------------
// You have a broad union type and you want a narrower version that excludes
// certain members — without writing a new union manually.
//
// SYNTAX
// ------
// type Result = Exclude<UnionType, TypesToRemove>;

// Simple example
type AllStatuses = "active" | "inactive" | "banned" | "pending";
type ActiveStatuses = Exclude<AllStatuses, "banned" | "inactive">;
// "active" | "pending"

const currentStatus: ActiveStatuses = "active";
console.log("Current status:", currentStatus);

// Practical example — filter out null-like types from a union
type MaybeString = string | number | null | undefined;
type DefinitelyValue = Exclude<MaybeString, null | undefined>;
// string | number

function processValue(val: DefinitelyValue): void {
  console.log("Processing:", val);
}

processValue("hello");
processValue(42);

// Real-world example — Order management: exclude terminal statuses from "actionable" list
type ActionableOrderStatus = Exclude<OrderStatus, "delivered" | "cancelled">;
// "pending" | "confirmed" | "shipped"

function canUpdateOrder(status: OrderStatus): status is ActionableOrderStatus {
  const actionable: ActionableOrderStatus[] = ["pending", "confirmed", "shipped"];
  return actionable.includes(status as ActionableOrderStatus);
}

console.log("Can update pending order?", canUpdateOrder("pending")); // true
console.log("Can update delivered order?", canUpdateOrder("delivered")); // false

// Exclude is also useful to remove a specific variant from a discriminated union:
type ApiEvent =
  | { type: "login"; userId: number }
  | { type: "logout"; userId: number }
  | { type: "error"; message: string };

type NonErrorEvent = Exclude<ApiEvent, { type: "error" }>;
// { type: "login"; userId: number } | { type: "logout"; userId: number }

function logNonErrorEvent(event: NonErrorEvent): void {
  console.log(`Event: ${event.type} for user ${event.userId}`);
}

logNonErrorEvent({ type: "login", userId: 5 });

// =====================================
// EXTRACT<T, U>
// =====================================

// WHAT IT IS
// ----------
// Extract<T, U> keeps only the members of union T that are assignable to U.
// It is the opposite of Exclude.
//
// PROBLEM IT SOLVES
// -----------------
// You have a large union and only want the subset that matches a certain shape
// or type — without manually listing them again.
//
// SYNTAX
// ------
// type Result = Extract<UnionType, TypesToKeep>;

// Simple example
type Primitive = string | number | boolean | null | undefined | symbol | bigint;
type NumericPrimitive = Extract<Primitive, number | bigint>;
// number | bigint

const val: NumericPrimitive = 42n;
console.log("Numeric primitive:", val);

// Practical example — extract string keys from a union
type KeyOrIndex = "name" | "email" | 0 | 1 | "id";
type StringKeys = Extract<KeyOrIndex, string>;
// "name" | "email" | "id"

const key: StringKeys = "email";
console.log("String key:", key);

// Real-world example — extract only the "shipped" or "delivered" statuses
// (e.g., to show tracking info)
type TrackableStatus = Extract<OrderStatus, "shipped" | "delivered">;
// "shipped" | "delivered"

function showTrackingInfo(status: TrackableStatus, trackingNumber: string): void {
  console.log(`Status: ${status} — Tracking: ${trackingNumber}`);
}

showTrackingInfo("shipped", "TRK9876543");

// Authentication — extract only roles that can access admin panel
type UserRole = "admin" | "editor" | "viewer" | "guest";
type AdminAccessRole = Extract<UserRole, "admin" | "editor">;

function checkAdminAccess(role: UserRole): role is AdminAccessRole {
  const adminRoles: AdminAccessRole[] = ["admin", "editor"];
  return adminRoles.includes(role as AdminAccessRole);
}

console.log("admin has access?", checkAdminAccess("admin")); // true
console.log("viewer has access?", checkAdminAccess("viewer")); // false

// =====================================
// NONNULLABLE<T>
// =====================================

// WHAT IT IS
// ----------
// NonNullable<T> removes null and undefined from the type T.
// It is shorthand for Exclude<T, null | undefined>.
//
// PROBLEM IT SOLVES
// -----------------
// Functions that receive optional/nullable values often have a guarded code path
// where they know the value is definitely present. NonNullable expresses that.
//
// SYNTAX
// ------
// type Result = NonNullable<T>;

// Simple example
type NullableString = string | null | undefined;
type DefiniteString = NonNullable<NullableString>;
// string

function toUpperCase(val: DefiniteString): string {
  return val.toUpperCase();
}

console.log("Upper:", toUpperCase("hello"));

// Practical example — after a null check, type is narrowed automatically,
// but NonNullable is useful to annotate the "safe" parameter explicitly.
type UserId = number | null;
type SafeUserId = NonNullable<UserId>;

function fetchOrdersForUser(userId: SafeUserId): void {
  console.log(`Fetching orders for user: ${userId}`);
}

fetchOrdersForUser(42);
// fetchOrdersForUser(null); // Compile error — good!

// Real-world example — User CRUD: resolving optional fields before processing
interface RawApiUser {
  id: number | null;
  name: string | null;
  email: string | undefined;
}

type ValidatedUser = {
  [K in keyof RawApiUser]: NonNullable<RawApiUser[K]>;
};
// { id: number; name: string; email: string; }

function validateApiUser(raw: RawApiUser): ValidatedUser | null {
  if (raw.id === null || raw.name === null || raw.email === undefined) {
    console.log("Invalid user data from API");
    return null;
  }
  return { id: raw.id, name: raw.name, email: raw.email };
}

console.log(validateApiUser({ id: 1, name: "Eve", email: "eve@example.com" }));
console.log(validateApiUser({ id: null, name: "Eve", email: "eve@example.com" }));

// =====================================
// AWAITED<T>
// =====================================

// WHAT IT IS
// ----------
// Awaited<T> recursively unwraps Promise types until it reaches the resolved value type.
// Awaited<Promise<string>> → string
// Awaited<Promise<Promise<number>>> → number
//
// PROBLEM IT SOLVES
// -----------------
// When working with async functions you often need the type of the resolved value
// without calling the function. Awaited<ReturnType<typeof asyncFn>> gives you that.
//
// SYNTAX
// ------
// type Result = Awaited<SomePromiseType>;

// Simple example
type StringPromise = Promise<string>;
type ResolvedString = Awaited<StringPromise>;
// string

async function fetchGreeting(): Promise<string> {
  return "Hello, TypeScript!";
}

type GreetingType = Awaited<ReturnType<typeof fetchGreeting>>;
// string

// Practical example — extract the resolved type from an async data loader
async function loadUserFromApi(id: number): Promise<User> {
  return {
    id,
    name: "Frank",
    email: "frank@example.com",
    password: "hash",
    salt: "salt",
    role: "viewer",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

type LoadedUser = Awaited<ReturnType<typeof loadUserFromApi>>;
// User — same as writing User, but derived automatically

async function processUser(id: number): Promise<void> {
  const user: LoadedUser = await loadUserFromApi(id);
  console.log("Loaded user:", user.name);
}

processUser(10);

// Real-world example — API response wrapper
async function fetchOrdersApi(userId: number): Promise<Order[]> {
  console.log(`API: fetching orders for user ${userId}`);
  return [];
}

type OrdersApiResult = Awaited<ReturnType<typeof fetchOrdersApi>>;
// Order[]

// Useful when building a generic cache layer — the cache stores the resolved type:
type Cache<T extends (...args: never[]) => Promise<unknown>> = Map<
  string,
  Awaited<ReturnType<T>>
>;

const orderCache: Cache<typeof fetchOrdersApi> = new Map();
orderCache.set("user_7", []);
console.log("Cache has user_7:", orderCache.has("user_7"));

// Awaited also handles nested promises (unusual but possible):
type Nested = Awaited<Promise<Promise<Promise<number>>>>;
// number — TypeScript fully unwraps the chain

// =====================================
// CREATING CUSTOM UTILITY TYPES
// =====================================

// TypeScript's built-in utilities are built on mapped types and conditional types.
// You can compose your own utilities by combining these building blocks.

// -- Nullable<T> --
// Makes a type T nullable (adds null to it).
type Nullable<T> = T | null;

type NullableUser = Nullable<User>;
const maybeUser: NullableUser = null; // Valid
console.log("Nullable user:", maybeUser);

// -- Optional<T> --
// Makes a type T optional (adds null and undefined).
type Optional<T> = T | null | undefined;

function findProductById(id: number): Optional<Product> {
  const store = catalog;
  return store[id] ?? null;
}

const found = findProductById(999);
console.log("Found product:", found);

// -- DeepPartial<T> --
// Recursively makes every property in T optional, including nested objects.
// Built-in Partial<T> only goes one level deep.
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface AppSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontSize: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
}

// With plain Partial, you can omit top-level keys but nested objects are still required.
// With DeepPartial, you can omit any key at any depth.
type DeepPartialSettings = DeepPartial<AppSettings>;

const partialSettings: DeepPartialSettings = {
  theme: {
    primaryColor: "#3b82f6",
    // secondaryColor and fontSize are optional at this level too
  },
};

console.log("Deep partial settings:", partialSettings);

// -- Mutable<T> --
// The inverse of Readonly — removes readonly from all properties.
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

interface FrozenPoint {
  readonly x: number;
  readonly y: number;
}

type MutablePoint = Mutable<FrozenPoint>;
// { x: number; y: number; } — no readonly

const mutablePoint: MutablePoint = { x: 1, y: 2 };
mutablePoint.x = 10; // Now allowed
console.log("Mutable point:", mutablePoint);

// -- RequiredKeys<T, K> --
// Makes only specific keys of T required while leaving the rest unchanged.
type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type OrderWithRequiredUser = RequiredKeys<OrderDraft, "userId" | "items">;
// userId and items are required; everything else stays optional

const validOrder: OrderWithRequiredUser = {
  userId: 7,
  items: [{ productId: 1, quantity: 2 }],
  // shippingAddress, paymentMethodId, couponCode are still optional
};
console.log("Order with required keys:", validOrder);

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1 — Overusing Partial<T> everywhere
// --------------------------------------------
// It is tempting to mark everything Partial to "be flexible".
// This silently removes required-field checks from the compiler.
// You lose the safety guarantee that the required data is actually present.

// BAD — every caller can now skip required fields with no error:
function badCreateUser(data: Partial<User>): void {
  // data.email might be undefined — you cannot safely call data.email.toLowerCase()
  // You have to add runtime null checks everywhere.
  console.log("Creating user:", data.name ?? "(no name)");
}

// GOOD — use Omit to exclude auto-generated fields, keep the rest required:
function goodCreateUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): void {
  // name, email, password, etc. are definitely present.
  console.log("Creating user:", data.name.toUpperCase()); // Safe!
}

goodCreateUser({
  name: "Grace",
  email: "grace@example.com",
  password: "hashed",
  salt: "salt",
  role: "viewer",
});

// MISTAKE 2 — Picking or Omitting non-existent keys
// --------------------------------------------------
// TypeScript DOES catch this, but developers sometimes copy-paste field names
// that have changed. Keep your utility-type derivations close to the source type.

// type WrongPick = Pick<User, "username">; // Compile error: 'username' does not exist on User.

// MISTAKE 3 — Misusing Record when an interface is clearer
// ---------------------------------------------------------
// Record<string, any> is the typed equivalent of a plain object with no constraints.
// If your value shapes are known, prefer an interface or a specific Record.

// BAD:
const looseCatalog: Record<string, unknown> = {};

// GOOD:
const strictCatalog: Record<number, ProductSummary> = {};
console.log("Strict catalog keys:", Object.keys(strictCatalog).length);

// MISTAKE 4 — Forgetting that Readonly is shallow
// ------------------------------------------------
// Readonly<T> only makes the top-level properties readonly.
// Nested objects remain mutable.

interface DeepObject {
  readonly address: {
    street: string;
    city: string;
  };
}

const obj: DeepObject = { address: { street: "1 Main St", city: "Springfield" } };
// obj.address = { street: "2 Oak Ave", city: "Shelbyville" }; // Error — top-level is readonly
obj.address.city = "Shelbyville"; // Allowed — nested object is NOT readonly!
console.log("Mutated nested city:", obj.address.city);
// Use a custom DeepReadonly utility if you need full immutability.

// =====================================
// BEST PRACTICES
// =====================================

// 1. DERIVE, DON'T DUPLICATE
//    Always derive a type from a source of truth rather than writing a
//    parallel interface. When the source changes, all derivatives update.

// 2. NAME YOUR DERIVED TYPES
//    Give meaningful names to utility-type results (PublicUser, ProductSummary)
//    instead of inlining Omit<User, ...> everywhere. Readers understand intent.

// 3. COMPOSE UTILITIES FOR PRECISION
//    Combine utilities to express exactly the shape you need:
type CreateProductPayload = Required<Omit<Product, "id">> & Readonly<Pick<Product, "category">>;
//    All Product fields required except id, and category is locked after creation.

// 4. USE READONLY AT BOUNDARIES
//    Mark function parameters Readonly<T> when the function should not mutate
//    its input. This is a clear contract for callers.

function calculateOrderTotal(order: Readonly<Order>): number {
  // order cannot be mutated here — safe to share across threads/fibers
  return order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

console.log("Order total:", calculateOrderTotal(sampleOrder));

// 5. PREFER OMIT OVER PARTIAL FOR CREATION PAYLOADS
//    Omit<T, "id" | "createdAt"> keeps all other fields required.
//    Partial<T> makes everything optional — too permissive for creation endpoints.

// 6. USE RECORD FOR ENUM-KEYED MAPS (exhaustiveness checking)
//    Record<SomeLiteralUnion, V> forces you to handle every key.
//    If you add a new status to the union, Record-typed maps will fail to compile
//    until you add the new entry — a free exhaustiveness check.

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between Partial<T> and Required<T>?
//
// A: Partial<T> makes every property optional (adds ? to each).
//    Required<T> makes every property required (removes ? from each).
//    They are inverses of each other.
//    Common use: Partial for PATCH/update payloads; Required to validate a draft
//    before submission.

// Q2: When would you use Pick vs Omit?
//
// A: Use Pick when you know exactly which few fields you WANT to keep — it is
//    concise when selecting a small subset (e.g., Pick<Product, "id"|"name"|"price">).
//    Use Omit when it is easier to say what you want to REMOVE — especially for
//    security (Omit<User, "password"|"salt">) or removing auto-generated fields
//    (Omit<Entity, "id"|"createdAt">). Choose whichever makes the intent clearest.

// Q3: How does Exclude<T, U> differ from Omit<T, U>?
//
// A: Exclude operates on UNION types — it removes type members from a union.
//    Omit operates on OBJECT types — it removes properties (keys) from an interface/type.
//    Exclude<"a"|"b"|"c", "b"> → "a"|"c"
//    Omit<{ a: 1; b: 2; c: 3 }, "b"> → { a: 1; c: 3 }

// Q4: How would you create a DeepPartial<T> and why might you need it?
//
// A: Built-in Partial<T> only makes top-level properties optional. For deeply nested
//    configuration objects (themes, feature flags, settings) you often want to merge
//    partial overrides at any depth. DeepPartial recursively applies Partial to every
//    nested object type:
//
//    type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
//
//    This lets you pass { theme: { primaryColor: "#fff" } } without specifying every
//    nested theme property.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1
// ------
// You have this interface:
//
// interface BlogPost {
//   id: number;
//   title: string;
//   body: string;
//   authorId: number;
//   tags: string[];
//   publishedAt: Date | null;
//   viewCount: number;
//   slug: string;
// }
//
// Using only TypeScript utility types (no new interfaces):
// a) Create a type for the POST /posts creation payload (no id, no viewCount).
// b) Create a type for the PATCH /posts/:id update payload (everything optional).
// c) Create a type for the public listing card (only id, title, tags, publishedAt).
// d) Create a type for an admin view that also includes viewCount.
//
// HINT: Combine Omit, Partial, Pick, and union types.

// TASK 2
// ------
// Build a typed in-memory cache using Record and ReturnType.
//
// Requirements:
// a) Write an async function fetchProductDetails(id: number): Promise<Product>.
// b) Use ReturnType + Awaited to derive the cached value type automatically.
// c) Implement a getOrFetch function that checks the cache first and falls back
//    to fetching — the return type must be inferred, not written by hand.
// d) Verify the cache works by calling getOrFetch twice for the same id and
//    confirming the second call does not trigger a fetch (log a "cache hit").

// TASK 3
// ------
// Model a permission system using Extract, Exclude, and Record.
//
// Requirements:
// a) Define a union type Action = "read" | "write" | "delete" | "publish" | "archive".
// b) Use Exclude to create a ReadOnlyAction type (removes write, delete, publish, archive).
// c) Use Extract to create a DestructiveAction type (write, delete only).
// d) Use Record<UserRole, Action[]> to define a permissions map where each role
//    gets an array of allowed actions.
// e) Write a function canPerform(role: UserRole, action: Action): boolean that
//    looks up the map and returns whether the role is permitted.
// f) Test it: admin should be able to "delete"; viewer should not.
