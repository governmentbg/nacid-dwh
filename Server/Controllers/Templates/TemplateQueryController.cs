using Ch.Models.Dtos;
using Common.Models.Dtos;
using Dw.Models.Dtos.Templates;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Common;
using Dw.Models.Enums.Templates;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Templates;
using Dw.Services.Templates;
using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models.ErrorCodes;
using Infrastructure.UserContext;
using Infrastructure.UserContext.Attributes;
using Infrastructure.UserContext.Permissions;
using Infrastructure.UserContext.Permissions.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.Templates
{
    [ApiController]
    [Authorize, AuthorizedDevice, DwClient]
    [Route("api/templateQueries")]
    public class TemplateQueryController : ControllerBase
    {
        private readonly PermissionService permissionService;
        private readonly TemplateQueryService templateQueryService;
        private readonly ITemplateQueryRepository templateQueryRepository;
        private readonly DomainValidatorService domainValidatorService;
        private readonly UserContext userContext;

        public TemplateQueryController(
            PermissionService permissionService,
            TemplateQueryService templateQueryService,
            ITemplateQueryRepository templateQueryRepository,
            DomainValidatorService domainValidatorService,
            UserContext userContext)
        {
            this.permissionService = permissionService;
            this.templateQueryService = templateQueryService;
            this.templateQueryRepository = templateQueryRepository;
            this.domainValidatorService = domainValidatorService;
            this.userContext = userContext;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TemplateQueryDto>> GetById([FromRoute] int id, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateReadPermission);

            return Ok(await templateQueryService.GetDtoById(id, cancellationToken));
        }

        [HttpPost("search")]
        public async Task<ActionResult<SearchResultDto<TemplateQueryDto>>> GetSearchResultDto([FromBody] TemplateQueryFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateReadPermission);

            return Ok(await templateQueryService.GetSearchResultDto<TemplateQueryDto>(filter, cancellationToken));
        }

        [HttpPost("search/subquery")]
        public async Task<ActionResult<SearchResultDto<TemplateSubquerySearchDto>>> GetSubquerySearchResultDto([FromBody] TemplateQueryFilterDto filter, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateReadPermission);

            return Ok(await templateQueryService.GetSearchResultDto<TemplateSubquerySearchDto>(filter, cancellationToken));
        }

        [HttpPost]
        public async Task<ActionResult<TemplateQueryDto>> Create([FromBody] TemplateQueryCreateDto templateQueryCreateDto, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateCreatePermission);

            if (templateQueryCreateDto?.TemplateQuery?.TemplateGroup == null
                || (templateQueryCreateDto.TemplateQuery.TemplateGroup.AccessLevel == TemplateAccessLevel.Private && templateQueryCreateDto.TemplateQuery.TemplateGroup.AccessUserId != userContext.UserId))
            {
                domainValidatorService.ThrowErrorMessage(TemplateQueryErrorCode.TemplateQuery_AccessUser_Wrong);
            }

            return Ok(await templateQueryService.Create(templateQueryCreateDto, cancellationToken));
        }

        [HttpPut]
        public async Task<ActionResult<TemplateQueryDto>> Update([FromBody] TemplateQueryDto templateQueryDto, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateWritePermission);
            var templateQueryForUpdate = await templateQueryRepository.GetById(templateQueryDto.Id, cancellationToken, templateQueryRepository.ConstructInclude(IncludeType.None));

            return Ok(await templateQueryService.Update(templateQueryForUpdate, templateQueryDto, cancellationToken));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<TemplateQueryDto>> UpdateQuery([FromRoute] int id, [FromBody] ChQueryDto queryDto, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateWritePermission);

            var queryForUpdate = await templateQueryRepository.GetById(id, cancellationToken, templateQueryRepository.ConstructInclude(IncludeType.None));

            return Ok(await templateQueryService.UpdateQuery(queryForUpdate, queryDto, cancellationToken));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete([FromRoute] int id, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateDeletePermission);
            var templateQueryForDelete = await templateQueryRepository.GetById(id, cancellationToken, templateQueryRepository.ConstructInclude(IncludeType.All));

            await templateQueryService.Delete(templateQueryForDelete);

            return Ok();
        }

        [HttpPut("moveGroup/{id:int}")]
        public async Task<ActionResult> MoveTemplateGroup([FromRoute] int id, [FromBody] TemplateQueryMoveGroupDto dto, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateWritePermission);

            await templateQueryService.MoveTemplateGroup(id, dto.TemplateGroupId, cancellationToken);

            return Ok();
        }

        [HttpPost("copyToGroup/{id:int}")]
        public async Task<ActionResult<TemplateQuery>> CopyToTemplateGroup([FromRoute] int id, [FromBody] TemplateQueryMoveGroupDto dto, CancellationToken cancellationToken)
        {
            permissionService.VerifyPermissionException(PermissionConstants.TemplateCreatePermission);

            return Ok(await templateQueryService.CopyToTemplateGroup(id, dto.TemplateGroupId, cancellationToken)); 
        }
    }
}
