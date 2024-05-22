using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using PoliceActivityApp.Models;

namespace PoliceActivityApp.Services
{
    public class PoliceActivityService
    {
        private readonly HttpClient _httpClient;

        public PoliceActivityService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<PoliceActivity>> GetPoliceActivitiesAsync()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters = { new CustomDateTimeConverter() }
            };

            var response = await _httpClient.GetStringAsync("https://polisen.se/api/events");
            return JsonSerializer.Deserialize<List<PoliceActivity>>(response, options) ?? new List<PoliceActivity>();
        }

    }
}
