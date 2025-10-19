import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import SearchModal from './SearchModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount} = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const cartCount = getCartCount();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const dropdownRef = useRef(null);

  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ShoeMart
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>
              <a href="#about" className="text-gray-700 hover:text-blue-600">
                About
              </a>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Search Button */}
              <button 
                onClick={() => setShowSearchModal(true)}
                className="text-gray-700 hover:text-blue-600 transition"
                title="Search products"
              >
                <Search size={20} />
              </button>

              <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop User Menu */}
              {isAuthenticated && user ? (
                <div className="hidden md:block relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <User size={20} />
                    <span className="hidden md:inline">{user.name}</span>
                  </button>
                  
                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex text-gray-700 hover:text-blue-600 items-center space-x-1"
                >
                  <User size={20} />
                  <span className="hidden md:inline text-sm">Login</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden text-gray-700 hover:text-blue-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="py-4 space-y-3">
                <Link 
                  to="/" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Products
                </Link>
                <a 
                  href="#about" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  About
                </a>
                
                {/* Mobile User Menu */}
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-4">
                      Logged in as <span className="font-semibold">{user.name}</span>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      onClick={closeMobileMenu}
                    >
                      Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        onClick={closeMobileMenu}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 border-t border-gray-200 mt-2 pt-4"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </>
  );
};

export default Navbar;