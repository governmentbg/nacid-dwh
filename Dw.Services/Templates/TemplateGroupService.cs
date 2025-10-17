using AutoMapper;
using Common.Models.Dtos;
using Dw.Models.Dtos.Templates;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Common;
using Dw.Models.Enums.Templates;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Templates;
using Infrastructure.DomainValidation;
using Infrastructure.UserContext;

namespace Dw.Services.Templates
{
    public class TemplateGroupService
    {
        private readonly IMapper mapper;
        private readonly ITemplateGroupRepository templateGroupRepository;
        private readonly UserContext userContext;
        private readonly DomainValidatorService domainValidatorService;

        public TemplateGroupService(
            IMapper mapper,
            ITemplateGroupRepository templateGroupRepository,
            UserContext userContext,
            DomainValidatorService domainValidatorService
            )
        {
            this.mapper = mapper;
            this.templateGroupRepository = templateGroupRepository;
            this.userContext = userContext;
            this.domainValidatorService = domainValidatorService;
        }

        public async Task<TemplateGroupDto> GetDtoById(int id, CancellationToken cancellationToken)
        {
            var templateGroup = await templateGroupRepository.GetById(id, cancellationToken, templateGroupRepository.ConstructInclude(IncludeType.None));

            return mapper.Map<TemplateGroupDto>(templateGroup);
        }

        public async Task<SearchResultDto<TSearchDto>> GetSearchResultDto<TSearchDto>(TemplateGroupFilterDto filterDto, CancellationToken cancellationToken)
            where TSearchDto : class
        {
            filterDto.AccessUserId = userContext.UserId;

            var (result, count) = await templateGroupRepository.GetAll(filterDto, cancellationToken, templateGroupRepository.ConstructInclude(IncludeType.Collections), e => e.OrderBy(e => e.Name));

            var searchResult = new SearchResultDto<TSearchDto>
            {
                Result = mapper.Map<List<TSearchDto>>(result),
                TotalCount = count
            };

            return searchResult;
        }

        public async Task<TemplateGroupDto> Create(TemplateGroupDto templateGroupDto, CancellationToken cancellationToken)
        {
            if (templateGroupDto.AccessLevel == TemplateAccessLevel.Private)
            {
                templateGroupDto.AccessUserId = userContext.UserId;
            }

            templateGroupDto.ValidateProperties(domainValidatorService);

            var newTemplateGroup = mapper.Map<TemplateGroup>(templateGroupDto);

            await templateGroupRepository.Create(newTemplateGroup);

            return mapper.Map<TemplateGroupDto>(await templateGroupRepository.GetById(newTemplateGroup.Id, cancellationToken));
        }

        public async Task<TemplateGroupDto> Update(TemplateGroup templateGroupForUpdate, TemplateGroupDto templateGroupDto, CancellationToken cancellationToken)
        {
            templateGroupDto.ValidateProperties(domainValidatorService);

            if (templateGroupForUpdate.AccessLevel != templateGroupDto.AccessLevel)
            {
                if (templateGroupDto.AccessLevel == TemplateAccessLevel.Private)
                {
                    templateGroupDto.AccessUserId = userContext.UserId; 
                }
                else if (templateGroupDto.AccessLevel == TemplateAccessLevel.Public)
                {
                    templateGroupDto.AccessUserId = null; 
                }
            }

            await templateGroupRepository.UpdateFromDto(templateGroupForUpdate, templateGroupDto);

            return await GetDtoById(templateGroupForUpdate.Id, cancellationToken);
        }
    }
}
