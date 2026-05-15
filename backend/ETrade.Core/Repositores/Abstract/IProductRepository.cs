using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Abstract
{
    public interface IProductRepository
    {
        public Task<bool> IsExistProductName(string Productname);
        public Task<Product> AddProductAsync(Product product);

        public Task<List<Product>> GetAllProductsAsync(int? categoryId);

        public Task<Product?> GetProductByIdAsync(int id);

        public Task<bool> IsExistProductName(string productName, int id);

        public Task<Product> UpdateProductAsync(Product product);
        public Task<Product?> GetProductByIdWithoutCategoryAsync(int id);
        public Task DeleteProductAsync(Product product);


    }
}
