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
    public class UslugaController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public UslugaController(SalonContext context)
        {
            Context = context;
        }


        [Route("DodajUslugu")]
        [HttpPost]
        public async Task<ActionResult> DodajUslugu([FromBody] Usluga usluga)
        {
            if (string.IsNullOrWhiteSpace(usluga.TipUsluge))
            {
                return BadRequest("Neispravan tip usluge.");
            }

            try
            {
                Context.Usluge.Add(usluga);
                await Context.SaveChangesAsync();
                return Ok("Usluga je dodata.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PrikazUsluga")]
        [HttpGet]
        public async Task<ActionResult> PrikazUsluga()
        {
            try
            {
                return Ok(await Context.Usluge.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("IzbrisiUslugu")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiUslugu(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Pogrešan ID!");
            }

            try
            {
                var usluga = await Context.Usluge.FindAsync(id);
                Context.Usluge.Remove(usluga);
                await Context.SaveChangesAsync();
                return Ok("Uspešno izbrisana usluga.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}