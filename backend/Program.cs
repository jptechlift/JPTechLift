// using DotNetEnv; // Tạm thời không dùng DotNetEnv nữa
using Microsoft.EntityFrameworkCore;
using backend.Data;

// Đặt tên cho chính sách CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// ... các services khác
builder.Services.AddHttpClient();

// ====================================================================
// BƯỚC 1: SỬA LỖI BẰNG CÁCH GÁN CỨNG CHUỖI KẾT NỐI
// Chúng ta sẽ bỏ qua việc đọc file .env và biến môi trường để đảm bảo
// backend kết nối đến đúng database mà bạn đang xem trên pgAdmin.
// ====================================================================
var hardcodedConnectionString = "Host=localhost;Port=5432;Database=JPTechLift;Username=postgres;Password=jptechlift";

// Thêm một dòng log thật lớn để bạn biết chắc chắn code mới đã được chạy
Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
Console.WriteLine("!!! CẢNH BÁO: ĐANG SỬ DỤNG CHUỖI KẾT NỐI GÁN CỨNG ĐỂ DEBUG !!!");
Console.WriteLine($"!!! -> {hardcodedConnectionString}");
Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


// *** Thêm dịch vụ CORS ***
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") 
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ====================================================================
// BƯỚC 2: SỬ DỤNG CHUỖI KẾT NỐI ĐÃ GÁN CỨNG Ở TRÊN
// ====================================================================
builder.Services.AddDbContextFactory<ApplicationDbContext>(options =>
    options.UseNpgsql(hardcodedConnectionString) // <-- Sử dụng biến mới ở đây
           .EnableDetailedErrors());

var port = "5000"; // Tạm thời gán cứng cổng backend luôn cho chắc chắn
builder.WebHost.UseUrls($"http://localhost:{port}");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapControllers();

app.Run();

// Hàm này không còn cần thiết nữa vì chúng ta đã dùng chuỗi kết nối chuẩn
/*
static string ConvertConnectionString(string url)
{
    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':');
    return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]}";
}
*/