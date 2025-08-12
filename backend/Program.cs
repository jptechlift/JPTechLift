var builder = WebApplication.CreateBuilder(args);

// Allow the React frontend to call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// In-memory store for a single user and blog posts
builder.Services.AddSingleton<DataStore>();

var app = builder.Build();

app.UseCors("AllowFrontend");

// ----- Authentication -----
app.MapPost("/api/login", (LoginRequest request) =>
{
    // Very basic credential check and fake token generation
    if (request.Username == "admin" && request.Password == "password")
    {
        return Results.Ok(new { token = "fake-jwt-token" });
    }

    return Results.Text("Invalid credentials", statusCode: StatusCodes.Status401Unauthorized);
});

// ----- User profile -----
app.MapGet("/api/user", (DataStore store) => Results.Ok(store.User));

app.MapPut("/api/user", (UserProfile profile, DataStore store) =>
{
    store.User = profile;
    return Results.Ok(store.User);
});

// ----- Blog posts -----
app.MapGet("/api/blogs", (DataStore store) => Results.Ok(store.Blogs));

app.MapPost("/api/blogs", (BlogPost post, DataStore store) =>
{
    post.Id = Guid.NewGuid();
    store.Blogs.Add(post);
    return Results.Ok(post);
});

app.Run("http://0.0.0.0:5000");

record LoginRequest(string Username, string Password);

class DataStore
{
    public UserProfile User { get; set; } = new();
    public List<BlogPost> Blogs { get; } = new();
}

class UserProfile
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? AvatarUrl { get; set; }
    public string? CoverUrl { get; set; }
}

class BlogPost
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
}