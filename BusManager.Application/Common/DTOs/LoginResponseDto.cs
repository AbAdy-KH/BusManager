using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusManager.Application.Common.DTOs
{
    public record LoginResponseDto
    (
        string Token,
        string UserId,
        IList<string> Roles
    );
}