using Common.Models.Dtos;
using Infrastructure.UserContext.Attributes;
using Infrastructure.UserContext.Permissions.Constants;
using Infrastructure.UserContext.Permissions;
using Logs.Entities;
using Logs.FilterDtos;
using Logs.Services.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.LogControllers
{
    [ApiController]
    [Route("api/logs/errors")]
    public class ErrorLogController : ControllerBase
    {
        private readonly ErrorLogSearchService errorLogSearchService;
        private readonly PermissionService permissionService;
        public ErrorLogController(
            ErrorLogSearchService errorLogSearchService,
            PermissionService permissionService
        )
        {
            this.errorLogSearchService = errorLogSearchService;
            this.permissionService = permissionService;
        }

        [Authorize, AuthorizedDevice, DwClient]
        [HttpPost]
        public async Task<ActionResult<SearchResultDto<ErrorLog>>> GetAll([FromBody] ErrorLogFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyUnitPermissionException(PermissionConstants.SystemLogReadPermission, new List<(string, int?)> { (OrganizationalUnitConstants.NacidAlias, null) });

            return Ok(await errorLogSearchService.GetAll(filter, cancellationToken));
        }

        [Authorize, AuthorizedDevice, DwClient]
        [HttpPost("count")]
        public async Task<ActionResult<int>> GetCount([FromBody] ErrorLogFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyUnitPermissionException(PermissionConstants.SystemLogReadPermission, new List<(string, int?)> { (OrganizationalUnitConstants.NacidAlias, null) });

            return Ok(await errorLogSearchService.GetCount(filter, cancellationToken));
        }

        [Authorize, AuthorizedDevice, DwClient]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ErrorLog>> GetById([FromRoute] int id, CancellationToken cancellationToken)
        {
            permissionService.VerifyUnitPermissionException(PermissionConstants.SystemLogReadPermission, new List<(string, int?)> { (OrganizationalUnitConstants.NacidAlias, null) });

            return Ok(await errorLogSearchService.GetById(id, cancellationToken));
        }
    }
}
