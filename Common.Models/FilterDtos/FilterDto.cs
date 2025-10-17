namespace Common.Models.FilterDtos
{
    public abstract class FilterDto<TEntity> : FilterPropDto, IFilterDto<TEntity>
        where TEntity : class
    {
        public virtual IQueryable<TEntity> WhereBuilder(IQueryable<TEntity> query)
        {
            return query;
        }
    }
}
