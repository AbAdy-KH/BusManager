using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BusManager.Application.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;

        public AuthService(
            UserManager<User> userManager, 
            RoleManager<IdentityRole> roleManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
        }

        public async Task<IdentityResult> Register(RegisterUserDto dto)
        {
            User user = dto.Role switch
            {
                UserRole.Driver => new Driver
                {
                    UserName = dto.Email,
                    Email = dto.Email,
                    Name = dto.Name,
                    LicenseNumber = dto.LicenseNumber,
                    BusId = dto.BusId
                },
                _ => throw new ArgumentException("Invalid user type")
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) return result;

            string roleName = dto.Role.ToString();

            if (!await _roleManager.RoleExistsAsync(roleName))
                await _roleManager.CreateAsync(new IdentityRole(roleName));

            await _userManager.AddToRoleAsync(user, roleName);

            return result;
        }
    
        public async Task<LoginResponseDto> Login(LoginRequestDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return null;

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid) return null;

            var roles = await _userManager.GetRolesAsync(user);
            string token = _GenerateJwtToken(user, roles);

            return new LoginResponseDto(
                Token: token,
                UserId: user.Id,
                Roles: roles
            );
        }

        private string _GenerateJwtToken(User user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim("Name", user.Name)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);            
        }
    }
}