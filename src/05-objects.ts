// =====================================
// 05-OBJECTS IN TYPESCRIPT
// =====================================
// Topic: Objects in TypeScript
// Audience: JavaScript developers learning TypeScript from scratch
//
// Objects are the backbone of most real-world applications.
// TypeScript gives you the ability to precisely describe the shape
// of every object your code works with, catching errors before runtime.

// =====================================
// JAVASCRIPT vs TYPESCRIPT COMPARISON
// =====================================

// --- JavaScript (no type safety) ---
// const user = { name: "Alice", age: 30 };
// user.nmae = "Bob"; // Typo! No error in JS, silently creates new property
// user.age = "thirty"; // Wrong type! JS allows this

// --- TypeScript (type-safe objects) ---
// const user: { name: string; age: number } = { name: "Alice", age: 30 };
// user.nmae = "Bob"; // ERROR: Property 'nmae' does not exist
// user.age = "thirty"; // ERROR: Type 'string' is not assignable to type 'number'

// TypeScript lets you define the exact "shape" of an object.
// If your code violates that shape, TypeScript reports an error immediately.

console.log("=== JavaScript vs TypeScript: Objects ===");

const jsStyleUser = { name: "Alice", age: 30 };
console.log("JS-style user (no type guard):", jsStyleUser);

const tsStyleUser: { name: string; age: number } = { name: "Alice", age: 30 };
console.log("TS-style user (type-annotated):", tsStyleUser);

// =====================================
// BASIC OBJECT TYPES
// =====================================
// What: Inline type annotations describe the shape of an object directly
//       at the point of use, using { property: Type } syntax.
// Why:  TypeScript uses structural typing — it checks that an object has
//       the required properties with the correct types, not that it was
//       created from a specific class.
// Syntax: const obj: { key1: Type1; key2: Type2 } = { key1: val1, key2: val2 };
//         Note: semicolons separate properties in type annotations (not commas).

console.log("\n=== BASIC OBJECT TYPES ===");

// Simple example
const point: { x: number; y: number } = { x: 10, y: 20 };
console.log("Point:", point);

// Practical example
const product: { id: number; name: string; price: number; inStock: boolean } = {
  id: 101,
  name: "Wireless Headphones",
  price: 79.99,
  inStock: true,
};
console.log("Product:", product);

// Real-world example: User Profile
const userProfile: {
  id: number;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
} = {
  id: 1,
  username: "alice_dev",
  email: "alice@example.com",
  age: 28,
  isActive: true,
};
console.log("User Profile:", userProfile);

// Real-world example: Authentication Token
const authToken: {
  token: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: number;
} = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  tokenType: "Bearer",
  expiresIn: 3600,
  issuedAt: Date.now(),
};
console.log("Auth Token:", authToken);

// Real-world example: Inventory Item
const inventoryItem: {
  sku: string;
  productName: string;
  quantity: number;
  warehouseLocation: string;
  unitCost: number;
} = {
  sku: "WH-BLK-001",
  productName: "Wireless Headphones Black",
  quantity: 250,
  warehouseLocation: "Aisle-B-Shelf-3",
  unitCost: 45.0,
};
console.log("Inventory Item:", inventoryItem);

// =====================================
// OPTIONAL PROPERTIES
// =====================================
// What: Properties marked with ? are optional — they may or may not exist on the object.
// Why:  Real data is rarely complete. A user might not have a phone number.
//       A product might not have a discount. Optional properties model this reality.
// Syntax: { requiredProp: Type; optionalProp?: Type }

console.log("\n=== OPTIONAL PROPERTIES ===");

// Simple example
const config: { host: string; port: number; debug?: boolean } = {
  host: "localhost",
  port: 3000,
  // debug is omitted — that is perfectly valid
};
console.log("Config:", config);

const configWithDebug: { host: string; port: number; debug?: boolean } = {
  host: "production.example.com",
  port: 443,
  debug: false,
};
console.log("Config with debug:", configWithDebug);

// Practical example: accessing optional properties safely
const userWithOptional: { name: string; email?: string; phone?: string } = {
  name: "Bob",
  email: "bob@example.com",
  // phone is not provided
};

// TypeScript forces you to handle the possibility of undefined
const contactInfo = userWithOptional.email ?? "No email provided";
const phoneInfo = userWithOptional.phone ?? "No phone provided";
console.log("Contact:", contactInfo, "|", phoneInfo);

// Real-world example: User Profile with optional fields
const fullUserProfile: {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  twitterHandle?: string;
} = {
  id: 2,
  username: "bob_coder",
  email: "bob@example.com",
  bio: "Full-stack developer who loves TypeScript",
  // avatarUrl, website, twitterHandle not provided — all optional
};
console.log("Full User Profile:", fullUserProfile);

// Real-world example: Product Catalog with optional fields
const catalogProduct: {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  discountPercent?: number;
  tags?: string[];
} = {
  id: 202,
  name: "Mechanical Keyboard",
  price: 149.99,
  description: "Tactile switches, RGB backlit",
  discountPercent: 10,
  // imageUrl and tags are omitted — optional
};
console.log("Catalog Product:", catalogProduct);

// Real-world example: Payment Object
const paymentDetails: {
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  cardLast4?: string;
  transactionId?: string;
  failureReason?: string;
} = {
  orderId: "ORD-2024-001",
  amount: 259.98,
  currency: "USD",
  method: "credit_card",
  cardLast4: "4242",
  transactionId: "txn_abc123",
  // failureReason is omitted — payment succeeded
};
console.log("Payment Details:", paymentDetails);

