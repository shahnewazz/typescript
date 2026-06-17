// =====================================
// API INTEGRATION PATTERNS IN TYPESCRIPT
// =====================================
// Target: JavaScript developers who know basic TypeScript
// All examples use simulated async functions (no real HTTP calls)

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// --- JavaScript (no types, risky) ---
// async function getUser(id) {
//   const res = await fetch(`/api/users/${id}`);
//   const data = await res.json(); // data is `any` — no idea what's inside
//   return data.user.name; // could crash at runtime if shape changes
// }

// --- TypeScript (typed, safe) ---
// async function getUser(id: number): Promise<User> {
//   const res = await fetch(`/api/users/${id}`);
//   const data: ApiResponse<User> = await res.json();
//   return data.data; // TypeScript knows the shape — autocomplete + safety
// }

// =====================================
// TYPING API RESPONSES
// =====================================

// --- Generic ApiResponse wrapper ---
// Wraps every response from the server in a consistent shape
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
}

// --- Paginated response wrapper ---
interface PaginatedResponse<T> {
  data: T[];
  success: boolean;
  message: string;
  statusCode: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// --- Error response type ---
interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: { field: string; message: string }[];
  timestamp: string;
}

// --- Discriminated union for API states ---
// This forces you to check `status` before accessing data or error
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };

// --- Helper to simulate server response ---
function mockResponse<T>(data: T, message = "Success"): ApiResponse<T> {
  return {
    data,
    success: true,
    message,
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}

function mockPaginatedResponse<T>(
  data: T[],
  page: number,
  total: number
): PaginatedResponse<T> {
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    success: true,
    message: "Fetched successfully",
    statusCode: 200,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

function mockError(
  message: string,
  statusCode = 400,
  errors?: { field: string; message: string }[]
): ApiError {
  return {
    success: false,
    message,
    statusCode,
    errors,
    timestamp: new Date().toISOString(),
  };
}

// =====================================
// DOMAIN TYPES / MODELS
// =====================================

// --- User ---
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer" | "vendor";
  createdAt: string;
  updatedAt: string;
}

type CreateUserPayload = Pick<User, "name" | "email"> & { password: string; role?: User["role"] };
type UpdateUserPayload = Partial<Pick<User, "name" | "email" | "role">>;

// --- Product ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
}

type CreateProductPayload = Omit<Product, "id" | "createdAt">;

// --- Order ---
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

type CreateOrderPayload = {
  items: { productId: number; quantity: number }[];
  shippingAddress: string;
};

// --- Cart ---
interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  updatedAt: string;
}

// --- Payment ---
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
type PaymentMethod = "card" | "paypal" | "bank_transfer";

interface Payment {
  id: string;
  orderId: number;
  userId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

interface InitiatePaymentPayload {
  orderId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
}

interface ConfirmPaymentPayload {
  paymentId: string;
  transactionId: string;
}

// --- Auth ---
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
}

// --- Inventory ---
interface InventoryItem {
  productId: number;
  productName: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  updatedAt: string;
}

// =====================================
// HTTP CLIENT PATTERNS
// =====================================

// --- Request config type ---
interface RequestConfig {
  baseURL: string;
  headers: Record<string, string>;
  timeout?: number;
}

// --- Query params type ---
type QueryParams = Record<string, string | number | boolean | undefined>;

// --- Typed fetch wrapper ---
// Centralizes all fetch logic: base URL, headers, error handling
class HttpClient {
  private config: RequestConfig;
  private accessToken: string | null = null;

  constructor(config: RequestConfig) {
    this.config = config;
  }

  // Simulates setting auth token (e.g. after login)
  setAuthToken(token: string): void {
    this.accessToken = token;
    this.config.headers["Authorization"] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    this.accessToken = null;
    delete this.config.headers["Authorization"];
  }

  // Build query string from typed params
  private buildQueryString(params?: QueryParams): string {
    if (!params) return "";
    const filtered = Object.entries(params).filter(([, v]) => v !== undefined);
    if (filtered.length === 0) return "";
    return "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
  }

