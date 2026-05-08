using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Internal
{
    public class CategoryDeleteCheckDto
    {
        public Category? Category { get; set;}
        public bool HasProducts { get; set;}
    }
}
