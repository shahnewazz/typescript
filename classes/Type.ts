// Type Alias
type ID = string | number;

type User = {
    id: ID;
    name: string;
    age: number;
    isActive: boolean;
};

type Employee = User & {
    salary: number;
    department: string;
};

let customer: User = {
    id: 1,
    name: "Jane Smith",
    age: 28,
    isActive: true
};

let admin: User = {
    id: "2",
    name: "Admin User",
    age: 35,
    isActive: false
};

let employee: Employee = {
    id: 3,
    name: "John Employee",
    age: 30,
    isActive: true,
    salary: 50000,
    department: "Sales"
};

console.log(`Customer: ${customer.name}, Age: ${customer.age}, Active: ${customer.isActive}`);
console.log(`Admin: ${admin.name}, Age: ${admin.age}, Active: ${admin.isActive}`);
console.log(`Employee: ${employee.name}, Age: ${employee.age}, Active: ${employee.isActive}, Salary: ${employee.salary}, Department: ${employee.department}`);

type getLocation = (city: string, country: string) => string;

const getLocation: getLocation = (city, country) => {
    return `${city}, ${country}`;
};

// export {};