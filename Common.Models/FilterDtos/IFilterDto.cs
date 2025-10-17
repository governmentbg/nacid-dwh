namespace Common.Models.FilterDtos
{
    public interface IFilterDto<TEntity> : IFilterPropDto
    {
        IQueryable<TEntity> WhereBuilder(IQueryable<TEntity> query);
    }
}
