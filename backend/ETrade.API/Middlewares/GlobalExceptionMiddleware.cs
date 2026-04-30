using ETrade.Core.DTOs.Responses;
using ETrade.Core.Exceptions;
using System.Text.Json;

namespace ETrade.API.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(BaseException ex)
            {
                await HandleExceptionAsync(context, ex.Message, ex.StatusCode);
            }
            catch(Exception ex)
            {
                await HandleExceptionAsync(context, "Beklenmedik Hata", 500);
            }

        }

        private async Task HandleExceptionAsync(HttpContext context,string message, int statusCode)
        {
            context.Response.ContentType= "application/json";
            context.Response.StatusCode = statusCode;

            var response=ApiResponse<object>.FailResponse(message,statusCode);
            var json=JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }

}
