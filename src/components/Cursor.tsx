import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { createThrottledScrollHandler } from '../utils/gsapUtils';

const CURSOR_UPDATE_DELAY = 16; // ~60fps

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  
  // Memoize event handlers
  const handleMouseMove = useCallback(createThrottledScrollHandler((e: MouseEvent) => {
    if (!cursorRef.current) return;
    
    gsap.to(cursorRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power1.out',
      overwrite: 'auto',
      force3D: true
    });
  }, CURSOR_UPDATE_DELAY), []);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  const handleLinkHover = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.tagName === 'A' || 
                         target.tagName === 'BUTTON' || 
                         target.closest('a') || 
                         target.closest('button');
    
    if (!isInteractive || !cursorRef.current) return;
    
    gsap.to(cursorRef.current, {
      scale: 1.5,
      backgroundColor: 'white',
      mixBlendMode: 'difference',
      duration: 0.3,
      force3D: true,
      overwrite: 'auto'
    });
    
    setCursorText('Click');
    cursorRef.current.classList.add('custom-cursor-text');
  }, []);

  const handleLinkLeave = useCallback(() => {
    if (!cursorRef.current) return;
    
    gsap.to(cursorRef.current, {
      scale: 1,
      backgroundColor: '',
      duration: 0.3,
      force3D: true,
      overwrite: 'auto'
    });
    
    setCursorText('');
    cursorRef.current.classList.remove('custom-cursor-text');
  }, []);

  useEffect(() => {
    const interactiveElements = document.querySelectorAll('a, button');
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleLinkHover);
      el.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkHover);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleLinkHover, handleLinkLeave]);

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor hardware-accelerated ${!isVisible ? 'custom-cursor-hidden' : ''}`}
      aria-hidden="true"
    >
      {cursorText && <span className="text-xs font-medium">{cursorText}</span>}
    </div>
  );
};

export default React.memo(Cursor);