  // Simulate GET
  async get<T>(path: string, params?: QueryParams): Promise<T> {
    const url = `${this.config.baseURL}${path}${this.buildQueryString(params)}`;
    console.log(`[GET] ${url} | headers: ${JSON.stringify(this.config.headers)}`);
    // In real code: return fetch(url, { headers: this.config.headers }).then(r => r.json());
    throw new Error("Simulated: override in API classes");
  }

  // Simulate POST
  async post<T, B = unknown>(path: string, body: B): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    console.log(`[POST] ${url} | body: ${JSON.stringify(body)}`);
    throw new Error("Simulated: override in API classes");
  }

  // Simulate PUT
  async put<T, B = unknown>(path: string, body: B): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    console.log(`[PUT] ${url} | body: ${JSON.stringify(body)}`);
    throw new Error("Simulated: override in API classes");
  }

  // Simulate PATCH
  async patch<T, B = unknown>(path: string, body: B): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    console.log(`[PATCH] ${url} | body: ${JSON.stringify(body)}`);
    throw new Error("Simulated: override in API classes");
  }

  // Simulate DELETE
  async delete<T>(path: string): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    console.log(`[DELETE] ${url}`);
    throw new Error("Simulated: override in API classes");
  }
}

// --- Interceptor pattern (typed) ---
// In production you'd use these to attach tokens, log requests, handle 401 refresh
type RequestInterceptor = (config: RequestConfig) => RequestConfig;
type ResponseInterceptor<T> = (response: ApiResponse<T>) => ApiResponse<T>;

interface InterceptorChain {
  requestInterceptors: RequestInterceptor[];
  responseInterceptors: ResponseInterceptor<unknown>[];
  addRequestInterceptor(fn: RequestInterceptor): void;
  addResponseInterceptor(fn: ResponseInterceptor<unknown>): void;
}

class InterceptorManager implements InterceptorChain {
  requestInterceptors: RequestInterceptor[] = [];
  responseInterceptors: ResponseInterceptor<unknown>[] = [];

  addRequestInterceptor(fn: RequestInterceptor): void {
    this.requestInterceptors.push(fn);
  }

  addResponseInterceptor(fn: ResponseInterceptor<unknown>): void {
    this.responseInterceptors.push(fn);
  }

  applyRequestInterceptors(config: RequestConfig): RequestConfig {
    return this.requestInterceptors.reduce((cfg, fn) => fn(cfg), config);
  }
}

// =====================================
// USER API
// =====================================

const userClientConfig: RequestConfig = {
  baseURL: "https://api.example.com",
  headers: { "Content-Type": "application/json" },
};

// Query params type for listing users
interface UserQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  role?: User["role"];
  search?: string;
}

async function getUser(id: number): Promise<ApiResponse<User>> {
  console.log(`\n[UserAPI] getUser(${id})`);
  const user: User = {
    id,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "customer",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T08:30:00Z",
  };
  return Promise.resolve(mockResponse(user, "User fetched"));
}

async function createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
  console.log(`\n[UserAPI] createUser(${JSON.stringify(payload)})`);
  const newUser: User = {
    id: 101,
    name: payload.name,
    email: payload.email,
    role: payload.role ?? "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(newUser, "User created"));
}

async function updateUser(id: number, payload: UpdateUserPayload): Promise<ApiResponse<User>> {
  console.log(`\n[UserAPI] updateUser(${id}, ${JSON.stringify(payload)})`);
  const updated: User = {
    id,
    name: payload.name ?? "Alice Johnson",
    email: payload.email ?? "alice@example.com",
    role: payload.role ?? "customer",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(updated, "User updated"));
}

async function deleteUser(id: number): Promise<ApiResponse<{ deleted: boolean }>> {
  console.log(`\n[UserAPI] deleteUser(${id})`);
  return Promise.resolve(mockResponse({ deleted: true }, "User deleted"));
}

// =====================================
// PRODUCT API
// =====================================

interface ProductQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

