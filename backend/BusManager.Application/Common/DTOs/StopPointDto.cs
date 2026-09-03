namespace BusManager.Application.Common.DTOs
{
    public class StopPointDto
    {

        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public bool IsDropPoint { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }    
}