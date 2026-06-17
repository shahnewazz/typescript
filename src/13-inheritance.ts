// =====================================
// 13 - INHERITANCE IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers learning TypeScript from scratch.
// This file is self-contained and fully runnable.

// =====================================
// WHAT IS INHERITANCE
// =====================================

// Inheritance is a mechanism where one class (child/subclass) acquires
// the properties and methods of another class (parent/superclass).
//
// WHY IT EXISTS:
//   - Avoids code duplication: common logic lives in one place
//   - Models "is-a" relationships (AdminUser IS-A BaseUser)
//   - Enables polymorphism: treat different types uniformly through a shared interface
//
// In JavaScript, "extends" already existed (ES6 classes).
// TypeScript adds:
//   - Type-checking on inherited properties and methods
//   - The "override" keyword (TS 4.3+) for explicit method overriding
//   - Abstract classes and abstract methods
//   - Access modifiers (private, protected, public) that are enforced at compile time
//   - Interface enforcement via "implements"

// =====================================
// BASIC INHERITANCE
// =====================================

// SYNTAX:
//   class Child extends Parent {
//     constructor(...) {
//       super(...);   // MUST call super() before using "this"
//     }
//   }

class BaseUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  getInfo(): string {
    return `User #${this.id}: ${this.name} <${this.email}>`;
  }

  isActive(): boolean {
    return true; // default: all users are active
  }

  greet(): string {
    return `Hello, ${this.name}!`;
  }
}

// Child class inherits all properties and methods of BaseUser
class GuestUser extends BaseUser {
  sessionToken: string;

  constructor(id: number, name: string, email: string, sessionToken: string) {
    super(id, name, email); // must call super() first — passes args up to parent
    this.sessionToken = sessionToken;
  }

  // GuestUser adds its own method
  getSessionInfo(): string {
    return `Guest session: ${this.sessionToken}`;
  }
}

const guest = new GuestUser(1, "Alice", "alice@example.com", "sess_abc123");
console.log(guest.getInfo());       // inherited from BaseUser
console.log(guest.greet());         // inherited from BaseUser
console.log(guest.getSessionInfo()); // own method

// =====================================
// super() IN CONSTRUCTOR
// =====================================

// WHY:
//   When a child class has a constructor, JavaScript/TypeScript requires
//   you to call super() BEFORE accessing "this". If you forget, you get:
//   "ReferenceError: Must call super constructor before accessing 'this'"
//
// super() passes arguments to the parent constructor so it can initialize
// the parent's own properties.

class CustomerUser extends BaseUser {
  loyaltyPoints: number;
  tier: "bronze" | "silver" | "gold";

  constructor(id: number, name: string, email: string, loyaltyPoints: number) {
    super(id, name, email); // initialize BaseUser fields first
    this.loyaltyPoints = loyaltyPoints;
    this.tier = this.calculateTier(loyaltyPoints);
  }

  private calculateTier(points: number): "bronze" | "silver" | "gold" {
    if (points >= 1000) return "gold";
    if (points >= 500) return "silver";
    return "bronze";
  }

  getCustomerInfo(): string {
    return `${this.getInfo()} | Tier: ${this.tier} | Points: ${this.loyaltyPoints}`;
  }
}

const customer = new CustomerUser(2, "Bob", "bob@example.com", 750);
console.log(customer.getCustomerInfo());
// User #2: Bob <bob@example.com> | Tier: silver | Points: 750

// =====================================
// OVERRIDING PARENT METHODS
// =====================================

// A child class can OVERRIDE (replace) a method inherited from the parent.
// The child's version runs instead of the parent's.
//
// WHY:
//   Different subclasses may need different behavior for the same action.
//   AdminUser.greet() can return a different message than BaseUser.greet().

class AdminUser extends BaseUser {
  role: "superadmin" | "moderator";
  permissions: string[];

  constructor(
    id: number,
    name: string,
    email: string,
    role: "superadmin" | "moderator",
    permissions: string[]
  ) {
    super(id, name, email);
    this.role = role;
    this.permissions = permissions;
  }

  // Override greet() from BaseUser
  greet(): string {
    return `Hello, Admin ${this.name}! Role: ${this.role}`;
  }

  // Override getInfo() from BaseUser
  getInfo(): string {
    return `${super.getInfo()} [ADMIN: ${this.role}]`;
    //       ^^^^ super.getInfo() calls the PARENT version, then we append more
  }

  hasPermission(perm: string): boolean {
    return this.permissions.includes(perm);
  }
}

