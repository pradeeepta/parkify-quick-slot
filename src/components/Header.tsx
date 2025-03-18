
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <Car className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold text-lg">Parkify</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`transition-colors duration-200 ${
              location.pathname === '/' 
                ? 'text-primary font-medium' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`transition-colors duration-200 ${
              location.pathname === '/dashboard' 
                ? 'text-primary font-medium' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/login" 
            className={`transition-colors duration-200 ${
              location.pathname === '/login' 
                ? 'text-primary font-medium' 
                : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <Button variant="outline" size="sm" className="gap-1">
              <User className="w-4 h-4" />
              Login
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center justify-center"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border animate-slide-down shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`py-3 px-4 rounded-md transition-colors ${
                location.pathname === '/' 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-secondary'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`py-3 px-4 rounded-md transition-colors ${
                location.pathname === '/dashboard' 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-secondary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/login" 
              className="py-3 px-4"
            >
              <Button className="w-full gap-2">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
