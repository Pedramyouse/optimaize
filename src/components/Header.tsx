import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import gsap from 'gsap';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isMenuOpen) {
      // Animate menu items when menu opens
      gsap.fromTo(
        '.mobile-menu-item',
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5,
          ease: 'power2.out'
        }
      );
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Enable body scroll
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass ${
        scrolled 
          ? 'py-4 shadow-md'
          : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <NavLink 
          to="/" 
          className="text-2xl font-bold relative z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-primary">P</span>ortfolio
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;