using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class ContactDTO
{
    [Required] public string FirstName { get; set; }
    [Required] public string MiddleInitial { get; set; }
    [Required] public string LastName { get; set; }
    [Required] public string Notes { get; set; }
}