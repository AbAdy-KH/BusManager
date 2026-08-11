
namespace BusManager.Application.Common.DTOs.Auth
{
    public record TokensDto
    (
        string AccessToken,
        string RefreshToken
    );
}