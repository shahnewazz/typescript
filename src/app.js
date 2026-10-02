"use strict";
// Type Alias
let customer = {
    name: "Jane Smith",
    age: 28,
    isActive: true
};
let admin = {
    name: "Admin User",
    age: 35,
    isActive: false
};
const getLocation = (city, country) => {
    return `${city}, ${country}`;
};
console.log(getLocation("New York", "USA"));
console.log(getLocation("London", "UK"));
