using AutoMapper;
using ETrade.Core.Data;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Exceptions;
using ETrade.Core.Mapping;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Services.Abstract;
using Microsoft.AspNetCore.Http;
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

        public OrderService(IHttpContextAccessor httpContextAccessor,
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IProductRepository productRepository,
            IMapper mapper,
            AppDbContext context)
            : base(httpContextAccessor)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<OrderResponseDto> CreateDirectOrderAsync(DirectOrderRequestDto request)
        {
            var userId=GetUserId();
           var product=await _productRepository.GetProductByIdWithoutCategoryAsync(request.ProductId);
            if (product == null) { throw new NotFoundException("Bu ürün mevcut değildir."); }
            if (product.Stock == 0) { throw new BadRequestException("Ürünün stoğu yoktur."); }
            if (product.Stock < request.Quantity) {
                throw new BadRequestException("Ürünün yeterli" +
                " stoğu yoktur.");}
            var order = await _orderRepository.AddOrderAsync(new Order
            {
                UserId = userId,
                ShippingAddress = request.ShippingAddress,
                CustomerPhone = request.CustomerPhone,
                TotalAmount=product.Price*request.Quantity,
            });
            var orderItem = await _orderRepository.AddOrderItemAsync(new OrderItem
            {
                OrderId=order.Id,
                ProductId=product.Id,
                Quantity=request.Quantity,
                UnitPrice=product.Price,

            });

            product.Stock -= orderItem.Quantity;
            product=await _productRepository.UpdateProductAsync(product);
            var orderItemResponse=_mapper.Map<OrderItemResponseDto>(orderItem);
            orderItemResponse.ProductName = product.Name;
            var response = _mapper.Map<OrderResponseDto>(order);
            response.OrderItems.Add(orderItemResponse);
            return response;

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
                await _orderRepository.UpdateOrderAsync(order);
                var orderItemResponses = _mapper.Map<List<OrderItemResponseDto>>(cartItems);
                var response = _mapper.Map<OrderResponseDto>(order);
                response.OrderItems = orderItemResponses;
                await _cartRepository.DeleteAllCartItemsByUserIdAsync(userId);
                await transaction.CommitAsync();
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
            var orders= await _orderRepository.GetAllOrdersAsync();
            var responses=_mapper.Map<List<OrderSummaryDto>>(orders);
            return responses;
        }

        public async Task<List<OrderSummaryDto>> GetUserOrderAsync()
        {
            var userId = GetUserId();
            var orders=await _orderRepository.GetUserOrderAsync(userId);
            var responses=_mapper.Map<List<OrderSummaryDto>>(orders);
            return responses;
        }
    }
}