async function getProducts(
  params?: ProductQueryParams
): Promise<PaginatedResponse<Product>> {
  console.log(`\n[ProductAPI] getProducts(${JSON.stringify(params)})`);
  const products: Product[] = [
    {
      id: 1,
      name: "TypeScript Handbook",
      description: "Complete guide to TypeScript",
      price: 29.99,
      category: "Books",
      stock: 150,
      imageUrl: "https://cdn.example.com/ts-book.jpg",
      createdAt: "2024-03-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      description: "Clicky RGB keyboard for developers",
      price: 120.0,
      category: "Electronics",
      stock: 30,
      imageUrl: "https://cdn.example.com/keyboard.jpg",
      createdAt: "2024-04-10T00:00:00Z",
    },
  ];
  return Promise.resolve(mockPaginatedResponse(products, params?.page ?? 1, 42));
}

async function getProductById(id: number): Promise<ApiResponse<Product>> {
  console.log(`\n[ProductAPI] getProductById(${id})`);
  const product: Product = {
    id,
    name: "TypeScript Handbook",
    description: "Complete guide to TypeScript",
    price: 29.99,
    category: "Books",
    stock: 150,
    imageUrl: "https://cdn.example.com/ts-book.jpg",
    createdAt: "2024-03-01T00:00:00Z",
  };
  return Promise.resolve(mockResponse(product, "Product fetched"));
}

async function createProduct(payload: CreateProductPayload): Promise<ApiResponse<Product>> {
  console.log(`\n[ProductAPI] createProduct(${JSON.stringify(payload)})`);
  const newProduct: Product = { id: 201, ...payload, createdAt: new Date().toISOString() };
  return Promise.resolve(mockResponse(newProduct, "Product created"));
}

// =====================================
// ORDER API
// =====================================

interface OrderQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: number;
}

async function getOrders(
  params?: OrderQueryParams
): Promise<PaginatedResponse<Order>> {
  console.log(`\n[OrderAPI] getOrders(${JSON.stringify(params)})`);
  const orders: Order[] = [
    {
      id: 1001,
      userId: 1,
      items: [
        {
          productId: 1,
          productName: "TypeScript Handbook",
          quantity: 2,
          unitPrice: 29.99,
          subtotal: 59.98,
        },
      ],
      totalAmount: 59.98,
      status: "confirmed",
      shippingAddress: "123 Main St, Dhaka",
      createdAt: "2024-06-10T09:00:00Z",
      updatedAt: "2024-06-10T10:00:00Z",
    },
  ];
  return Promise.resolve(mockPaginatedResponse(orders, 1, 5));
}

async function createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
  console.log(`\n[OrderAPI] createOrder(${JSON.stringify(payload)})`);
  const newOrder: Order = {
    id: 1002,
    userId: 1,
    items: payload.items.map((item, i) => ({
      productId: item.productId,
      productName: `Product #${item.productId}`,
      quantity: item.quantity,
      unitPrice: 29.99,
      subtotal: item.quantity * 29.99,
    })),
    totalAmount: payload.items.reduce((sum, item) => sum + item.quantity * 29.99, 0),
    status: "pending",
    shippingAddress: payload.shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(newOrder, "Order created"));
}

async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
): Promise<ApiResponse<Order>> {
  console.log(`\n[OrderAPI] updateOrderStatus(${orderId}, ${status})`);
  const updated: Order = {
    id: orderId,
    userId: 1,
    items: [],
    totalAmount: 59.98,
    status,
    shippingAddress: "123 Main St, Dhaka",
    createdAt: "2024-06-10T09:00:00Z",
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(updated, `Order status updated to ${status}`));
}

// =====================================
// CART API
// =====================================

async function getCart(userId: number): Promise<ApiResponse<Cart>> {
  console.log(`\n[CartAPI] getCart(userId=${userId})`);
  const cart: Cart = {
    id: 1,
    userId,
    items: [
      {
        id: 10,
        productId: 2,
        productName: "Mechanical Keyboard",
        quantity: 1,
        unitPrice: 120.0,
        subtotal: 120.0,
      },
    ],
    totalAmount: 120.0,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(cart, "Cart fetched"));
}

