using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Radnik")]
    public class Radnik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(20)]
        public string Ime { get; set; }

        [Required]
        public string Zanimanje { get; set; }

        [JsonIgnore]
        public List<Termin> Termini { get; set; }

        [JsonIgnore]
        public Salon Salon { get; set; }
    }
}
