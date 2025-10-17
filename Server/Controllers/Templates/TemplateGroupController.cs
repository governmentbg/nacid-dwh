using Common.Models.Dtos;
using Dw.Models.Dtos.Templates;
using Dw.Models.Dtos.Templates.Search;
using Dw.Models.Enums.Common;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Templates;
using Dw.Services.Templates;
using Infrastructure.UserContext.Attributes;
using Infrastructure.UserContext.Permissions;
using Infrastructure.UserContext.Permissions.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.Templates
{
    [ApiController]
    [Authorize, AuthorizedDevice, DwClient]
    [Route("api/templateGroups")]
    public class TemplateGroupController : ControllerBase
    {
        private readonly TemplateGroupService templateGroupService;
        private readonly PermissionService permissionService;
        private readonly ITemplateGroupRepository templateGroupRepository; 

        public TemplateGroupController(
            TemplateGroupService templateGroupService,
            PermissionService permissionService,
            ITemplateGroupRepository templateGroupRepository)
        {
            this.templateGroupService = templateGroupService;
            this.permissionService = permissionService;
            this.templateGroupRepository = templateGroupRepository;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TemplateGroupDto>> GetById([FromRoute] int id, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateReadPermission);

            return Ok(await templateGroupService.GetDtoById(id, cancellationToken));
        }

        [HttpPost("search")]
        public async Task<ActionResult<SearchResultDto<TemplateGroupSearchDto>>> GetSearchResultDto([FromBody] TemplateGroupFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateReadPermission);

            return Ok(await templateGroupService.GetSearchResultDto<TemplateGroupSearchDto>(filter, cancellationToken));
        }

        [HttpPost("nomenclature")]
        public async Task<ActionResult<SearchResultDto<TemplateGroupDto>>> GetNomenclatureResultDto([FromBody] TemplateGroupFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateReadPermission);

            return Ok(await templateGroupService.GetSearchResultDto<TemplateGroupDto>(filter, cancellationToken));
        }

        [HttpPost]
        public async Task<ActionResult<TemplateGroupDto>> Create([FromBody] TemplateGroupDto templateGroupDto, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateCreatePermission);

            return Ok(await templateGroupService.Create(templateGroupDto, cancellationToken));
        }

        [HttpPut]
        public async Task<ActionResult<TemplateGroupDto>> Update([FromBody] TemplateGroupDto templateGroupDto, CancellationToken cancellationToken)
        {
            var templateGroupForUpdate = await templateGroupRepository.GetById(templateGroupDto.Id, cancellationToken, templateGroupRepository.ConstructInclude(IncludeType.None));

            permissionService.VerifyPermissionException(PermissionConstants.TemplateWritePermission);

            return Ok(await templateGroupService.Update(templateGroupForUpdate, templateGroupDto, cancellationToken));
        }
    }
}
