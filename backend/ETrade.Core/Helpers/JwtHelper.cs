using ETrade.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;
        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public JwtResult GenerateToken(User user)
        {
            var expirationMinutes = Convert.ToDouble(_configuration["JwtSettings:ExpirationMinutes"]);

            var key = new SymmetricSecurityKey(   //header için gerekli
           Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);//header için gerekli

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),              //payload ıcın gerekli
            new Claim(ClaimTypes.Name, user.FullName)
             };

            var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],    //header+payload+signature
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials     //signature otomatık olusur
             );

            return   new JwtResult
            {
                Token=new JwtSecurityTokenHandler().WriteToken(token),
                ExpirationTime=DateTime.UtcNow.AddMinutes(expirationMinutes),
            };
        }

    }
}
