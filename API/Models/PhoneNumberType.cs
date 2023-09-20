using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class PhoneNumberType
{
    [Key] public Guid PhoneNumberTypeId { get; set; }
    [Required] public string Name { get; set; }

    // Users can add custom contact types to their organizations
    public Guid? OrganizationId { get; set; }
    public Organization? Organization { get; set; }
}