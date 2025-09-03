using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using Backend.Dtos.Auth;
using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Administrative operations for managing users.
/// </summary>
[Authorize(Roles = "admin")]
[ApiController]
[Route("api/users")]
public class AdminUsersController : ControllerBase
{
    private readonly UserRepository _users;

    public AdminUsersController(UserRepository users)
    {
        _users = users;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _users.GetAllAsync();
        return Ok(users.Select(u => u.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _users.GetByIdAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user.ToDto());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(
        int id,
        [FromBody] AdminUserUpdateRequest request
    )
    {
        var user = await _users.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        var currentIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (
            int.TryParse(currentIdString, out var currentId)
            && currentId == id
            && request.Role != null
        )
        {
            return BadRequest(new { message = "Admin cannot modify their own role." });
        }

        if (request.Email != null && !new EmailAddressAttribute().IsValid(request.Email))
        {
            return BadRequest(new { message = "Invalid email." });
        }

        user.Username = request.Username ?? user.Username;
        user.Email = request.Email ?? user.Email;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
        user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
        user.CoverUrl = request.CoverUrl ?? user.CoverUrl;
        if (request.Role != null)
            user.Role = request.Role;
        if (request.IsActive.HasValue)
            user.IsActive = request.IsActive.Value;

        await _users.UpdateAsync(user);
        return Ok(user.ToDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var currentIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(currentIdString, out var currentId) && currentId == id)
        {
            return BadRequest(new { message = "Admin cannot delete themselves." });
        }

        await _users.DeleteAsync(id);
        return Ok(new { message = "User deleted." });
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] AdminUserCreateRequest request)
    {
        if (!new EmailAddressAttribute().IsValid(request.Email))
        {
            return BadRequest(new { message = "Invalid email." });
        }
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
        {
            return BadRequest(new { message = "Password too weak." });
        }

        var existing = await _users.GetByEmailAsync(request.Email);
        if (existing != null)
        {
            return Conflict(new { message = "Email already registered" });
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            AvatarUrl = request.AvatarUrl,
            CoverUrl = request.CoverUrl,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            IsActive = request.IsActive,
        };

        await _users.AddAsync(user);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user.ToDto());
    }
}
