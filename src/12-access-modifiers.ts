// =====================================
// 12 - ACCESS MODIFIERS IN TYPESCRIPT
// =====================================

// Target audience: JavaScript developers learning TypeScript from scratch.
// This file is self-contained and fully runnable.

// Access modifiers control WHERE a class member (property or method) can be
// accessed from. JavaScript has NO built-in access modifiers — TypeScript
// adds them as a compile-time safety layer on top.
//
// Modifiers covered in this file:
//   public     — accessible from anywhere (the default)
//   private    — accessible only inside the class that declares it
//   protected  — accessible inside the class AND its subclasses
//   readonly   — can be set once, never changed after that
//   static     — belongs to the class itself, not to any instance
//   abstract   — must be implemented by a concrete subclass
//   override   — marks an intentional override in a subclass
//   #field     — ECMAScript truly-private field (runtime enforcement)

// =====================================
// JAVASCRIPT VS TYPESCRIPT COMPARISON
// =====================================

// In plain JavaScript there are NO access modifiers.
// Developers used conventions like leading underscores (_name) to signal
// "please treat this as private" but nothing stopped anyone from accessing it.
//
// JavaScript (no enforcement):
// class Person {
//   constructor(name) {
//     this._name = name;   // underscore is just a naming convention
//   }
// }
// const p = new Person("Alice");
// console.log(p._name);  // works fine — no error
//
// TypeScript compiles access modifiers AWAY when it generates JavaScript, so
// at runtime the compiled JS has none of them. TypeScript private is purely
// a COMPILE-TIME check. The # field (ECMAScript private) is different — it
// survives compilation and IS enforced at runtime.

// =====================================
// PUBLIC MODIFIER
// =====================================

// WHAT IT IS:
//   The default modifier. A public member is accessible from anywhere:
//   inside the class, in subclasses, and from outside code.
//
// WHY IT EXISTS:
//   Explicitly documenting that a member is part of the public API.
//   Writing "public" is optional but improves readability.
//
// SYNTAX:
//   public propertyName: type;
//   public methodName(): returnType { ... }

class Car {
  public brand: string;   // explicitly public
  model: string;          // implicitly public — same thing

  constructor(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
  }

  public describe(): string {
    return `${this.brand} ${this.model}`;
  }
}

const car = new Car("Toyota", "Camry");
console.log(car.brand);        // "Toyota"   — accessible from outside
console.log(car.model);        // "Camry"
console.log(car.describe());   // "Toyota Camry"

// PRACTICAL EXAMPLE — UserAccount (public members)
class UserAccountPublicDemo {
  public name: string;
  public email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  public greet(): string {
    return `Hello, ${this.name}!`;
  }
}

const user1 = new UserAccountPublicDemo("Alice", "alice@example.com");
console.log(user1.greet());   // "Hello, Alice!"
console.log(user1.name);      // "Alice" — public, accessible anywhere

// =====================================
// PRIVATE MODIFIER
// =====================================

// WHAT IT IS:
//   A private member can ONLY be accessed inside the class that declares it.
//   No outside code, no subclass — only the declaring class itself.
//
// WHY IT EXISTS:
//   Encapsulation — hide internal details. External code should interact
//   through a controlled interface (getters, methods), not raw fields.
//
// SYNTAX:
//   private propertyName: type;
//   private methodName(): returnType { ... }
//
// IMPORTANT: TypeScript private is a COMPILE-TIME check only.
//   After compilation to JavaScript, the compiled output has no private keyword.
//   Accessing the property directly in JS at runtime is technically still
//   possible. Use # (ECMAScript private) when runtime enforcement is needed.

