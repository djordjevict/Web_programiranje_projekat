using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TerminController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public TerminController(SalonContext context)
        {
            Context = context;
        }


        [Route("PrikazTermina")]
        [HttpGet]
        public async Task<ActionResult> PrikazTermina()
        {
            try
            {
                var termini = Context.Termin
                                .Include(p => p.musterija)
                                .Include(p => p.usluga)
                                .Include(p => p.radnik);
                var lista = await termini.ToListAsync();
                return Ok
                (
                    lista.Select(p =>
                    new
                    {
                        Dan = p.Dan,
                        Vreme = p.Vreme,
                        Musterija = p.musterija.Ime,
                        Usluga = p.usluga.TipUsluge,
                        Radnik = p.radnik.Ime
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazTerminaPoRadniku/{idRadnika}")]
        [HttpGet]
        public async Task<ActionResult> PrikazTerminaPoRadniku(int idRadnika)
        {
            try
            {
                var termini = Context.Termin
                                .Include(p => p.musterija)
                                .Include(p => p.usluga)
                                .Include(p => p.radnik)
                                .Where(p => p.radnik.ID == idRadnika);
                                
                var lista = await termini.ToListAsync();
                return Ok
                (
                    lista.Select(p =>
                    new
                    {
                        ID = p.ID,
                        Dan = p.Dan,
                        Vreme = p.Vreme,
                        Musterija = p.musterija.ID,
                        Usluga = p.usluga.TipUsluge,
                        Radnik = p.radnik.Ime
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PrikazTerminaPoMusteriji/{idMusterije}")]
        [HttpGet]
        public async Task<ActionResult> PrikazTerminaPoMusteriji(int idMusterije)
        {
            try
            {
                var termini = Context.Termin
                                .Include(p => p.musterija)
                                .Include(p => p.usluga)
                                .Include(p => p.radnik)
                                .ThenInclude(p => p.Salon)
                                .Where(p => p.musterija.ID == idMusterije);
                                
                var lista = await termini.ToListAsync();
                return Ok
                (
                    lista.Select(p =>
                    new
                    {
                        Id = p.ID,
                        Dan = p.Dan,
                        Vreme = p.Vreme,
                        Usluga = p.usluga.TipUsluge,
                        RadnikIme = p.radnik.Ime,
                        RadnikSalon = p.radnik.Salon.ID
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazTerminaPoID/{id}")]
        [HttpGet]
        public async Task<ActionResult> PrikazTerminaPoID(int id)
        {
            try
            {
                var termini = Context.Termin
                                .Include(p => p.musterija)
                                .Include(p => p.usluga)
                                .Include(p => p.radnik)
                                .ThenInclude(p => p.Salon)
                                .Where(p => p.ID == id);
                                
                var termin = await termini.ToListAsync();
                return Ok
                (
                    termin.Select(p =>
                    new
                    {
                        Id = p.ID,
                        Dan = p.Dan,
                        Vreme = p.Vreme,
                        Usluga = p.usluga.ID,
                        RadnikID = p.radnik.ID,
                        RadnikSalon = p.radnik.Salon.ID
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("DodajTermin/{idMusterije}/{idUsluge}/{idRadnika}/{dan}/{vreme}")]
        [HttpPost]
        public async Task<ActionResult> DodajTermin(int idMusterije, int idUsluge, int idRadnika, string dan, string vreme)
        {
            if (!("Ponedeljak".Contains(dan) == true || "Utorak".Contains(dan) == true || "Sreda".Contains(dan) == true
                || "Cetvrtak".Contains(dan) == true || "Petak".Contains(dan) == true || "Subota".Contains(dan) == true))
            {
                return BadRequest("Neodgovarajuci dan");
            }

            try
            {
                var m = await Context.Musterije.FindAsync(idMusterije);
                var u = await Context.Usluge.FindAsync(idUsluge);
                var r = await Context.Radnici.FindAsync(idRadnika);

                Termin t = new Termin
                {
                    musterija = m,
                    usluga = u,
                    radnik = r,
                    Dan = dan,
                    Vreme = vreme
                };

                Context.Termin.Add(t);
                await Context.SaveChangesAsync();
                return Ok("Termin je dodat.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PromeniTermin/{idTermina}/{dan}/{vreme}/{idUsluge}")]
        [HttpPut]
        public async Task<ActionResult> PromeniTermin(int idTermina, string dan, string vreme, int idUsluge)
        {
            if (!("Ponedeljak".Contains(dan) == true || "Utorak".Contains(dan) == true || "Sreda".Contains(dan) == true
                || "Cetvrtak".Contains(dan) == true || "Petak".Contains(dan) == true || "Subota".Contains(dan) == true))
            {
                return BadRequest("Neodgovarajuci dan");
            }

            try
            {
                var termin = Context.Termin.Where(p => p.ID == idTermina).FirstOrDefault();
                var usluga = Context.Usluge.Where(p => p.ID == idUsluge).FirstOrDefault();

                if (termin != null)
                {
                    termin.Dan = dan;
                    termin.Vreme = vreme;
                    termin.usluga = usluga;

                    await Context.SaveChangesAsync();
                    return Ok("Uspešno izmenjen termin.");
                }
                else
                {
                    return BadRequest("Doslo je do greske!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("OtkaziTermin/{id}")]
        [HttpDelete]
        public async Task<ActionResult> OtkaziTermin(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Pogrešan ID!");
            }

            try
            {
                var termin = await Context.Termin.FindAsync(id);
                Context.Termin.Remove(termin);
                await Context.SaveChangesAsync();
                return Ok("Uspešno otkazan termin.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}