// =====================================
// READONLY PROPERTIES
// =====================================
// What: The readonly modifier prevents a property from being reassigned
//       after the object is created.
// Why:  Some values should never change after they are set — like a user's ID,
//       a transaction ID, or a creation timestamp. readonly enforces immutability
//       at the type level, making your intent explicit and preventing accidental mutations.
// Syntax: { readonly prop: Type }

console.log("\n=== READONLY PROPERTIES ===");

// Simple example
const origin: { readonly x: number; readonly y: number } = { x: 0, y: 0 };
console.log("Origin:", origin);
// origin.x = 5; // ERROR: Cannot assign to 'x' because it is a read-only property

// Practical example: database record (id should never change)
const dbRecord: { readonly id: number; readonly createdAt: Date; name: string; value: number } = {
  id: 9999,
  createdAt: new Date("2024-01-01"),
  name: "Some Record",
  value: 42,
};
dbRecord.name = "Updated Record"; // Allowed — name is mutable
dbRecord.value = 100;             // Allowed — value is mutable
// dbRecord.id = 1000;            // ERROR — id is readonly
console.log("DB Record:", dbRecord);

// Real-world example: User Profile with readonly fields
const registeredUser: {
  readonly id: number;
  readonly registeredAt: string;
  username: string;
  email: string;
  isActive: boolean;
} = {
  id: 1001,
  registeredAt: "2024-03-15T10:00:00Z",
  username: "carol_ts",
  email: "carol@example.com",
  isActive: true,
};
registeredUser.username = "carol_typescript"; // Allowed — can update username
// registeredUser.id = 9999;                  // ERROR — id is immutable
console.log("Registered User:", registeredUser);

// Real-world example: Authentication Token (token and issuedAt are immutable)
const immutableAuthToken: {
  readonly token: string;
  readonly issuedAt: number;
  expiresIn: number;
  isRevoked: boolean;
} = {
  token: "secure-jwt-token-here",
  issuedAt: Date.now(),
  expiresIn: 3600,
  isRevoked: false,
};
immutableAuthToken.expiresIn = 7200; // Allowed — can extend expiry
immutableAuthToken.isRevoked = true;  // Allowed — can revoke token
// immutableAuthToken.token = "hack"; // ERROR — token is readonly
console.log("Immutable Auth Token:", immutableAuthToken);

// Real-world example: Order (orderId is readonly once created)
const order: {
  readonly orderId: string;
  readonly placedAt: string;
  status: string;
  totalAmount: number;
} = {
  orderId: "ORD-20240617-XYZ",
  placedAt: new Date().toISOString(),
  status: "pending",
  totalAmount: 399.97,
};
order.status = "processing"; // Allowed — status changes over time
// order.orderId = "HACKED";  // ERROR — orderId cannot change
console.log("Order:", order);

// =====================================
// INDEX SIGNATURES
// =====================================
// What: An index signature allows an object to have any number of properties
//       where you do not know the keys in advance, but you know the value type.
// Why:  Sometimes you work with dynamic data — environment variables, query params,
//       feature flags, locale strings — where the keys are not known at compile time.
//       Index signatures let you type these flexible structures safely.
// Syntax: { [key: string]: ValueType }

console.log("\n=== INDEX SIGNATURES ===");

// Simple example
const colorMap: { [key: string]: string } = {};
colorMap["primary"] = "#3498db";
colorMap["secondary"] = "#2ecc71";
colorMap["danger"] = "#e74c3c";
console.log("Color Map:", colorMap);

// Practical example: environment variables
const envVars: { [key: string]: string } = {
  NODE_ENV: "production",
  DATABASE_URL: "postgres://localhost:5432/mydb",
  PORT: "3000",
  SECRET_KEY: "super-secret",
};
console.log("Env Var NODE_ENV:", envVars["NODE_ENV"]);
console.log("Env Var PORT:", envVars["PORT"]);

// Index signature with number keys (array-like access)
const errorMessages: { [code: number]: string } = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};
console.log("Error 404:", errorMessages[404]);
console.log("Error 500:", errorMessages[500]);

// Mixing known properties with index signature
// Known properties must be compatible with the index signature type
const featureFlags: { readonly appName: string; [feature: string]: string | boolean } = {
  appName: "MyShop",
  darkMode: true,
  betaCheckout: false,
  newDashboard: true,
};
console.log("Feature Flags:", featureFlags);

// Real-world example: API response with dynamic metadata
const apiMetadata: { [key: string]: string | number | boolean } = {
  requestId: "req-abc-123",
  version: "2.1.0",
  rateLimitRemaining: 99,
  cached: false,
};
console.log("API Metadata:", apiMetadata);

// Real-world example: Product attributes (dynamic keys like "color", "size", "material")
const productAttributes: { productId: number; [attribute: string]: string | number } = {
  productId: 303,
  color: "Midnight Black",
  size: "Large",
  material: "Aluminum",
  weight: 1.2,
};
console.log("Product Attributes:", productAttributes);

// Real-world example: Cart with dynamic item keys
const cartItemQuantities: { [productId: string]: number } = {
  "prod-001": 2,
  "prod-005": 1,
  "prod-012": 3,
};
console.log("Cart quantities:", cartItemQuantities);

// =====================================
// NESTED OBJECT TYPES
// =====================================
// What: Object type annotations can themselves contain nested objects,
//       allowing you to describe complex, deeply structured data.
// Why:  Real-world data is hierarchical. An order contains items.
//       A user has an address. A product has dimensions.
//       Nested types let TypeScript validate the entire tree.
// Syntax: { outer: { inner: Type } }

console.log("\n=== NESTED OBJECT TYPES ===");

// Simple example
const person: {
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
} = {
  name: "Diana",
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA",
  },
};
console.log("Person city:", person.address.city);

