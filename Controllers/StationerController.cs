using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PoliceActivityApp.Services;
using Microsoft.Extensions.Logging;

namespace PoliceActivityApp.Controllers
{
    public class StationerController : Controller
    {

        private readonly ILogger<StationerController> _logger;

        public StationerController(ILogger<StationerController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View("Stationer");
        }

        public async Task<IActionResult> GetPoliceStations()
        {
            var url = "https://polisen.se/api/policestations";
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation("1");
                    try
                    {
                        // Deserialize the response to ensure it's a valid JSON
                        var stations = JsonConvert.DeserializeObject(data);
                        _logger.LogInformation("2");
                        // Serialize it back to JSON to return it as a proper JSON response
                        var jsonData = JsonConvert.SerializeObject(stations);
                        //PRINT the data to console
                        _logger.LogInformation("3");
                        return Content(jsonData, "application/json");
                    }
                    catch (JsonException ex)
                    {
                        return StatusCode(500, $"Error deserializing data: {ex.Message}");
                        _logger.LogInformation("4");
                    }
                }
                else
                {
                    _logger.LogInformation("5");
                    return StatusCode((int)response.StatusCode, "Error fetching data");
                }
            }
        }
    }
}
