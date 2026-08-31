using System.Linq.Expressions;


namespace BusManager.Application.Common.Interfaces
{
    public interface IRepository <T>
    {
        void Add (T entity);
        void Update (T entity);
        void Delete (T entity);
        Task<T?> Get (Expression<Func<T, bool>> filter, string? includeProperties = null, bool tracked = true);
        Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? filter = null, string? includeProperties = null);
    }
}