const admin = new AdminUser(3, "Carol", "carol@example.com", "superadmin", [
  "read",
  "write",
  "delete",
]);
console.log(admin.greet());    // overridden version
console.log(admin.getInfo()); // uses super.getInfo() + appends
console.log(admin.hasPermission("delete")); // true

// =====================================
// super.method() — CALLING PARENT METHODS
// =====================================

// WHY:
//   Sometimes you want to EXTEND the parent behavior rather than fully replace it.
//   super.method() runs the parent's version, then you add your own logic on top.
//
// SYNTAX:
//   override someMethod(): ReturnType {
//     const parentResult = super.someMethod();
//     // ... add extra behavior
//     return parentResult + " extra";
//   }

class VIPCustomerUser extends CustomerUser {
  vipCode: string;

  constructor(
    id: number,
    name: string,
    email: string,
    loyaltyPoints: number,
    vipCode: string
  ) {
    super(id, name, email, loyaltyPoints);
    this.vipCode = vipCode;
  }

  // Extend getCustomerInfo from CustomerUser
  getCustomerInfo(): string {
    const base = super.getCustomerInfo(); // call CustomerUser's version
    return `${base} | VIP Code: ${this.vipCode}`;
  }
}

const vip = new VIPCustomerUser(4, "Dave", "dave@example.com", 1500, "VIP-007");
console.log(vip.getCustomerInfo());
// User #4: Dave <dave@example.com> | Tier: gold | Points: 1500 | VIP Code: VIP-007

// =====================================
// THE override KEYWORD (TypeScript 4.3+)
// =====================================

// WHY IT EXISTS:
//   Without "override", if the parent renames a method, the child silently
//   stops overriding it — TypeScript would not warn you. The "override" keyword
//   makes the intent explicit: "this method MUST exist in the parent."
//   If the parent method is removed or renamed, TypeScript throws a compile error.
//
// ENABLING IT:
//   In tsconfig.json set: "noImplicitOverride": true
//   This forces ALL overrides to use the "override" keyword.
//
// SYNTAX:
//   override methodName(): ReturnType { ... }

class PremiumCustomerUser extends CustomerUser {
  discountRate: number;

  constructor(
    id: number,
    name: string,
    email: string,
    loyaltyPoints: number,
    discountRate: number
  ) {
    super(id, name, email, loyaltyPoints);
    this.discountRate = discountRate;
  }

  // "override" explicitly marks this as overriding BaseUser.greet()
  override greet(): string {
    return `Welcome back, Premium Member ${this.name}! Your discount: ${this.discountRate}%`;
  }

  // "override" on isActive — PremiumCustomerUser is always active
  override isActive(): boolean {
    return true;
  }
}

const premium = new PremiumCustomerUser(5, "Eve", "eve@example.com", 2000, 15);
console.log(premium.greet());
// Welcome back, Premium Member Eve! Your discount: 15%

// =====================================
// instanceof — CHECKING INHERITANCE
// =====================================

// instanceof checks if an object is an instance of a class OR any of its parents.
//
// WHY:
//   Useful for runtime type-narrowing — choosing behavior based on what kind
//   of object you actually have.

const users: BaseUser[] = [
  new GuestUser(10, "Frank", "frank@example.com", "sess_xyz"),
  new CustomerUser(11, "Grace", "grace@example.com", 300),
  new AdminUser(12, "Heidi", "heidi@example.com", "moderator", ["read"]),
];

for (const user of users) {
  console.log(`\n--- ${user.name} ---`);
  console.log("Is BaseUser?", user instanceof BaseUser);      // always true
  console.log("Is GuestUser?", user instanceof GuestUser);
  console.log("Is CustomerUser?", user instanceof CustomerUser);
  console.log("Is AdminUser?", user instanceof AdminUser);

  // TypeScript narrows the type inside instanceof checks
  if (user instanceof AdminUser) {
    console.log("Admin role:", user.role); // TypeScript knows this is AdminUser
  } else if (user instanceof CustomerUser) {
    console.log("Loyalty points:", user.loyaltyPoints);
  } else if (user instanceof GuestUser) {
    console.log("Session:", user.sessionToken);
  }
}

// =====================================
// ABSTRACT CLASSES
// =====================================

