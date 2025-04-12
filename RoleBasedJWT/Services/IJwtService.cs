using RoleBasedJWT.Models;

namespace RoleBasedJWT.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
