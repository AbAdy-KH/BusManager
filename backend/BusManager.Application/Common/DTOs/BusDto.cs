namespace BusManager.Application.Common.DTOs
{
    public class BusDto
    {
        public string PlateNumber { get; set; } =  string.Empty;
        public int Capacity { get; set; }
        public int Number { get; set; }
        public bool IsActive { get; set; }

    }
}