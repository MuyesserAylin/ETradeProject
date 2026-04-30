using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Exceptions;
using ETrade.Core.Helpers;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Concrete
{
    public class AuthService:IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IAuthRepository authRepository,JwtHelper jwtHelper)
        {
            _authRepository = authRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<LoginResponse> Login(LoginRequest request)
        {
            var user=await _authRepository.GetByEmailUserAsync(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedException("Email adresiniz veya şifreniz hatalı");
            }
            var jwtResult= _jwtHelper.GenerateToken(user);


            return new LoginResponse
            {

                Token = jwtResult.Token,
                FullName=user.FullName,
                Role=user.Role,
                ExpirationTime=jwtResult.ExpirationTime,
            };

        }

        public async Task<string> Register(RegisterRequest request)
        {
            if (await _authRepository.EmailExists(request.Email))
            {
                throw new BadRequestException("Bu email adresi kullanılmaktadır.");
            }

            var user = new User
            {

                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)

            };

            await _authRepository.AddUserAsyc(user);
            return "Üye başarıyla eklendi.";

        }
    }
}
