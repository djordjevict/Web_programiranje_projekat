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
    public class MusterijaController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public MusterijaController(SalonContext context)
        {
            Context = context;
        }


        [Route("DodajMusteriju/{ime}/{prezime}")]
        [HttpPost]
        public async Task<ActionResult> DodajMusteriju(string ime, string prezime)
        {
            if (string.IsNullOrWhiteSpace(ime) || ime.Length > 20)
            {
                return BadRequest("Neispravno ime.");
            }

            if (string.IsNullOrWhiteSpace(prezime) || prezime.Length > 30)
            {
                return BadRequest("Neispravno prezime.");
            }

            try
            {
                var mus = await Context.Musterije.Where( p=> p.Ime == ime && p.Prezime == prezime).FirstOrDefaultAsync();
                if (mus != null)
                {
                    return Ok(mus.ID);
                }
                else
                {
                    Musterija musterija = new Musterija
                    {
                        Ime = ime,
                        Prezime = prezime
                    };
                    Context.Musterije.Add(musterija);
                    await Context.SaveChangesAsync();
                    var mu = await Context.Musterije.Where( p=> p.Ime == ime && p.Prezime == prezime).FirstOrDefaultAsync();
                    return Ok(mu.ID);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazMusterija")]
        [HttpGet]
        public async Task<ActionResult> PrikazMusterija()
        {
            try
            {
                return Ok(await Context.Musterije.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


    }
}