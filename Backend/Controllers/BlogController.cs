using Backend.Constants;
using Backend.Dtos.Blog;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace Backend.Controllers;

/// <summary>
/// Exposes CRUD operations for blogs.
/// </summary>
[ApiController]
public class BlogController : ControllerBase
{
    private readonly BlogService _blogService;
    private readonly AiBlogService _aiBlogService;
    private readonly ILogger<BlogController> _logger;

    public BlogController(
        BlogService blogService,
        AiBlogService aiBlogService,
        ILogger<BlogController> logger)
    {
        _blogService = blogService;
        _aiBlogService = aiBlogService;
        _logger = logger;
    }

    // --- CÁC PHƯƠNG THỨC KHÁC ĐƯỢC GIỮ NGUYÊN ---

    [HttpGet("/api/blogs")]
    public async Task<IActionResult> GetAll()
    {
        var blogs = await _blogService.GetAllAsync();
        return Ok(blogs);
    }

    [HttpGet("/api/blog/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var blog = await _blogService.GetBySlugAsync(slug);
        if (blog == null)
            return NotFound();
        return Ok(blog);
    }

    [HttpGet("/api/blog/recent")]
    public async Task<IActionResult> GetRecent([FromQuery] int? count)
    {
        var blogs = await _blogService.GetRecentAsync(count ?? 5);
        return Ok(blogs);
    }

    [HttpPost("/api/blog/generate-preview")]
    [Authorize]
    public async Task<IActionResult> GeneratePreview([FromBody] BlogRequest request)
    {
        var (title, slug, content, metaDescription) = await _blogService.GeneratePreviewAsync(request);
        return Ok(new { title, slug, generatedContent = content, previewUrl = $"/blogs/{slug}", metaDescription });
    }

    [HttpPost("/api/blog/publish")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Author)]
    public async Task<IActionResult> Publish([FromBody] BlogRequest request)
    {
        var username = User.Identity?.Name ?? string.Empty;
        var blog = await _blogService.PublishAsync(request, username);
        var blogDto = blog.ToDto();
        return CreatedAtAction(nameof(Publish), new { id = blogDto.Id }, blogDto);
    }

    [HttpPut("/api/blog/{id}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Author)]
    public async Task<IActionResult> Update(int id, [FromBody] BlogRequest request)
    {
        var username = User.Identity?.Name ?? string.Empty;
        var blog = await _blogService.UpdateAsync(id, request, username);
        if (blog == null)
            return NotFound();
        return Ok(blog);
    }

    [HttpDelete("/api/blog/{id}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Author)]
    public async Task<IActionResult> Delete(int id)
    {
        await _blogService.DeleteAsync(id);
        return NoContent();
    }


    // === PHIÊN BẢN CUỐI CÙNG CỦA PHƯƠNG THỨC TẠO BLOG TỪ TÀI LIỆU ===
    /// <summary>
    /// Generates a preview by extracting content directly from an uploaded document.
    /// </summary>
    /// <param name="file">The uploaded document file (.docx, .pdf, .txt).</param>
    [HttpPost("/api/blog/generate-from-document")]
    [Authorize] // Yêu cầu xác thực
    public async Task<IActionResult> GenerateFromDocument([FromForm] IFormFile file)
    {
        // 1. Kiểm tra đầu vào cơ bản
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Không có file nào được tải lên hoặc file trống." });
        }

        try
        {
            // 2. Gửi file trực tiếp đến AiBlogService để xử lý.
            // Service sẽ tự kiểm tra định dạng file và thực hiện logic trích xuất.
            var (title, slug, content, metaDescription) = await _aiBlogService.GenerateFromDocumentAsync(file);

            // 3. Trả về kết quả thành công cho frontend
            return Ok(new
            {
                title,
                slug,
                generatedContent = content, // Tên thuộc tính này phải khớp với frontend
                metaDescription
            });
        }
        // 4. Bắt các lỗi cụ thể từ service để trả về thông báo chính xác
        catch (NotSupportedException ex) // Bắt lỗi khi định dạng file không được hỗ trợ
        {
             _logger.LogWarning("Attempted to upload an unsupported file type. File: {FileName}, Message: {Message}", file.FileName, ex.Message);
             return BadRequest(new { message = ex.Message }); // Lỗi 400
        }
        catch (InvalidOperationException ex) // Bắt lỗi khi file hỏng hoặc trống
        {
            _logger.LogWarning(ex, "Document processing failed for file {FileName}. Message: {Message}", file.FileName, ex.Message);
            return BadRequest(new { message = ex.Message }); // Lỗi 400
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred while processing file {FileName}.", file.FileName);
            // Lỗi 500 cho các vấn đề không lường trước được ở server
            return StatusCode(500, new { message = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại." });
        }
    }
}