class BankAccount {
  private balance: number;  // cannot be accessed from outside
  public owner: string;

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount <= 0) {
      console.log("Deposit amount must be positive.");
      return;
    }
    this.balance += amount;
    console.log(`Deposited $${amount}. New balance: $${this.balance}`);
  }

  public withdraw(amount: number): void {
    if (amount <= 0) {
      console.log("Withdrawal amount must be positive.");
      return;
    }
    if (amount > this.balance) {
      console.log("Insufficient funds.");
      return;
    }
    this.balance -= amount;
    console.log(`Withdrew $${amount}. Remaining balance: $${this.balance}`);
  }

  public getBalance(): number {
    return this.balance;  // controlled read access
  }
}

const account = new BankAccount("Bob", 1000);
account.deposit(500);      // Deposited $500. New balance: $1500
account.withdraw(200);     // Withdrew $200. Remaining balance: $1300
console.log(account.getBalance());  // 1300

// account.balance = 9999; // ERROR at compile time — private property
// console.log(account.balance);    // ERROR at compile time

// PRACTICAL EXAMPLE — PaymentGateway with private apiKey
class PaymentGateway {
  private apiKey: string;
  public gatewayName: string;

  constructor(gatewayName: string, apiKey: string) {
    this.gatewayName = gatewayName;
    this.apiKey = apiKey;
  }

  public processPayment(amount: number): void {
    // apiKey is used internally — never exposed outside
    const masked = this.apiKey.slice(0, 4) + "****";
    console.log(`[${this.gatewayName}] Processing $${amount} with key ${masked}`);
  }

  private validateKey(): boolean {
    return this.apiKey.length >= 16;  // private helper method
  }

  public isReady(): boolean {
    return this.validateKey();  // public method calls private method — allowed
  }
}

const gateway = new PaymentGateway("Stripe", "sk_live_abcd1234efgh5678");
gateway.processPayment(99.99);    // [Stripe] Processing $99.99 with key sk_l****
console.log(gateway.isReady());   // true
// console.log(gateway.apiKey);   // ERROR — private

// =====================================
// PROTECTED MODIFIER
// =====================================

// WHAT IT IS:
//   A protected member is accessible inside the declaring class AND in any
//   class that EXTENDS it (subclasses). It is NOT accessible from outside.
//
// WHY IT EXISTS:
//   Inheritance hierarchies often need to share internals between a base class
//   and derived classes without exposing those internals to the world.
//
// SYNTAX:
//   protected propertyName: type;
//   protected methodName(): returnType { ... }

class ProductInventory {
  protected stock: number;
  public productName: string;

  constructor(productName: string, initialStock: number) {
    this.productName = productName;
    this.stock = initialStock;
  }

  public getStock(): number {
    return this.stock;  // public read access
  }

  protected adjustStock(delta: number): void {
    this.stock += delta;
    console.log(`[${this.productName}] Stock adjusted by ${delta}. Current: ${this.stock}`);
  }
}

class WarehouseProduct extends ProductInventory {
  private location: string;

  constructor(productName: string, initialStock: number, location: string) {
    super(productName, initialStock);
    this.location = location;
  }

  public receiveShipment(units: number): void {
    // subclass CAN access protected member
    this.adjustStock(units);
    console.log(`Shipment received at ${this.location}`);
  }

  public sell(units: number): void {
    if (units > this.stock) {  // protected stock accessible here
      console.log("Not enough stock to complete sale.");
      return;
    }
    this.adjustStock(-units);
  }
}

const widget = new WarehouseProduct("Widget A", 100, "Aisle 3");
widget.receiveShipment(50);   // Stock adjusted by 50. Current: 150
widget.sell(30);              // Stock adjusted by -30. Current: 120
console.log(widget.getStock());  // 120
// widget.stock = 999;        // ERROR — protected, not accessible outside
// widget.adjustStock(10);    // ERROR — protected, not accessible outside

// PRACTICAL EXAMPLE — OrderProcessor with protected methods
class OrderProcessor {
  protected orderId: string;

  constructor(orderId: string) {
    this.orderId = orderId;
  }

  protected log(message: string): void {
    console.log(`[Order ${this.orderId}] ${message}`);
  }

  protected validate(amount: number): boolean {
    return amount > 0 && amount < 100000;
  }
}

