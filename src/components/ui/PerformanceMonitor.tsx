"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag: any;
  }
}

// Performance Monitoring Hook
export const usePerformanceMonitoring = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Measure navigation timing
    const measureNavigation = () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Send performance metrics to analytics
        if (window.gtag && process.env.NODE_ENV === 'production') {
          window.gtag('event', 'performance_timing', {
            event_category: 'Performance',
            event_label: pathname,
            value: Math.round(perfData.loadEventEnd - perfData.startTime),
          });

          // Core Web Vitals
          window.gtag('event', 'web_vital', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
          });
        }
      }
    };

    // Measure resource loading
    const measureResourceLoad = () => {
      if ('performance' in window) {
        const resources = performance.getEntriesByType('resource');
        resources.forEach((resource: PerformanceEntry) => {
          if (window.gtag && process.env.NODE_ENV === 'production') {
            window.gtag('event', 'resource_load_time', {
              event_category: 'Performance',
              event_label: resource.name,
              value: Math.round(resource.duration),
            });
          }
        });
      }
    };

    // Run measurements after page load
    window.addEventListener('load', () => {
      setTimeout(measureNavigation, 0);
      setTimeout(measureResourceLoad, 100);
    });
  }, [pathname]);
};

// Performance Monitoring Component
export const PerformanceMonitor = () => {
  usePerformanceMonitoring();
  
  return null; // This component doesn't render anything
};