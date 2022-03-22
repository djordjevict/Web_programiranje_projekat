using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Usluga")]
    public class Usluga
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string TipUsluge { get; set; }

         [JsonIgnore]
        public List<Termin> Termini { get; set; }
    }
}