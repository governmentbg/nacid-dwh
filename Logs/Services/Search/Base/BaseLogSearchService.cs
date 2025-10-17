using Common.Models.Dtos;
using Common.Models.FilterDtos;
using Logs.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Logs.Services.Search.Base
{
    public abstract class BaseLogSearchService<TEntity, TFilter>
        where TEntity : BaseLog
        where TFilter : FilterDto<TEntity>, new()
    {
        protected readonly LogDbContext context;

        public BaseLogSearchService(
           LogDbContext context
        )
        {
            this.context = context;
        }

        public async virtual Task<TEntity> GetById(int id, CancellationToken cancellationToken)
        {
            return await context.Set<TEntity>().AsNoTracking().SingleOrDefaultAsync(e => e.Id == id, cancellationToken);
        }

        public async virtual Task<SearchResultDto<TEntity>> GetAll(TFilter filter, CancellationToken cancellationToken)
        {
            var queryIds = GetInitialQuery(filter);

            var loadIds = await queryIds
                .Take(filter.Limit)
                .ToListAsync(cancellationToken);

            var result = await context.Set<TEntity>()
                .AsNoTracking()
                .Where(e => loadIds.Contains(e.Id))
                .OrderByDescending(e => e.Id)
                .ToListAsync(cancellationToken);

            var searchResult = new SearchResultDto<TEntity>
            {
                Result = result
            };

            return searchResult;
        }

        public async virtual Task<int> GetCount(TFilter filter, CancellationToken cancellationToken)
        {
            var queryIds = GetInitialQuery(filter);

            return await queryIds.CountAsync(cancellationToken);
        }

        protected virtual IQueryable<int> GetInitialQuery(TFilter filter)
        {
            if (filter == null)
            {
                filter = new TFilter();
            }

            var query = context.Set<TEntity>()
                .AsNoTracking()
                .OrderByDescending(e => e.Id)
                .AsQueryable();

            var queryIds = filter.WhereBuilder(query).Select(e => e.Id);

            return queryIds;
        }
    }
}
