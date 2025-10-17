using AutoMapper;
using Ch.Models.Dtos;
using Dw.Models.Dtos.Templates;
using Dw.Models.Dtos.Templates.Search;
using Dw.Models.Entities.Templates;
using Newtonsoft.Json;

namespace Dw.Services.Templates.Profiles
{
    public class TemplateProfile : Profile
    {
        public TemplateProfile()
        {
            CreateMap<TemplateGroup, TemplateGroupDto>();
            CreateMap<TemplateQuery, TemplateQueryDto>();
            CreateMap<TemplateGroup, TemplateGroupSearchDto>()
                .ForMember(dest => dest.TemplateQueryCount, opt => opt.MapFrom(src => src.TemplateQueries.Count));
            CreateMap<TemplateQuery, TemplateSubquerySearchDto>()
                .ForMember(dest => dest.ChQuery, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<ChQueryDto>(src.JsonQuery)));

            CreateMap<TemplateGroupDto, TemplateGroup>();
            CreateMap<TemplateQueryDto, TemplateQuery>();
        }
    }
}
