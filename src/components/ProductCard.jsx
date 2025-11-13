import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { addToCart } from "../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const getFarmerName = () => {
    if (product.farmerName) {
      return product.farmerName;
    } else if (product.farmerId && product.farmerId.firstName) {
      return product.farmerId.firstName;
    }
    return "Unknown Farmer";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow dark:border dark:border-gray-700">
      <img
        src={product.images?.[0] || "/placeholder-image.jpg"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 dark:bg-gray-800">
        <h3 className="font-semibold text-lg dark:text-white">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 dark:text-green-400 font-bold">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {product.category}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-500 dark:text-gray-400">
            Stock: {product.stock}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            By: {getFarmerName()}
          </span>
        </div>

        {product.isAvailable ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-500 dark:bg-green-600 text-white py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="text-red-500 dark:text-red-400 text-sm text-center py-2">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
