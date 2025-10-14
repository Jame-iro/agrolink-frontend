import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { addToCart } from '../store/slices/cartSlice';

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

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <img 
        src={product.images?.[0] || '/placeholder-image.jpg'} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {product.category}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-500">
            Stock: {product.stock}
          </span>
          <span className="text-gray-500">
            By: {product.farmerId?.firstName}
          </span>
        </div>

        {product.isAvailable ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="text-red-500 text-sm text-center py-2">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;