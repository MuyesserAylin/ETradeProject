using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Abstract
{
    public interface IProductService
    {
        public Task<ProductResponseDto> AddProductAsync(ProductCreateDto request);
        public Task<List<ProductResponseDto>> GetAllProductsAsync(int? categoryId);
        public Task<ProductDetailResponseDto> GetProductByIdAsync(int id);
        public Task<ProductResponseDto> UpdateProductAsync(int id, ProductUpdateDto request);
        public Task DeleteProductAsync(int id);
      
    }
}
