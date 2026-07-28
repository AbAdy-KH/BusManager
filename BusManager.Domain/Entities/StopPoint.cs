using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using NetTopologySuite.Geometries;

namespace BusManager.Domain.Entities
{
    public class StopPoint
    {

        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Address { get; set; }
        
        [Required]
        [Precision(9, 6)]
        public decimal Latitude { get; set; }

        [Required]
        [Precision(9, 6)]
        public decimal Longitude { get; set; }
        
        // // SpatialPoint synced automatically with SRID 4326 (WGS84)
        // [NotMapped]
        // public Point SpatialPoint 
        // {
        //     get => new Point((double)Longitude, (double)Latitude) { SRID = 4326 };
        //     private set { }
        // }

        [Required]
        public bool IsDropPoint { get; set; } = true;
        
        [Required]
        public bool IsActive { get; set; } = true;
    }
}