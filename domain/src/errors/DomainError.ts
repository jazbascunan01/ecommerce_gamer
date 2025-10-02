export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ProductNotFoundError extends DomainError {
    constructor(productId: string) {
        super(`Product with ID ${productId} not found.`);
    }
}

export class ProductNotInCartError extends DomainError {
    constructor(productId: string) {
        super(`Product with ID ${productId} is not in the cart.`);
    }
}

export class InsufficientStockError extends DomainError {
    constructor(productId: string) {
        super(`Insufficient stock for product with ID ${productId}.`);
    }
}
export class InvalidQuantityError extends DomainError {
    constructor(quantity: number, message?: string) {
        super(message ?? `Invalid quantity: ${quantity}. Quantity must be a positive number.`);
    }
}

export class UserAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super(`User with email ${email} already exists.`);
    }
}

export class UserNotFoundError extends DomainError {
    constructor(identifier: string) {
        super(`User with identifier '${identifier}' not found.`);
    }
}

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super(`Invalid credentials.`);
    }
}

export class CartNotFoundError extends DomainError {
    constructor(userId: string) {
        super(`Cart for user with ID ${userId} not found.`);
    }
}