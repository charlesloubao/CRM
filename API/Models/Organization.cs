using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Organization
{
    [Key] public Guid OrganizationId { get; set; }
    [Required] public string Name { get; set; }
    [Required] DateTime CreatedAt { get; set; }
    [Required] DateTime UpdatedAt { get; set; }

    private List<OrganizationMember> Members { get; set; }
    private List<Contact> Contacts { get; set; }
}