async function addToCart(
  userId: number,
  productId: number,
  quantity: number
): Promise<ApiResponse<Cart>> {
  console.log(`\n[CartAPI] addToCart(userId=${userId}, productId=${productId}, qty=${quantity})`);
  const updatedCart: Cart = {
    id: 1,
    userId,
    items: [
      {
        id: 11,
        productId,
        productName: `Product #${productId}`,
        quantity,
        unitPrice: 29.99,
        subtotal: quantity * 29.99,
      },
    ],
    totalAmount: quantity * 29.99,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(updatedCart, "Item added to cart"));
}

async function removeFromCart(userId: number, cartItemId: number): Promise<ApiResponse<Cart>> {
  console.log(`\n[CartAPI] removeFromCart(userId=${userId}, cartItemId=${cartItemId})`);
  const emptyCart: Cart = {
    id: 1,
    userId,
    items: [],
    totalAmount: 0,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(emptyCart, "Item removed from cart"));
}

async function clearCart(userId: number): Promise<ApiResponse<{ cleared: boolean }>> {
  console.log(`\n[CartAPI] clearCart(userId=${userId})`);
  return Promise.resolve(mockResponse({ cleared: true }, "Cart cleared"));
}

// =====================================
// PAYMENT API
// =====================================

async function initiatePayment(
  payload: InitiatePaymentPayload
): Promise<ApiResponse<Payment>> {
  console.log(`\n[PaymentAPI] initiatePayment(${JSON.stringify(payload)})`);
  const payment: Payment = {
    id: "pay_abc123",
    orderId: payload.orderId,
    userId: 1,
    amount: payload.amount,
    currency: payload.currency,
    method: payload.method,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(payment, "Payment initiated"));
}

async function confirmPayment(
  payload: ConfirmPaymentPayload
): Promise<ApiResponse<Payment>> {
  console.log(`\n[PaymentAPI] confirmPayment(${JSON.stringify(payload)})`);
  const confirmedPayment: Payment = {
    id: payload.paymentId,
    orderId: 1002,
    userId: 1,
    amount: 59.98,
    currency: "USD",
    method: "card",
    status: "completed",
    transactionId: payload.transactionId,
    createdAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(confirmedPayment, "Payment confirmed"));
}

async function refundPayment(
  paymentId: string,
  reason: string
): Promise<ApiResponse<Payment>> {
  console.log(`\n[PaymentAPI] refundPayment(${paymentId}, reason="${reason}")`);
  const refunded: Payment = {
    id: paymentId,
    orderId: 1002,
    userId: 1,
    amount: 59.98,
    currency: "USD",
    method: "card",
    status: "refunded",
    transactionId: "txn_refund_xyz",
    createdAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(refunded, "Payment refunded"));
}

// =====================================
// AUTH API
// =====================================

async function login(payload: LoginPayload): Promise<ApiResponse<AuthTokens>> {
  console.log(`\n[AuthAPI] login(email=${payload.email})`);
  const tokens: AuthTokens = {
    accessToken: "eyJhbGciOiJIUzI1NiJ9.accessToken.signature",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.refreshToken.signature",
    expiresIn: 3600,
  };
  return Promise.resolve(mockResponse(tokens, "Login successful"));
}

async function register(payload: RegisterPayload): Promise<ApiResponse<User>> {
  console.log(`\n[AuthAPI] register(email=${payload.email})`);
  const user: User = {
    id: 202,
    name: payload.name,
    email: payload.email,
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(user, "Registration successful"));
}

async function logout(): Promise<ApiResponse<{ loggedOut: boolean }>> {
  console.log(`\n[AuthAPI] logout()`);
  return Promise.resolve(mockResponse({ loggedOut: true }, "Logged out successfully"));
}

async function refreshToken(
  token: string
): Promise<ApiResponse<AuthTokens>> {
  console.log(`\n[AuthAPI] refreshToken(token=...${token.slice(-6)})`);
  const newTokens: AuthTokens = {
    accessToken: "eyJhbGciOiJIUzI1NiJ9.newAccessToken.signature",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.newRefreshToken.signature",
    expiresIn: 3600,
  };
  return Promise.resolve(mockResponse(newTokens, "Token refreshed"));
}

