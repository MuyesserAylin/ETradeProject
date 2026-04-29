using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Abstract
{
    public interface IAuthService
    {
        Task<string> Register(RegisterRequest request);
        Task<LoginResponse> Login (LoginRequest request);
    }
}
