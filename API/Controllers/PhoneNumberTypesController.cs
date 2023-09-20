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
    public class PhoneNumberTypesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PhoneNumberTypesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<PhoneNumberType>>> GetPhoneNumberTypes(Guid organizationId)
        {
            var user = HttpContext.User.Claims;
            await using (_dbContext)
            {
                var phoneNumberTypes = await _dbContext.PhoneNumberTypes
                    .Where(phoneNumberType => phoneNumberType.OrganizationId == organizationId ||
                                              phoneNumberType.OrganizationId ==
                                              null) // Default phone number types are included
                    .ToListAsync();
                return Ok(phoneNumberTypes);
            }
        }
    }
}