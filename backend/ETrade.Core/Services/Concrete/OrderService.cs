using AutoMapper;
using ETrade.Core.Data;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Enums;
using ETrade.Core.Exceptions;
using ETrade.Core.Mapping;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Services.Abstract;
using Microsoft.AspNetCore.Http;
using Org.BouncyCastle.Asn1.Esf;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Concrete
{
    public class OrderService :BaseService, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public OrderService(IHttpContextAccessor httpContextAccessor,
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IProductRepository productRepository,
            IMapper mapper,
            AppDbContext context
            ,IEmailService emailService)
            : base(httpContextAccessor)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _mapper = mapper;
            _context = context;
            _emailService = emailService;
        }

        public async Task<OrderDetailResponseDto> CancelOrderAsync(int id)
        {
            var order = await _orderRepository.GetOrderWithDetails(id);
            if(order == null) { throw new NotFoundException("Sipariş bulunamadı."); }
            if (order.UserId != GetUserId()) { throw new UnauthorizedException("Bu işlem için yetkiniz yoktur."); }
            if (order.Status == OrderStatus.Cancelled)
                throw new BadRequestException("Sipariş zaten iptal edilmiş.");
            if (order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Delivered)
                throw new BadRequestException("Kargoya verilen veya teslim edilen sipariş iptal edilemez.");
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                order.Status = OrderStatus.Cancelled;

                    foreach (var orderItem in order.OrderItems)
                        orderItem.Product.Stock += orderItem.Quantity;
                    await _productRepository.UpdateStocksAsync(order.OrderItems.Select(oi => oi.Product).ToList());
                
                order = await _orderRepository.UpdateOrderAsync(order);
                await transaction.CommitAsync();
                var orderDetailResponse = _mapper.Map<OrderDetailResponseDto>(order);
                orderDetailResponse.OrderItems = _mapper.Map<List<OrderItemResponseDto>>(order.OrderItems);
                await _emailService.SendOrderCancelledAsync(order.User.Email, order.Id);
                return orderDetailResponse;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

        }

        public async  Task<OrderResponseDto> CreateDirectOrderAsync(DirectOrderRequestDto request)
        {
           var userId=GetUserId();
            var product=await _productRepository.GetProductByIdWithoutCategoryAsync(request.ProductId);
            if (product == null) { throw new NotFoundException("Ürün mevcut değildir."); }
            if (product.Stock <= 0) { throw new BadRequestException("Ürünün stoku yoktur."); }
            if (product.Stock < request.Quantity) { throw new BadRequestException("İstenen miktarda ürün mevcut değildir."); }
            using var transaction=await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _orderRepository.AddOrderAsync(new Order
                {
                    UserId = userId,
                    TotalAmount = product.Price * request.Quantity,
                    ShippingAddress = request.ShippingAddress,
                    CustomerPhone = request.CustomerPhone,
                });
                var orderItem = await _orderRepository.AddOrderItemAsync(new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = request.Quantity,
                    UnitPrice = product.Price

                });
                product.Stock -= orderItem.Quantity;
                product = await _productRepository.UpdateProductAsync(product);
                var orderItemResponse = _mapper.Map<OrderItemResponseDto>(orderItem);
                orderItemResponse.ProductName = product.Name;
                var response = _mapper.Map<OrderResponseDto>(order);
                response.OrderItems.Add(orderItemResponse);
                await transaction.CommitAsync();
                await _emailService.SendOrderConfirmationAsync(GetUserEmail(), response);
                return response;

            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
           
        }

        public async Task<OrderResponseDto> CreateOrderFromCartAsync(CreateOrderRequestDto request)
        {
            var userId = GetUserId();
            var cartItems = await _cartRepository.GetAllCartItemAsync(userId);
            if (!cartItems.Any()) { throw new NotFoundException("Sepetiniz boş. Sipariş oluşturulamadı."); }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var orderItems = new List<OrderItem>();
                var order = await _orderRepository.AddOrderAsync(new Order
                {
                    UserId = userId,
                    ShippingAddress = request.ShippingAddress,
                    CustomerPhone = request.CustomerPhone,
                });
                foreach (var cartItem in cartItems)
                {
                    if (cartItem.Quantity > cartItem.Product.Stock)
                        throw new BadRequestException(cartItem.Product.Name + " adlı üründe yeterli stok yoktur.");
                    var orderItem = _mapper.Map<OrderItem>(cartItem);
                    orderItem.OrderId = order.Id;
                    orderItems.Add(orderItem);
                    cartItem.Product.Stock -= cartItem.Quantity;
                }
                await _productRepository.UpdateStocksAsync(cartItems.Select(c => c.Product).ToList());
                orderItems = await _orderRepository.AddOrderItemsAsync(orderItems);
                order.TotalAmount = orderItems.Sum(o => o.UnitPrice * o.Quantity);
                order=await _orderRepository.UpdateOrderAsync(order);
                var orderItemResponses = _mapper.Map<List<OrderItemResponseDto>>(cartItems);
                var response = _mapper.Map<OrderResponseDto>(order);
                response.OrderItems = orderItemResponses;
                await _cartRepository.DeleteAllCartItemsByUserIdAsync(userId);
                await transaction.CommitAsync();
                await _emailService.SendOrderConfirmationAsync(GetUserEmail(), response);
                return response;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<OrderSummaryDto>> GetAllOrdersAsync()
        {
            List<Order> orders;
            if (GetUserRole() == "Admin")
            {
               orders=await _orderRepository.GetAllOrdersAsync();
            }
            else
            {
                orders=await _orderRepository.GetOrdersByUserIdAsync(GetUserId());
            }

                return _mapper.Map<List<OrderSummaryDto>>(orders);
           
        }

       

        public async Task<OrderDetailResponseDto> GetOrderByIdAsync(int id)
        {
            var order=await _orderRepository.GetOrderWithDetails(id);
            if (order == null) { throw new NotFoundException("Sipariş bulunamadı."); }
            if(GetUserRole()!="Admin" && order.UserId != GetUserId())
            {
                throw new UnauthorizedException("Bu siparişi görüntüleme yetkiniz yok.");
            }
            var orderDetailResponse=_mapper.Map<OrderDetailResponseDto>(order);
            orderDetailResponse.OrderItems = _mapper.Map<List<OrderItemResponseDto>>(order.OrderItems);
            return orderDetailResponse;
            
        }

        public async Task<OrderDetailResponseDto> UpdateOrderStatusAsync(int id,UpdateOrderStatusDto request)
        {
            var order = await _orderRepository.GetOrderWithDetails(id);
            if (order == null) { throw new NotFoundException("Sipariş bulunamadı."); }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                order.Status = request.Status;
                if (order.Status == OrderStatus.Cancelled)
                {
                    foreach (var orderItem in order.OrderItems)
                        orderItem.Product.Stock += orderItem.Quantity;
                    await _productRepository.UpdateStocksAsync(order.OrderItems.Select(oi => oi.Product).ToList());
                }
                order = await _orderRepository.UpdateOrderAsync(order);
                await transaction.CommitAsync();
                var orderDetailResponse = _mapper.Map<OrderDetailResponseDto>(order);
                orderDetailResponse.OrderItems = _mapper.Map<List<OrderItemResponseDto>>(order.OrderItems);
                await _emailService.SendOrderStatusChangedAsync(order.User.Email,order.Id,order.Status);
                return orderDetailResponse;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
            

        }
    }
}
