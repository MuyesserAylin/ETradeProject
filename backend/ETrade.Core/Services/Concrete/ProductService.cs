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
                throw new NotFoundException("Eklemek istediğiniz ürünün kategorisi mevcut değildir");

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

        public async Task<List<ProductResponseDto>> GetAllProductsAsync(int? categoryId)
        {
            List<Product> products;
            if(categoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdCategoryAsync(categoryId.Value);
                if(category == null)
                {
                    throw new NotFoundException("Ürünlerini listelemek istediğiniz kategori mevcut değildir");
                }
            }
            products = await _productRepository.GetAllProductsAsync(categoryId);
            return _mapper.Map<List<ProductResponseDto>>(products);
        }

        public async Task<ProductDetailResponseDto> GetProductByIdAsync(int id)
        {
            var product=await _productRepository.GetProductByIdAsync(id);
            if(product== null)
            {
                throw new NotFoundException("İncelemek istediğiniz ürün mevcut değildir");
            }
            return _mapper.Map<ProductDetailResponseDto>(product);
        }

        public async Task<ProductResponseDto> UpdateProductAsync(int id, ProductUpdateDto request)
        {
            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null)
            {
                throw new NotFoundException("Güncellemek istediğiniz ürün mevcut değildir.");
            }
            else
            {
                string currentCategoryName=product.Category.Name;
                if(product.CategoryId!=request.CategoryId)
                {
                    var category = await _categoryRepository.GetByIdCategoryAsync(request.CategoryId);
                    if (category == null) 
                    {
                        throw new NotFoundException("Güncellemek istediğiniz kategori mevcut değildir.");
                    }
                    currentCategoryName=category.Name;
                }
                if (!product.Name.Equals(request.Name))
                {
                    if(await _productRepository.IsExistProductName(request.Name,id))
                    {
                        throw new BadRequestException("Bu isme sahip ürün zaten mevcuttur.");
                    }
                }
                _mapper.Map(request, product);
                var updatedProduct=await _productRepository.UpdateProductAsync(product);
                var response=_mapper.Map<ProductResponseDto>(updatedProduct);
                response.CategoryName = currentCategoryName;
      
                return response;

            }


        }
    }
}
