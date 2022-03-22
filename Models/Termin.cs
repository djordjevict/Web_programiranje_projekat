using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Termin")]
    public class Termin
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Dan { get; set; }

        [Required]
        public string Vreme { get; set; }

        [JsonIgnore]
        public Musterija musterija { get; set; }
        
        [JsonIgnore]
        public Usluga usluga { get; set; }
        
        [JsonIgnore]
        public Radnik radnik { get; set; }
    }
}