// An ABSTRACT CLASS is a blueprint that CANNOT be instantiated directly.
// It exists only to be extended by concrete (non-abstract) subclasses.
//
// WHY ABSTRACT CLASSES EXIST:
//   Some classes represent concepts too general to be useful on their own.
//   You never want a plain "BasePayment" object — you always want a
//   CreditCardPayment, PayPalPayment, or CryptoPayment.
//   Abstract classes enforce that subclasses provide specific implementations.
//
// ABSTRACT vs INTERFACE:
//   Use ABSTRACT CLASS when:
//     - You want to share CODE (not just type shapes) between subclasses
//     - You need a constructor with shared initialization logic
//     - You want a mix of fully implemented methods + required-to-implement methods
//   Use INTERFACE when:
//     - You only care about the SHAPE (what methods/properties exist)
//     - Multiple unrelated classes should share the same shape
//     - You need multiple "inheritance" (a class can implement many interfaces)
//
// SYNTAX:
//   abstract class Name {
//     abstract abstractMethod(): ReturnType;  // no body — subclass MUST implement
//     concreteMethod(): ReturnType { ... }    // has a body — subclass INHERITS it
//   }

abstract class BasePayment {
  readonly id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;

  constructor(amount: number, currency: string = "USD") {
    this.id = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.amount = amount;
    this.currency = currency;
    this.status = "pending";
    this.createdAt = new Date();
  }

  // ABSTRACT method — every subclass MUST provide its own implementation
  abstract processPayment(): Promise<boolean>;

  // ABSTRACT method — each payment type describes itself differently
  abstract getPaymentDetails(): string;

  // CONCRETE method — shared logic all payment types can use as-is
  getReceipt(): string {
    return `Receipt: ${this.id} | ${this.currency} ${this.amount.toFixed(2)} | Status: ${this.status}`;
  }

  // CONCRETE method with hook for subclasses
  async execute(): Promise<string> {
    console.log(`Processing payment ${this.id}...`);
    const success = await this.processPayment();
    this.status = success ? "completed" : "failed";
    return this.getReceipt();
  }
}

// Attempting to instantiate an abstract class is a compile-time error:
// const pay = new BasePayment(100); // Error: Cannot create an instance of an abstract class.

class CreditCardPayment extends BasePayment {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;

  constructor(
    amount: number,
    currency: string,
    cardNumber: string,
    cardHolder: string,
    expiryDate: string
  ) {
    super(amount, currency);
    this.cardNumber = cardNumber;
    this.cardHolder = cardHolder;
    this.expiryDate = expiryDate;
  }

  // Must implement abstract method
  override async processPayment(): Promise<boolean> {
    // Simulate card charge
    console.log(`Charging card ending in ${this.cardNumber.slice(-4)}...`);
    return true;
  }

  override getPaymentDetails(): string {
    const masked = "*".repeat(12) + this.cardNumber.slice(-4);
    return `Credit Card: ${masked} | Holder: ${this.cardHolder} | Exp: ${this.expiryDate}`;
  }
}

class PayPalPayment extends BasePayment {
  paypalEmail: string;

  constructor(amount: number, currency: string, paypalEmail: string) {
    super(amount, currency);
    this.paypalEmail = paypalEmail;
  }

  override async processPayment(): Promise<boolean> {
    console.log(`Requesting PayPal authorization for ${this.paypalEmail}...`);
    return true;
  }

  override getPaymentDetails(): string {
    return `PayPal: ${this.paypalEmail}`;
  }
}

class CryptoPayment extends BasePayment {
  walletAddress: string;
  cryptoType: "BTC" | "ETH" | "USDC";

  constructor(
    amount: number,
    currency: string,
    walletAddress: string,
    cryptoType: "BTC" | "ETH" | "USDC"
  ) {
    super(amount, currency);
    this.walletAddress = walletAddress;
    this.cryptoType = cryptoType;
  }

  override async processPayment(): Promise<boolean> {
    console.log(`Broadcasting ${this.cryptoType} transaction to ${this.walletAddress}...`);
    return true;
  }

  override getPaymentDetails(): string {
    return `${this.cryptoType} Wallet: ${this.walletAddress.slice(0, 8)}...`;
  }
}

// All three can be treated as BasePayment
async function runPayments() {
  const payments: BasePayment[] = [
    new CreditCardPayment(99.99, "USD", "4111111111111234", "Alice Smith", "12/27"),
    new PayPalPayment(49.50, "USD", "alice@paypal.com"),
    new CryptoPayment(0.005, "BTC", "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", "BTC"),
  ];

  for (const payment of payments) {
    console.log(`\nPayment Details: ${payment.getPaymentDetails()}`);
    const receipt = await payment.execute();
    console.log(receipt);
  }
}

runPayments();

// =====================================
// ABSTRACT PROPERTIES
// =====================================

// Abstract classes can also declare abstract PROPERTIES.
// Subclasses must provide the property (usually as a getter or field).

