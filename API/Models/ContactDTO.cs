using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class ContactDTO
{
    [Required] public string FirstName { get; set; }
    [Required(AllowEmptyStrings = true)] public string MiddleName { get; set; }
    [Required(AllowEmptyStrings = true)] public string LastName { get; set; }
    [Required(AllowEmptyStrings = true)] public string Notes { get; set; }
}