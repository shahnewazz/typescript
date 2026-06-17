// =====================================
// ARRAYS AND TUPLES IN TYPESCRIPT
// =====================================
// Target: JavaScript developers learning TypeScript from scratch
// This file is fully self-contained and all code is runnable.

// =====================================
// SECTION 1: ARRAYS
// =====================================

// -------------------------------------
// 1.1 Array Type Syntax: string[] and Array<string>
// -------------------------------------
// WHAT: TypeScript gives you two equivalent ways to declare an array type.
// WHY: Type-safe arrays prevent you from accidentally mixing incompatible values.
//      TypeScript will catch type errors at compile time, not at runtime.
//
// SYNTAX:
//   string[]           -- shorthand (most common, preferred)
//   Array<string>      -- generic form (more explicit)

// Simple example
const fruits: string[] = ["apple", "banana", "cherry"];
const cities: Array<string> = ["Dhaka", "London", "Tokyo"];

// TypeScript enforces the type -- this would be a compile error:
// fruits.push(42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'

// Practical example: list of product names
const productNames: string[] = ["Laptop", "Mouse", "Keyboard", "Monitor"];
productNames.push("Webcam");
console.log("Product names:", productNames);

// Real-world example: list of registered usernames
const registeredUsers: Array<string> = ["alice", "bob", "carol", "dave"];
const isUserRegistered = (username: string): boolean =>
  registeredUsers.includes(username);
console.log("Is 'bob' registered?", isUserRegistered("bob"));
console.log("Is 'eve' registered?", isUserRegistered("eve"));

// Number arrays
const prices: number[] = [9.99, 24.99, 149.99, 299.99];
const ids: Array<number> = [101, 102, 103, 104];
console.log("Prices:", prices);
console.log("IDs:", ids);

// Boolean arrays
const inStock: boolean[] = [true, false, true, true];
console.log("In stock flags:", inStock);

// -------------------------------------
// 1.2 Readonly Arrays: readonly string[] and ReadonlyArray<string>
// -------------------------------------
// WHAT: An array whose elements cannot be added, removed, or replaced after creation.
// WHY: Prevents accidental mutation of data that should stay constant -- e.g.,
//      configuration values, constant lists, props passed to functions.
//
// SYNTAX:
//   readonly string[]        -- shorthand
//   ReadonlyArray<string>    -- generic form

// Simple example
const COUNTRIES: readonly string[] = ["BD", "UK", "US", "JP"];
const CURRENCY_CODES: ReadonlyArray<string> = ["BDT", "GBP", "USD", "JPY"];

// These would all be compile errors:
// COUNTRIES.push("DE");    // Error: Property 'push' does not exist on type 'readonly string[]'
// COUNTRIES[0] = "CN";     // Error: Index signature in type 'readonly string[]' only permits reading
// COUNTRIES.pop();         // Error: Property 'pop' does not exist on type 'readonly string[]'

console.log("Countries:", COUNTRIES);
console.log("Currency codes:", CURRENCY_CODES);

// Practical example: allowed payment methods (should never change at runtime)
const ALLOWED_PAYMENT_METHODS: readonly string[] = [
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
];

function isPaymentMethodAllowed(method: string): boolean {
  return ALLOWED_PAYMENT_METHODS.includes(method);
}
console.log("Is 'paypal' allowed?", isPaymentMethodAllowed("paypal"));
console.log("Is 'crypto' allowed?", isPaymentMethodAllowed("crypto"));

// Real-world example: product categories that should not be mutated
const PRODUCT_CATEGORIES: ReadonlyArray<string> = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
];
console.log("Available categories:", PRODUCT_CATEGORIES);
console.log("Category count:", PRODUCT_CATEGORIES.length);

// -------------------------------------
// 1.3 Multidimensional Arrays: number[][]
// -------------------------------------
// WHAT: Arrays whose elements are themselves arrays (nested arrays).
// WHY: Useful for grids, matrices, tables, coordinates, or grouped data.
//
// SYNTAX:
//   number[][]     -- 2D array of numbers
//   string[][]     -- 2D array of strings
//   number[][][]   -- 3D array of numbers (rarely needed)

// Simple example: a 3x3 grid
const grid: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log("Grid row 0:", grid[0]);
console.log("Grid cell [1][2]:", grid[1][2]); // 6

// Practical example: seating chart (row, seat)
const seatingChart: string[][] = [
  ["A1", "A2", "A3", "A4"],
  ["B1", "B2", "B3", "B4"],
  ["C1", "C2", "C3", "C4"],
];
console.log("Row B seats:", seatingChart[1]);