// =====================================
// INVENTORY API
// =====================================

async function getInventory(
  productIds?: number[]
): Promise<ApiResponse<InventoryItem[]>> {
  console.log(`\n[InventoryAPI] getInventory(productIds=${JSON.stringify(productIds)})`);
  const inventory: InventoryItem[] = [
    {
      productId: 1,
      productName: "TypeScript Handbook",
      currentStock: 150,
      reservedStock: 10,
      availableStock: 140,
      updatedAt: new Date().toISOString(),
    },
    {
      productId: 2,
      productName: "Mechanical Keyboard",
      currentStock: 30,
      reservedStock: 5,
      availableStock: 25,
      updatedAt: new Date().toISOString(),
    },
  ];
  const filtered = productIds ? inventory.filter((i) => productIds.includes(i.productId)) : inventory;
  return Promise.resolve(mockResponse(filtered, "Inventory fetched"));
}

async function updateStock(
  productId: number,
  quantity: number
): Promise<ApiResponse<InventoryItem>> {
  console.log(`\n[InventoryAPI] updateStock(productId=${productId}, quantity=${quantity})`);
  const updated: InventoryItem = {
    productId,
    productName: `Product #${productId}`,
    currentStock: quantity,
    reservedStock: 0,
    availableStock: quantity,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockResponse(updated, "Stock updated"));
}

// =====================================
// STATE MANAGEMENT PATTERNS
// =====================================

// --- Generic state hook pattern (framework-agnostic) ---
// In React this would be useState, but the pattern is the same
class ApiStateManager<T> {
  private state: ApiState<T> = { status: "idle" };
  private listeners: ((state: ApiState<T>) => void)[] = [];

  subscribe(listener: (state: ApiState<T>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: ApiState<T>): void {
    this.state = next;
    this.listeners.forEach((l) => l(next));
  }

  getState(): ApiState<T> {
    return this.state;
  }

  async execute(fn: () => Promise<ApiResponse<T>>): Promise<void> {
    this.setState({ status: "loading" });
    try {
      const response = await fn();
      if (response.success) {
        this.setState({ status: "success", data: response.data });
      } else {
        this.setState({
          status: "error",
          error: mockError(response.message, response.statusCode),
        });
      }
    } catch (err) {
      this.setState({
        status: "error",
        error: mockError(err instanceof Error ? err.message : "Unknown error", 500),
      });
    }
  }
}

// --- Optimistic update pattern ---
// Update local state immediately, revert on failure
class OptimisticCartManager {
  private cart: Cart = {
    id: 1,
    userId: 1,
    items: [],
    totalAmount: 0,
    updatedAt: new Date().toISOString(),
  };

  getCart(): Cart {
    return { ...this.cart };
  }

  async optimisticAdd(productId: number, quantity: number): Promise<void> {
    // Snapshot for rollback
    const snapshot = { ...this.cart, items: [...this.cart.items] };

    // Optimistically add to local cart
    const optimisticItem: CartItem = {
      id: Date.now(),
      productId,
      productName: `Product #${productId}`,
      quantity,
      unitPrice: 29.99,
      subtotal: quantity * 29.99,
    };
    this.cart.items.push(optimisticItem);
    this.cart.totalAmount += optimisticItem.subtotal;
    console.log(
      `[Optimistic] Cart updated locally. Total: $${this.cart.totalAmount.toFixed(2)}`
    );

    try {
      // Sync with server
      const response = await addToCart(1, productId, quantity);
      this.cart = response.data; // Replace with real server state
      console.log(
        `[Optimistic] Server confirmed. Total: $${this.cart.totalAmount.toFixed(2)}`
      );
    } catch (err) {
      // Revert on failure
      this.cart = snapshot;
      console.log(
        `[Optimistic] Server failed, reverted. Total: $${this.cart.totalAmount.toFixed(2)}`
      );
    }
  }
}

// --- Cache pattern for API responses ---
interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  ttl: number; // milliseconds
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl = 60_000): void {
    this.cache.set(key, { data, fetchedAt: Date.now(), ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > entry.ttl) {
      this.cache.delete(key);
      console.log(`[Cache] MISS (expired): ${key}`);
      return null;
    }
    console.log(`[Cache] HIT: ${key}`);
    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`[Cache] Invalidated: ${key}`);
  }

  invalidatePattern(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        console.log(`[Cache] Invalidated by pattern: ${key}`);
      }
    }
  }
}

