using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Abstract
{
    public interface IAuthRepository
    {
        Task<bool> EmailExists(string email);
        Task<User?> GetByEmailUserAsync(string email);
        Task AddUserAsyc(User user);
        

    }
}
