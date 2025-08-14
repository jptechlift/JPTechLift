using DotNetEnv;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        // Nạp các giá trị từ file .env
        Env.Load();

        // Lấy chuỗi kết nối từ môi trường hoặc file .env
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        // Cấu hình DbContext với chuỗi kết nối PostgreSQL
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(databaseUrl));  // Sử dụng Npgsql cho PostgreSQL

        var app = builder.Build();
        app.Run();
    }
}
