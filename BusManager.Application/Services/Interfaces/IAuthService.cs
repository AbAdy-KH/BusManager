using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using Microsoft.AspNetCore.Identity;

namespace BusManager.Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<IdentityResult> Register(RegisterUserDto dto);
        Task<LoginResponseDto> Login(LoginRequestDto dto);
    }
}