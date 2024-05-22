using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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

        public async Task<IActionResult> GetEventsByDate(string date)
        {
            if (string.IsNullOrEmpty(date))
            {
                return BadRequest("Date is required");
            }

            var url = $"https://polisen.se/api/events?DateTime={date}";
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();

                    try
                    {
                        // Deserialize the response to ensure it's a valid JSON
                        var events = JsonConvert.DeserializeObject(data);

                        // Serialize it back to JSON to return it as a proper JSON response
                        var jsonData = JsonConvert.SerializeObject(events);
                        return Content(jsonData, "application/json");
                    }
                    catch (JsonException ex)
                    {
                        return StatusCode(500, $"Error deserializing data: {ex.Message}");
                    }
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "Error fetching data");
                }
            }
        }
    }
}
