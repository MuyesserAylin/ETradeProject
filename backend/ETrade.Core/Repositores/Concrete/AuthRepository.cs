using ETrade.Core.Data;
using ETrade.Core.Entities;
using ETrade.Core.Repositores.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Concrete
{
    public class AuthRepository:IAuthRepository
    {
        private readonly AppDbContext _context;
        public AuthRepository(AppDbContext context)
        { 
           _context = context;
        }

        public async Task AddUserAsyc(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _context.Users
                .AnyAsync(u=>u.Email == email);
        }

        public async Task<User?> GetByEmailUserAsync(string email)
        {
           return await _context.Users
                .FirstOrDefaultAsync(u=>u.Email==email);
        }
    }
}