// Real-world example: Order with nested items
const orderWithItems: {
  readonly orderId: string;
  readonly placedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  totalAmount: number;
  status: string;
} = {
  orderId: "ORD-20240617-001",
  placedAt: "2024-06-17T09:00:00Z",
  customer: {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
  },
  shippingAddress: {
    line1: "456 Oak Avenue",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "USA",
  },
  items: [
    {
      productId: 101,
      productName: "Wireless Headphones",
      quantity: 1,
      unitPrice: 79.99,
      subtotal: 79.99,
    },
    {
      productId: 202,
      productName: "Mechanical Keyboard",
      quantity: 1,
      unitPrice: 149.99,
      subtotal: 149.99,
    },
  ],
  payment: {
    method: "credit_card",
    status: "paid",
    transactionId: "txn_xyz789",
  },
  totalAmount: 229.98,
  status: "processing",
};

console.log("Order ID:", orderWithItems.orderId);
console.log("Customer:", orderWithItems.customer.name);
console.log("Items count:", orderWithItems.items.length);
console.log("First item:", orderWithItems.items[0].productName);
console.log("Payment status:", orderWithItems.payment.status);

// Real-world example: Cart with nested structure
const shoppingCart: {
  cartId: string;
  userId: number;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  coupon?: {
    code: string;
    discountPercent: number;
  };
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    grandTotal: number;
  };
  lastUpdated: string;
} = {
  cartId: "cart-user1-session42",
  userId: 1,
  items: [
    { productId: 101, name: "Wireless Headphones", price: 79.99, quantity: 1 },
    { productId: 303, name: "USB-C Hub", price: 49.99, quantity: 2, imageUrl: "/images/hub.jpg" },
  ],
  coupon: {
    code: "SAVE10",
    discountPercent: 10,
  },
  totals: {
    subtotal: 179.97,
    tax: 18.00,
    shipping: 0,
    discount: 17.997,
    grandTotal: 179.973,
  },
  lastUpdated: new Date().toISOString(),
};

console.log("Cart grand total:", shoppingCart.totals.grandTotal.toFixed(2));
console.log("Coupon applied:", shoppingCart.coupon?.code ?? "None");

// Real-world example: API Response Wrapper (nested generic-style)
const apiResponseWrapper: {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    products: {
      id: number;
      name: string;
      price: number;
    }[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  error?: {
    code: string;
    details: string;
  };
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
  };
} = {
  success: true,
  statusCode: 200,
  message: "Products fetched successfully",
  data: {
    products: [
      { id: 1, name: "Headphones", price: 79.99 },
      { id: 2, name: "Keyboard", price: 149.99 },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalItems: 48,
      itemsPerPage: 10,
    },
  },
  meta: {
    requestId: "req-20240617-abc",
    timestamp: new Date().toISOString(),
    version: "v2",
  },
};

console.log("API success:", apiResponseWrapper.success);
console.log("Total items:", apiResponseWrapper.data.pagination.totalItems);
console.log("Products returned:", apiResponseWrapper.data.products.length);

// =====================================
// OBJECT DESTRUCTURING WITH TYPES
// =====================================
// What: You can destructure typed objects just like in JavaScript.
//       TypeScript infers the types of destructured variables automatically.
// Why:  Destructuring makes code cleaner and reduces repetition. TypeScript
//       ensures you only destructure properties that actually exist on the object.
// Syntax: const { prop1, prop2 }: { prop1: Type1; prop2: Type2 } = obj;
//         Or let TypeScript infer from a typed variable.

console.log("\n=== OBJECT DESTRUCTURING WITH TYPES ===");

// Simple example — type is inferred from the typed variable
const productItem: { id: number; name: string; price: number } = {
  id: 1,
  name: "Monitor",
  price: 399.99,
};
const { id, name, price } = productItem;
console.log(`Product: [${id}] ${name} - $${price}`);

// Destructuring with explicit type annotation on the destructured object
const { username, email }: { username: string; email: string } = {
  username: "eve_dev",
  email: "eve@example.com",
};
console.log("Username:", username, "| Email:", email);

// Destructuring with default values for optional properties
const profileData: { displayName: string; bio?: string; followers?: number } = {
  displayName: "Frank",
};
const { displayName, bio = "No bio yet", followers = 0 } = profileData;
console.log(`${displayName}: ${bio} | Followers: ${followers}`);

// Renaming during destructuring
const apiUser: { id: number; name: string } = { id: 42, name: "Grace" };
const { id: userId, name: userName } = apiUser;
console.log("User ID:", userId, "| User Name:", userName);

// Nested destructuring
const orderSummary: {
  orderId: string;
  customer: { name: string; email: string };
  totalAmount: number;
} = {
  orderId: "ORD-999",
  customer: { name: "Henry", email: "henry@example.com" },
  totalAmount: 89.99,
};
const { orderId, customer: { name: customerName, email: customerEmail }, totalAmount } = orderSummary;
console.log(`Order ${orderId} for ${customerName} (${customerEmail}) — $${totalAmount}`);

// Destructuring in function parameters (covered more in the next section)
function displayProduct({ id: pid, name: pName, price: pPrice }: { id: number; name: string; price: number }): void {
  console.log(`  [${pid}] ${pName} — $${pPrice}`);
}
displayProduct({ id: 5, name: "Webcam", price: 89.99 });

// Real-world example: Destructuring an API response
const response: { success: boolean; data: { token: string; userId: number }; message: string } = {
  success: true,
  data: { token: "jwt-token-here", userId: 1001 },
  message: "Login successful",
};
const { success, data: { token, userId: loggedInUserId }, message } = response;
console.log(`Auth success: ${success} | User: ${loggedInUserId} | Msg: ${message}`);
console.log("Token preview:", token.slice(0, 10) + "...");

