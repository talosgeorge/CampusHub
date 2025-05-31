using CampusHub.Server.Data;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;   
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json;




var builder = WebApplication.CreateBuilder(args);
// Simi: DESKTOP-3KFCOVV\SQLEXPRESS
// Talos: Talos\\SQLEXPRESS03
// Chio: DESKTOP-SH9UD67\SQLEXPRESS
// === Configurare conexiune DB ===
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=Talos\\SQLEXPRESS03;Initial Catalog=CampusHub;Integrated Security=True;TrustServerCertificate=True";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging());

// === Identity ===
builder.Services.AddIdentity<UserAccount, IdentityRole>(options =>
{
    options.User.AllowedUserNameCharacters = null;
    options.User.RequireUniqueEmail = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();
// === Swagger ===
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CampusHub API", Version = "v1" });

    // Configurare JWT Bearer în Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Introduceți JWT în formatul: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new string[] {}
        }
    });
});


// === JWT Authentication ===
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Token failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine("Challenge error: " + context.ErrorDescription);
                return Task.CompletedTask;
            }
        };
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            RoleClaimType = ClaimTypes.Role
        };
        // Prevent redirect on unauthorized
        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\": \"Unauthorized\"}");
            }
        };
    });

// === CORS pentru Angular ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("https://localhost:4200", "https://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// === Altele ===
static async Task SeedAdminAsync(IServiceProvider serviceProvider)
{
    var userManager = serviceProvider.GetRequiredService<UserManager<UserAccount>>();
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string adminEmail = "admin@campushub.com";
    string adminPassword = "Admin123!";

    // Creează rolul dacă nu există
    if (!await roleManager.RoleExistsAsync("admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("admin"));
    }

    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        var user = new UserAccount
        {
            UserName = "admin",
            Email = adminEmail,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "admin");
        }
    }
}
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();

// === Pipeline ===
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapControllers();
app.Use(async (context, next) =>
{
    Console.WriteLine($"[Routing] {context.Request.Method} {context.Request.Path}");
    await next();
});
app.MapFallbackToFile("/index.html");
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedAdminAsync(services);
}
app.Run();
