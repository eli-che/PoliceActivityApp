using System;
using System.Text.Json.Serialization;

namespace PoliceActivityApp.Models
{
    public class PoliceActivity
    {
        public int Id { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime Datetime { get; set; }

        public string Name { get; set; }
        public string Summary { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public Location Location { get; set; }
    }

    public class Location
    {
        public string Name { get; set; }
        public string Gps { get; set; }
    }
}
