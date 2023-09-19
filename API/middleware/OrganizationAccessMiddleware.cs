using System.Security.Claims;
using System.Text.RegularExpressions;
using API.DB;
using Microsoft.EntityFrameworkCore;

namespace API.middleware;

public class OrganizationAccessMiddleware
{
    private readonly RequestDelegate _next;

    public OrganizationAccessMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        /*
         Examples of organization access:
            /api/organizations/000-000-000-000/
            /api/organizations/000-000-000-000/contacts/
            /api/organizations/000-000-000-000/contacts/000-000-000-000
         */

        var isOrganizationAccess = Regex.Match(context.Request.Path.Value!, @"\/api\/organizations/.+((\/.*)*)").Success;

        if (!isOrganizationAccess)
        {
            await _next(context);
            return;
        }

        var userId = context.User.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
        var orgId = Guid.Parse(context.Request.Path.Value!.Split("/")[3]);

        await using (dbContext)
        {
            var orgMember = await dbContext.OrganizationMembers.FirstOrDefaultAsync(member =>
                member.OrganizationId == (orgId)
                && member.UserId == userId);

            var isOrgMember = orgMember != null;

            if (!isOrgMember)
            {
                context.Response.StatusCode = 403;
                return;
            }

            await _next(context);
        }
    }
}