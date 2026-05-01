using ETrade.API.Middlewares;
using ETrade.Core.Data;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Helpers;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Repositores.Concrete;
using ETrade.Core.Services.Abstract;
using ETrade.Core.Services.Concrete;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DB baðlantýsý
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD_PROJE1");
var fullConnectionString = $"{connectionString} Password={dbPassword};";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(fullConnectionString));

// Repository ve Service kayýtlarý
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtHelper>();

// JWT ayarlarý
var secretKey = builder.Configuration["JwtSettings:SecretKey"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey!))
        };
    });

builder.Services.AddControllers();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value!.Errors.Count > 0)
            .ToDictionary(
                x => x.Key.ToLower(),
                x => x.Value!.Errors.Select(e => e.ErrorMessage).ToList()
            );

        var response = ApiResponse<Dictionary<string, List<string>>>
            .FailResponse("Validation hatasý.", 400);
        response.Data = errors;

        return new BadRequestObjectResult(response);
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope=app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if(!context.Users.Any(u=>u.Role=="Admin"))
    {
        context.Users.Add(new ETrade.Core.Entities.User
        {
            FullName="Admin",
            Email = builder.Configuration["AdminSettings:Email"]!,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(builder.Configuration["AdminSettings:Password"]!),
            Role="Admin"
            
        });
        context.SaveChanges();

    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>(); 
app.UseHttpsRedirection();
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();
app.Run();