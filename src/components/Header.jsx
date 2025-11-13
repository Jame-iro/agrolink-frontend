import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import CartIcon from './CartIcon';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Logo variant="horizontal" size="medium" />
            </Link>
            
            <nav className="flex space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Store
              </Link>
              <Link 
                to="/dashboard" 
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Right side - Dark Mode Toggle and Cart */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;