// Real-world example: order history grouped by month
// Each inner array is a list of order IDs for that month
const orderHistory: number[][] = [
  [1001, 1002, 1003], // January
  [1004, 1005],       // February
  [1006, 1007, 1008, 1009], // March
];
orderHistory.forEach((monthOrders, index) => {
  console.log(`Month ${index + 1} orders:`, monthOrders);
});

// -------------------------------------
// 1.4 Array of Objects
// -------------------------------------
// WHAT: Arrays where each element is an object conforming to a specific type or interface.
// WHY: This is the most common pattern in real apps -- lists of users, products, orders, etc.
//
// SYNTAX (using an inline type):
//   { id: number; name: string }[]
// SYNTAX (using an interface -- preferred for reuse):
//   User[]

// Define a User interface for reuse across examples
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Simple example
const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", isActive: true },
  { id: 2, name: "Bob Smith", email: "bob@example.com", isActive: false },
  { id: 3, name: "Carol White", email: "carol@example.com", isActive: true },
];
console.log("Users:", users);

// Define a Product interface
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

// Real-world example: product inventory
const inventory: Product[] = [
  { id: 101, name: "Laptop Pro", price: 1299.99, category: "Electronics", stock: 15 },
  { id: 102, name: "Wireless Mouse", price: 29.99, category: "Electronics", stock: 120 },
  { id: 103, name: "USB-C Hub", price: 49.99, category: "Electronics", stock: 45 },
  { id: 104, name: "Desk Chair", price: 299.99, category: "Furniture", stock: 8 },
  { id: 105, name: "Standing Desk", price: 499.99, category: "Furniture", stock: 0 },
];
console.log("Inventory:", inventory);

// Inline object type syntax (useful for one-off arrays)
const tags: { id: number; label: string }[] = [
  { id: 1, label: "sale" },
  { id: 2, label: "new" },
  { id: 3, label: "featured" },
];
console.log("Tags:", tags);

// -------------------------------------
// 1.5 Array Methods with Types (map, filter, reduce, find, forEach)
// -------------------------------------
// WHAT: All standard JS array methods work in TypeScript, but TypeScript
//       infers or enforces types on the return values and callback parameters.
// WHY: You get autocomplete and type safety inside every callback --
//      no more guessing what type 'item' is inside a .map() call.

// --- map ---
// Returns a new array by transforming each element.
// TypeScript infers the return type from the callback's return value.

const userNames: string[] = users.map((user: User): string => user.name);
console.log("User names via map:", userNames);

// Map products to display strings
const productLabels: string[] = inventory.map(
  (p: Product): string => `${p.name} - $${p.price.toFixed(2)}`
);
console.log("Product labels:", productLabels);

// Map to a new shape (array of objects)
interface ProductSummary {
  id: number;
  label: string;
  inStock: boolean;
}
const productSummaries: ProductSummary[] = inventory.map(
  (p: Product): ProductSummary => ({
    id: p.id,
    label: p.name,
    inStock: p.stock > 0,
  })
);
console.log("Product summaries:", productSummaries);

// --- filter ---
// Returns a new array containing only elements that pass the test.
// TypeScript preserves the original element type in the result.

const activeUsers: User[] = users.filter((user: User): boolean => user.isActive);
console.log("Active users:", activeUsers);

// Filter products in stock
const inStockProducts: Product[] = inventory.filter(
  (p: Product): boolean => p.stock > 0
);
console.log("In-stock products:", inStockProducts.map((p) => p.name));

// Filter by category
const electronics: Product[] = inventory.filter(
  (p: Product): boolean => p.category === "Electronics"
);
console.log("Electronics:", electronics.map((p) => p.name));

// Type guard in filter (narrows type)
const mixedValues: (string | number)[] = ["Alice", 25, "Bob", 30, "Carol", 22];
const onlyStrings: string[] = mixedValues.filter(
  (v): v is string => typeof v === "string"
);
console.log("Only strings:", onlyStrings);

// --- reduce ---
// Accumulates a single value by iterating over the array.
// TypeScript requires you to type the accumulator when its type differs from the element type.

const totalInventoryValue: number = inventory.reduce(
  (total: number, product: Product): number => total + product.price * product.stock,
  0
);
console.log("Total inventory value: $", totalInventoryValue.toFixed(2));

// Reduce to an object (group by category)
const productsByCategory: Record<string, Product[]> = inventory.reduce(
  (acc: Record<string, Product[]>, product: Product): Record<string, Product[]> => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  },
  {}
);
console.log("Products by category keys:", Object.keys(productsByCategory));

// Count items
const totalStockUnits: number = inventory.reduce(
  (sum: number, p: Product): number => sum + p.stock,
  0
);
console.log("Total stock units:", totalStockUnits);

// --- find ---
// Returns the first element that matches, or undefined.
// TypeScript types the return as: ElementType | undefined

