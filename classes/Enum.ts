// ENUM
enum Role {
    Admin = "admin",
    User = "user",
    Guest = "guest"
};

enum ResponseType {
    Success = "success",
    Error = "error",
    Warning = "warning"
}

enum OrderStatus {
    Pending = "pending",
    Shipped = "shipped",
    Delivered = "delivered",
    Cancelled = "cancelled"
}

let user = {
    name: "Alice",
    role: Role.Admin
}

const orderStatusMessages = {
    [OrderStatus.Pending]: "Your order is pending.",
    [OrderStatus.Shipped]: "Your order has been shipped.",
    [OrderStatus.Delivered]: "Your order has been delivered.",
    [OrderStatus.Cancelled]: "Your order has been cancelled."
};

function checkOrderStatus(status: OrderStatus): void {
    console.log(orderStatusMessages[status]);
}
checkOrderStatus(OrderStatus.Delivered)