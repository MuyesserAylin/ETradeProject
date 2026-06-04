using ETrade.API.Middlewares;
using ETrade.Core.Data;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Helpers;
using ETrade.Core.Mapping;
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

// DB bağlantısı
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD_PROJE1");
var fullConnectionString = $"{connectionString} Password={dbPassword};";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(fullConnectionString));

// Repository ve Service kayıtları
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IEmailService, MailService>();

builder.Services.AddScoped<JwtHelper>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

// CORS Politikası Tanımlama
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT ayarları
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
        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                var response = ApiResponse<object>.FailResponse("Giriş yapmanız gerekiyor.", 401);
                await context.Response.WriteAsJsonAsync(response);
            },
            OnForbidden = async context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";
                var response = ApiResponse<object>.FailResponse("Bu işlem için yetkiniz yok.", 403);
                await context.Response.WriteAsJsonAsync(response);
            }
        };
    });

// Controllers & JSON Naming Policy (CamelCase için)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

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
            .FailResponse("Validation hatası.", 400);
        response.Data = errors;

        return new BadRequestObjectResult(response);
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Bearer TOKEN"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Veritabanı Seed (Admin Kullanıcı Oluşturma)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.Users.Any(u => u.Role == "Admin"))
    {
        context.Users.Add(new ETrade.Core.Entities.User
        {
            FullName = "Admin",
            Email = builder.Configuration["AdminSettings:Email"]!,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(builder.Configuration["AdminSettings:Password"]!),
            Role = "Admin"
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

app.UseCors("AllowFrontend");
app.UseAuthentication();    
app.UseAuthorization();      

app.MapControllers();
app.Run();