abstract class BaseProduct {
  id: string;
  name: string;
  price: number;
  stock: number;

  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = 0;
  }

  // Abstract property — every subclass must define its own productType
  abstract readonly productType: string;

  // Abstract method — delivery varies by product type
  abstract calculateDeliveryDate(): Date;

  // Abstract method — SKU format differs per type
  abstract generateSKU(): string;

  // Concrete method shared by all products
  getSummary(): string {
    return `[${this.productType.toUpperCase()}] ${this.name} | $${this.price.toFixed(2)} | SKU: ${this.generateSKU()}`;
  }

  applyDiscount(percent: number): number {
    return this.price * (1 - percent / 100);
  }
}

class PhysicalProduct extends BaseProduct {
  readonly productType = "physical"; // satisfies abstract property
  weightKg: number;
  dimensions: { width: number; height: number; depth: number };

  constructor(
    id: string,
    name: string,
    price: number,
    weightKg: number,
    dimensions: { width: number; height: number; depth: number }
  ) {
    super(id, name, price);
    this.weightKg = weightKg;
    this.dimensions = dimensions;
    this.stock = 100;
  }

  override calculateDeliveryDate(): Date {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 5); // 5 days shipping
    return delivery;
  }

  override generateSKU(): string {
    return `PHY-${this.id.toUpperCase()}-${Math.round(this.weightKg * 1000)}G`;
  }

  getShippingCost(): number {
    return this.weightKg * 2.5; // $2.50 per kg
  }
}

class DigitalProduct extends BaseProduct {
  readonly productType = "digital";
  fileSize: number; // in MB
  downloadUrl: string;

  constructor(
    id: string,
    name: string,
    price: number,
    fileSize: number,
    downloadUrl: string
  ) {
    super(id, name, price);
    this.fileSize = fileSize;
    this.downloadUrl = downloadUrl;
    this.stock = Infinity; // digital products have infinite stock
  }

  override calculateDeliveryDate(): Date {
    return new Date(); // instant delivery
  }

  override generateSKU(): string {
    return `DIG-${this.id.toUpperCase()}-${this.fileSize}MB`;
  }

  getDownloadLink(userId: string): string {
    return `${this.downloadUrl}?user=${userId}&token=${Date.now()}`;
  }
}

class SubscriptionProduct extends BaseProduct {
  readonly productType = "subscription";
  billingCycle: "monthly" | "yearly";
  trialDays: number;

  constructor(
    id: string,
    name: string,
    price: number,
    billingCycle: "monthly" | "yearly",
    trialDays: number = 14
  ) {
    super(id, name, price);
    this.billingCycle = billingCycle;
    this.trialDays = trialDays;
    this.stock = Infinity;
  }

  override calculateDeliveryDate(): Date {
    return new Date(); // access granted immediately
  }

  override generateSKU(): string {
    const cycle = this.billingCycle === "monthly" ? "MO" : "YR";
    return `SUB-${this.id.toUpperCase()}-${cycle}`;
  }

  getAnnualCost(): number {
    return this.billingCycle === "monthly" ? this.price * 12 : this.price;
  }
}

const physBook = new PhysicalProduct("book-001", "TypeScript Handbook", 39.99, 0.5, {
  width: 15,
  height: 21,
  depth: 2,
});
const eCourse = new DigitalProduct("course-001", "TypeScript Masterclass", 79.99, 2048, "https://cdn.example.com/courses/ts");
const saasApp = new SubscriptionProduct("saas-001", "TypeScript IDE Pro", 9.99, "monthly", 14);

console.log("\n--- Product Summaries ---");
console.log(physBook.getSummary());
console.log(eCourse.getSummary());
console.log(saasApp.getSummary());
console.log("Shipping cost for book:", physBook.getShippingCost());
console.log("Annual cost for SaaS:", saasApp.getAnnualCost());
console.log("Download link:", eCourse.getDownloadLink("user_42"));

// =====================================
// ABSTRACT REPOSITORY PATTERN
// =====================================

// A classic real-world use of abstract classes: the Repository pattern.
// The abstract base defines the DATA ACCESS CONTRACT.
// Concrete repositories implement it for a specific data source (DB, API, memory).

interface UserRecord {
  id: number;
  name: string;
  email: string;
}

interface ProductRecord {
  id: string;
  name: string;
  price: number;
}

abstract class BaseRepository<T, ID> {
  protected store: Map<string, T> = new Map();

  // Abstract — subclasses define how to generate an ID
  abstract generateId(): ID;

  // Abstract CRUD contract
  abstract findById(id: ID): T | undefined;
  abstract findAll(): T[];
  abstract save(entity: T): T;
  abstract delete(id: ID): boolean;

