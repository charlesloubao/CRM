using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Contact
{
    [Key] public Guid ContactId { get; set; }
    [Required] public string FirstName { get; set; }
    [Required(AllowEmptyStrings = true)] public string MiddleName { get; set; }
    [Required(AllowEmptyStrings = true)] public string LastName { get; set; }
    [Required(AllowEmptyStrings = true)] public string Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }

    public List<PhoneNumber> PhoneNumbers { get; set; }
    public List<EmailAddress> EmailAddresses { get; set; }
}