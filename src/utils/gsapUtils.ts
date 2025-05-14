import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText, ScrollToPlugin);

// Store active triggers by component ID to enable targeted cleanup
const activeTriggersMap: Record<string, Set<ScrollTrigger>> = {};

/**
 * Creates a ScrollTrigger and registers it with the component for cleanup
 * @param componentId Unique ID for the component using the trigger
 * @param config ScrollTrigger configuration
 * @returns The created ScrollTrigger instance
 */
export const createScrollTrigger = (componentId: string, config: ScrollTrigger.Vars): ScrollTrigger => {
  if (!activeTriggersMap[componentId]) {
    activeTriggersMap[componentId] = new Set();
  }
  
  const trigger = ScrollTrigger.create(config);
  activeTriggersMap[componentId].add(trigger);
  
  return trigger;
};

/**
 * Creates a GSAP timeline with ScrollTrigger configuration and registers it for cleanup
 * @param componentId Unique ID for the component using the timeline
 * @param scrollTriggerConfig Optional ScrollTrigger configuration
 * @returns A GSAP timeline instance
 */
export const createScrollTimeline = (
  componentId: string, 
  scrollTriggerConfig?: ScrollTrigger.Vars
): gsap.core.Timeline => {
  const timeline = gsap.timeline({
    scrollTrigger: scrollTriggerConfig ? {
      ...scrollTriggerConfig,
      onRefresh: (self) => {
        if (!activeTriggersMap[componentId]) {
          activeTriggersMap[componentId] = new Set();
        }
        activeTriggersMap[componentId].add(self);
        
        // Call the original onRefresh if it exists
        if (scrollTriggerConfig.onRefresh) {
          scrollTriggerConfig.onRefresh(self);
        }
      }
    } : undefined
  });
  
  return timeline;
};

/**
 * Performs efficient cleanup of all ScrollTriggers associated with a component
 * @param componentId Unique ID for the component to clean up
 */
export const cleanupScrollTriggers = (componentId: string): void => {
  if (activeTriggersMap[componentId]) {
    activeTriggersMap[componentId].forEach(trigger => {
      trigger.kill();
    });
    activeTriggersMap[componentId].clear();
    delete activeTriggersMap[componentId];
  }
};

/**
 * Creates staggered animations with reduced CPU usage
 * @param elements Elements to animate
 * @param fromVars GSAP from vars
 * @param staggerAmount Time between each animation
 * @param componentId Component ID for cleanup
 * @param scrollTriggerConfig Optional ScrollTrigger configuration
 */
export const createStaggeredAnimation = (
  elements: (Element | null)[],
  fromVars: gsap.TweenVars,
  staggerAmount: number = 0.1,
  componentId: string,
  scrollTriggerConfig?: ScrollTrigger.Vars
): void => {
  // Filter out null elements
  const validElements = elements.filter(Boolean) as Element[];
  
  if (validElements.length === 0) return;
  
  const tl = createScrollTimeline(componentId, scrollTriggerConfig);
  
  tl.from(validElements, {
    ...fromVars,
    stagger: staggerAmount,
    force3D: true, // Hardware acceleration
    overwrite: 'auto',
  });
};

/**
 * Optimizes performance for splitText animations
 * @param element Element containing text to split
 * @param splitType Type of split (chars, words, lines)
 * @param componentId Component ID for cleanup
 * @returns Split text instance
 */
export const createOptimizedSplitText = (
  element: Element | null,
  splitType: 'chars' | 'words' | 'lines' | 'all' = 'words',
  componentId: string
): SplitText | null => {
  if (!element) return null;
  
  // Use the SplitText API
  const splitText = new SplitText(element, {
    type: splitType,
    linesClass: "split-line",
    wordsClass: "split-word",
    charsClass: "split-char",
  });
  
  // Add cleanup function to ensure SplitText instances are properly disposed
  const originalRevert = splitText.revert.bind(splitText);
  splitText.revert = () => {
    originalRevert();
    if (componentId && activeTriggersMap[componentId]) {
      // Some cleanup specific to this instance if needed
    }
  };
  
  return splitText;
};

// Performance optimized defaults
export const performanceDefaults = {
  ease: "power3.out", // More efficient than elastic or bounce
  duration: 0.6,      // Shorter durations use less CPU
  force3D: true,      // Hardware acceleration
  overwrite: 'auto' as gsap.TweenVars['overwrite'],
  lazy: true,         // Optimized rendering
  fastScrollEnd: true // Performance for ScrollTrigger
};

// Throttled scroll function to reduce scroll event impact
export const createThrottledScrollTrigger = (
  componentId: string,
  config: ScrollTrigger.Vars,
  throttleAmount: number = 0.2  // seconds
): ScrollTrigger => {
  let lastScrollTime = 0;
  const now = Date.now();
  
  const throttledConfig = {
    ...config,
    onUpdate: (self: ScrollTrigger) => {
      const currentTime = Date.now();
      if (currentTime - lastScrollTime > throttleAmount * 1000) {
        lastScrollTime = currentTime;
        if (config.onUpdate) {
          config.onUpdate(self);
        }
      }
    }
  };
  
  return createScrollTrigger(componentId, throttledConfig);
};

export default {
  createScrollTrigger,
  createScrollTimeline,
  cleanupScrollTriggers,
  createStaggeredAnimation,
  createOptimizedSplitText,
  performanceDefaults,
  createThrottledScrollTrigger
}; 