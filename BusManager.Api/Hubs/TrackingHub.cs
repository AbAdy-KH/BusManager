using Microsoft.AspNetCore.SignalR;

namespace BusManager.Api.Hubs
{
    public class TrackingHub : Hub
    {
        // Admin client joins the monitoring stream
        public async Task JoinAdminGroup()
        {
            // Require Admin role if authorization is configured
            if (Context.User?.IsInRole("Admin") ?? true)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
            }
        }        
    }
}