using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

namespace BusManager.Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<IdentityResult> Register(RegisterUserDto dto);
        Task<TokensDto> Login(LoginRequestDto dto);
        Task<TokensDto> Refresh(TokensDto dto);
        Task<bool> Logout(TokensDto dto);


    }
}