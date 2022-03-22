using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RadnikController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public RadnikController(SalonContext context)
        {
            Context = context;
        }


        [Route("DodajRadnika/{idSalona}")]
        [HttpPost]
        public async Task<ActionResult> DodajRadnika(int idSalona, [FromBody] Radnik radnik)
        {
            if (string.IsNullOrWhiteSpace(radnik.Ime) || radnik.Ime.Length > 20)
            {
                return BadRequest("Neispravno ime.");
            }

            if (string.IsNullOrWhiteSpace(radnik.Zanimanje))
            {
                return BadRequest("Neispravno zanimanje.");
            }

            try
            {
                var salon = await Context.Saloni.FindAsync(idSalona);
                radnik.Salon = salon;
                Context.Radnici.Add(radnik);
                await Context.SaveChangesAsync();
                return Ok("Radnik je dodat.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazRadnika")]
        [HttpGet]
        public async Task<ActionResult> PrikazRadnika()
        {
            try
            {
                var radnici = Context.Radnici/*.Include(p => p.Salon)*/;
                var radnik = await radnici.ToListAsync();
                return Ok(radnik);
               /* (
                    radnik.Select(p =>
                    new
                    {
                        Ime = p.Ime,
                        Zanimanje = p.Zanimanje,
                        Salon = p.Salon.Naziv
                    }).ToList()
                );*/
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazRadnikaPoSalonu/{id}")]
        [HttpGet]
        public async Task<ActionResult> PrikazRadnikaPoSalonu(int id)
        {
            try
            {
                var radnici = Context.Radnici.Include(p => p.Salon);
                var radnici1 = await radnici.Where( p=> p.Salon.ID == id).ToListAsync();
                return Ok(radnici1);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
    }
}