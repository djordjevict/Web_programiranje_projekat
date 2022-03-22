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
    public class SalonController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public SalonController(SalonContext context)
        {
            Context = context;
        }


        [Route("DodajSalon")]
        [HttpPost]
        public async Task<ActionResult> DodajSalon([FromBody] Salon salon)
        {
            if (string.IsNullOrWhiteSpace(salon.Naziv) || salon.Naziv.Length > 50)
            {
                return BadRequest("Neispravan naziv.");
            }

            if (string.IsNullOrWhiteSpace(salon.Adresa))
            {
                return BadRequest("Neispravna adresa.");
            }

            try
            {
                Context.Saloni.Add(salon);
                await Context.SaveChangesAsync();
                return Ok("Salon je dodat.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazSalona")]
        [HttpGet]
        public async Task<ActionResult> PrikazSalona()
        {
            try
            {
                var temp = await Context.Saloni
                                    .Include(p => p.Radnici)
                                /*    .ThenInclude(q => q.Termini)
                                    .ThenInclude(r => r.musterija)*/
                                    .ToListAsync();
                return Ok
                (
                    temp.Select(p =>
                    new
                    {
                        Id = p.ID,
                        Naziv = p.Naziv,
                        Adresa = p.Adresa,
                        Radnici = p.Radnici
                            .Select(q =>
                            new
                            {
                                Id = q.ID,
                                Ime = q.Ime,
                                Zanimanje = q.Zanimanje,
                                //Termini = q.Termini
                            })
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


    }
}