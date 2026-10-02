// Type Alias

type User = {
    name: string;
    age: number;
    isActive: boolean;
};

let customer: User = {
    name: "Jane Smith",
    age: 28,
    isActive: true
};

let admin: User = {
    name: "Admin User",
    age: 35,
    isActive: false
};

type getLocation = (city: string, country: string) => string;

const getLocation: getLocation = (city, country) => {
    return `${city}, ${country}`;
};

console.log(getLocation("New York", "USA"));
console.log(getLocation("London", "UK"));