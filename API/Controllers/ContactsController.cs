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
                    OrganizationId = organizationId
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
                var contact = await _dbContext.Contacts.FirstOrDefaultAsync(contact =>
                    contact.OrganizationId == organizationId && contact.ContactId == contactId);

                if (contact == null) return BadRequest();

                contact.FirstName = data.FirstName;
                contact.MiddleName = data.MiddleName;
                contact.LastName = data.LastName;
                contact.Notes = data.Notes;
                contact.UpdatedAt = DateTime.Now;

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