class PremiumOrderProcessor extends OrderProcessor {
  private discount: number;

  constructor(orderId: string, discount: number) {
    super(orderId);
    this.discount = discount;
  }

  public processOrder(amount: number): void {
    if (!this.validate(amount)) {   // protected method from parent
      this.log("Invalid order amount.");  // protected method from parent
      return;
    }
    const finalAmount = amount * (1 - this.discount);
    this.log(`Processed. Original: $${amount}, After ${this.discount * 100}% discount: $${finalAmount}`);
  }
}

const processor = new PremiumOrderProcessor("ORD-001", 0.1);
processor.processOrder(500);
// [Order ORD-001] Processed. Original: $500, After 10% discount: $450

// =====================================
// READONLY MODIFIER
// =====================================

// WHAT IT IS:
//   A readonly property can be assigned ONCE (during declaration or in the
//   constructor) and never changed after that. It is immutable after init.
//
// WHY IT EXISTS:
//   Some values — like an ID, a creation timestamp, or a configuration key —
//   should never change after the object is created. readonly enforces this.
//
// SYNTAX:
//   readonly propertyName: type;
//
// NOTE: readonly is a TypeScript concept. The compiled JS uses const or just
//   a normal property with no runtime immutability guarantee for objects.
//   For true runtime immutability use Object.freeze().

class UserAccount {
  readonly id: string;        // set once in constructor, never changed
  public name: string;
  private password: string;   // private — not accessible outside

  constructor(id: string, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  public updateName(newName: string): void {
    this.name = newName;   // allowed — name is not readonly
    // this.id = "new-id"; // ERROR — id is readonly
  }

  public checkPassword(input: string): boolean {
    return this.password === input;  // internal use only
  }

  public describe(): string {
    return `User[${this.id}]: ${this.name}`;
  }
}

const alice = new UserAccount("USR-001", "Alice", "s3cur3P@ss");
console.log(alice.id);            // "USR-001"
console.log(alice.describe());    // "User[USR-001]: Alice"
alice.updateName("Alice Smith");
console.log(alice.describe());    // "User[USR-001]: Alice Smith"
// alice.id = "USR-002";         // ERROR — cannot assign to readonly property
// alice.password = "hacked";    // ERROR — private

// readonly with arrays — the reference is readonly, not array contents
class Config {
  readonly allowedRoles: string[] = ["admin", "editor", "viewer"];

  addRole(role: string): void {
    this.allowedRoles.push(role);  // allowed — array contents are mutable
    // this.allowedRoles = [];    // ERROR — cannot reassign readonly reference
  }
}

const config = new Config();
config.addRole("moderator");
console.log(config.allowedRoles);  // ["admin", "editor", "viewer", "moderator"]

// =====================================
// PARAMETER PROPERTIES
// =====================================

// WHAT IT IS:
//   A shorthand syntax that declares AND assigns a class property directly
//   in the constructor parameters. Add a modifier (public/private/protected/
//   readonly) to a constructor parameter and TypeScript automatically:
//     1. Declares a property with that name and modifier
//     2. Assigns the parameter value to it
//
// WHY IT EXISTS:
//   Eliminates the repetitive boilerplate of declaring a field, then listing
//   it in the constructor signature, then assigning it.
//
// SYNTAX:
//   constructor(private name: string, public age: number) { }

// WITHOUT parameter properties (verbose):
class PersonVerbose {
  private name: string;
  public age: number;
  readonly id: string;

  constructor(name: string, age: number, id: string) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}

// WITH parameter properties (concise — exactly the same result):
class Person {
  constructor(
    private name: string,    // declares private this.name
    public age: number,      // declares public this.age
    readonly id: string      // declares readonly this.id
  ) {}  // constructor body is empty — assignments happen automatically

