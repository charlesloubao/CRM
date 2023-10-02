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
    public class EmailAddressTypesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public EmailAddressTypesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<EmailAddressType>>> GetEmailAddressTypes(Guid organizationId)
        {
            var user = HttpContext.User.Claims;
            await using (_dbContext)
            {
                var emailAddressTypes = await _dbContext.EmailAddressTypes
                    .Where(emailAddressType => emailAddressType.OrganizationId == organizationId ||
                                               emailAddressType.OrganizationId ==
                                               null) // Default email address types are included
                    .ToListAsync();
                return Ok(emailAddressTypes);
            }
        }
    }
}