import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Home, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  
  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto container-px py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-900 text-white rounded-md flex items-center justify-center">
              <Home size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              PropertyBid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-base font-medium ${isActive ? 'text-blue-900' : 'text-slate-700 hover:text-blue-800'}`
              }
            >
              Properties
            </NavLink>
            {user && (
              <>
                <NavLink 
                  to="/create-property" 
                  className={({ isActive }) => 
                    `text-base font-medium ${isActive ? 'text-blue-900' : 'text-slate-700 hover:text-blue-800'}`
                  }
                >
                  Create Listing
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `text-base font-medium ${isActive ? 'text-blue-900' : 'text-slate-700 hover:text-blue-800'}`
                  }
                >
                  Dashboard
                </NavLink>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-slate-800 hover:text-blue-900 transition-colors"
                  onClick={toggleProfileMenu}
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[120px]">
                        {user.full_name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.coins} coins
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={16} />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary"
              >
                Connect Wallet
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 -mr-2 text-slate-800"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 animate-slide-up">
            <div className="flex flex-col space-y-3">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-2 py-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </NavLink>
              {user && (
                <>
                  <NavLink 
                    to="/create-property" 
                    className={({ isActive }) => 
                      `px-2 py-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-100'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Listing
                  </NavLink>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `px-2 py-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-100'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `px-2 py-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-100'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button 
                    className="px-2 py-1 text-left rounded-md text-red-600 hover:bg-slate-100"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <Link 
                  to="/login" 
                  className="px-2 py-1 rounded-md bg-blue-900 text-white font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connect Wallet
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;