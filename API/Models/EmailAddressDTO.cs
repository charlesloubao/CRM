using Microsoft.Build.Framework;

namespace API.Models;

// Used for CRUD email addresses on new and existing contacts so contactId and emailAddressId are optional
public class EmailAddressDTO
{
    public Guid? ContactId { get; set; }
    public Guid? EmailAddressId { get; set; }
    [Required] public Guid EmailAddressTypeId { get; set; }
    [Required] public string Value { get; set; }
}