  public introduce(): string {
    return `Hi, I am ${this.name}, age ${this.age} (ID: ${this.id})`;
  }
}

const bob = new Person("Bob", 30, "P-001");
console.log(bob.introduce());  // "Hi, I am Bob, age 30 (ID: P-001)"
console.log(bob.age);          // 30   — public
// console.log(bob.name);      // ERROR — private
// bob.id = "P-999";           // ERROR — readonly

// Parameter properties with all four modifiers together:
class Product {
  constructor(
    public readonly sku: string,      // public AND readonly
    private price: number,
    protected category: string,
    public name: string
  ) {}

  public getInfo(): string {
    return `[${this.sku}] ${this.name} — $${this.price} (${this.category})`;
  }
}

const laptop = new Product("SKU-001", 999, "Electronics", "Laptop Pro");
console.log(laptop.getInfo());  // [SKU-001] Laptop Pro — $999 (Electronics)
console.log(laptop.sku);        // "SKU-001" — public
console.log(laptop.name);       // "Laptop Pro" — public
// console.log(laptop.price);   // ERROR — private

// =====================================
// STATIC MODIFIER
// =====================================

// WHAT IT IS:
//   A static member belongs to the CLASS itself, not to any particular instance.
//   All instances share the same static property/method.
//
// WHY IT EXISTS:
//   Utility functions, factory methods, counters, and shared configuration do
//   not belong to any single object — they belong to the class as a whole.
//
// SYNTAX:
//   static propertyName: type;
//   static methodName(): returnType { ... }
//   Access via ClassName.propertyName — NOT via this.propertyName on instances

class UserSession {
  private static activeCount: number = 0;  // shared across ALL instances
  public readonly sessionId: string;
  public userName: string;

