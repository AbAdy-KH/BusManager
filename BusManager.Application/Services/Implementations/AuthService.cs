using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using BusManager.Application.Common.DTOs.Auth;


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
                    LicenseNumber = dto.LicenseNumber
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
    
        public async Task<TokensDto?> Login(LoginRequestDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return null;

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid) return null;

            return await _GenerateAndSaveTokens(user);
        }

        public async Task<TokensDto?> Refresh(TokensDto dto)
        {
            var principal = _GetPrincipalFromExpiredToken(dto.AccessToken);
            if(principal == null) return null;

            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if(string.IsNullOrEmpty(userId)) return null;

            var user = await _userManager.FindByIdAsync(userId);
            if(user == null || user.RefreshTokenRevokedAt != null || user.RefreshTokenExpiresAt <= DateTime.UtcNow) return null;

            bool isValidRefreshToken = BCrypt.Net.BCrypt.Verify(dto.RefreshToken, user.RefreshTokenHash);
            if(!isValidRefreshToken) return null;

            return await _GenerateAndSaveTokens(user);
        }

        public async Task<bool> Logout(TokensDto dto)
        {
            var principal = _GetPrincipalFromExpiredToken(dto.AccessToken);
            if(principal == null) return false;

            string? userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if(string.IsNullOrEmpty(userId)) return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            bool isValidRefreshToken = BCrypt.Net.BCrypt.Verify(dto.RefreshToken, user.RefreshTokenHash);
            if(!isValidRefreshToken) return false;

            user.RefreshTokenHash = null;
            user.RefreshTokenExpiresAt = null;
            user.RefreshTokenRevokedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
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
        
        private string _GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        private async Task<TokensDto> _GenerateAndSaveTokens(User user)
        {
            string refreshToken = _GenerateRefreshToken();

            user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            user.RefreshTokenRevokedAt = null;

            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);
            string accessToken = _GenerateJwtToken(user, roles); 

            return new TokensDto(
                AccessToken: accessToken,
                RefreshToken: refreshToken
            );          
        }
        
        private ClaimsPrincipal? _GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)),
                ValidateLifetime = false // IMPORTANT: ignore expiration date here
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }

            return principal;
        }
    }
}