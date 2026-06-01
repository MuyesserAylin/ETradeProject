using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ETrade.Core.Services.Concrete
{
    public class BaseService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public BaseService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected int GetUserId()
        {
            return int.Parse(
                _httpContextAccessor.HttpContext!.User
                .FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }
        protected string  GetUserEmail()
        {
            return _httpContextAccessor.HttpContext!.User
             .FindFirst(ClaimTypes.Email)!.Value;
        }
        protected string? GetUserRole()
        {
            return _httpContextAccessor.HttpContext?.User
                .FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}