  // Concrete utility methods available to all repositories
  count(): number {
    return this.store.size;
  }

  exists(id: ID): boolean {
    return this.findById(id) !== undefined;
  }
}

class UserRepository extends BaseRepository<UserRecord, number> {
  private nextId = 1;

  override generateId(): number {
    return this.nextId++;
  }

  override findById(id: number): UserRecord | undefined {
    return this.store.get(String(id));
  }

  override findAll(): UserRecord[] {
    return Array.from(this.store.values());
  }

  override save(user: UserRecord): UserRecord {
    const id = user.id || this.generateId();
    const record = { ...user, id };
    this.store.set(String(id), record);
    return record;
  }

  override delete(id: number): boolean {
    return this.store.delete(String(id));
  }

  // UserRepository-specific query
  findByEmail(email: string): UserRecord | undefined {
    return this.findAll().find((u) => u.email === email);
  }
}

class ProductRepository extends BaseRepository<ProductRecord, string> {
  override generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  }

  override findById(id: string): ProductRecord | undefined {
    return this.store.get(id);
  }

  override findAll(): ProductRecord[] {
    return Array.from(this.store.values());
  }

  override save(product: ProductRecord): ProductRecord {
    const id = product.id || this.generateId();
    const record = { ...product, id };
    this.store.set(id, record);
    return record;
  }

  override delete(id: string): boolean {
    return this.store.delete(id);
  }

  // ProductRepository-specific query
  findByMaxPrice(maxPrice: number): ProductRecord[] {
    return this.findAll().filter((p) => p.price <= maxPrice);
  }
}

const userRepo = new UserRepository();
const u1 = userRepo.save({ id: 0, name: "Alice", email: "alice@example.com" });
const u2 = userRepo.save({ id: 0, name: "Bob", email: "bob@example.com" });

console.log("\n--- UserRepository ---");
console.log("Total users:", userRepo.count());
console.log("Find by email:", userRepo.findByEmail("alice@example.com"));
console.log("Exists id 1:", userRepo.exists(1));
userRepo.delete(u1.id);
console.log("After delete, total:", userRepo.count());

const productRepo = new ProductRepository();
productRepo.save({ id: "abc", name: "Keyboard", price: 89.99 });
productRepo.save({ id: "def", name: "Mouse", price: 29.99 });
productRepo.save({ id: "ghi", name: "Monitor", price: 349.99 });

console.log("\n--- ProductRepository ---");
console.log("Under $100:", productRepo.findByMaxPrice(100));

// =====================================
// ABSTRACT VALIDATOR PATTERN
// =====================================

// Another classic: abstract validators.
// BaseValidator defines the validation pipeline.
// Concrete validators add domain-specific rules.

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

abstract class BaseValidator<T> {
  protected errors: string[] = [];

  // Subclasses define what rules to apply
  abstract validate(value: T): ValidationResult;

  // Helper shared by all validators
  protected addError(message: string): void {
    this.errors.push(message);
  }

  protected resetErrors(): void {
    this.errors = [];
  }

  protected buildResult(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }
}

class EmailValidator extends BaseValidator<string> {
  override validate(email: string): ValidationResult {
    this.resetErrors();

    if (!email || email.trim().length === 0) {
      this.addError("Email is required.");
    } else {
      if (!email.includes("@")) {
        this.addError("Email must contain '@'.");
      }
      const parts = email.split("@");
      if (parts.length === 2) {
        if (!parts[1].includes(".")) {
          this.addError("Email domain must contain a dot (e.g. example.com).");
        }
        if (parts[0].length === 0) {
          this.addError("Email local part cannot be empty.");
        }
      }
      if (email.length > 254) {
        this.addError("Email must not exceed 254 characters.");
      }
    }

    return this.buildResult();
  }
}

class PasswordValidator extends BaseValidator<string> {
  private minLength: number;
  private requireUppercase: boolean;
  private requireNumber: boolean;
  private requireSpecial: boolean;

  constructor(
    minLength = 8,
    requireUppercase = true,
    requireNumber = true,
    requireSpecial = true
  ) {
    super();
    this.minLength = minLength;
    this.requireUppercase = requireUppercase;
    this.requireNumber = requireNumber;
    this.requireSpecial = requireSpecial;
  }

