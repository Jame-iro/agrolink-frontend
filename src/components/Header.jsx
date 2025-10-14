import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import CartIcon from './cartIcon';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Logo variant="horizontal" size="medium" />
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Store
              </Link>
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            {/* User menu can be added here later */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;