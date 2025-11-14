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
    <div
      className="bg-white light:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow light:border light:border-gray-700"
      onClick={handleClick}
    >
      <img
        src={product.images?.[0] || "/placeholder-image.jpg"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-3 sm:p-4">
        {/* Product name with proper truncation */}
        <h3 className="font-semibold text-gray-900 light:text-white text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <p className="text-gray-600 light:text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 light:text-green-400 font-bold text-base sm:text-lg">
            ${product.price}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 light:text-gray-400 capitalize truncate ml-2">
            {product.category}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm mb-3">
          <span className="text-gray-500 light:text-gray-400">
            Stock: {product.stock}
          </span>
          <span className="text-gray-500 light:text-gray-400 truncate ml-2 text-right">
            By: {getFarmerName()}
          </span>
        </div>

        {product.isAvailable ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-500 light:bg-green-600 text-white py-2 rounded-lg hover:bg-green-600 light:hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Add to Cart
          </button>
        ) : (
          <div className="text-red-500 light:text-red-400 text-xs sm:text-sm text-center py-2">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
