import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText, ScrollToPlugin);

// Store active triggers by component ID
const activeTriggersMap: Record<string, Set<ScrollTrigger>> = {};

// Throttle function for scroll events
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance optimized defaults
export const performanceDefaults = {
  ease: "power3.out",
  duration: 0.6,
  force3D: true,
  overwrite: 'auto' as gsap.TweenVars['overwrite'],
  lazy: true,
  fastScrollEnd: true
};

// Create ScrollTrigger with automatic cleanup
export const createScrollTrigger = (componentId: string, config: ScrollTrigger.Vars): ScrollTrigger => {
  if (!activeTriggersMap[componentId]) {
    activeTriggersMap[componentId] = new Set();
  }

  const trigger = ScrollTrigger.create({
    ...config,
    onRefresh: (self) => {
      if (config.onRefresh) config.onRefresh(self);
    },
    onKill: (self) => {
      if (config.onKill) config.onKill(self);
      activeTriggersMap[componentId]?.delete(self);
    }
  });

  activeTriggersMap[componentId].add(trigger);
  return trigger;
};

// Create optimized timeline with ScrollTrigger
export const createScrollTimeline = (
  componentId: string,
  scrollTriggerConfig?: ScrollTrigger.Vars
): gsap.core.Timeline => {
  const timeline = gsap.timeline({
    defaults: performanceDefaults,
    scrollTrigger: scrollTriggerConfig ? {
      ...scrollTriggerConfig,
      onRefresh: (self) => {
        if (!activeTriggersMap[componentId]) {
          activeTriggersMap[componentId] = new Set();
        }
        activeTriggersMap[componentId].add(self);
        if (scrollTriggerConfig.onRefresh) scrollTriggerConfig.onRefresh(self);
      }
    } : undefined
  });

  return timeline;
};

// Cleanup function
export const cleanupScrollTriggers = (componentId: string): void => {
  if (activeTriggersMap[componentId]) {
    activeTriggersMap[componentId].forEach(trigger => trigger.kill());
    activeTriggersMap[componentId].clear();
    delete activeTriggersMap[componentId];
  }
};

// Optimized staggered animations
export const createStaggeredAnimation = (
  elements: Element[],
  fromVars: gsap.TweenVars,
  staggerAmount: number = 0.1,
  componentId: string,
  scrollTriggerConfig?: ScrollTrigger.Vars
): void => {
  if (elements.length === 0) return;

  const tl = createScrollTimeline(componentId, scrollTriggerConfig);
  
  tl.from(elements, {
    ...fromVars,
    stagger: {
      amount: staggerAmount,
      ease: "power1.inOut"
    },
    ...performanceDefaults
  });
};

// Throttled scroll handler
export const createThrottledScrollHandler = (
  handler: (event: Event) => void,
  delay: number = 100
): (event: Event) => void => {
  return throttle(handler, delay);
};

// Optimized SplitText with cleanup
export const createOptimizedSplitText = (
  element: Element,
  config: gsap.SplitText.Vars = { type: "words,chars" }
): SplitText => {
  const split = new SplitText(element, {
    ...config,
    reduceWhiteSpace: false
  });

  return split;
};

export default {
  createScrollTrigger,
  createScrollTimeline,
  cleanupScrollTriggers,
  createStaggeredAnimation,
  createThrottledScrollHandler,
  createOptimizedSplitText,
  performanceDefaults
};