const foundUser: User | undefined = users.find((u: User): boolean => u.id === 2);
console.log("Found user:", foundUser?.name ?? "Not found");

const notFoundUser: User | undefined = users.find((u: User): boolean => u.id === 99);
console.log("User with id 99:", notFoundUser ?? "Not found");

// Find an out-of-stock product
const outOfStockProduct: Product | undefined = inventory.find(
  (p: Product): boolean => p.stock === 0
);
console.log("First out-of-stock product:", outOfStockProduct?.name ?? "None");

// --- forEach ---
// Iterates over each element. Returns void (no new array).

console.log("--- All users ---");
users.forEach((user: User): void => {
  console.log(`  [${user.id}] ${user.name} (${user.isActive ? "active" : "inactive"})`);
});

console.log("--- Inventory report ---");
inventory.forEach((product: Product): void => {
  const status = product.stock > 0 ? `${product.stock} in stock` : "OUT OF STOCK";
  console.log(`  ${product.name}: ${status}`);
});

// -------------------------------------
// 1.6 Union Type Arrays: (string | number)[]
// -------------------------------------
// WHAT: An array that can hold values of more than one type.
// WHY: Sometimes data is legitimately mixed -- IDs that can be strings or numbers,
//      spreadsheet rows, CSV columns, legacy API responses.
//
// SYNTAX:
//   (string | number)[]       -- array of string OR number values
//   (string | null)[]         -- array of strings that might be null
//   (User | Product)[]        -- array of User or Product objects

// Simple example
const mixedIds: (string | number)[] = [1, "SKU-001", 2, "SKU-002", 3];
console.log("Mixed IDs:", mixedIds);

// Practical example: a row from a CSV file (could be string, number, or boolean)
type CsvRow = (string | number | boolean)[];
const csvRow: CsvRow = ["Alice", 25, "alice@example.com", true, 1299.99];
console.log("CSV row:", csvRow);

// Real-world example: search results that could be users or products
type SearchResult = User | Product;
const searchResults: SearchResult[] = [
  users[0],
  inventory[0],
  users[1],
  inventory[2],
];

searchResults.forEach((result: SearchResult): void => {
  // Type narrowing inside the loop
  if ("email" in result) {
    console.log("User result:", result.name, result.email);
  } else {
    console.log("Product result:", result.name, `$${result.price}`);
  }
});

// Nullable array items: items that might be missing
const optionalEmails: (string | null)[] = ["alice@example.com", null, "carol@example.com"];
const validEmails: string[] = optionalEmails.filter(
  (email): email is string => email !== null
);
console.log("Valid emails:", validEmails);

// =====================================
// SECTION 2: TUPLES
// =====================================

// -------------------------------------
// 2.1 What Is a Tuple?
// -------------------------------------
// WHAT: A tuple is a fixed-length array where each position has a specific, known type.
// WHY: In JavaScript, [string, number] is just an array -- JS does not know what type
//      each position should hold. TypeScript adds this constraint so you always know
//      that position 0 is a string, position 1 is a number, etc.
//      Tuples are great for: function return values, structured data rows,
//      coordinate pairs, key-value pairs.
//
// JS vs TS comparison:
//   JavaScript:  const pair = ["Alice", 30];  // could be anything
//   TypeScript:  const pair: [string, number] = ["Alice", 30];  // position types are fixed

// JavaScript mindset (no guarantees):
const jsPair = ["Alice", 30]; // JS doesn't know or care about order/types
jsPair[0] = 99;               // JS allows this -- first item is now a number
jsPair[1] = "thirty";         // JS allows this -- second item is now a string
console.log("JS pair (mutated):", jsPair); // [99, "thirty"] -- totally valid in JS

// TypeScript mindset (fixed positions):
const tsPair: [string, number] = ["Alice", 30];
// tsPair[0] = 99;       // Error: Type 'number' is not assignable to type 'string'
// tsPair[1] = "thirty"; // Error: Type 'string' is not assignable to type 'number'
console.log("TS pair:", tsPair);

// -------------------------------------
// 2.2 Tuple Syntax: [string, number]
// -------------------------------------
// SYNTAX: [Type1, Type2, Type3, ...]
// Each position is typed independently.

// Simple example: a name and age pair
const person: [string, number] = ["Bob", 25];
console.log("Person tuple:", person);
console.log("Name:", person[0]); // TypeScript knows this is a string
console.log("Age:", person[1]);  // TypeScript knows this is a number

// Practical example: a key-value pair from a form field
type FormField = [string, string]; // [fieldName, fieldValue]
const usernameField: FormField = ["username", "alice123"];
const emailField: FormField = ["email", "alice@example.com"];
console.log("Form field:", usernameField[0], "=", usernameField[1]);
console.log("Form field:", emailField[0], "=", emailField[1]);