  override validate(password: string): ValidationResult {
    this.resetErrors();

    if (!password || password.length === 0) {
      this.addError("Password is required.");
      return this.buildResult();
    }

    if (password.length < this.minLength) {
      this.addError(`Password must be at least ${this.minLength} characters.`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      this.addError("Password must contain at least one uppercase letter.");
    }

    if (this.requireNumber && !/[0-9]/.test(password)) {
      this.addError("Password must contain at least one number.");
    }

    if (this.requireSpecial && !/[^a-zA-Z0-9]/.test(password)) {
      this.addError("Password must contain at least one special character.");
    }

    return this.buildResult();
  }
}

const emailValidator = new EmailValidator();
const passwordValidator = new PasswordValidator(10, true, true, true);

console.log("\n--- Email Validation ---");
console.log(emailValidator.validate("alice@example.com"));  // valid
console.log(emailValidator.validate("not-an-email"));       // errors
console.log(emailValidator.validate("missing@dot"));        // errors

console.log("\n--- Password Validation ---");
console.log(passwordValidator.validate("Str0ng!Pass#"));    // valid
console.log(passwordValidator.validate("weak"));            // multiple errors
console.log(passwordValidator.validate("NoSpecial1234"));   // missing special char

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

// JAVASCRIPT (ES6+):
//
//   class Animal {
//     constructor(name) {
//       this.name = name;      // no type annotation
//     }
//     speak() {
//       console.log(`${this.name} makes a sound.`);
//     }
//   }
//
//   class Dog extends Animal {
//     speak() {
//       console.log(`${this.name} barks.`);  // override — no warning if parent renames
//     }
//   }
//
// TYPESCRIPT adds:
//
//   class Animal {
//     name: string;            // explicit type annotation
//     constructor(name: string) { this.name = name; }
//     speak(): void { ... }
//   }
//
//   class Dog extends Animal {
//     override speak(): void { ... }  // compile error if speak() doesn't exist in parent
//   }
//
// TypeScript inheritance improvements over JavaScript:
//   1. Type-checked constructor arguments via super()
//   2. abstract keyword — cannot be replicated in plain JS
//   3. "override" keyword with noImplicitOverride — refactoring safety
//   4. protected access modifier — enforced at compile time
//   5. Interfaces and implements for structural contracts
//   6. Generic base classes (BaseRepository<T, ID>)

// =====================================
// COMPOSITION VS INHERITANCE
// =====================================

// "PREFER COMPOSITION OVER INHERITANCE" is a well-known design principle.
//
// WHY INHERITANCE CAN BE PROBLEMATIC:
//   - Deep chains (A -> B -> C -> D) make code hard to follow
//   - Changes to a parent break all children (fragile base class problem)
//   - "is-a" relationships are often forced; in reality classes share BEHAVIOR
//   - JavaScript/TypeScript only allow single inheritance
//
// WHY COMPOSITION IS OFTEN BETTER:
//   - "has-a" is more flexible than "is-a"
//   - Mix and match behaviors independently
//   - Easier to test in isolation
//
// WHEN INHERITANCE MAKES SENSE:
//   - True "is-a" hierarchy: AdminUser IS-A BaseUser (shares identity)
//   - Sharing implementation, not just shape
//   - Hierarchy is shallow (1-2 levels)
//   - Framework patterns (React.Component, abstract repos, test suites)

// EXAMPLE — Composition approach for behaviors:

// Instead of: class FlyingSwimmingDuck extends FlyingAnimal extends SwimmingAnimal
// Use composition with behavior objects:

interface Flyable {
  fly(): string;
}

interface Swimmable {
  swim(): string;
}

// Behavior implementations (could be plain functions or objects)
const FlyBehavior: Flyable = {
  fly() {
    return "Flap flap — I'm flying!";
  },
};

const SwimBehavior: Swimmable = {
  swim() {
    return "Splash splash — I'm swimming!";
  },
};

const NoFlyBehavior: Flyable = {
  fly() {
    return "I cannot fly.";
  },
};

class Duck {
  name: string;
  private flyBehavior: Flyable;
  private swimBehavior: Swimmable;

  constructor(name: string, flyBehavior: Flyable, swimBehavior: Swimmable) {
    this.name = name;
    this.flyBehavior = flyBehavior;
    this.swimBehavior = swimBehavior;
  }

  performFly(): string {
    return `${this.name}: ${this.flyBehavior.fly()}`;
  }

  performSwim(): string {
    return `${this.name}: ${this.swimBehavior.swim()}`;
  }

