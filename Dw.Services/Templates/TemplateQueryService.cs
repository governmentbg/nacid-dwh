using AutoMapper;
using Ch.Services;
using Dw.Models.Dtos.Templates;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Templates;
using Dw.Repositories.Templates;
using Infrastructure.DomainValidation;
using Infrastructure.UserContext;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Common.Models.Dtos;
using Dw.Models.Enums.Common;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Helpers;
using Ch.Models.Dtos;

namespace Dw.Services.Templates
{
    public class TemplateQueryService
    {
        private readonly IMapper mapper;
        private readonly ITemplateQueryRepository templateQueryRepository;
        private readonly ClickHouseQueryService clickHouseQueryService;
        private readonly DomainValidatorService domainValidatorService;
        private readonly UserContext userContext;

        public TemplateQueryService(
            IMapper mapper,
            ITemplateQueryRepository templateQueryRepository,
            ClickHouseQueryService clickHouseQueryService,
            DomainValidatorService domainValidatorService,
            UserContext userContext
            )
        {
            this.mapper = mapper;
            this.templateQueryRepository = templateQueryRepository;
            this.clickHouseQueryService = clickHouseQueryService;
            this.domainValidatorService = domainValidatorService;
            this.userContext = userContext;
        }

        public async Task<TemplateQueryDto> GetDtoById(int id, CancellationToken cancellationToken)
        {
            var templateQuery = await templateQueryRepository.GetById(id, cancellationToken, templateQueryRepository.ConstructInclude(IncludeType.None));

            return mapper.Map<TemplateQueryDto>(templateQuery);
        }

        public async Task<SearchResultDto<TSearchDto>> GetSearchResultDto<TSearchDto>(TemplateQueryFilterDto filterDto, CancellationToken cancellationToken)
            where TSearchDto : class
        {
            filterDto.AccessUserId = userContext.UserId;

            var (result, count) = await templateQueryRepository.GetAll(filterDto, cancellationToken, templateQueryRepository.ConstructInclude(IncludeType.None), e => e.OrderBy(e => e.Name));

            var searchResult = new SearchResultDto<TSearchDto>
            {
                Result = mapper.Map<List<TSearchDto>>(result),
                TotalCount = count
            };

            return searchResult;
        }

        public async Task<TemplateQueryDto> Create(TemplateQueryCreateDto templateQueryCreateDto, CancellationToken cancellationToken)
        {
            if (templateQueryCreateDto.TemplateQuery.TemplateGroup.AccessLevel == TemplateAccessLevel.Private)
            {
                templateQueryCreateDto.TemplateQuery.AccessLevel = TemplateAccessLevel.Private;
            }

            if (templateQueryCreateDto.TemplateQuery.AccessLevel == TemplateAccessLevel.Private)
            {
                templateQueryCreateDto.TemplateQuery.AccessUserId = userContext.UserId;
            }

            templateQueryCreateDto.ValidateProperties(domainValidatorService);
            var newTemplateQuery = mapper.Map<TemplateQuery>(templateQueryCreateDto.TemplateQuery);

            newTemplateQuery.RawQuery = clickHouseQueryService.GetQueryString(templateQueryCreateDto.ChQuery);
            newTemplateQuery.JsonQuery = JsonConvert.SerializeObject(templateQueryCreateDto.ChQuery, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
            await templateQueryRepository.Create(newTemplateQuery);
            return mapper.Map<TemplateQueryDto>(await templateQueryRepository.GetById(newTemplateQuery.Id, cancellationToken));
        }

        public async Task<TemplateQueryDto> Update(TemplateQuery templateQueryForUpdate, TemplateQueryDto templateQueryDto, CancellationToken cancellationToken)
        {
            templateQueryDto.ValidateProperties(domainValidatorService);

            await templateQueryRepository.UpdateFromDto(templateQueryForUpdate, templateQueryDto);

            return await GetDtoById(templateQueryForUpdate.Id, cancellationToken);
        }

        public async Task<TemplateQueryDto> UpdateQuery(TemplateQuery queryForUpdate, ChQueryDto queryDto, CancellationToken cancellationToken)
        {
            queryForUpdate.RawQuery = clickHouseQueryService.GetQueryString(queryDto);
            queryForUpdate.JsonQuery = JsonConvert.SerializeObject(queryDto, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });

            var templateQueryDto = mapper.Map<TemplateQueryDto>(queryForUpdate);

            await templateQueryRepository.UpdateFromDto(queryForUpdate, templateQueryDto);

            return await GetDtoById(queryForUpdate.Id, cancellationToken);
        }

        public async Task Delete(TemplateQuery templateQueryForDelete)
        {
            await templateQueryRepository.Delete(templateQueryForDelete);
        }

        public async Task MoveTemplateGroup(int templateQueryId, int newGroupId, CancellationToken cancellationToken)
        {
            var templateQuery = await templateQueryRepository.GetById(templateQueryId, cancellationToken);

            var modificationDto = new TemplateQueryMoveGroupDto
            {
                TemplateGroupId = newGroupId
            };

            await templateQueryRepository.UpdateFromDto(templateQuery, modificationDto);
        }

        public async Task<TemplateQuery> CopyToTemplateGroup(int templateQueryId, int newGroupId, CancellationToken cancellationToken)
        {
            var originalTemplateQuery = await templateQueryRepository.GetById(templateQueryId, cancellationToken);

            var newTemplateQuery = EntityHelper.CloneObject(originalTemplateQuery) as TemplateQuery;
            newTemplateQuery.TemplateGroupId = newGroupId;

            await templateQueryRepository.Create(newTemplateQuery);

            return mapper.Map<TemplateQuery>(await templateQueryRepository.GetById(newTemplateQuery.Id, cancellationToken));
        }
    }
}