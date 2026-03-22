# @hanzo/gui-animations-motion

Motion animation driver for Hanzo GUI, powered by the [Motion](https://motion.dev) library and the Web Animations API (WAAPI).

## Features

- **Hybrid Engine**: Combines JavaScript animations with native WAAPI for GPU-accelerated performance
- **Spring Physics**: Natural, physics-based animations with intuitive `damping`, `stiffness`, and `mass` parameters
- **Independent Transforms**: Animate `x`, `y`, `scale`, `rotate` properties separately with different configurations
- **Compositor Thread**: Runs animations smoothly even when the main thread is busy
- **Web-Only**: Optimized for modern web browsers with WAAPI support

## Installation

```bash
yarn add @hanzo/gui-animations-motion motion
```

## Usage

Add to your Hanzo GUI configuration:

```tsx
import { createAnimations } from '@hanzo/gui-animations-motion'
import { createGui } from '@hanzo/gui'

export default createGui({
  animations: createAnimations({
    bouncy: {
      type: 'spring',
      damping: 9,
      mass: 0.9,
      stiffness: 150,
    },
    quick: {
      type: 'spring',
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    '100ms': {
      duration: 100,
    },
  }),
  // ...
})
```

## Animation Types

### Spring Animations

```tsx
{
  type: 'spring',
  damping: 10,    // Higher = less bouncy
  stiffness: 100, // Higher = faster
  mass: 1,        // Higher = more inertia
}
```

### Tween Animations

```tsx
{
  duration: 200, // Duration in milliseconds
}
```

## Documentation

For complete documentation, see the [Gui Animations docs](https://gui.hanzo.ai/docs/core/animations).
