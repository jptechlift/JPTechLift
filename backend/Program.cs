using DotNetEnv;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        Env.Load();

        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL") ?? string.Empty;

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(ConvertConnectionString(databaseUrl)));

        var app = builder.Build();

        app.MapControllers();

        app.Run();
    }

    private static string ConvertConnectionString(string url)
    {
        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':');
        return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]}";
    }
}