using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// load environment variables
Env.Load();

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL") ?? string.Empty;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(ConvertConnectionString(databaseUrl)));

// Use a dedicated environment variable for the backend port to avoid
// clashing with the PORT variable used by other tools (e.g. Vite).
var port = Environment.GetEnvironmentVariable("BACKEND_PORT") ?? "5000";

builder.WebHost.UseUrls($"http://*:{port}");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthorization();

// basic root endpoint so '/' doesn't 404
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapControllers();

app.Run();

static string ConvertConnectionString(string url)
{
    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':');
    return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]}";
}