// =====================================
// FUNCTION PARAMETERS AS TYPED OBJECTS
// =====================================
// What: Function parameters can be typed as objects, describing exactly
//       what shape of data the function accepts.
// Why:  Functions with many parameters become confusing. Object parameters
//       (sometimes called "options objects" or "config objects") are self-documenting
//       and order-independent. TypeScript ensures callers provide the right shape.
// Syntax: function fn(param: { key: Type }): ReturnType { ... }
//         or with destructuring: function fn({ key }: { key: Type }): ReturnType { ... }

console.log("\n=== FUNCTION PARAMETERS AS TYPED OBJECTS ===");

// Simple example
function greetUser(user: { name: string; age: number }): void {
  console.log(`Hello, ${user.name}! You are ${user.age} years old.`);
}
greetUser({ name: "Ivan", age: 34 });
// greetUser({ name: "Ivan" }); // ERROR: missing property 'age'
// greetUser({ name: 123, age: 34 }); // ERROR: type mismatch

// With destructuring in parameters
function displayInventory({ sku, productName, quantity, unitCost }: {
  sku: string;
  productName: string;
  quantity: number;
  unitCost: number;
}): void {
  const totalValue = quantity * unitCost;
  console.log(`  SKU: ${sku} | ${productName} | Qty: ${quantity} | Value: $${totalValue.toFixed(2)}`);
}
displayInventory({ sku: "KB-MEC-001", productName: "Mechanical Keyboard", quantity: 50, unitCost: 75.0 });

// Function with optional and readonly in object parameter
function createUserProfile(input: {
  readonly id: number;
  username: string;
  email: string;
  bio?: string;
}): void {
  console.log(`  Created profile #${input.id}: @${input.username} (${input.bio ?? "No bio"})`);
}
createUserProfile({ id: 1, username: "julia_ts", email: "julia@example.com" });
createUserProfile({ id: 2, username: "kevin_dev", email: "kevin@example.com", bio: "TypeScript enthusiast" });

// Real-world example: Process payment
function processPayment(payment: {
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  cardLast4?: string;
}): void {
  const maskedCard = payment.cardLast4 ? ` (**** ${payment.cardLast4})` : "";
  console.log(
    `  Payment for order ${payment.orderId}: ${payment.currency} ${payment.amount.toFixed(2)} via ${payment.method}${maskedCard}`
  );
}
processPayment({ orderId: "ORD-001", amount: 149.99, currency: "USD", method: "credit_card", cardLast4: "4242" });
processPayment({ orderId: "ORD-002", amount: 59.99, currency: "USD", method: "paypal" });

// Real-world example: Add item to cart
function addToCart(
  cart: { cartId: string; userId: number; items: { productId: number; quantity: number }[] },
  newItem: { productId: number; quantity: number }
): void {
  cart.items.push(newItem);
  console.log(`  Cart ${cart.cartId}: Added product ${newItem.productId} x${newItem.quantity}. Total items: ${cart.items.length}`);
}

const myCart: { cartId: string; userId: number; items: { productId: number; quantity: number }[] } = {
  cartId: "cart-001",
  userId: 1,
  items: [],
};
addToCart(myCart, { productId: 101, quantity: 2 });
addToCart(myCart, { productId: 202, quantity: 1 });

// Real-world example: Search products
function searchProducts(query: {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: string;
}): void {
  console.log("  Search params:", JSON.stringify(query));
}
searchProducts({ keyword: "headphones", maxPrice: 100, inStockOnly: true });
searchProducts({ minPrice: 50, maxPrice: 200, sortBy: "price_asc" });

// =====================================
// RETURNING TYPED OBJECTS FROM FUNCTIONS
// =====================================
// What: Functions can have a return type that is an object type, ensuring
//       the function always returns an object with the correct shape.
// Why:  Return type annotations act as a contract. If your function forgets
//       to return a property, or returns the wrong type for a property,
//       TypeScript will alert you before runtime.
// Syntax: function fn(): { key: Type } { return { key: value }; }

console.log("\n=== RETURNING TYPED OBJECTS FROM FUNCTIONS ===");

// Simple example
function getCoordinates(lat: number, lon: number): { latitude: number; longitude: number } {
  return { latitude: lat, longitude: lon };
}
const coords = getCoordinates(47.6062, -122.3321);
console.log("Coordinates:", coords);

// Returning a user profile
function createUser(id: number, username: string, email: string): {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  isActive: boolean;
} {
  return {
    id,
    username,
    email,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
}
const newUser = createUser(5, "laura_ts", "laura@example.com");
console.log("New user:", newUser.username, "| Active:", newUser.isActive);

// Returning an API response wrapper
function buildApiResponse<T>(
  success: boolean,
  data: T,
  message: string
): { success: boolean; data: T; message: string; timestamp: string } {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}
const productsResponse = buildApiResponse(
  true,
  [{ id: 1, name: "Headphones" }, { id: 2, name: "Keyboard" }],
  "Products fetched"
);
console.log("API Response success:", productsResponse.success);
console.log("API Response data count:", productsResponse.data.length);

// Returning a typed auth token
function generateAuthToken(userId: number): {
  readonly token: string;
  readonly issuedAt: number;
  expiresIn: number;
  userId: number;
} {
  return {
    token: `jwt-${userId}-${Math.random().toString(36).slice(2)}`,
    issuedAt: Date.now(),
    expiresIn: 3600,
    userId,
  };
}
const token = generateAuthToken(101);
console.log("Generated token for user:", token.userId, "| Expires in:", token.expiresIn, "seconds");

// Returning an order summary
function calculateOrderTotal(items: { name: string; price: number; quantity: number }[]): {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    tax,
    total: subtotal + tax,
  };
}
const orderTotal = calculateOrderTotal([
  { name: "Headphones", price: 79.99, quantity: 1 },
  { name: "Cable", price: 9.99, quantity: 2 },
]);
console.log("Order total:", orderTotal.total.toFixed(2), "| Tax:", orderTotal.tax.toFixed(2));

