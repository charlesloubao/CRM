using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DB;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [Route("api/organizations/{organizationId:guid}/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ContactsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<Contact>>> GetContacts(Guid organizationId)
        {
            var user = HttpContext.User.Claims;
            await using (_dbContext)
            {
                var contacts = await _dbContext.Contacts
                    .Include(contact => contact.EmailAddresses)
                    .Include(contact => contact.PhoneNumbers)
                    .Where(contact => contact.OrganizationId == organizationId)
                    .ToListAsync();
                return Ok(contacts);
            }
        }

        [HttpGet("{contactId:guid}")]
        public async Task<ActionResult<Contact>> GetContactById(Guid organizationId, Guid contactId)
        {
            await using (_dbContext)
            {
                var contact = await _dbContext.Contacts
                    .Include(contact => contact.EmailAddresses)
                    .ThenInclude(emailAddress => emailAddress.EmailAddressType)
                    .Include(contact => contact.PhoneNumbers)
                    .ThenInclude(phoneNumber => phoneNumber.PhoneNumberType)
                    .FirstOrDefaultAsync(contact => contact.OrganizationId == organizationId
                                                    && contact.ContactId == contactId);

                if (contact == null) return NotFound();

                return Ok(contact);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> CreateContact(Guid organizationId, ContactDTO data)
        {
            await using (_dbContext)
            {
                var contact = new Contact()
                {
                    ContactId = Guid.NewGuid(),
                    FirstName = data.FirstName,
                    MiddleName = data.MiddleName,
                    LastName = data.LastName,
                    Notes = data.Notes,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    OrganizationId = organizationId,
                    PhoneNumbers = data.PhoneNumbers.Select(phoneData => new PhoneNumber()
                    {
                        PhoneNumberId = Guid.NewGuid(),
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        PhoneNumberTypeId = phoneData.PhoneNumberTypeId,
                        Value = phoneData.Value
                    }).ToList(),
                    EmailAddresses = data.EmailAddresses.Select(emailAddressData => new EmailAddress()
                    {
                        EmailAddressId = Guid.NewGuid(),
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        EmailAddressTypeId = emailAddressData.EmailAddressTypeId,
                        Value = emailAddressData.Value
                    }).ToList()
                };

                _dbContext.Contacts.Add(contact);
                await _dbContext.SaveChangesAsync();

                return Ok(contact);
            }
        }


        [HttpPut("{contactId:guid}")]
        public async Task<ActionResult<Contact>> UpdateContact(Guid contactId, Guid organizationId, ContactDTO data)
        {
            await using (_dbContext)
            {
                var contact = await _dbContext.Contacts
                    .Include(contact => contact.EmailAddresses)
                    .Include(contact => contact.PhoneNumbers)
                    .FirstOrDefaultAsync(contact =>
                        contact.OrganizationId == organizationId && contact.ContactId == contactId);

                if (contact == null) return BadRequest();

                contact.FirstName = data.FirstName;
                contact.MiddleName = data.MiddleName;
                contact.LastName = data.LastName;
                contact.Notes = data.Notes;
                contact.UpdatedAt = DateTime.Now;

                PhoneNumber? existingPhoneNumber;
                foreach (var numberDto in data.PhoneNumbers)
                {
                    if (numberDto.PhoneNumberId == null)
                    {
                        _dbContext.PhoneNumbers.Add(new PhoneNumber()
                        {
                            PhoneNumberId = Guid.NewGuid(),
                            ContactId = contact.ContactId,
                            PhoneNumberTypeId = numberDto.PhoneNumberTypeId,
                            Value = numberDto.Value,
                            UpdatedAt = DateTime.Now,
                            CreatedAt = DateTime.Now
                        });
                    }
                    else
                    {
                        existingPhoneNumber =
                            contact.PhoneNumbers.FirstOrDefault(value =>
                                value.PhoneNumberId == numberDto.PhoneNumberId);

                        if (existingPhoneNumber == null) return BadRequest();

                        existingPhoneNumber.Value = numberDto.Value;
                        existingPhoneNumber.UpdatedAt = DateTime.Now;
                        existingPhoneNumber.PhoneNumberTypeId = numberDto.PhoneNumberTypeId;
                    }
                }

                foreach (var phoneNumberId in data.PhoneNumbersToDelete)
                {
                    existingPhoneNumber =
                        contact.PhoneNumbers.FirstOrDefault(value => value.PhoneNumberId == phoneNumberId);

                    if (existingPhoneNumber == null) return BadRequest();

                    contact.PhoneNumbers.Remove(existingPhoneNumber);
                }

                EmailAddress? existingEmailAddress;
                foreach (var emailAddressDto in data.EmailAddresses)
                {
                    if (emailAddressDto.EmailAddressId == null)
                    {
                        _dbContext.EmailAddresses.Add(new EmailAddress()
                        {
                            EmailAddressId = Guid.NewGuid(),
                            ContactId = contact.ContactId,
                            EmailAddressTypeId = emailAddressDto.EmailAddressTypeId,
                            Value = emailAddressDto.Value,
                            UpdatedAt = DateTime.Now,
                            CreatedAt = DateTime.Now
                        });
                    }
                    else
                    {
                        existingEmailAddress =
                            contact.EmailAddresses.FirstOrDefault(value =>
                                value.EmailAddressId == emailAddressDto.EmailAddressId);

                        if (existingEmailAddress == null) return BadRequest();

                        existingEmailAddress.Value = emailAddressDto.Value;
                        existingEmailAddress.UpdatedAt = DateTime.Now;
                        existingEmailAddress.EmailAddressTypeId = emailAddressDto.EmailAddressTypeId;
                    }
                }

                foreach (var emailAddressId in data.EmailAddressesToDelete)
                {
                    existingEmailAddress =
                        contact.EmailAddresses.FirstOrDefault(value => value.EmailAddressId == emailAddressId);

                    if (existingEmailAddress == null) return BadRequest();

                    contact.EmailAddresses.Remove(existingEmailAddress);
                }

                _dbContext.Contacts.Update(contact);
                await _dbContext.SaveChangesAsync();

                return Ok(contact);
            }
        }


        [HttpDelete("{contactId:guid}")]
        public async Task<ActionResult<Contact>> UpdateContact(Guid contactId)
        {
            await using (_dbContext)
            {
                var contact = await _dbContext.Contacts.FindAsync(contactId);

                if (contact == null) return BadRequest();

                _dbContext.Contacts.Remove(contact);
                await _dbContext.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}