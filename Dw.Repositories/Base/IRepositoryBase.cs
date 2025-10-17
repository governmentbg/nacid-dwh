using Common.Models.FilterDtos;
using Dw.Models.Entities.Base;
using Dw.Models.Enums.Common;
using System.Linq.Expressions;

namespace Dw.Repositories.Base
{
    public interface IRepositoryBase<TEntity, TFilterDto>
        where TEntity : IEntityVersion
        where TFilterDto : IFilterDto<TEntity>
    {
        Task<TEntity> GetById(int id, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null);
        Task<TEntity> GetByProperties(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null);
        Task<List<TEntity>> GetList(TFilterDto filerDto, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null);
        Task<(List<TEntity>, int)> GetAll(TFilterDto filerDto, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null);
        IQueryable<TEntity> GetQuery(TFilterDto filerDto, CancellationToken cancellationToken, Func<IQueryable<TEntity>, IQueryable<TEntity>> includesFunc = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null);

        Task<bool> AnyEntity(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken);

        Task Create(TEntity entity);
        Task Update(TEntity entity, TEntity modificationEntity);
        Task UpdateFromDto<TDto>(TEntity entity, TDto modificationDto);
        Task Delete(TEntity entity);

        Func<IQueryable<TEntity>, IQueryable<TEntity>> ConstructInclude(IncludeType includeType = IncludeType.None);
    }
}
