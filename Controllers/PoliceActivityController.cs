using Microsoft.AspNetCore.Mvc;
using PoliceActivityApp.Services;
using System.Threading.Tasks;

namespace PoliceActivityApp.Controllers
{
    public class PoliceActivityController : Controller
    {
        private readonly PoliceActivityService _policeActivityService;

        public PoliceActivityController(PoliceActivityService policeActivityService)
        {
            _policeActivityService = policeActivityService;
        }

        public async Task<IActionResult> Index()
        {
            var activities = await _policeActivityService.GetPoliceActivitiesAsync();
            return View(activities);
        }
    }
}
