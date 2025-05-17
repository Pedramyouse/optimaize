import React, { useEffect, useRef } from 'react';
import { Home, User, FolderOpen, Mail } from 'lucide-react';
import gsap from 'gsap';
import { createScrollTrigger, cleanupScrollTriggers, performanceDefaults } from '../utils/gsapUtils';

interface BottomNavProps {
  onSectionClick: (id: string) => void;
}

const BOTTOMNAV_COMPONENT_ID = 'bottom-nav';

const BottomNav: React.FC<BottomNavProps> = ({ onSectionClick }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const navElement = navRef.current;
    const containerElement = containerRef.current;

    if (!navElement || !containerElement) return;
    
    gsap.set(containerElement, {
      rotateX: 0,
      transformPerspective: 600,
      transformStyle: "preserve-3d",
      ...performanceDefaults
    });
    
    createScrollTrigger(BOTTOMNAV_COMPONENT_ID, {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scrollDirection = self.direction > 0 ? 1 : -1;
        const scrollSpeed = Math.abs(self.getVelocity() / 1000);
        const maxTilt = 5;
        const tiltAmount = Math.min(scrollSpeed * scrollDirection, maxTilt);
        
        gsap.to(containerElement, {
          rotateX: tiltAmount,
          ...performanceDefaults,
          duration: 0.5,
        });
        
        const scale = 1 - (Math.abs(tiltAmount) / 100);
        gsap.to(containerElement, {
          scale: scale,
          ...performanceDefaults,
          duration: 0.5,
        });
        
        const yOffset = scrollDirection * 2;
        gsap.to(navElement, {
          y: yOffset,
          ...performanceDefaults,
          duration: 0.5,
        });
      }
    });
    
    const handleMouseEnter = () => {
      gsap.to(containerElement, {
        scale: 1.05,
        ...performanceDefaults,
        duration: 0.3,
        ease: "power1.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(containerElement, {
        scale: 1,
        ...performanceDefaults,
        duration: 0.3,
        ease: "power1.out"
      });
    };

    containerElement.addEventListener('mouseenter', handleMouseEnter);
    containerElement.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cleanupScrollTriggers(BOTTOMNAV_COMPONENT_ID);
      containerElement.removeEventListener('mouseenter', handleMouseEnter);
      containerElement.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(containerElement);
      gsap.killTweensOf(navElement);
    };
  }, []);
  
  return (
    <nav ref={navRef} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 will-change-transform">
      <div 
        ref={containerRef}
        className="bg-background/60 backdrop-blur-xl border border-foreground/10 px-6 py-4 rounded-full shadow-lg will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <ul className="flex items-center gap-8">
          {[
            { id: 'home', icon: <Home size={20} />, label: 'Home' },
            { id: 'about', icon: <User size={20} />, label: 'About' },
            { id: 'projects', icon: <FolderOpen size={20} />, label: 'Projects' },
            { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionClick(item.id)}
                data-section={item.id}
                className="relative flex flex-col items-center gap-1 text-sm font-medium
                  transition-colors duration-300 text-foreground/60 hover:text-foreground"
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;