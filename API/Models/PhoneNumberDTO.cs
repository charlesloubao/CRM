using Microsoft.Build.Framework;

namespace API.Models;

// Used for CRUD phone numbers on new and existing contacts so contactId and phoneNumberId are optional
public class PhoneNumberDTO
{
    public Guid? ContactId { get; set; }
    public Guid? PhoneNumberId { get; set; }
    [Required] public Guid PhoneNumberTypeId { get; set; }
    [Required] public string Value { get; set; }
}