var builder = WebApplication.CreateBuilder(args);

// Configure CORS to allow requests from the frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowFrontend");

app.MapPost("/api/login", (LoginRequest request) =>
{
    if (request.Username == "admin" && request.Password == "password")
    {
        return Results.Ok("Login successful");
    }

    return Results.Text("Invalid credentials", statusCode: StatusCodes.Status401Unauthorized);
});

app.Run("http://0.0.0.0:5000");

record LoginRequest(string Username, string Password);