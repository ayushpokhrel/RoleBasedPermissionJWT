using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RoleBasedJWT.Models;
using RoleBasedJWT.Services;

namespace RoleBasedJWT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;
        public AuthController(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }

        // Mock users (replace with DB later)
        private readonly List<User> users = new()
    {
        new User { Id = 1, Username = "admin", Password = "admin123", Role = "Admin" },
        new User { Id = 2, Username = "user", Password = "user123", Role = "User" }
    };

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = users.SingleOrDefault(u =>
                u.Username == request.Username && u.Password == request.Password);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            if (_jwtService == null)
            {
                return BadRequest("JWT service not injected.");
            }
            var token = _jwtService.GenerateToken(user);
            return Ok(new AuthResponse { Token = token });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public IActionResult OnlyAdminCanAccess()
        {
            return Ok("Welcome Admin! 🎉");
        }

        [Authorize(Roles = "User")]
        [HttpGet("user")]
        public IActionResult OnlyUserCanAccess()
        {
            return Ok("Hello User! 👋");
        }

    }
}
