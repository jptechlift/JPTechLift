var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    // Dòng này sẽ yêu cầu backend không phân biệt chữ hoa-thường
    // khi đọc tên thuộc tính từ JSON mà frontend gửi lên.
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});
// Configure CORS to allow requests from the frontend
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
     // ================================================================
    // ===== BẮT ĐẦU VÙNG CODE GỠ LỖI (DEBUGGING) =======================
    // ================================================================
    Console.WriteLine("-----------------------------------------");
    Console.WriteLine(">>> ĐÃ NHẬN ĐƯỢC YÊU CẦU ĐĂNG NHẬP <<<");

    // Kiểm tra xem đối tượng request có bị null không
    if (request == null)
    {
        Console.WriteLine(">>> LỖI: Toàn bộ đối tượng request nhận được là NULL.");
    }
    else
    {
        // In ra giá trị thực tế của Username và Password mà backend nhận được
        // Dùng '?? "NULL"' để tránh lỗi nếu thuộc tính bị null
        Console.WriteLine($"--> Username nhận được: '{request.Username ?? "NULL"}'");
        Console.WriteLine($"--> Password nhận được: '{request.Password ?? "NULL"}'");
    }
    
    Console.WriteLine("-----------------------------------------");
    // ================================================================
    // ===== KẾT THÚC VÙNG CODE GỠ LỖI =================================
    // ================================================================
    // Very basic credential check and fake token generation
    if (request.Username == "admin" && request.Password == "1")
    {
        // Trả về một đối tượng JSON chứa cả message và token
    return Results.Ok(new { message = "Login successful", token = "day-la-mot-token-gia-dinh-dung-chuan" });
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