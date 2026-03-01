# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js portfolio website for Newton Frank, featuring a sophisticated design system called "The Nexus" that allows users to shift between "Developer", "Nexus" (hybrid), and "Designer" modes. The portfolio showcases advanced UI/UX with 3D graphics, smooth animations, and dynamic theming.

## Architecture & Structure

The project follows a Next.js 14 App Router architecture with:
- `src/app/` - Contains Next.js routes and global configuration
- `src/components/sections/` - Major page sections (Hero, About, Work, Skills, Contact, Footer)
- `src/components/ui/` - Reusable UI components (3D cards, parallax effects, custom cursors, etc.)
- `src/components/canvas/` - Three.js and 3D related components
- `src/store/` - Zustand stores for global state management
- `src/hooks/` - Custom React hooks

## Key Features & Architecture

1. **Dynamic Theme System**: The `useSpectrum` store manages a continuous spectrum between Developer, Nexus, and Designer modes with dynamic CSS variable updates and color transitions.

2. **Performance Optimized**: Uses Next.js dynamic imports for lazy loading sections and components to optimize initial load times.

3. **3D Graphics**: Heavily uses Three.js and @react-three/fiber for 3D visualizations and interactive elements.

4. **Advanced Animations**: Implements Framer Motion, custom scroll effects, and smooth cursor animations.

5. **Custom UI Components**: Extensive collection of reusable UI components including 3D cards, parallax effects, custom cursors, and more.

## State Management

- `useSpectrum` (src/store/useSpectrum.ts): Manages the theme spectrum between Dev/Design modes
- `useTechStore` (src/store/useTechStore.ts): Manages technology stack state
- Custom hooks in `src/hooks/` for mobile detection, physics, scroll reveal, etc.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Key Files & Components

- `src/app/page.tsx`: Main page with lazy-loaded sections
- `src/app/layout.tsx`: Root layout with metadata and structured data
- `src/app/globals.css`: Tailwind layers with dynamic theme variables
- `src/components/sections/*`: Individual page sections
- `src/components/ui/*`: Reusable UI components
- `src/store/useSpectrum.ts`: Dynamic theme system implementation
- `src/components/ui/SpectrumSlider.ts`: Interactive slider for theme switching

## Styling Approach

Uses Tailwind CSS with custom CSS variables managed by the spectrum system. Components are styled using:
- CSS variables defined in `:root` for dynamic theming
- Tailwind's `@layer` directives for component definitions
- Custom CSS for advanced effects like grain overlays and vignettes

## Special Considerations

- The project uses dynamic imports extensively to prevent SSR issues with Three.js and browser-specific APIs
- Custom cursor implementation that hides native cursor on desktop devices
- Smooth scrolling implemented with lenis for enhanced UX
- Advanced SEO with structured data, OpenGraph, and Twitter cards
- Konami code Easter egg implementation in the KonamiTerminal component