  constructor(userName: string) {
    this.userName = userName;
    this.sessionId = `SID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    UserSession.activeCount++;
  }

  public end(): void {
    UserSession.activeCount--;
    console.log(`Session ${this.sessionId} ended.`);
  }

  public static getActiveCount(): number {
    return UserSession.activeCount;
  }

  public static createGuest(): UserSession {
    return new UserSession("Guest");  // static factory method
  }
}

const s1 = new UserSession("Alice");
const s2 = new UserSession("Bob");
const s3 = UserSession.createGuest();

console.log(UserSession.getActiveCount());  // 3
s2.end();
console.log(UserSession.getActiveCount());  // 2

// static + readonly — a true constant on the class
class MathConstants {
  static readonly PI = 3.14159265358979;
  static readonly E  = 2.71828182845904;

  static circleArea(radius: number): number {
    return MathConstants.PI * radius * radius;
  }
}

console.log(MathConstants.PI);               // 3.14159265358979
console.log(MathConstants.circleArea(5));    // 78.539...
// MathConstants.PI = 3;   // ERROR — readonly

// =====================================
// ABSTRACT MODIFIER
// =====================================

// WHAT IT IS:
//   An abstract class cannot be instantiated directly — it is a template for
//   subclasses. Abstract methods have NO implementation in the base class;
//   every concrete subclass MUST implement them.
//
// WHY IT EXISTS:
//   When you want to define a shared interface/contract across a family of
//   classes but leave specific behavior to each subclass.
//
// SYNTAX:
//   abstract class ClassName { ... }
//   abstract methodName(): returnType;   // no body

abstract class Shape {
  abstract area(): number;                // must be implemented by subclass
  abstract perimeter(): number;           // must be implemented by subclass

  // concrete method — shared by all subclasses
  public describe(): string {
    return `Shape: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`;
  }
}

// new Shape();  // ERROR — cannot instantiate abstract class

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const circle = new Circle(7);
const rect   = new Rectangle(4, 6);
console.log(circle.describe());   // Shape: area=153.94, perimeter=43.98
console.log(rect.describe());     // Shape: area=24.00, perimeter=20.00

// Abstract class with abstract properties
abstract class DatabaseConnection {
  abstract readonly connectionString: string;
  protected abstract connect(): void;

  public initialize(): void {
    console.log(`Initializing connection: ${this.connectionString}`);
    this.connect();
  }
}

class PostgresConnection extends DatabaseConnection {
  readonly connectionString = "postgres://localhost:5432/mydb";

  protected connect(): void {
    console.log("Connected to PostgreSQL.");
  }
}

const db = new PostgresConnection();
db.initialize();
// Initializing connection: postgres://localhost:5432/mydb
// Connected to PostgreSQL.

// =====================================
// OVERRIDE MODIFIER
// =====================================

// WHAT IT IS:
//   The override keyword marks a method as intentionally overriding a method
//   from the base class. TypeScript will error if the base class does NOT have
//   that method — catching accidental "overrides" caused by typos.
//
// WHY IT EXISTS:
//   Without it, you might misspell a method name in a subclass, thinking you
//   are overriding the parent, but actually creating a brand new method.
//   override makes the intent explicit and lets the compiler verify it.
//
// SYNTAX:
//   override methodName(): returnType { ... }
//
// NOTE: Requires "noImplicitOverride": true in tsconfig.json to enforce
//   that ALL overrides must use the keyword (optional but recommended).

class Animal {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public speak(): string {
    return `${this.name} makes a sound.`;
  }

  public move(distance: number = 0): string {
    return `${this.name} moved ${distance}m.`;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  override speak(): string {         // override is explicit and verified
    return `${this.name} barks!`;
  }

  override move(distance: number = 10): string {
    return `${this.name} ran ${distance}m.`;
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }

  override speak(): string {
    return `${this.name} meows.`;
  }

  // override speek(): string { ... }
  // ERROR — "speek" does not exist on base class — typo caught!
}

const dog = new Dog("Rex");
const cat = new Cat("Whiskers");
console.log(dog.speak());     // "Rex barks!"
console.log(dog.move(50));    // "Rex ran 50m."
console.log(cat.speak());     // "Whiskers meows."

// =====================================
// PRIVATE FIELDS WITH # (ECMASCRIPT PRIVATE)
// =====================================

// WHAT IT IS:
//   The # prefix is a JavaScript (ECMAScript) language feature for truly
//   private fields. Unlike TypeScript's "private" keyword, # fields are
//   enforced at RUNTIME — they survive compilation and cannot be accessed
//   from outside, even in the generated JavaScript.
//
// WHY IT EXISTS:
//   TypeScript private is erased at compile time. If you inspect the compiled
//   JS, the field is just a regular property and can be accessed at runtime.
//   The # field prevents that — it is genuinely inaccessible at runtime too.
//
// SYNTAX:
//   #fieldName: type;
//   #methodName(): returnType { ... }

class SecureVault {
  #pin: string;             // truly private — NOT accessible outside at runtime
  #accessLog: string[] = [];
  public vaultId: string;

  constructor(vaultId: string, pin: string) {
    this.vaultId = vaultId;
    this.#pin = pin;
  }

  public unlock(inputPin: string): boolean {
    this.#recordAttempt(inputPin === this.#pin);
    return inputPin === this.#pin;
  }

  #recordAttempt(success: boolean): void {  // private method with #
    this.#accessLog.push(`${new Date().toISOString()} — ${success ? "SUCCESS" : "FAIL"}`);
  }

  public getAccessLog(): string[] {
    return [...this.#accessLog];  // return a copy
  }
}

const vault = new SecureVault("VAULT-42", "1234");
console.log(vault.unlock("0000"));    // false
console.log(vault.unlock("1234"));    // true
console.log(vault.getAccessLog());    // array with two log entries
// console.log(vault.#pin);           // ERROR — truly private, even in JS

// =====================================
// TYPESCRIPT private vs # PRIVATE — KEY DIFFERENCES
// =====================================

// 1. COMPILE-TIME vs RUNTIME
//    TypeScript private  → error only during compilation; erased in output JS
//    # private           → error at both compile time AND runtime
//
// 2. TYPE SYSTEM ACCESS
//    TypeScript private  → TypeScript still "knows about" the property for
//                          internal type checking, casting, etc.
//    # private           → completely hidden — no way to access via any cast
//
// 3. INHERITANCE
//    TypeScript private  → cannot be accessed in subclasses
//    # private           → cannot be accessed in subclasses
//    (Both behave the same for subclass access — neither allows it)
//
// 4. REFLECTION / CASTING BYPASS
//    TypeScript private  → (obj as any).privateField works at runtime
//    # private           → (obj as any).#field still fails at runtime

class TSPrivateDemo {
  private secret = "ts-private";  // TypeScript private
  #trueSecret = "js-private";     // ECMAScript private

  getSecrets(): string {
    return `${this.secret} | ${this.#trueSecret}`;
  }
}

const demo = new TSPrivateDemo();
console.log(demo.getSecrets());           // "ts-private | js-private"
// console.log(demo.secret);             // TypeScript ERROR
// console.log((demo as any).secret);    // Works at RUNTIME (TS private is erased)
// console.log(demo.#trueSecret);        // ERROR — compile time
// console.log((demo as any).#trueSecret); // Still ERROR — runtime enforcement

// =====================================
// PRACTICAL PATTERNS
// =====================================

// PATTERN 1 — Encapsulation using private
// Hide internal state; expose only what is needed via public methods.

class TemperatureSensor {
  private rawValue: number = 0;
  public sensorId: string;

