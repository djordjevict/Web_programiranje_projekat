using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class SalonContext : DbContext
    {
        public DbSet<Salon> Saloni { get; set; }
        public DbSet<Radnik> Radnici { get; set; }
        public DbSet<Musterija> Musterije { get; set; }
        public DbSet<Usluga> Usluge { get; set; }
        public DbSet<Termin> Termin { get; set; }

        public SalonContext(DbContextOptions options) : base(options)
        {

        }
    }
}