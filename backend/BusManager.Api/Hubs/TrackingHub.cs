using BusManager.Application.Common.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BusManager.Api.Hubs
{
    [Authorize]
    public class TrackingHub : Hub
    {
        public async Task JoinAdminGroup()
        {
            if (Context.User?.IsInRole("Admin") == true)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
            }
        }

        public async Task SendBusLocation(BusLocationDto location)
        {
            if (Context.User?.IsInRole("Driver") == true)
            {
                await Clients.Group("Admins").SendAsync("ReceiveBusLocation", location);
            }
        }
    }
}
