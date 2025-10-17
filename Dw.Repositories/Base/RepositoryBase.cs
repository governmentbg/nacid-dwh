using Common.Models.FilterDtos;
using Dw.Models;
using Dw.Models.Entities.Base;
using Dw.Models.Enums.Common;
using Dw.Repositories.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Dw.Repositories.Base
{
    public abstract class RepositoryBase<TEntity, TFilter> : IRepositoryBase<TEntity, TFilter>
        where TEntity : EntityVersion
        where TFilter : FilterDto<TEntity>, new()
    {
        protected readonly DwDbContext context;

        public RepositoryBase(DwDbContext context)
        {
            this.context = context;
        }

        public virtual async Task<TEntity> GetById(int id, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null)
        {
            var query = context.Set<TEntity>().AsNoTracking();

            if (includesFunc != null)
            {
                query = includesFunc(query);
            }

            return await query.SingleOrDefaultAsync(e => e.Id == id, cancellationToken);
        }

        public virtual async Task<TEntity> GetByProperties(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null)
        {
            var query = context.Set<TEntity>().AsNoTracking();

            if (includesFunc != null)
            {
                query = includesFunc(query);
            }

            return await query.SingleOrDefaultAsync(predicate, cancellationToken);
        }

        public virtual async Task<List<TEntity>> GetList(TFilter filter, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null)
        {
            if (filter == null)
            {
                filter = new TFilter();
            }

            var query = GetQuery(filter, cancellationToken, includesFunc, orderBy);

            var result = filter.GetAllData ? await query.ToListAsync(cancellationToken) : await query.Skip(filter.Offset).Take(filter.Limit).ToListAsync(cancellationToken);

            return result;
        }

        public virtual async Task<(List<TEntity>, int)> GetAll(TFilter filter, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null)
        {
            if (filter == null)
            {
                filter = new TFilter();
            }

            var query = GetQuery(filter, cancellationToken, includesFunc, orderBy);

            var result = filter.GetAllData ? await query.ToListAsync(cancellationToken) : await query.Skip(filter.Offset).Take(filter.Limit).ToListAsync(cancellationToken);

            return (result, await query.CountAsync(cancellationToken));
        }

        public virtual IQueryable<TEntity> GetQuery(TFilter filter, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null)
        {
            var query = context.Set<TEntity>().AsNoTracking();

            if (includesFunc != null)
            {
                query = includesFunc(query);
            }

            query = filter.WhereBuilder(query);

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            return query;
        }

        public virtual async Task<bool> AnyEntity(Expression<Func<TEntity, bool>> predicate, CancellationToken token)
        {
            return await context.Set<TEntity>().AsNoTracking().AnyAsync(predicate, token);
        }

        public virtual async Task Create(TEntity entity)
        {
            EntityHelper.ClearSkipProperties(entity);
            await context.Set<TEntity>().AddAsync(entity);

            await context.SaveChangesAsync();
        }

        public virtual async Task Update(TEntity entity, TEntity modificationEntity)
        {
            EntityHelper.Update(entity, modificationEntity, context);

            await context.SaveChangesAsync();
        }

        public virtual async Task UpdateFromDto<TDto>(TEntity entity, TDto modificationDto)
        {
            EntityHelper.UpdateFromDto(entity, modificationDto, context);

            await context.SaveChangesAsync();
        }

        public virtual async Task Delete(TEntity entity)
        {
            EntityHelper.ClearSkipProperties(entity);
            EntityHelper.Remove(entity, context);

            await context.SaveChangesAsync();
        }

        public virtual Func<IQueryable<TEntity>, IQueryable<TEntity>> ConstructInclude(IncludeType includeType = IncludeType.None)
        {
            return e => e;
        }
    }
}