// Real-world example: HTTP response tuple [statusCode, body]
type HttpResponse = [number, string];
const successResponse: HttpResponse = [200, "OK"];
const notFoundResponse: HttpResponse = [404, "Not Found"];
const serverError: HttpResponse = [500, "Internal Server Error"];

function handleResponse(response: HttpResponse): void {
  const [status, message] = response;
  if (status >= 200 && status < 300) {
    console.log(`Success (${status}): ${message}`);
  } else {
    console.log(`Error (${status}): ${message}`);
  }
}
handleResponse(successResponse);
handleResponse(notFoundResponse);
handleResponse(serverError);

// Real-world example: [userId, productId, quantity] for cart item
type CartItem = [number, number, number]; // [userId, productId, quantity]
const cartItem: CartItem = [1, 101, 2]; // user 1, product 101, quantity 2
console.log("Cart item - userId:", cartItem[0], "productId:", cartItem[1], "qty:", cartItem[2]);

// -------------------------------------
// 2.3 Named Tuples: [name: string, age: number]
// -------------------------------------
// WHAT: Tuple positions can be given descriptive labels.
// WHY: Labels make the tuple self-documenting. Without labels, [string, number]
//      could mean anything. With labels, [name: string, age: number] is clear.
//      Labels are only for documentation -- they do not change runtime behavior.
//
// SYNTAX: [label1: Type1, label2: Type2]

// Simple example
type PersonTuple = [name: string, age: number];
const alice: PersonTuple = ["Alice", 28];
console.log("Named tuple person:", alice);

// Practical example: geographic coordinate
type Coordinate = [latitude: number, longitude: number];
const dhaka: Coordinate = [23.8103, 90.4125];
const london: Coordinate = [51.5074, -0.1278];
console.log("Dhaka coordinates:", dhaka);
console.log("London coordinates:", london);

// Real-world example: order line item [productId, productName, quantity, unitPrice]
type OrderLineItem = [
  productId: number,
  productName: string,
  quantity: number,
  unitPrice: number
];

const lineItem1: OrderLineItem = [101, "Laptop Pro", 1, 1299.99];
const lineItem2: OrderLineItem = [102, "Wireless Mouse", 2, 29.99];
const lineItem3: OrderLineItem = [103, "USB-C Hub", 1, 49.99];

function printLineItem(item: OrderLineItem): void {
  const [id, name, qty, price] = item;
  console.log(`  Item #${id}: ${name} x${qty} @ $${price} = $${(qty * price).toFixed(2)}`);
}

console.log("--- Order items ---");
printLineItem(lineItem1);
printLineItem(lineItem2);
printLineItem(lineItem3);

// -------------------------------------
// 2.4 Optional Tuple Elements: [string, number?]
// -------------------------------------
// WHAT: A tuple element marked with ? is optional -- it may or may not be present.
// WHY: Sometimes a tuple represents data where some trailing fields are not always provided.
//      For example, a name might or might not include a middle name.
//
// SYNTAX: [Type1, Type2?]
// The optional element must come AFTER all required elements.

// Simple example: [firstName, lastName, middleName?]
type FullName = [firstName: string, lastName: string, middleName?: string];

const name1: FullName = ["Alice", "Johnson"];
const name2: FullName = ["Bob", "Van", "Halen"];
console.log("Name 1:", name1);
console.log("Name 2:", name2);

// Accessing optional elements safely
function formatName(name: FullName): string {
  const [first, last, middle] = name;
  return middle ? `${first} ${middle} ${last}` : `${first} ${last}`;
}
console.log("Formatted name 1:", formatName(name1));
console.log("Formatted name 2:", formatName(name2));

// Practical example: product with optional discount
type ProductEntry = [name: string, price: number, discount?: number];

const fullPriceItem: ProductEntry = ["Keyboard", 79.99];
const discountedItem: ProductEntry = ["Laptop Pro", 1299.99, 150.00];

function calculateFinalPrice(entry: ProductEntry): number {
  const [, price, discount] = entry;
  return discount !== undefined ? price - discount : price;
}
console.log("Keyboard final price: $", calculateFinalPrice(fullPriceItem).toFixed(2));
console.log("Laptop final price: $", calculateFinalPrice(discountedItem).toFixed(2));

// Real-world example: shipping address [street, city, postalCode, country, apartment?]
type ShippingAddress = [
  street: string,
  city: string,
  postalCode: string,
  country: string,
  apartment?: string
];

const address1: ShippingAddress = ["123 Main St", "Dhaka", "1207", "Bangladesh"];
const address2: ShippingAddress = ["456 Baker St", "London", "NW1 6XE", "UK", "Apt 2B"];
console.log("Address 1:", address1);
console.log("Address 2:", address2);