// =====================================
// OBJECT SPREAD AND REST WITH TYPES
// =====================================
// What: Spread (...) copies properties from one object into another.
//       Rest (...rest) collects remaining properties during destructuring.
//       TypeScript types are merged or inferred automatically.
// Why:  Spread is used to create updated copies of objects without mutation
//       (important for immutability). Rest lets you extract a subset of
//       properties while capturing the remainder.
// Syntax:
//   Spread: const merged = { ...obj1, ...obj2 };
//   Rest:   const { known, ...remaining } = obj;

console.log("\n=== OBJECT SPREAD AND REST WITH TYPES ===");

// Simple spread example
const baseConfig: { host: string; port: number } = { host: "localhost", port: 3000 };
const devConfig: { host: string; port: number; debug: boolean } = { ...baseConfig, debug: true };
const prodConfig: { host: string; port: number; debug: boolean } = { ...baseConfig, host: "prod.example.com", debug: false };
console.log("Dev config:", devConfig);
console.log("Prod config:", prodConfig);

// Spread to update an object (immutable update pattern)
const originalUser: { id: number; name: string; email: string; isActive: boolean } = {
  id: 1,
  name: "Mike",
  email: "mike@example.com",
  isActive: true,
};
const updatedUser: { id: number; name: string; email: string; isActive: boolean } = {
  ...originalUser,
  email: "mike.updated@example.com", // overrides original email
};
console.log("Original user email:", originalUser.email);
console.log("Updated user email:", updatedUser.email);

// Rest — extracting known properties and collecting the rest
const fullProduct: { id: number; name: string; price: number; sku: string; weight: number; stock: number } = {
  id: 1,
  name: "Wireless Mouse",
  price: 34.99,
  sku: "WM-BLK-001",
  weight: 0.12,
  stock: 120,
};
const { id: productId, name: productName, price: productPrice, ...productDetails } = fullProduct;
console.log("Product core:", { productId, productName, productPrice });
console.log("Product details (rest):", productDetails);

// Real-world example: Merging user profile update
const existingProfile: {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
} = {
  id: 10,
  username: "nina_dev",
  email: "nina@example.com",
  bio: "JavaScript developer",
  avatarUrl: "/avatars/default.png",
  isVerified: false,
};

const profileUpdate: Partial<typeof existingProfile> = {
  bio: "TypeScript & JavaScript developer",
  avatarUrl: "/avatars/nina.png",
  isVerified: true,
};

const mergedProfile = { ...existingProfile, ...profileUpdate };
console.log("Merged profile bio:", mergedProfile.bio);
console.log("Merged profile verified:", mergedProfile.isVerified);

// Real-world example: Removing sensitive fields using rest
const userWithSensitiveData: {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  sessionToken: string;
} = {
  id: 1,
  username: "oscar_ts",
  email: "oscar@example.com",
  passwordHash: "bcrypt_hashed_value",
  sessionToken: "session-token-xyz",
};
// Remove sensitive fields before sending to client
const { passwordHash, sessionToken, ...safeUserData } = userWithSensitiveData;
console.log("Safe user data (no sensitive fields):", safeUserData);
// passwordHash and sessionToken are not in safeUserData

// Real-world example: Spread for cart update
const currentCart: { cartId: string; userId: number; itemCount: number; lastUpdated: string } = {
  cartId: "cart-abc",
  userId: 1,
  itemCount: 3,
  lastUpdated: "2024-06-16T08:00:00Z",
};
const updatedCart = {
  ...currentCart,
  itemCount: 4,
  lastUpdated: new Date().toISOString(),
};
console.log("Updated cart item count:", updatedCart.itemCount);

// Real-world example: Spread API response data
function wrapInApiResponse(
  data: object,
  extraMeta?: { requestId?: string; version?: string }
): { success: boolean; data: object; meta: { timestamp: string; requestId: string; version: string } } {
  const defaultMeta = { requestId: "req-default", version: "v1" };
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...defaultMeta,
      ...extraMeta,
    },
  };
}
const wrapped = wrapInApiResponse(
  { items: ["headphones", "keyboard"] },
  { requestId: "req-xyz-456", version: "v2" }
);
console.log("Wrapped API meta:", wrapped.meta);

// =====================================
// COMBINING READONLY AND OPTIONAL
// =====================================
// What: readonly and ? can be combined on the same property.
//       readonly?: means the property is optional but, if present, cannot be reassigned.
// Why:  This pattern is useful for configuration objects where some settings
//       might not always be present, but once set should not change.

console.log("\n=== COMBINING READONLY AND OPTIONAL ===");

// Simple example
const appConfig: {
  readonly appName: string;
  readonly version: string;
  readonly apiKey?: string;
  maxRetries?: number;
} = {
  appName: "MyShop",
  version: "1.0.0",
  apiKey: "api-key-12345",
  // maxRetries omitted — optional
};

// appConfig.appName = "NewName"; // ERROR — readonly
// appConfig.apiKey = "other-key"; // ERROR — readonly (even though optional)
appConfig.maxRetries = 3;          // Allowed — not readonly
console.log("App config:", appConfig);

