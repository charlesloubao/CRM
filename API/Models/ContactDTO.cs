using System.ComponentModel.DataAnnotations;
using API.Controllers;

namespace API.Models;

public class ContactDTO
{
    [Required] public string FirstName { get; set; }
    [Required(AllowEmptyStrings = true)] public string MiddleName { get; set; }
    [Required(AllowEmptyStrings = true)] public string LastName { get; set; }
    [Required(AllowEmptyStrings = true)] public string Notes { get; set; }
    [Required] public List<PhoneNumberDTO> PhoneNumbers { get; set; }
    [Required] public List<EmailAddressDTO> EmailAddresses { get; set; }
    [Required] public List<Guid> PhoneNumbersToDelete { get; set; }
    [Required] public List<Guid> EmailAddressesToDelete { get; set; }
}