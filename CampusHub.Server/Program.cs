using AngularApp1.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
using AngularApp1.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure Database
// Simi : DESKTOP-3KFCOVV\SQLEXPRESS
// Chio : DESKTOP-SH9UD67\\SQLEXPRESS
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=DESKTOP-3KFCOVV\\SQLEXPRESS;Initial Catalog=CampusHub;Integrated Security=True;Connect Timeout=30;Encrypt=True;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// 🔹 Configure Identity - Choose ONE of these options:

// OPTION 1: If using custom UserAccount (recommended)
builder.Services.AddIdentity<UserAccount, IdentityRole>(options =>
{
    options.User.AllowedUserNameCharacters = null; // Allow any characters
    options.User.RequireUniqueEmail = false;      // Allow duplicate emails
})
.AddEntityFrameworkStores<AppDbContext>();



// 🔹 Enable CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging();
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();