// Real-world example: Product catalog entry
const catalogEntry: {
  readonly id: number;
  readonly sku: string;
  name: string;
  price: number;
  readonly createdAt: string;
  discontinuedAt?: string;
  readonly originalPrice?: number;
} = {
  id: 55,
  sku: "LAPTOP-PRO-16",
  name: "Pro Laptop 16-inch",
  price: 1299.99,
  createdAt: "2024-01-01T00:00:00Z",
  originalPrice: 1499.99, // readonly and optional — set once
};
catalogEntry.name = "Pro Laptop 16-inch (Refurbished)"; // Allowed
catalogEntry.price = 999.99;                             // Allowed
catalogEntry.discontinuedAt = "2025-01-01T00:00:00Z";   // Allowed — not readonly
// catalogEntry.originalPrice = 2000; // ERROR — readonly
console.log("Catalog entry:", catalogEntry.name, "| Price:", catalogEntry.price);

// Real-world example: Inventory item with readonly and optional
const stockItem: {
  readonly itemId: string;
  readonly addedToInventoryAt: string;
  quantity: number;
  location?: string;
  readonly supplierCode?: string;
} = {
  itemId: "INV-20240617-001",
  addedToInventoryAt: new Date().toISOString(),
  quantity: 100,
  supplierCode: "SUP-XYZ", // readonly and optional — set at creation
};
stockItem.quantity = 95;       // Allowed
stockItem.location = "A1-B2";  // Allowed
// stockItem.supplierCode = "OTHER"; // ERROR — readonly
console.log("Stock item:", stockItem.itemId, "| Qty:", stockItem.quantity);

// Real-world example: Auth token object (combining all modifiers)
const secureToken: {
  readonly token: string;
  readonly userId: number;
  readonly issuedAt: number;
  expiresIn: number;
  readonly scope?: string;
  isRevoked: boolean;
  revokedAt?: string;
} = {
  token: "bearer-token-secure",
  userId: 999,
  issuedAt: Date.now(),
  expiresIn: 3600,
  scope: "read:products write:cart",
  isRevoked: false,
};
secureToken.isRevoked = true;
secureToken.revokedAt = new Date().toISOString();
// secureToken.token = "hacked"; // ERROR — readonly
console.log("Secure token revoked:", secureToken.isRevoked);

// =====================================
// COMMON MISTAKES AND HOW TO AVOID THEM
// =====================================

console.log("\n=== COMMON MISTAKES ===");

// MISTAKE 1: Misspelling property names
// In JavaScript this creates a new (undefined) property silently.
// TypeScript catches this at compile time.
const product1: { name: string; price: number } = { name: "Laptop", price: 999 };
// console.log(product1.prise); // TypeScript ERROR: Property 'prise' does not exist on type...
console.log("Correct access:", product1.price); // Must use exact name

// MISTAKE 2: Assigning wrong types to properties
// const badUser: { age: number } = { age: "thirty" }; // ERROR: Type 'string' not assignable to 'number'
const goodUser: { age: number } = { age: 30 }; // Correct
console.log("Good user age:", goodUser.age);

// MISTAKE 3: Forgetting required properties
// const incompleteProduct: { id: number; name: string; price: number } = {
//   id: 1,
//   name: "Monitor",
//   // price is missing! TypeScript ERROR
// };

// MISTAKE 4: Adding extra properties (excess property check)
// TypeScript only applies excess property checking for object literals.
// const strictProduct: { id: number; name: string } = {
//   id: 1,
//   name: "Laptop",
//   unknownProp: true, // ERROR: Object literal may only specify known properties
// };

// MISTAKE 5: Mutating readonly properties
// const readonlyItem: { readonly id: number } = { id: 1 };
// readonlyItem.id = 99; // ERROR: Cannot assign to 'id' because it is a read-only property

// MISTAKE 6: Not handling optional properties before accessing
const maybeUser: { name: string; email?: string } = { name: "Paul" };
// const emailLength = maybeUser.email.length; // Potential runtime error! TypeScript warns you
const safeEmailLength = maybeUser.email?.length ?? 0; // Safe access
console.log("Safe email length:", safeEmailLength);

// MISTAKE 7: Index signature type mismatch
const scores: { [key: string]: number } = {};
scores["alice"] = 100;
// scores["bob"] = "ninety"; // ERROR: Type 'string' is not assignable to type 'number'
scores["bob"] = 90;
console.log("Scores:", scores);

// =====================================
// BEST PRACTICES
// =====================================

console.log("\n=== BEST PRACTICES ===");

// BEST PRACTICE 1: Use type aliases for reused object shapes (covered more in types lesson)
// Instead of repeating { id: number; name: string; email: string } everywhere,
// define a type alias. This keeps your code DRY and consistent.
type UserShape = { id: number; name: string; email: string };
const user1: UserShape = { id: 1, name: "Quinn", email: "quinn@example.com" };
const user2: UserShape = { id: 2, name: "Rachel", email: "rachel@example.com" };
console.log("Users:", user1.name, user2.name);

// BEST PRACTICE 2: Mark truly immutable properties as readonly
// IDs, timestamps, and tokens should almost always be readonly.
type ImmutableRecord = { readonly id: string; readonly createdAt: string; value: number };
const record: ImmutableRecord = { id: "rec-001", createdAt: "2024-01-01", value: 42 };
record.value = 100; // Fine
// record.id = "rec-002"; // TypeScript catches this mistake for you
console.log("Record:", record);

// BEST PRACTICE 3: Use optional (?) instead of | undefined for optional fields
// Bad:  { name: string; email: string | undefined }
// Good: { name: string; email?: string }
// The ? form is more idiomatic and works better with destructuring defaults.
const contact: { name: string; email?: string } = { name: "Sam" };
const { name: contactName, email: contactEmail = "N/A" } = contact;
console.log("Contact:", contactName, "|", contactEmail);

