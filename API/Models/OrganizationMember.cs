using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class OrganizationMember
{
    [Key] public string UserId { get; set; }
    [Required] public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public DateTime AddedOn { get; set; }
}