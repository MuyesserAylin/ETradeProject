using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Exceptions
{
    public class UnauthorizedException:BaseException
    {
        public UnauthorizedException(string message):base(message,401)
        {

        }
    }
}