// BEST PRACTICE 4: Use index signatures only when truly dynamic
// Prefer known property names when you know them at design time.
// Use index signatures only for genuinely dynamic data like config maps or translations.

// BEST PRACTICE 5: Use spread for immutable updates, not mutation
// Bad (mutation):
// user.email = "new@email.com";
// Good (immutable update):
const existingUser: UserShape = { id: 1, name: "Tara", email: "tara@old.com" };
const updatedUserProfile: UserShape = { ...existingUser, email: "tara@new.com" };
console.log("Updated email:", updatedUserProfile.email);
console.log("Original unchanged:", existingUser.email);

// BEST PRACTICE 6: Be explicit about return types on functions
// This catches cases where you accidentally forget a property in the return value.
function getTokenInfo(userId: number): { userId: number; expiresAt: number; scope: string } {
  return {
    userId,
    expiresAt: Date.now() + 3600 * 1000,
    scope: "read write",
    // If you forgot 'scope', TypeScript would tell you immediately
  };
}
const tokenInfo = getTokenInfo(1);
console.log("Token info:", tokenInfo.scope);

// BEST PRACTICE 7: Use optional chaining (?.) and nullish coalescing (??) with optional props
const optionalProfile: { name: string; address?: { city?: string } } = { name: "Uma" };
const city = optionalProfile.address?.city ?? "Unknown City";
console.log("City:", city);

// =====================================
// INTERVIEW QUESTIONS AND ANSWERS
// =====================================

console.log("\n=== INTERVIEW QUESTIONS ===");

/*
QUESTION 1:
  What is the difference between optional (?) and readonly in TypeScript object types?

ANSWER:
  - Optional (?): The property may or may not exist on the object.
    Accessing it gives you Type | undefined.
    Example: { email?: string } — email might not be present.

  - Readonly: The property must be present, but cannot be reassigned after creation.
    Example: { readonly id: number } — id must be set at creation and cannot change.

  They can be combined: { readonly createdAt?: string } — optional at creation,
  but immutable if present. TypeScript enforces both constraints simultaneously.
*/

/*
QUESTION 2:
  What is an index signature in TypeScript and when would you use one?

ANSWER:
  An index signature { [key: string]: ValueType } allows an object to have
  any number of properties with string (or number) keys of a known value type.

  Use it when:
  - The property names are not known at compile time (e.g., user settings, locale strings)
  - You are wrapping dynamic API responses
  - You are building a map/dictionary structure

  Avoid it when you know all the property names — prefer explicit properties instead,
  as they provide better autocomplete and type safety.
*/

/*
QUESTION 3:
  Explain TypeScript's excess property checking and when it does NOT apply.

ANSWER:
  TypeScript performs excess property checking when you assign an object literal
  directly to a typed variable. If the literal has properties not in the type,
  TypeScript reports an error:

    const x: { id: number } = { id: 1, extra: true }; // ERROR

  However, excess property checking does NOT apply when:
  - Assigning through an intermediate variable:
      const temp = { id: 1, extra: true };
      const x: { id: number } = temp; // OK — structural check only
  - Passing through a function that accepts a wider type

  This is intentional — TypeScript only applies the strict check when the
  extra properties are "obviously" mistakes (inline literal assignment).
*/

/*
QUESTION 4:
  What is the difference between using object spread (...) for updates versus
  direct mutation? Why does TypeScript favor immutable update patterns?

ANSWER:
  Direct mutation modifies the original object in place:
    user.email = "new@email.com";

  Spread creates a new object with the updated value:
    const updatedUser = { ...user, email: "new@email.com" };

  TypeScript favors immutable updates because:
  1. readonly properties cannot be reassigned — spread is the only way to
     create an "updated" version of an object with readonly fields.
  2. Immutability prevents bugs where two variables share a reference and
     a mutation in one place unexpectedly affects another.
  3. It works well with React state, Redux, and functional patterns where
     state should never be mutated directly.
*/

// =====================================
// PRACTICE TASKS
// =====================================

console.log("\n=== PRACTICE TASKS ===");

/*
TASK 1: Build a Product Catalog System
  Create a typed object for a product with:
  - readonly id (number) and readonly createdAt (string)
  - name, description (optional), price, stock (number)
  - category and tags (string array)
  - dimensions object with width, height, depth (all numbers, all optional)
  - An index signature for dynamic attributes like { [attr: string]: string }

  Then write two functions:
  a) applyDiscount(product, percent) — returns a new product object with the updated price
  b) markOutOfStock(product) — returns a new product object with stock set to 0

  Verify that the original product is NOT modified after calling these functions.

TASK 2: Design an Order Processing Pipeline
  Create typed objects for:
  - A CartItem: { productId, name, price, quantity }
  - A Cart: { cartId (readonly), userId, items: CartItem[], couponCode?: string }
  - An Order: { orderId (readonly), placedAt (readonly), status, cart, shippingAddress, payment }

  Write functions:
  a) cartToOrder(cart, shippingAddress, payment) — converts a Cart into an Order
  b) updateOrderStatus(order, newStatus) — returns an updated order (immutable update)
  c) getOrderTotal(order) — returns an object with { subtotal, tax, grandTotal }

  Test the pipeline: build a cart, convert to order, update status, compute total.

TASK 3: Build a Type-Safe API Response System
  Create an API response wrapper type with:
  - success (boolean), statusCode (number), message (string)
  - data (generic — use T or use unknown and cast)
  - error?: { code: string; details: string }
  - meta: { requestId (readonly), timestamp (readonly), version, pagination? }
  - pagination?: { page, perPage, total, totalPages }

  Write functions:
  a) successResponse(data, message, meta?) — builds a successful response object
  b) errorResponse(code, details, statusCode?) — builds an error response object
  c) paginatedResponse(data, page, perPage, total) — builds a paginated response

  Call all three functions and log the results.
  Verify TypeScript catches it if you try to set meta.requestId after creation.
*/

