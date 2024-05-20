using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

public class CustomDateTimeConverter : JsonConverter<DateTime>
{
    private readonly string[] DateTimeFormats = new[]
    {
        "yyyy-MM-dd HH:mm:ss zzz",
        "yyyy-MM-dd h:mm:ss tt zzz",
        "yyyy-MM-dd H:mm:ss zzz"
    };

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var dateString = reader.GetString();

        if (string.IsNullOrWhiteSpace(dateString))
        {
            // Return a default value if the date string is empty or null
            return DateTime.MinValue;
        }

        foreach (var format in DateTimeFormats)
        {
            if (DateTime.TryParseExact(dateString, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
            {
                return dateTime;
            }
        }

        throw new JsonException($"Unable to convert \"{dateString}\" to DateTime.");
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(DateTimeFormats[0], CultureInfo.InvariantCulture));
    }
}
