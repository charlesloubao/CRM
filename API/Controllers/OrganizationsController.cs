using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public OrganizationsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<Organization>>> GetOrganizations()
        {
            var userId = HttpContext.User.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            await using (_dbContext)
            {
                var memberships = await _dbContext.OrganizationMembers
                    .Include(member => member.Organization)
                    .Where(member => member.UserId == userId)
                    .ToListAsync();

                var organizations = memberships.Select(membership => membership.Organization);
                return Ok(organizations);
            }
        }

        [HttpGet("{organizationId:guid}")]
        public async Task<ActionResult<Contact>> GetOrganizationById(Guid organizationId)
        {
            var userId = HttpContext.User.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            await using (_dbContext)
            {
                var memberships = await _dbContext.OrganizationMembers
                    .Include(member => member.Organization)
                    .FirstOrDefaultAsync(member => member.UserId == userId && member.OrganizationId == organizationId);

                if (memberships == null) return NotFound();

                return Ok(memberships.Organization);
            }

            ;
        }
    }
}