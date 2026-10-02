// TUPLES
let user : [string, number] = ["John Doe", 30];

let location: [number, number] = [40.7128, -74.0060]; // Latitude and Longitude

function displayUserInfo(user: [string, number]): void {
    const [name, age] = user;
    console.log(`Name: ${name}, Age: ${age}`);
}

function displayLocation(location: [number, number]): void {
    const [latitude, longitude] = location;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
}

displayUserInfo(user);
displayLocation(location);