// -------------------------------------
// 2.5 Rest Elements in Tuples: [string, ...number[]]
// -------------------------------------
// WHAT: A tuple can have a rest element (...Type[]) to capture a variable
//       number of trailing elements of the same type.
// WHY: Useful when the first few positions are fixed/typed but the rest are variable.
//      For example, a function call log: [functionName, ...args].
//
// SYNTAX: [Type1, Type2, ...Type3[]]
// The rest element must be the last element in the tuple.

// Simple example: [label, ...values]
type LabeledValues = [label: string, ...values: number[]];

const scores: LabeledValues = ["test scores", 85, 92, 78, 90, 88];
console.log("Label:", scores[0]);
console.log("Scores:", scores.slice(1));

// Practical example: [eventName, ...participantIds]
type EventAttendance = [eventName: string, ...participantIds: number[]];

const meetingAttendance: EventAttendance = ["Q1 Review", 1, 2, 3, 5, 8];
const [eventName, ...participants] = meetingAttendance;
console.log("Event:", eventName);
console.log("Participants:", participants);

// Real-world example: a shopping basket [customerId, ...productIds]
type ShoppingBasket = [customerId: number, ...productIds: number[]];

const basket1: ShoppingBasket = [1, 101, 102, 103];
const basket2: ShoppingBasket = [2, 104];
const basket3: ShoppingBasket = [3]; // empty basket (no products yet)

function printBasket(basket: ShoppingBasket): void {
  const [customerId, ...products] = basket;
  if (products.length === 0) {
    console.log(`Customer ${customerId}: empty basket`);
  } else {
    console.log(`Customer ${customerId}: products [${products.join(", ")}]`);
  }
}
printBasket(basket1);
printBasket(basket2);
printBasket(basket3);

// Mixed fixed + rest: [method, url, ...headers]
type HttpRequest = [method: string, url: string, ...headers: string[]];
const getRequest: HttpRequest = ["GET", "/api/products"];
const postRequest: HttpRequest = [
  "POST",
  "/api/orders",
  "Content-Type: application/json",
  "Authorization: Bearer token123",
];
console.log("GET request:", getRequest);
console.log("POST request method:", postRequest[0], "url:", postRequest[1]);
console.log("POST headers:", postRequest.slice(2));

// -------------------------------------
// 2.6 Readonly Tuples
// -------------------------------------
// WHAT: A tuple whose elements cannot be reassigned after creation.
// WHY: When a tuple represents a fixed data record (like a database row or a
//      configuration value) you want to prevent accidental mutation.
//
// SYNTAX:
//   readonly [string, number]
//   Readonly<[string, number]>   -- using the Readonly utility type

// Simple example
const readonlyCoord: readonly [number, number] = [23.8103, 90.4125];
// readonlyCoord[0] = 0; // Error: Cannot assign to '0' because it is a read-only property
console.log("Readonly coordinate:", readonlyCoord);

// Using the Readonly utility type
const fixedConfig: Readonly<[string, number, boolean]> = ["production", 8080, true];
// fixedConfig[1] = 3000; // Error: Cannot assign to '1' because it is a read-only property
console.log("Fixed config:", fixedConfig);

// Practical example: a currency exchange rate that should not change mid-computation
type ExchangeRate = readonly [fromCurrency: string, toCurrency: string, rate: number];
const usdToBdt: ExchangeRate = ["USD", "BDT", 110.5];
console.log(`1 ${usdToBdt[0]} = ${usdToBdt[2]} ${usdToBdt[1]}`);

// Real-world example: immutable product snapshot (price at time of order)
type OrderSnapshot = readonly [
  orderId: number,
  productName: string,
  priceAtPurchase: number,
  quantity: number
];

const orderSnapshot: OrderSnapshot = [5001, "Laptop Pro", 1299.99, 1];
// orderSnapshot[2] = 999.99; // Error: cannot change historical price
console.log("Order snapshot:", orderSnapshot);

// -------------------------------------
// 2.7 Destructuring Tuples
// -------------------------------------
// WHAT: Extracting tuple values into named variables using destructuring syntax.
// WHY: Positional access (tuple[0], tuple[1]) is hard to read. Destructuring
//      gives each value a meaningful name and TypeScript preserves the types.
//
// SYNTAX:
//   const [a, b, c] = myTuple;
//   const [a, , c] = myTuple;          -- skip the second element
//   const [a, ...rest] = myTuple;      -- capture rest elements

// Simple example
const employeeTuple: [string, number, string] = ["Alice", 50000, "Engineering"];
const [empName, empSalary, empDepartment] = employeeTuple;
console.log(`${empName} earns $${empSalary} in ${empDepartment}`);

// Skip elements with empty slots
const [, , dept] = employeeTuple; // only grab department
console.log("Department only:", dept);

