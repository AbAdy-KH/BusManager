using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BusManager.Domain.Entities
{
    public enum UserRole { Admin = 1, Driver = 2, Student = 3 }

    public class User : IdentityUser
    {
        // IdentityUser provides: Id, Email, PhoneNumber, and PasswordHash!

        [Required]
        public string Name { get; set; } = string.Empty;
    }
}