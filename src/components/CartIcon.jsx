import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

const CartIcon = () => {
  const { items, total } = useAppSelector(state => state.cart);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link 
      to="/cart" 
      className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
    >
      <FiShoppingCart className="w-6 h-6" />
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
      
      {itemCount > 0 && (
        <span className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-xs px-1 rounded">
          ${total.toFixed(2)}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;