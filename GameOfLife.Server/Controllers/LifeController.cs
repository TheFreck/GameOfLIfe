using Microsoft.AspNetCore.Mvc;

namespace GameOfLife.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LifeController : ControllerBase
    {
        [HttpGet("/life")]
        public IActionResult Get() => Ok("Got it");

        [HttpGet("/getlife")]
        public IActionResult GetLife() => Ok("You got life");

        [HttpPost("/generation")]
        public IActionResult Generation([FromBody]bool[][] life)
        {
            return Ok(Life.Proceed(life));
        }

        [HttpPost("/{num}/generations")]
        public IActionResult Generations([FromBody]bool[][] life, int num)
        {
            return Ok(Life.ProceedMany(life, num));
        }
    }
}
