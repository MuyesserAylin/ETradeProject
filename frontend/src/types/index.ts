export interface ApiResponse<T> {
    succes: boolean
    message: string
    data: T
    statusCode: number
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    fullName: string
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    fullName: string
    role: 'Admin' | 'Customer'
    expirationTime: string
}

export interface CategoryResponseDto {
    id: number
    name: string
}

export interface CategoryCreateDto {
    name: string
}

export interface ProductResponseDto {
    id: number
    name: string
    price: number
    stock: number
    categoryId: number
    categoryName: string
    isDeleted: boolean
}

export interface ProductDetailResponseDto extends ProductResponseDto {
    description: string
}

export interface ProductCreateDto {
    name: string
    description: string
    price: number
    stock: number
    categoryId: number
}

export interface ProductUpdateDto extends ProductCreateDto { }

export interface AddToCartDto {
    productId: number
    quantity: number
}

export interface UpdateCartItemDto {
    quantity: number
}

export interface CartItemResponseDto {
    id: number
    productId: number
    productName: string
    quantity: number
    unitPrice: number
    linePrice: number
}

export interface CartResponseDto {
    cartItems: CartItemResponseDto[]
    totalPrice: number
}

export enum OrderStatus {
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4,
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'Beklemede',
    [OrderStatus.Processing]: 'Hazırlanıyor',
    [OrderStatus.Shipped]: 'Kargolandı',
    [OrderStatus.Delivered]: 'Teslim Edildi',
    [OrderStatus.Cancelled]: 'İptal Edildi',
}

export const OrderStatusColor: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [OrderStatus.Processing]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [OrderStatus.Shipped]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    [OrderStatus.Delivered]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [OrderStatus.Cancelled]: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export interface CreateOrderRequestDto {
    shippingAddress: string
    customerPhone: string
}

export interface DirectOrderRequestDto {
    productId: number
    quantity: number
    shippingAddress: string
    customerPhone: string
}

export interface UpdateOrderStatusDto {
    status: OrderStatus
}

export interface OrderItemResponseDto {
    productId: number
    productName: string
    quantity: number
    unitPrice: number
    subTotal: number
}

export interface OrderSummaryDto {
    id: number
    orderDate: string
    status: OrderStatus
    totalAmount: number
}

export interface OrderResponseDto extends OrderSummaryDto {
    shippingAddress: string
    customerPhone: string
    orderItems: OrderItemResponseDto[]
}

export interface OrderDetailResponseDto extends OrderResponseDto {
    customerFullName: string
    customerEmail: string
}