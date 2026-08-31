
namespace BusManager.Application.Common.DTOs.Auth
{
    public record RefreshTokenRequestDto
    (
        string AccessToken,
        string RefreshToken
    );
}