// Cache-aware product fetcher
const globalCache = new ApiCache();

async function getCachedProduct(id: number): Promise<Product> {
  const cacheKey = `product:${id}`;
  const cached = globalCache.get<Product>(cacheKey);
  if (cached) return cached;

  console.log(`[Cache] MISS: ${cacheKey} — fetching from API`);
  const response = await getProductById(id);
  globalCache.set(cacheKey, response.data, 30_000); // 30s TTL
  return response.data;
}

// =====================================
// COMMON MISTAKES & BEST PRACTICES
// =====================================

// MISTAKE 1: Trusting API data blindly — no validation
// BAD:
// async function badGetUser(id: number): Promise<User> {
//   const res = await fetch(`/api/users/${id}`);
//   return res.json() as User; // TypeScript says it's User but it could be ANYTHING at runtime
// }

// GOOD: Validate critical fields at runtime
function isUser(data: unknown): data is User {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === "number" &&
    typeof d.name === "string" &&
    typeof d.email === "string"
  );
}

async function safeGetUser(id: number): Promise<User | null> {
  const response = await getUser(id);
  if (!isUser(response.data)) {
    console.error(`[SafeGetUser] Unexpected shape for user ${id}`);
    return null;
  }
  return response.data;
}

// MISTAKE 2: Not handling errors — crashing silently
// BAD:
// const user = await getUser(999); // If this throws, the whole app crashes

// GOOD: Always wrap in try/catch or handle the error state
async function safeDeleteUser(id: number): Promise<boolean> {
  try {
    const response = await deleteUser(id);
    return response.data.deleted;
  } catch (err) {
    console.error(`[safeDeleteUser] Failed to delete user ${id}:`, err);
    return false;
  }
}

// MISTAKE 3: Using `any` for request/response types
// BAD:
// async function badPost(url: string, body: any): Promise<any> { ... }

// GOOD: Use generics
async function typedPost<TRequest, TResponse>(
  endpoint: string,
  body: TRequest
): Promise<ApiResponse<TResponse>> {
  console.log(`[typedPost] ${endpoint}`, body);
  // real implementation would call fetch here
  return mockResponse({} as TResponse, "OK");
}

// BEST PRACTICE: Always use generics for wrappers
// This keeps all API calls consistent and type-safe

// =====================================
// AUTHENTICATION HEADERS PATTERN
// =====================================

// In a real app you'd store this after login
let currentAccessToken: string | null = null;

