using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusManager.Application.Common.DTOs
{
    public record LoginRequestDto
    (
        string Email,
        string Password
    );
}