  // Behaviors can be changed at RUNTIME — impossible with pure inheritance
  setFlyBehavior(fb: Flyable): void {
    this.flyBehavior = fb;
  }
}

const mallard = new Duck("Mallard", FlyBehavior, SwimBehavior);
const rubber = new Duck("Rubber Duck", NoFlyBehavior, SwimBehavior);

console.log("\n--- Composition Example ---");
console.log(mallard.performFly());
console.log(mallard.performSwim());
console.log(rubber.performFly());

// =====================================
// MIXIN PATTERN
// =====================================

// Mixins let you "mix in" behaviors from multiple sources into a single class.
// This is a popular alternative to deep inheritance chains.
//
// WHY:
//   TypeScript only allows single class inheritance (extends one class).
//   Mixins give you a way to share code across unrelated class hierarchies.
//
// PATTERN:
//   1. Define a "mixin" as a function that takes a base class and returns
//      an extended class.
//   2. Apply multiple mixins to compose behavior.

// A "constructor type" helper
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin: adds timestamp tracking
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    touch(): void {
      this.updatedAt = new Date();
    }
  };
}

// Mixin: adds soft-delete capability
function SoftDeletable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    deletedAt: Date | null = null;

    softDelete(): void {
      this.deletedAt = new Date();
    }

    restore(): void {
      this.deletedAt = null;
    }

    isDeleted(): boolean {
      return this.deletedAt !== null;
    }
  };
}

// Mixin: adds audit logging
function Auditable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private auditLog: string[] = [];

    logAction(action: string): void {
      this.auditLog.push(`[${new Date().toISOString()}] ${action}`);
    }

    getAuditLog(): string[] {
      return [...this.auditLog];
    }
  };
}

// Base class — plain and simple
class BaseEntity {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

// Compose by applying mixins
const AuditableTimestampedEntity = Auditable(Timestamped(BaseEntity));

class Order extends AuditableTimestampedEntity {
  total: number;

  constructor(id: string, total: number) {
    super(id);
    this.total = total;
    this.logAction(`Order ${id} created with total $${total}`);
  }