  constructor(sensorId: string) {
    this.sensorId = sensorId;
  }

  public setRaw(raw: number): void {
    this.rawValue = raw;
  }

  public getCelsius(): number {
    return (this.rawValue - 32) * (5 / 9);
  }

  public getFahrenheit(): number {
    return this.rawValue;
  }
}

const sensor = new TemperatureSensor("SENSOR-01");
sensor.setRaw(98.6);
console.log(`${sensor.getCelsius().toFixed(1)}°C`);   // 37.0°C
// sensor.rawValue = -999;  // ERROR — private

// PATTERN 2 — Validation in setters using private backing fields

class Age {
  private _value: number;

  constructor(initial: number) {
    this._value = this.validate(initial);
  }

  private validate(n: number): number {
    if (n < 0 || n > 150) throw new Error(`Invalid age: ${n}`);
    return n;
  }

  get value(): number {
    return this._value;
  }

  set value(n: number) {
    this._value = this.validate(n);  // validation runs on every assignment
  }
}

const age = new Age(25);
console.log(age.value);  // 25
age.value = 30;
console.log(age.value);  // 30
// age.value = -5;        // throws Error: Invalid age: -5

// PATTERN 3 — Protected for inheritance hierarchies

class BaseReport {
  protected data: number[];

  constructor(data: number[]) {
    this.data = data;
  }

  protected computeSum(): number {
    return this.data.reduce((a, b) => a + b, 0);
  }

  protected computeAvg(): number {
    return this.computeSum() / this.data.length;
  }
}

class SalesReport extends BaseReport {
  public readonly title = "Sales Report";

  public generate(): void {
    console.log(`${this.title}`);
    console.log(`Total: $${this.computeSum()}`);
    console.log(`Average: $${this.computeAvg().toFixed(2)}`);
  }
}

const report = new SalesReport([200, 450, 300, 125, 600]);
report.generate();
// Sales Report
// Total: $1675
// Average: $335.00

// PATTERN 4 — Readonly for immutable data

class GeoCoordinate {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number
  ) {}

  public distanceTo(other: GeoCoordinate): string {
    const diff = Math.sqrt(
      (this.latitude - other.latitude) ** 2 +
      (this.longitude - other.longitude) ** 2
    );
    return diff.toFixed(4);
  }
}

const nyc    = new GeoCoordinate(40.7128, -74.006);
const boston = new GeoCoordinate(42.3601, -71.0589);
console.log(`Distance: ${nyc.distanceTo(boston)}`);  // Distance: 2.9854
// nyc.latitude = 0;   // ERROR — readonly

// =====================================
// COMPLETE REAL-WORLD EXAMPLE
// =====================================

// Combining all modifiers in a cohesive system

abstract class BaseEntity {
  readonly id: string;
  readonly createdAt: Date;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
  }