function getAuthHeaders(): Record<string, string> {
  if (!currentAccessToken) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${currentAccessToken}`,
  };
}

// Simulate token refresh on 401
async function withAutoRefresh<T>(
  fn: () => Promise<ApiResponse<T>>,
  refreshTokenValue: string
): Promise<ApiResponse<T>> {
  try {
    return await fn();
  } catch (err: unknown) {
    // Type-narrowing the error
    if (
      typeof err === "object" &&
      err !== null &&
      "statusCode" in err &&
      (err as { statusCode: number }).statusCode === 401
    ) {
      console.log("[withAutoRefresh] 401 detected — refreshing token...");
      const refreshed = await refreshToken(refreshTokenValue);
      currentAccessToken = refreshed.data.accessToken;
      return await fn(); // Retry with new token
    }
    throw err;
  }
}

// =====================================
// RUNNING THE EXAMPLES
// =====================================

async function runAllExamples(): Promise<void> {
  console.log("\n======================================================");
  console.log("   API INTEGRATION PATTERNS IN TYPESCRIPT — DEMO");
  console.log("======================================================");

  // --- Auth flow ---
  console.log("\n--- AUTH FLOW ---");
  const loginResult = await login({ email: "alice@example.com", password: "secret123" });
  console.log("Login result:", loginResult.data);
  currentAccessToken = loginResult.data.accessToken;

  const registerResult = await register({
    name: "Bob Smith",
    email: "bob@example.com",
    password: "pass456",
  });
  console.log("Registered user:", registerResult.data.name, registerResult.data.email);

  const refreshResult = await refreshToken(loginResult.data.refreshToken);
  console.log("New access token (last 20 chars):", refreshResult.data.accessToken.slice(-20));

  const logoutResult = await logout();
  console.log("Logged out:", logoutResult.data.loggedOut);

  // --- User CRUD ---
  console.log("\n--- USER API ---");
  const user = await getUser(1);
  console.log("Fetched user:", user.data.name, "| role:", user.data.role);

  const created = await createUser({ name: "Carol White", email: "carol@example.com", password: "pw" });
  console.log("Created user id:", created.data.id, "name:", created.data.name);

  const updated = await updateUser(1, { role: "admin" });
  console.log("Updated role:", updated.data.role);

  const deleted = await deleteUser(99);
  console.log("Deleted:", deleted.data.deleted);

  const safeUser = await safeGetUser(1);
  console.log("Safe-fetched user:", safeUser?.name);

  const safeDeleted = await safeDeleteUser(88);
  console.log("Safe-deleted:", safeDeleted);

  // --- Product API ---
  console.log("\n--- PRODUCT API ---");
  const productsPage = await getProducts({ page: 1, category: "Books", sortBy: "price" });
  console.log(
    `Products page ${productsPage.pagination.page}/${productsPage.pagination.totalPages}`,
    "| count:", productsPage.data.length,
    "| hasNext:", productsPage.pagination.hasNext
  );

  const product = await getProductById(1);
  console.log("Product:", product.data.name, "| $" + product.data.price);

  const newProduct = await createProduct({
    name: "VS Code Extension Pack",
    description: "Must-have extensions",
    price: 0,
    category: "Software",
    stock: 9999,
    imageUrl: "https://cdn.example.com/vscode.png",
  });
  console.log("Created product:", newProduct.data.name, "id:", newProduct.data.id);

  // --- Cart flow ---
  console.log("\n--- CART API ---");
  const cart = await getCart(1);
  console.log("Cart total: $" + cart.data.totalAmount, "| items:", cart.data.items.length);

  const addedCart = await addToCart(1, 1, 2);
  console.log("After add — total: $" + addedCart.data.totalAmount);

  const removedCart = await removeFromCart(1, 10);
  console.log("After remove — items:", removedCart.data.items.length);

  const cleared = await clearCart(1);
  console.log("Cart cleared:", cleared.data.cleared);

  // --- Order flow ---
  console.log("\n--- ORDER API ---");
  const ordersPage = await getOrders({ page: 1, status: "confirmed" });
  console.log("Orders fetched:", ordersPage.data.length, "| total:", ordersPage.pagination.total);

  const newOrder = await createOrder({
    items: [{ productId: 1, quantity: 3 }],
    shippingAddress: "456 Dev Lane, Dhaka",
  });
  console.log("New order id:", newOrder.data.id, "| total: $" + newOrder.data.totalAmount.toFixed(2));

  const shipped = await updateOrderStatus(newOrder.data.id, "shipped");
  console.log("Order status:", shipped.data.status);

  // --- Payment flow ---
  console.log("\n--- PAYMENT API ---");
  const payment = await initiatePayment({
    orderId: newOrder.data.id,
    amount: newOrder.data.totalAmount,
    currency: "USD",
    method: "card",
  });
  console.log("Payment initiated:", payment.data.id, "| status:", payment.data.status);

  const confirmed = await confirmPayment({
    paymentId: payment.data.id,
    transactionId: "txn_stripe_888xyz",
  });
  console.log("Payment confirmed:", confirmed.data.status, "| txn:", confirmed.data.transactionId);

  const refunded = await refundPayment(confirmed.data.id, "Customer changed mind");
  console.log("Refunded:", refunded.data.status);

  // --- Inventory API ---
  console.log("\n--- INVENTORY API ---");
  const inventory = await getInventory([1, 2]);
  inventory.data.forEach((item) =>
    console.log(`  ${item.productName}: available=${item.availableStock}`)
  );

  const stockUpdated = await updateStock(1, 200);
  console.log("Stock updated for product", stockUpdated.data.productId, "->", stockUpdated.data.currentStock);

  // --- State manager demo ---
  console.log("\n--- STATE MANAGER ---");
  const userState = new ApiStateManager<User>();
  userState.subscribe((state) => {
    console.log(`[StateManager] status changed to: ${state.status}`);
    if (state.status === "success") {
      console.log(`[StateManager] data: ${state.data.name}`);
    }
  });
  await userState.execute(() => getUser(1));

  // --- Optimistic updates ---
  console.log("\n--- OPTIMISTIC UPDATE ---");
  const cartManager = new OptimisticCartManager();
  await cartManager.optimisticAdd(1, 1);
  console.log("Final cart total: $" + cartManager.getCart().totalAmount.toFixed(2));

  // --- Cache demo ---
  console.log("\n--- CACHE DEMO ---");
  const p1 = await getCachedProduct(1); // miss
  console.log("First fetch:", p1.name);
  const p2 = await getCachedProduct(1); // hit
  console.log("Cached fetch:", p2.name);
  globalCache.invalidate("product:1");
  const p3 = await getCachedProduct(1); // miss again after invalidation
  console.log("After invalidation:", p3.name);

  console.log("\n======================================================");
  console.log("   ALL EXAMPLES COMPLETE");
  console.log("======================================================");
}

// =====================================
// INTERVIEW QUESTIONS & ANSWERS
// =====================================

// Q1: What is the benefit of using ApiResponse<T> instead of defining each
//     response type separately?
// A: It enforces a consistent envelope (success, message, statusCode, timestamp)
//    across all endpoints. Generic T lets TypeScript infer the exact data shape
//    at each call site without duplicating the wrapper fields.

// Q2: What is a discriminated union and why is it useful for API state?
// A: A discriminated union uses a literal-type field (e.g. `status`) as a
//    discriminant. TypeScript narrows the type inside each branch so you cannot
//    accidentally access `data` in the "error" state or `error` in the "success"
//    state — compile-time safety for runtime state machines.

// Q3: What is optimistic updating and when would you use it?
// A: You apply the expected state change locally before the server confirms it,
//    giving instant UI feedback. If the server call fails you roll back to the
//    snapshot. Use it for low-latency interactions like toggling a like button or
//    adding to cart where eventual consistency is acceptable.

// Q4: How do you prevent stale cache data from causing bugs in a TypeScript
//     API client?
// A: Store a `fetchedAt` timestamp and a `ttl` with each cache entry. On every
//    read, compare `Date.now() - fetchedAt` against `ttl`; if expired, evict the
//    entry and re-fetch. Also invalidate by key or prefix after mutations (POST,
//    PUT, DELETE) so reads always reflect the latest state.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — Type-safe search endpoint
// Define a `SearchParams` type with fields: query (string), page (number),
// limit (number), filters (Record<string, string>). Write a `searchProducts`
// function that accepts SearchParams and returns Promise<PaginatedResponse<Product>>.
// Simulate 3 results. Log pagination info.

// TASK 2 — Retry wrapper
// Write a generic `withRetry<T>` function:
//   withRetry(fn: () => Promise<T>, retries: number, delayMs: number): Promise<T>
// It should call `fn`, and if it throws, wait `delayMs` ms then retry up to
// `retries` times before re-throwing. Test it by wrapping a function that fails
// twice then succeeds.

// TASK 3 — Full checkout flow
// Wire together the APIs to simulate a checkout:
//   1. login()
//   2. getCart(userId)
//   3. createOrder() from cart items
//   4. initiatePayment() for the order total
//   5. confirmPayment() with a fake transactionId
//   6. updateOrderStatus(orderId, "confirmed")
//   7. clearCart(userId)
// Log each step with the key values. Handle any error with a try/catch and
// log a meaningful message.

// Run the demo
runAllExamples().catch(console.error);
