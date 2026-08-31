using System.Security.Claims;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.DTOs.Auth;
using BusManager.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterUserDto dto)
        {
            var result = await _authService.Register(dto);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem(ModelState);
            }

            return Ok(new { Message = "User registered successfully." });
        }
    
        [HttpPost("login")]
        [EnableRateLimiting("AuthLimit")]
        public async Task<ActionResult<TokensDto>> Login(LoginRequestDto dto)
        {
            var result = await _authService.Login(dto);

            if (result == null) return Unauthorized("Unauthorized access");

            return Ok(result);
        }

        [HttpPost("refresh")]
        [EnableRateLimiting("AuthLimit")]
        public async Task<ActionResult<TokensDto>> Refresh (TokensDto dto)
        {
            var result = await _authService.Refresh(dto);

            if (result == null) return Unauthorized("Unauthorized access");

            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout(TokensDto dto)
        {   
            // var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // if(string.IsNullOrEmpty(userId)) return Unauthorized(); 

            bool result = await _authService.Logout(dto);

            if (result == false) return BadRequest("Could not log out user.");

            return Ok(new { Message = "User loged out successfully." });
        }
    }
}