  updateTotal(newTotal: number): void {
    this.total = newTotal;
    this.touch(); // from Timestamped mixin
    this.logAction(`Total updated to $${newTotal}`); // from Auditable mixin
  }
}

const order = new Order("ORD-001", 150.00);
order.updateTotal(175.00);

console.log("\n--- Mixin Example ---");
console.log("Order ID:", order.id);
console.log("Total:", order.total);
console.log("Created:", order.createdAt);
console.log("Updated:", order.updatedAt);
console.log("Audit log:", order.getAuditLog());

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1: FORGETTING super() IN THE CONSTRUCTOR
// -------------------------------------------------
// class Child extends Parent {
//   constructor() {
//     this.value = 42;  // ERROR: Must call super() before accessing 'this'
//     super();           // super() must come FIRST
//   }
// }

// MISTAKE 2: DEEP INHERITANCE CHAINS
// -----------------------------------
// class A { ... }
// class B extends A { ... }
// class C extends B { ... }
// class D extends C { ... }
// class E extends D { ... }   // Danger zone — fragile, hard to reason about
//
// Fix: Keep hierarchies to 1-2 levels. Use composition for deeper hierarchies.

// MISTAKE 3: NOT USING override (TypeScript 4.3+)
// ------------------------------------------------
// If parent renames "greet()" to "sayHello()", the child's "greet()" silently
// becomes a NEW method, not an override. The bug is invisible.
// Fix: Use the "override" keyword and enable "noImplicitOverride" in tsconfig.

// MISTAKE 4: INSTANTIATING ABSTRACT CLASSES
// ------------------------------------------
// abstract class Base { abstract doWork(): void; }
// const b = new Base(); // Compile Error: Cannot create instance of abstract class
// Fix: Always instantiate the concrete subclass.

// MISTAKE 5: CALLING super.method() WHEN THERE IS NOTHING TO CALL
// ----------------------------------------------------------------
// If you call super.someMethod() and the parent does not have that method,
// TypeScript will catch it at compile time. Good.

// MISTAKE 6: OVERUSING INHERITANCE FOR CODE REUSE
// ------------------------------------------------
// class Logger extends Array { ... }  // Wrong: Logger IS-A Array? No.
// Fix: Use composition — Logger HAS-A array internally.

// =====================================
// BEST PRACTICES
// =====================================

// 1. PREFER COMPOSITION OVER INHERITANCE
//    Unless there is a true "is-a" relationship, favor composition.
//    AdminUser IS-A BaseUser: OK.
//    OrderService HAS-A Logger: use composition, not inheritance.

// 2. KEEP HIERARCHIES SHALLOW
//    Aim for 1-2 levels of inheritance. More than 3 is usually a design smell.

// 3. USE abstract FOR TRUE BLUEPRINTS
//    If a class should never be used directly, make it abstract.
//    This communicates intent and prevents accidental instantiation.

// 4. ALWAYS USE override (enable noImplicitOverride in tsconfig)
//    Makes intent explicit and guards against silent bugs when parents change.

// 5. CALL super() FIRST
//    In any constructor of a child class, super() must be the first statement.

// 6. PROGRAM TO THE ABSTRACTION
//    Accept BasePayment, not CreditCardPayment, in function parameters.
//    This makes code extensible — add new payment types without changing callers.

// 7. AVOID BREAKING THE LISKOV SUBSTITUTION PRINCIPLE (LSP)
//    A subclass should be substitutable for its parent without breaking behavior.
//    If you find yourself throwing in a method override, that is an LSP violation.

function printPaymentInfo(payment: BasePayment): void {
  // Works for ANY payment type — extensible by design
  console.log(payment.getPaymentDetails());
  console.log(payment.getReceipt());
}

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between abstract classes and interfaces in TypeScript?
//
// A: Abstract classes can contain both implemented (concrete) methods and
//    abstract methods. They allow sharing code between subclasses and support
//    constructors with initialization logic. A class can only extend ONE abstract class.
//    Interfaces only define the SHAPE (contract) — no implementation.
//    A class can implement MULTIPLE interfaces. Use abstract classes when you
//    need shared code; use interfaces when you only need a contract.

// Q2: Why must you call super() before using "this" in a child constructor?
//
// A: In JavaScript's class model, the parent constructor is responsible for
//    creating and initializing the object (setting up "this"). Until super()
//    runs, "this" does not technically exist. Accessing it first causes a
//    ReferenceError. TypeScript enforces this at compile time.

// Q3: What does the "override" keyword do and why was it added in TypeScript 4.3?
//
// A: "override" explicitly marks a method as overriding one from a parent class.
//    Without it, if the parent renames or removes a method, the child's version
//    silently becomes a NEW method instead of an override — a hard-to-find bug.
//    With "override" (and "noImplicitOverride: true" in tsconfig), TypeScript
//    will error if the parent method no longer exists, catching the bug at compile time.

// Q4: Explain the "prefer composition over inheritance" principle.
//
// A: Inheritance models "is-a" relationships and shares implementation.
//    Composition models "has-a" relationships and assembles behavior from parts.
//    Composition is preferred because: it avoids the fragile base class problem
//    (changes to parent break children), it sidesteps single-inheritance limits,
//    it makes units independently testable, and it avoids forcing "is-a" when
//    only behavior sharing is needed. Inheritance is appropriate for true "is-a"
//    hierarchies with shallow depth (1-2 levels).

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1: VEHICLE HIERARCHY
// -------------------------
// Create an abstract class BaseVehicle with:
//   - Properties: make, model, year, fuelType
//   - Abstract method: getRange(): number  (km on a full tank/charge)
//   - Abstract method: refuel(): string
//   - Concrete method: getAge(): number  (current year - year)
//   - Concrete method: describe(): string
//
// Implement three subclasses:
//   - PetrolCar: has tankLiters, fuelEfficiency (km/L). Implements getRange and refuel.
//   - ElectricCar: has batteryKWh, rangePerKWh (km/kWh). Implements getRange and refuel.
//   - HybridCar: has both a battery and tank. getRange() combines both.
//
// Test: create one of each and call describe(), getRange(), and refuel().

// TASK 2: NOTIFICATION SYSTEM WITH MIXINS
// ----------------------------------------
// Define a BaseNotification class with: id, message, createdAt, status.
// Apply a Retryable mixin that adds: retryCount, maxRetries, retry() method.
// Apply a Loggable mixin that adds: logDelivery(channel: string) method.
//
// Create EmailNotification and SMSNotification classes that extend the
// composed base. Each should have a send() method returning a string.
//
// Test: create one of each, send them, retry a failed one, and print the log.

// TASK 3: E-COMMERCE ORDER PIPELINE
// ----------------------------------
// Create an abstract BaseOrderProcessor with:
//   - Abstract methods: validate(order: Order): boolean
//                       calculateTotal(order: Order): number
//                       process(order: Order): string
//   - Concrete method: run(order: Order): string — calls validate, then
//     calculateTotal, then process in sequence
//
// Implement:
//   - StandardOrderProcessor: no discount, standard shipping
//   - PrimeOrderProcessor: 10% discount, free shipping
//   - WholesaleOrderProcessor: 25% discount, minimum order $500
//
// Test: create a sample order object and run it through all three processors.
// Observe how the same "order" data produces different totals based on processor.
