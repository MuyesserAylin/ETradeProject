using AutoMapper;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Exceptions;
using ETrade.Core.Mapping;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Concrete
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository,IMapper mapper)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<ProductResponseDto> AddProductAsync(ProductCreateDto request)
        {
            var category=await _categoryRepository.GetByIdCategoryAsync(request.CategoryId);
           if(category==null)
            {
                throw new BadRequestException("Eklemek istediğiniz ürünün kategorisi mevcut değildir");

            }
           if(await _productRepository.IsExistProductName(request.Name))
            {
                throw new BadRequestException("Eklemek istediğiniz ürün zaten mevcuttur.");
            }

            var product = _mapper.Map<Product>(request);
            var createdProduct=await _productRepository.AddProductAsync(product);
            var response=_mapper.Map<ProductResponseDto>(createdProduct);
            response.CategoryName= category.Name;
            return response;

        }
    }
}
