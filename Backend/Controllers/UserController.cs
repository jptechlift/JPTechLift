using System.Security.Claims;
using Backend.Dtos.Auth;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Manages user profile information.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserRepository _users;

    public UserController(UserRepository users)
    {
        _users = users;
    }

    /// <summary>
    /// Retrieves the profile of the authenticated user.
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var idValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (idValue == null)
            return Unauthorized();

        var user = await _users.GetByUsernameAsync(User.Identity?.Name ?? string.Empty);
        if (user == null)
            return NotFound();

        return Ok(user.ToDto());
    }

    /// <summary>
    /// Updates the authenticated user's profile.
    /// </summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest request)
    {
        var username = User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var user = await _users.GetByUsernameAsync(username);
        if (user == null)
            return NotFound();

        user.Email = request.Email ?? user.Email;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
        user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
        user.CoverUrl = request.CoverUrl ?? user.CoverUrl;

        await _users.UpdateAsync(user);
        var updatedDto = user.ToDto();
        return Ok(updatedDto);
    }
}
