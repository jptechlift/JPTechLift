using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using backend.Data;

// Đặt tên cho chính sách CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// load environment variables
Env.Load();

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL") ?? string.Empty;
Console.WriteLine($"--- Backend is connecting with URL: {databaseUrl} ---");

// *** BƯỚC 1: Thêm dịch vụ CORS ***
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // Thay "http://localhost:5173" bằng địa chỉ thực tế của React app
                          policy.WithOrigins("http://localhost:5173") 
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(ConvertConnectionString(databaseUrl)));

var port = Environment.GetEnvironmentVariable("BACKEND_PORT") ?? "5000";
builder.WebHost.UseUrls($"http://localhost:{port}");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// *** BƯỚC 2: Thêm CORS middleware vào pipeline ***
// Vị trí rất quan trọng: Phải đặt sau UseRouting và trước UseAuthorization.
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapControllers();

app.Run();

static string ConvertConnectionString(string url)
{
    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':');
    return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]}";
}