// Destructure with rest
const scoresTuple: [string, ...number[]] = ["Alice", 88, 92, 79, 95];
const [studentName, ...studentScores] = scoresTuple;
const average = studentScores.reduce((s, n) => s + n, 0) / studentScores.length;
console.log(`${studentName}'s average score: ${average.toFixed(1)}`);

// Practical example: destructuring a function return tuple
// (Tuples are very commonly used as return values from functions)
function getUserInfo(id: number): [string, string, boolean] {
  // In a real app this would fetch from a database
  const mockData: Record<number, [string, string, boolean]> = {
    1: ["Alice Johnson", "alice@example.com", true],
    2: ["Bob Smith", "bob@example.com", false],
  };
  return mockData[id] ?? ["Unknown", "unknown@example.com", false];
}

const [userName, userEmail, userActive] = getUserInfo(1);
console.log(`Name: ${userName}, Email: ${userEmail}, Active: ${userActive}`);

// Real-world example: destructuring an order line item
function processOrderItem(item: OrderLineItem): void {
  const [productId, productName, quantity, unitPrice] = item;
  const total = quantity * unitPrice;
  console.log(
    `Processing: ${productName} (ID: ${productId}), qty: ${quantity}, unit: $${unitPrice}, total: $${total.toFixed(2)}`
  );
}
processOrderItem(lineItem1);
processOrderItem(lineItem2);

// Named tuple destructuring (names in the type do NOT become variable names automatically)
type GeoPoint = [lat: number, lng: number, elevation?: number];
const mountEverest: GeoPoint = [27.9881, 86.925, 8848];
const [lat, lng, elevation] = mountEverest; // you choose the variable names
console.log(`Mount Everest: lat=${lat}, lng=${lng}, elevation=${elevation}m`);

// =====================================
// SECTION 3: JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

console.log("\n--- JS vs TS Comparison ---");

// JavaScript: no type enforcement whatsoever
// const jsUsers = [];
// jsUsers.push("Alice");     // string -- fine
// jsUsers.push(42);          // number -- JS doesn't care
// jsUsers.push(true);        // boolean -- JS doesn't care
// jsUsers.push({ id: 1 });   // object -- JS doesn't care
// Result: [string, number, boolean, object] -- messy and unpredictable

// TypeScript: type enforcement at compile time
const tsUsers: User[] = [];
// tsUsers.push("Alice");   // Error: string is not assignable to User
// tsUsers.push(42);        // Error: number is not assignable to User
tsUsers.push({ id: 4, name: "Dave", email: "dave@example.com", isActive: true });
console.log("TypeScript users (type-safe):", tsUsers);

// JavaScript tuple "simulation": just an array, no guarantees
const jsProductEntry = ["Laptop", 1299.99]; // looks like a tuple but isn't enforced
jsProductEntry[0] = 9999;     // JS allows replacing the name with a number -- bug!
jsProductEntry.push("extra"); // JS allows adding extra elements
console.log("JS 'tuple' (mutated):", jsProductEntry);

// TypeScript tuple: enforced positions and length
const tsProductEntry: [name: string, price: number] = ["Laptop", 1299.99];
// tsProductEntry[0] = 9999;     // Error: number not assignable to string
// tsProductEntry.push("extra"); // Warning: no overload matches this call (in strict mode)
console.log("TS tuple (safe):", tsProductEntry);

// =====================================
// SECTION 4: COMMON MISTAKES
// =====================================

console.log("\n--- Common Mistakes ---");

// MISTAKE 1: Pushing the wrong type into a typed array
const productPrices: number[] = [9.99, 24.99, 49.99];
// productPrices.push("free"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
// FIX: only push numbers
productPrices.push(99.99);
console.log("Prices after push:", productPrices);

// MISTAKE 2: Wrong tuple order (getting position types wrong)
// type UserRecord = [name: string, age: number];
// const wrongOrder: UserRecord = [25, "Alice"]; // Error: number not assignable to string
// FIX: Always match positions to their declared types
const correctOrder: [name: string, age: number] = ["Alice", 25]; // correct
console.log("Correct tuple order:", correctOrder);

// MISTAKE 3: Accessing a tuple index that doesn't exist
const coordTuple: [number, number] = [10, 20];
// const z = coordTuple[2]; // Error: Tuple type '[number, number]' of length '2' has no element at index '2'
// FIX: Only access valid indices
const x = coordTuple[0];
const y = coordTuple[1];
console.log("Coord x:", x, "y:", y);

// MISTAKE 4: Forgetting that find() returns T | undefined
const foundProduct: Product | undefined = inventory.find((p) => p.id === 999);
// console.log(foundProduct.name); // Error: Object is possibly 'undefined'
// FIX: check for undefined first
if (foundProduct) {
  console.log("Found product:", foundProduct.name);
} else {
  console.log("Product not found -- handled safely");
}