// --- TASK 1 STARTER SOLUTION ---

console.log("\n--- Task 1 Starter Solution ---");

const sampleProduct: {
  readonly id: number;
  readonly createdAt: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  dimensions?: { width?: number; height?: number; depth?: number };
  [attr: string]: unknown; // index signature for dynamic attributes
} = {
  id: 1,
  createdAt: "2024-01-01",
  name: "Wireless Headphones",
  price: 79.99,
  stock: 150,
  category: "Electronics",
  tags: ["audio", "wireless", "bluetooth"],
  dimensions: { width: 18, height: 22, depth: 8 },
  color: "Black",
  material: "Plastic/Metal",
};

function applyDiscount(
  product: typeof sampleProduct,
  discountPercent: number
): typeof sampleProduct {
  const discountedPrice = product.price * (1 - discountPercent / 100);
  return { ...product, price: parseFloat(discountedPrice.toFixed(2)) };
}

function markOutOfStock(product: typeof sampleProduct): typeof sampleProduct {
  return { ...product, stock: 0 };
}

const discountedProduct = applyDiscount(sampleProduct, 15);
const outOfStockProduct = markOutOfStock(sampleProduct);

console.log("Original price:", sampleProduct.price);
console.log("Discounted price:", discountedProduct.price);
console.log("Original stock:", sampleProduct.stock);
console.log("Out-of-stock version:", outOfStockProduct.stock);

// --- TASK 2 STARTER SOLUTION ---

console.log("\n--- Task 2 Starter Solution ---");

type CartItem2 = { productId: number; name: string; price: number; quantity: number };
type Cart2 = { readonly cartId: string; userId: number; items: CartItem2[]; couponCode?: string };
type ShippingAddress2 = { line1: string; city: string; state: string; postalCode: string; country: string };
type Payment2 = { method: string; status: string; transactionId?: string };
type Order2 = {
  readonly orderId: string;
  readonly placedAt: string;
  status: string;
  cart: Cart2;
  shippingAddress: ShippingAddress2;
  payment: Payment2;
};

function cartToOrder(cart: Cart2, shippingAddress: ShippingAddress2, payment: Payment2): Order2 {
  return {
    orderId: `ORD-${Date.now()}`,
    placedAt: new Date().toISOString(),
    status: "pending",
    cart,
    shippingAddress,
    payment,
  };
}

function updateOrderStatus(order: Order2, newStatus: string): Order2 {
  return { ...order, status: newStatus };
}

function getOrderTotal(order: Order2): { subtotal: number; tax: number; grandTotal: number } {
  const subtotal = order.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  return { subtotal, tax, grandTotal: subtotal + tax };
}

const myCart2: Cart2 = {
  cartId: "cart-task2",
  userId: 1,
  items: [
    { productId: 1, name: "Headphones", price: 79.99, quantity: 1 },
    { productId: 2, name: "Keyboard", price: 149.99, quantity: 1 },
  ],
};
const myOrder = cartToOrder(
  myCart2,
  { line1: "123 Main St", city: "Seattle", state: "WA", postalCode: "98101", country: "USA" },
  { method: "credit_card", status: "paid", transactionId: "txn-task2-001" }
);
const processedOrder = updateOrderStatus(myOrder, "shipped");
const totals = getOrderTotal(processedOrder);

console.log("Order ID:", processedOrder.orderId);
console.log("Order status:", processedOrder.status);
console.log("Order total:", totals.grandTotal.toFixed(2));

// --- TASK 3 STARTER SOLUTION ---

console.log("\n--- Task 3 Starter Solution ---");

type ApiMeta = { readonly requestId: string; readonly timestamp: string; version: string };
type Pagination = { page: number; perPage: number; total: number; totalPages: number };
type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: { code: string; details: string };
  meta: ApiMeta & { pagination?: Pagination };
};

function successResponse<T>(data: T, message: string, extra?: Partial<ApiMeta>): ApiResponse<T> {
  return {
    success: true,
    statusCode: 200,
    message,
    data,
    meta: {
      requestId: extra?.requestId ?? `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: extra?.version ?? "v1",
    },
  };
}

function errorResponse(code: string, details: string, statusCode: number = 500): ApiResponse<null> {
  return {
    success: false,
    statusCode,
    message: "An error occurred",
    data: null,
    error: { code, details },
    meta: {
      requestId: `req-err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: "v1",
    },
  };
}

function paginatedResponse<T>(
  data: T[],
  page: number,
  perPage: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    statusCode: 200,
    message: "Data fetched successfully",
    data,
    meta: {
      requestId: `req-page-${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: "v1",
      pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    },
  };
}

const successRes = successResponse({ userId: 1, token: "abc123" }, "Login successful");
const errorRes = errorResponse("AUTH_FAILED", "Invalid credentials", 401);
const pagedRes = paginatedResponse([{ id: 1 }, { id: 2 }], 1, 10, 42);

console.log("Success response:", successRes.success, "|", successRes.message);
console.log("Error response:", errorRes.statusCode, "|", errorRes.error?.code);
console.log("Paged response total pages:", pagedRes.meta.pagination?.totalPages);

// TypeScript prevents mutating readonly meta fields:
// successRes.meta.requestId = "hacked"; // ERROR: Cannot assign to 'requestId' (readonly)

console.log("\n=== END OF 05-OBJECTS.TS ===");
