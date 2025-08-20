using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/blog")]
    public class BlogController : ControllerBase
    {
        private readonly NpgsqlDataSource _dataSource;
        public BlogController(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        public class ProductDetails
        {
            public string ProductName { get; set; } = string.Empty;
            public string ProductType { get; set; } = string.Empty;
        }

        public class TopicDetails
        {
            public string Topic { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
        }

        public class BlogRequest
        {
            public string BlogType { get; set; } = string.Empty;
            public ProductDetails? ProductDetails { get; set; }
            public TopicDetails? TopicDetails { get; set; }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] BlogRequest request)
        {
            var username = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            await using var conn = await _dataSource.OpenConnectionAsync();
            await using var tx = await conn.BeginTransactionAsync();
            try
            {
                var title = request.BlogType == "product"
                    ? request.ProductDetails?.ProductName
                    : request.TopicDetails?.Topic;
                if (title == null)
                {
                    return BadRequest("Invalid blog type or missing details.");
                }

                int blogId;
                await using (var cmd = new NpgsqlCommand("INSERT INTO blogs (title, username) VALUES (@title, @username) RETURNING id", conn, tx))
                {
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("username", username);
                    blogId = (int)await cmd.ExecuteScalarAsync();
                }

                if (request.BlogType == "product" && request.ProductDetails != null)
                {
                    await using var cmd = new NpgsqlCommand("INSERT INTO productblogs (blogid, productname, producttype) VALUES (@id, @name, @type)", conn, tx);
                    cmd.Parameters.AddWithValue("id", blogId);
                    cmd.Parameters.AddWithValue("name", request.ProductDetails.ProductName);
                    cmd.Parameters.AddWithValue("type", request.ProductDetails.ProductType);
                    await cmd.ExecuteNonQueryAsync();
                }
                else if (request.BlogType == "topic" && request.TopicDetails != null)
                {
                    await using var cmd = new NpgsqlCommand("INSERT INTO topicblogs (blogid, topic, content) VALUES (@id, @topic, @content)", conn, tx);
                    cmd.Parameters.AddWithValue("id", blogId);
                    cmd.Parameters.AddWithValue("topic", request.TopicDetails.Topic);
                    cmd.Parameters.AddWithValue("content", request.TopicDetails.Content);
                    await cmd.ExecuteNonQueryAsync();
                }
                else
                {
                    return BadRequest("Invalid blog type or missing details.");
                }

                await tx.CommitAsync();
                return Ok(new { message = "Blog đã được tạo thành công!", blogId });
            }
            catch (Exception)
            {
                await tx.RollbackAsync();
                return StatusCode(500, "An internal error occurred while creating the blog.");
            }
        }
    }
}