  abstract validate(): boolean;

  protected log(action: string): void {
    console.log(`[${this.id}] ${action} at ${this.createdAt.toISOString()}`);
  }
}

class FullUserAccount extends BaseEntity {
  public name: string;
  private password: string;
  private loginAttempts: number = 0;
  private static readonly MAX_ATTEMPTS = 5;
  private static totalUsers: number = 0;

  constructor(id: string, name: string, password: string) {
    super(id);
    this.name = name;
    this.password = password;
    FullUserAccount.totalUsers++;
  }

  validate(): boolean {
    return this.name.length > 0 && this.password.length >= 8;
  }

  public login(inputPassword: string): boolean {
    if (this.loginAttempts >= FullUserAccount.MAX_ATTEMPTS) {
      console.log(`Account ${this.id} is locked.`);
      return false;
    }
    if (inputPassword === this.password) {
      this.loginAttempts = 0;
      this.log("Logged in");
      return true;
    }
    this.loginAttempts++;
    console.log(`Wrong password. Attempts: ${this.loginAttempts}/${FullUserAccount.MAX_ATTEMPTS}`);
    return false;
  }

  public static getTotalUsers(): number {
    return FullUserAccount.totalUsers;
  }
}

const u1 = new FullUserAccount("USR-A1", "Carol", "strongPass123");
const u2 = new FullUserAccount("USR-A2", "Dave", "anotherPass456");

console.log(`Valid: ${u1.validate()}`);               // Valid: true
u1.login("wrongPass");                                 // Wrong password. Attempts: 1/5
u1.login("strongPass123");                             // [USR-A1] Logged in at ...
console.log(`Total users: ${FullUserAccount.getTotalUsers()}`);  // Total users: 2

// =====================================
// COMMON MISTAKES
// =====================================

// MISTAKE 1 — Thinking TypeScript "private" prevents runtime access
// TypeScript private is compile-time only. The compiled JS is accessible.
//   class Foo { private secret = "hidden"; }
//   const f = new Foo();
//   (f as any).secret  // "hidden" — accessible at runtime!
// FIX: Use # for real runtime privacy.

// MISTAKE 2 — Confusing "private" and "#" for inheritance
// Both prevent access in subclasses. Neither is "more private" for subclasses.
// The difference is purely about runtime enforcement.

// MISTAKE 3 — Treating readonly as deep immutability
// readonly only prevents reassigning the REFERENCE.
// The contents of an array or object marked readonly can still be mutated.
//   readonly items: string[] = ["a"];
//   items.push("b");   // allowed!
//   items = [];        // ERROR
// FIX: Use Object.freeze() or ReadonlyArray<T> for deep immutability.

// MISTAKE 4 — Using protected when private is sufficient
// If a subclass does not need direct access to a field, keep it private.
// Exposing it as protected creates an unnecessary coupling between classes.

// MISTAKE 5 — Forgetting that static is accessed on the CLASS, not instances
//   class Counter { static count = 0; }
//   const c = new Counter();
//   c.count;           // ERROR (TypeScript warns you)
//   Counter.count;     // correct

// MISTAKE 6 — Trying to instantiate abstract classes
//   abstract class Vehicle { }
//   new Vehicle();  // ERROR — abstract class cannot be directly instantiated

// =====================================
// BEST PRACTICES
// =====================================

// 1. DEFAULT TO PRIVATE
//    Make everything private first. Loosen to protected or public only
//    when there is a clear need. This is the principle of least privilege.

// 2. USE READONLY FOR IDENTIFIERS AND CONSTANTS
//    IDs, creation timestamps, and config values that must not change
//    should always be readonly. It communicates intent clearly.

// 3. USE PROTECTED SPARINGLY
//    Protected creates a tight coupling between base and derived classes.
//    If you find yourself heavily relying on protected, consider composition
//    over inheritance.

