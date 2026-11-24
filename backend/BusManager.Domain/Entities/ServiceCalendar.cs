using System.ComponentModel.DataAnnotations;

namespace BusManager.Domain.Entities
{
    public class ServiceCalendar
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool Sunday { get; set; } = true;
        public bool Monday { get; set; } = true;
        public bool Tuesday { get; set; } = true;
        public bool Wednesday { get; set; } = true;
        public bool Thursday { get; set; } = true;
        public bool Friday { get; set; } = false;
        public bool Saturday { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public ICollection<CalendarTripTemplate> Templates { get; set; } = new List<CalendarTripTemplate>();
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();

        public bool RunsOnDate(DateTime date)
        {
            var d = date.Date;
            if (!IsActive || d < StartDate.Date || d > EndDate.Date)
                return false;

            return d.DayOfWeek switch
            {
                DayOfWeek.Sunday => Sunday,
                DayOfWeek.Monday => Monday,
                DayOfWeek.Tuesday => Tuesday,
                DayOfWeek.Wednesday => Wednesday,
                DayOfWeek.Thursday => Thursday,
                DayOfWeek.Friday => Friday,
                DayOfWeek.Saturday => Saturday,
                _ => false
            };
        }
    }
}
