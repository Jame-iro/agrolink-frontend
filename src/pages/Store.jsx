import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchProducts, setFilters } from "../store/slices/productsSlice";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter";

const Store = () => {
  const dispatch = useAppDispatch();
  const {
    items: products,
    loading,
    error,
    filters,
    hasMore,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const loadMore = () => {
    dispatch(fetchProducts({ ...filters, page: filters.page + 1 }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Filter filters={filters} onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {hasMore && !loading && products.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Load More
          </button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">No products found</div>
      )}
    </div>
  );
};

export default Store;