// 4. PREFER # FOR SENSITIVE DATA IN PRODUCTION CODE
//    If a field holds secrets (API keys, passwords, tokens), use # private
//    so it is genuinely inaccessible at runtime, not just at compile time.

// 5. USE PARAMETER PROPERTIES TO REDUCE BOILERPLATE
//    They are idiomatic TypeScript and make constructors much cleaner.

// 6. USE OVERRIDE KEYWORD EXPLICITLY
//    Enable "noImplicitOverride" in tsconfig.json and always write override
//    when extending — it prevents silent bugs from renamed parent methods.

// 7. ABSTRACT CLASSES FOR SHARED BEHAVIOR + POLYMORPHISM
//    Use abstract when you want to guarantee subclasses implement certain
//    methods while still sharing common implementation.

// 8. STATIC FOR CROSS-INSTANCE SHARED STATE AND UTILITY METHODS
//    Counters, registries, singletons, and pure utility functions all belong
//    as static members.

// =====================================
// INTERVIEW QUESTIONS
// =====================================

// Q1: What is the difference between TypeScript "private" and JavaScript "#"?
// A: TypeScript private is a compile-time-only restriction. It is erased
//    from the generated JavaScript, so the field is still accessible at
//    runtime (e.g., via (obj as any).field). The # field is a JavaScript
//    (ECMAScript) feature enforced at RUNTIME — it cannot be accessed from
//    outside the class body even in the compiled JavaScript.

// Q2: What does "readonly" mean in TypeScript? Is it truly immutable?
// A: readonly prevents reassigning the property after initialization.
//    However, it only protects the reference, not the contents of objects
//    or arrays. An array marked readonly can still have .push() called on it.
//    For deep immutability use Object.freeze() or ReadonlyArray<T>.

// Q3: When would you use "protected" vs "private"?
// A: Use private when the field/method is purely an internal implementation
//    detail of that one class. Use protected when subclasses legitimately
//    need direct access to the member — typically shared state or helper
//    methods that are part of an inheritance contract. Prefer private by
//    default and only relax to protected when there is a concrete need.

// Q4: What is the purpose of the "override" keyword in TypeScript?
// A: override marks a method as intentionally overriding a method from
//    the parent class. TypeScript verifies that the named method actually
//    exists on the base class — catching typos and renames that would
//    otherwise silently create a new unrelated method in the subclass.

// =====================================
// PRACTICE TASKS
// =====================================

// TASK 1 — Library System
// Build a LibraryBook class with:
//   - readonly isbn: string
//   - private _checkedOut: boolean (default false)
//   - public title: string
//   - public author: string
//   - public methods: checkOut(), returnBook(), isAvailable()
//   - A static counter that tracks total books ever created
// Extend it with a RareBook subclass that adds:
//   - protected estimatedValue: number
//   - override checkOut() that logs a warning about handling rare books
//   - public getValueEstimate() visible only to RareBook and its subclasses

// TASK 2 — Employee Hierarchy
// Create an abstract Employee class with:
//   - readonly employeeId: string (parameter property)
//   - protected department: string (parameter property)
//   - abstract calculatePay(): number
//   - public getSummary() that calls calculatePay() inside
// Create HourlyEmployee and SalariedEmployee subclasses that:
//   - Use override on calculatePay()
//   - Have private fields for their respective rate/hours or annual salary
//   - Add a static method getTitle() returning the employee type label

// TASK 3 — Secure Config Store
// Build a ConfigStore class using # private fields that:
//   - Stores key-value pairs in a #store private Map
//   - Has a #masterKey private string set in the constructor
//   - public set(key, value, adminKey): void  — only sets if adminKey matches
//   - public get(key): string | undefined
//   - public has(key): boolean
//   - A static createDefault() factory returning a pre-configured instance
// Verify that #store and #masterKey are inaccessible outside the class
//   even when casting with (instance as any).

console.log("\n--- End of 12-access-modifiers.ts ---");
