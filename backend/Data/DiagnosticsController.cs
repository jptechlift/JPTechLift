using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;

        public DiagnosticsController(IDbContextFactory<ApplicationDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        [HttpPost("fk-test")]
        public async Task<IActionResult> ForeignKeyTest()
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            var username = $"user_{DateTime.UtcNow.Ticks}";
            var user = new User { Username = username };
            var blog = new Blog { Title = "debug", Username = username };

            context.Users.Add(user);
            context.Blogs.Add(blog);

            try
            {
                await context.SaveChangesAsync();
                return Ok("Success");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}