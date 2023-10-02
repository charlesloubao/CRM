using System.Text.Json.Serialization;
using Microsoft.Build.Framework;

namespace API.Models;

public class EmailAddress
{
    [Required] public Guid EmailAddressId { get; set; }

    [Required] public DateTime CreatedAt { get; set; }
    [Required] public DateTime UpdatedAt { get; set; }

    [Required] public bool IsPrimary { get; set; }

    [Required] public Guid ContactId { get; set; }
    [JsonIgnore] public Contact Contact { get; set; }

    [Required] public Guid EmailAddressTypeId { get; set; }
    public EmailAddressType EmailAddressType { get; set; }

    [Required] public string Value { get; set; }
}