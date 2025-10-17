using Common.Models.FilterDtos;
using Dapper;

namespace Dw.ClickHouse.FilterDtos.Base
{
    public abstract class ChFilterDto : FilterPropDto, IChFilterDto
    {
        public virtual void WhereBuilder(SqlBuilder sqlBuilder)
        {
        }
    }
}
