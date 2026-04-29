using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Helpers
{
    public class JwtResult
    {
        public string Token { get; set; } = null!;
        public DateTime ExpirationTime { get; set; }

    }
}