// MISTAKE 5: Mutating a readonly array or tuple
const readonlyPrices: readonly number[] = [9.99, 24.99];
// readonlyPrices.push(49.99); // Error: Property 'push' does not exist on type 'readonly number[]'
// FIX: create a new array if you need to add elements
const updatedPrices: number[] = [...readonlyPrices, 49.99];
console.log("Updated prices (new array):", updatedPrices);

// MISTAKE 6: Treating reduce's accumulator as the wrong type
// const badResult = inventory.reduce((acc, p) => acc + p.name, 0);  // TypeScript would flag this
// FIX: TypeScript infers the return type from the initializer -- make sure they match
const totalValue: number = inventory.reduce((acc: number, p: Product) => acc + p.price, 0);
console.log("Total value:", totalValue.toFixed(2));

// =====================================
// SECTION 5: BEST PRACTICES
// =====================================

console.log("\n--- Best Practices ---");

// BEST PRACTICE 1: Prefer string[] over Array<string> for readability (personal/team choice)
// Both are equivalent -- pick one style and be consistent.
const goodStyle: string[] = ["a", "b", "c"];     // preferred shorthand
const alsoGood: Array<string> = ["a", "b", "c"]; // generic form, equally valid

// BEST PRACTICE 2: Use interfaces for array-of-objects instead of inline types
// BAD (hard to reuse):
const badProducts: { id: number; name: string }[] = [{ id: 1, name: "A" }];

// GOOD (reusable, self-documenting):
interface CartProduct {
  id: number;
  name: string;
  price: number;
}
const goodProducts: CartProduct[] = [{ id: 1, name: "Laptop", price: 1299.99 }];
console.log("Products with interface type:", goodProducts);

// BEST PRACTICE 3: Use readonly arrays for constants and function parameters
//                  that should not be mutated inside the function
function printAllProducts(products: readonly Product[]): void {
  // products.push(...); // TypeScript prevents this -- we promised not to mutate
  products.forEach((p) => console.log(`  - ${p.name}: $${p.price}`));
}
console.log("Products (readonly param):");
printAllProducts(inventory.slice(0, 3));

// BEST PRACTICE 4: Use named tuples for self-documenting return values
function getCartTotals(items: OrderLineItem[]): [subtotal: number, tax: number, total: number] {
  const actualSubtotal = items.reduce(
    (sum: number, [, , qty, price]: OrderLineItem): number => sum + qty * price,
    0
  );
  const tax = actualSubtotal * 0.1;
  const total = actualSubtotal + tax;
  return [actualSubtotal, tax, total];
}
const [subtotal, tax, total] = getCartTotals([lineItem1, lineItem2, lineItem3]);
console.log(`Cart - Subtotal: $${subtotal.toFixed(2)}, Tax: $${tax.toFixed(2)}, Total: $${total.toFixed(2)}`);

// BEST PRACTICE 5: Prefer tuples over plain arrays for fixed-structure data records
// BAD: relies on convention, no compile-time safety
const badCoord: number[] = [23.8103, 90.4125]; // which is lat? which is lng?

// GOOD: self-documenting, type-safe positions
const goodCoord: [lat: number, lng: number] = [23.8103, 90.4125]; // clear!
console.log("Good coord:", goodCoord);

// BEST PRACTICE 6: Use type guards when filtering union type arrays
const items: (string | number)[] = ["Alice", 1, "Bob", 2, "Carol", 3];
// Use a type predicate to get a properly typed result array
const strings: string[] = items.filter((item): item is string => typeof item === "string");
const numbers: number[] = items.filter((item): item is number => typeof item === "number");
console.log("Strings:", strings);
console.log("Numbers:", numbers);

// =====================================
// SECTION 6: INTERVIEW QUESTIONS
// =====================================

