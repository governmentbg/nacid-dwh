using Common.Models.FilterDtos;
using Dapper;

namespace Dw.ClickHouse.FilterDtos.Base
{
    public interface IChFilterDto : IFilterPropDto
    {
        void WhereBuilder(SqlBuilder sqlBuilder);
    }
}
