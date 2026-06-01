// Auth
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    fullName: string;
    role: string;
    expirationTime: string;
}

// Product
export interface ProductResponseDto {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    categoryName: string;
}

export interface ProductDetailResponseDto extends ProductResponseDto {
    description: string;
}

// Cart
export interface CartItemResponseDto {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    linePrice: number;
}

export interface CartResponseDto {
    cartItems: CartItemResponseDto[];
    totalPrice: number;
}

// Order
export interface OrderItemResponseDto {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

export interface OrderSummaryDto {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
}

export interface OrderResponseDto {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    shippingAddress: string;
    customerPhone: string;
    orderItems: OrderItemResponseDto[];
}
export interface OrderDetailResponseDto extends OrderResponseDto {
    customerFullName: string;
    customerEmail: string;
}
// API Response
export interface ApiResponse<T> {
    succes: boolean;
    message: string;
    data: T;
    statusCode: number;
}