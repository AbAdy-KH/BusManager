using BusManager.Application.Common.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace BusManager.Api.Hubs
{
    public class TrackingHub : Hub
    {
        // Admin client joins the monitoring stream
        public async Task JoinAdminGroup()
        {
            // Require Admin role if authorization is configured
            if (Context.User?.IsInRole("Admin") == true)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");

                Console.WriteLine("admin connected");
            }
        }

        // Called by Driver clients
        public async Task SendBusLocation(BusLocationDto location)
        {
            if (Context.User?.IsInRole("Driver") == true)
            {
                // Broadcasts location strictly to connections in the "Admins" group
                await Clients.Group("Admins").SendAsync("ReceiveBusLocation", location);

                Console.WriteLine("Bus sent location");
            }

            Console.WriteLine(Context.User?.IsInRole("Driver"));
        }   
    }
}