/*
INTERVIEW QUESTION 1:
  Q: What is the difference between string[] and Array<string> in TypeScript?
  A: They are functionally identical. Both declare a typed array of strings.
     string[] is shorthand (preferred by most style guides), Array<string> is the
     generic form. The choice is stylistic -- many teams standardize on one form
     for consistency. The compiler treats them exactly the same way.

INTERVIEW QUESTION 2:
  Q: What is the difference between a TypeScript tuple and a regular array?
  A: A regular array (string[]) is variable-length and every element must be the same type.
     A tuple ([string, number]) has a fixed length and each position has its own specific type.
     Tuples are best for structured records like [name, age] or [lat, lng] where position
     carries semantic meaning. Arrays are for homogeneous collections of unknown length.

INTERVIEW QUESTION 3:
  Q: Why would you use readonly string[] instead of string[] for a function parameter?
  A: Using readonly string[] signals to callers that the function will not mutate the array
     (no push, pop, splice, etc.). This makes the function safer to use with arrays you don't
     want modified. It also allows callers to pass readonly arrays -- TypeScript would
     reject passing a readonly array to a function that expects a mutable string[].
     It enforces the principle of least surprise and prevents defensive copying.

INTERVIEW QUESTION 4:
  Q: What are optional and rest elements in tuples, and when would you use them?
  A: Optional elements ([string, number?]) allow trailing positions to be omitted.
     Use them when some tuple fields are not always present (e.g., a middle name).
     Rest elements ([string, ...number[]]) allow a variable number of trailing elements
     all of the same type. Use them when the first few positions are fixed (e.g., a label)
     but the rest is open-ended (e.g., [label, ...scores]). Optional elements must come
     after required ones; rest elements must be the final element.
*/

// =====================================
// SECTION 7: PRACTICE TASKS
// =====================================

console.log("\n--- Practice Tasks ---");

// -------------------------------------------------------
// PRACTICE TASK 1:
// You have a product inventory array. Write a function that:
//   a) Filters out all out-of-stock products (stock === 0)
//   b) Applies a 10% discount to all remaining products
//   c) Returns an array of strings in the format "ProductName: $newPrice"
// -------------------------------------------------------

function getDiscountedInStockLabels(products: Product[]): string[] {
  return products
    .filter((p: Product): boolean => p.stock > 0)
    .map((p: Product): Product => ({ ...p, price: p.price * 0.9 }))
    .map((p: Product): string => `${p.name}: $${p.price.toFixed(2)}`);
}

const discountedLabels: string[] = getDiscountedInStockLabels(inventory);
console.log("Task 1 - Discounted in-stock products:");
discountedLabels.forEach((label) => console.log(" ", label));

// -------------------------------------------------------
// PRACTICE TASK 2:
// Create a type alias for a cart item as a named tuple:
//   [productId: number, productName: string, quantity: number, unitPrice: number]
// Then write a function that accepts an array of these tuples and returns
// a tuple [itemCount: number, totalCost: number].
// -------------------------------------------------------

type CartItemTuple = [
  productId: number,
  productName: string,
  quantity: number,
  unitPrice: number
];

function summariseCart(
  cartItems: CartItemTuple[]
): [itemCount: number, totalCost: number] {
  const itemCount = cartItems.reduce(
    (count: number, [, , qty]: CartItemTuple): number => count + qty,
    0
  );
  const totalCost = cartItems.reduce(
    (cost: number, [, , qty, price]: CartItemTuple): number => cost + qty * price,
    0
  );
  return [itemCount, totalCost];
}

const myCart: CartItemTuple[] = [
  [101, "Laptop Pro", 1, 1299.99],
  [102, "Wireless Mouse", 2, 29.99],
  [103, "USB-C Hub", 3, 49.99],
];

const [totalItems, cartTotal] = summariseCart(myCart);
console.log(`Task 2 - Cart: ${totalItems} items, total: $${cartTotal.toFixed(2)}`);

// -------------------------------------------------------
// PRACTICE TASK 3:
// You receive a list of users as an array of objects.
// Write a function that:
//   a) Accepts a readonly User[] so the original array is not mutated
//   b) Returns a new array containing only active users
//   c) Each element in the returned array should be a named tuple:
//      [userId: number, displayName: string, email: string]
//   d) Sort the result alphabetically by displayName
// -------------------------------------------------------

type UserTuple = [userId: number, displayName: string, email: string];

function getActiveUserTuples(allUsers: readonly User[]): UserTuple[] {
  return allUsers
    .filter((u: User): boolean => u.isActive)
    .map((u: User): UserTuple => [u.id, u.name, u.email])
    .sort(([, nameA]: UserTuple, [, nameB]: UserTuple): number =>
      nameA.localeCompare(nameB)
    );
}

// Extend the users array for a richer example
const allUsers: readonly User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", isActive: true },
  { id: 2, name: "Bob Smith", email: "bob@example.com", isActive: false },
  { id: 3, name: "Carol White", email: "carol@example.com", isActive: true },
  { id: 4, name: "Dave Brown", email: "dave@example.com", isActive: false },
  { id: 5, name: "Eve Davis", email: "eve@example.com", isActive: true },
];

const activeUserTuples: UserTuple[] = getActiveUserTuples(allUsers);
console.log("Task 3 - Active users (sorted, as tuples):");
activeUserTuples.forEach(([id, name, email]: UserTuple) => {
  console.log(`  [${id}] ${name} <${email}>`);
});

// =====================================
// END OF FILE: 03-arrays-tuples.ts
// =====================================
