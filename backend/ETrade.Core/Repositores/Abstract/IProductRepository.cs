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

    }
}
