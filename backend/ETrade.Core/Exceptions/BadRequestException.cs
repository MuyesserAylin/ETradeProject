using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Exceptions
{
    public class BadRequestException:BaseException
    {
        public BadRequestException(string message):base(message,400)
        {

        }
    }
}
