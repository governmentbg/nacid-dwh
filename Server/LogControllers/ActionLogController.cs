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
    [Route("api/logs/actions")]
    public class ActionLogController : ControllerBase
    {
        private readonly ActionLogSearchService actionLogSearchService;
        private readonly PermissionService permissionService;

        public ActionLogController(
            ActionLogSearchService actionLogSearchService,
            PermissionService permissionService
        )
        {
            this.actionLogSearchService = actionLogSearchService;
            this.permissionService = permissionService;
        }

        [Authorize, AuthorizedDevice, DwClient]
        [HttpPost]
        public async Task<ActionResult<SearchResultDto<ActionLog>>> GetAll([FromBody] ActionLogFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyUnitPermissionException(PermissionConstants.SystemLogReadPermission, new List<(string, int?)> { (OrganizationalUnitConstants.NacidAlias, null) });

            return Ok(await actionLogSearchService.GetAll(filter, cancellationToken));
        }

        [Authorize, AuthorizedDevice, DwClient]
        [HttpPost("count")]
        public async Task<ActionResult<int>> GetCount([FromBody] ActionLogFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyUnitPermissionException(PermissionConstants.SystemLogReadPermission, new List<(string, int?)> { (OrganizationalUnitConstants.NacidAlias, null) });

            return Ok(await actionLogSearchService.GetCount(filter, cancellationToken));
        }

        [Authorize, AuthorizedDevice, DwClient]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ActionLog>> GetById([FromRoute] int id, CancellationToken cancellationToken)
        {
            permissionService.VerifyUnitPermissionException(PermissionConstants.SystemLogReadPermission, new List<(string, int?)> { (OrganizationalUnitConstants.NacidAlias, null) });

            return Ok(await actionLogSearchService.GetById(id, cancellationToken));
        }
    }
}
