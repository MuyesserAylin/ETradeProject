using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Responses
{
    public class ApiResponse<T>
    {
        public bool Succes { get; set; }
        public string Message { get; set; } = null!;
        public T? Data { get; set; }
        public int StatusCode { get; set; }

        public static ApiResponse<T> SuccesResponse(T data, String message = "İşlem Başarılı", int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Succes = true,
                Message = message,
                Data = data,
                StatusCode = statusCode
            };
        }

        public static ApiResponse<T> FailResponse(string message,int statusCode=400)
        {
            return new ApiResponse<T>
            {
                Succes = false,
                Message = message,
                Data = default,
                StatusCode=statusCode
            };
        }


    }
}
