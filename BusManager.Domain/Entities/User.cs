using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BusManager.Domain.Entities
{
    public enum UserRole { Admin = 1, Driver = 2, Student = 3 }

    public class User : IdentityUser
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string RefreshTokenHash { get; set; }
        public DateTime? RefreshTokenExpiresAt { get; set; }
        public DateTime? RefreshTokenRevokedAt { get; set; }
    }
}