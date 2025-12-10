# Moonii Project Detail Page - Documentation

## Overview

This is a production-ready Project Detail page featuring a **Floating Stage** design with 3D parallax mockups, shared element transitions, and full accessibility support.

## Features Implemented

### ✨ Visual Design

- **Floating Stage**: Three frameless device mockups (1 primary center, 2 secondary angled)
- **3D Parallax**: Mouse-following effects with configurable intensity
- **Glass Morphism**: Backdrop-blur containers with subtle borders
- **Animated Orbs**: 3 floating gradient orbs in background
- **Theme Support**: Full light/dark mode integration

### 🎬 Animations

- **Shared Element Transition**: Hero image morphs from `/work` overview page (800ms spring)
- **Entry Animation**: Blurred hero → sharp + content stagger (0.04s delays)
- **Hover Effects**: Micro-lift (-6px), scale (1.02), glow border (180ms ease-out)
- **Parallax Ranges**:
  - Primary mockup: ±10px translate
  - Secondary mockups: ±18px translate, ±3deg rotate

### ♿ Accessibility

- **Reduced Motion**: All animations disabled when `prefers-reduced-motion` is active
- **Keyboard Navigation**: Arrow keys navigate modal, Esc closes
- **Alt Text**: All images have descriptive alt attributes
- **Focus States**: Visible keyboard focus indicators
- **ARIA Labels**: Proper labels on interactive elements

### 📱 Responsive Design

- **Desktop (lg+)**: 3-up floating stage layout
- **Mobile (<lg)**: Single centered primary mockup
- **Touch Support**: Tap interactions, swipe in modal

### 🚀 Performance

- **Priority Loading**: Hero image with `priority` flag
- **Lazy Loading**: Secondary mockups load on-demand
- **Transform-Only Animations**: No layout thrashing
- **Optimized Images**: next/image with proper `sizes` attributes
- **Shallow DOM**: Only 3 orb elements in background

## Components

### `FloatingStage`

Main 3-mockup stage with parallax effects.

**Props:**

```typescript
{
  images: Array<{ name: string; image: string }>;
  mockupRadius?: string; // Default: "28px"
  reduced?: boolean; // Disable animations
  onOpen?: (index: number) => void; // Click handler
}
```

### `FramelessDeviceMockup`

Individual device mockup with hover and parallax.

**Props:**

```typescript
{
  src: string; // Image path
  alt: string; // Accessibility text
  size: "primary" | "secondary";
  index: number; // 0=left, 1=center, 2=right
  mockupRadius?: string; // CSS variable
  reduced?: boolean;
  onClick?: () => void;
}
```

### `OrbBackground`

Renders 3 animated gradient orbs.

**Props:**

```typescript
{
  reduced?: boolean; // Returns null if true
  isDark: boolean; // Theme state
}
```

### `FullscreenModalViewer`

Fullscreen image carousel with keyboard navigation.

**Props:**

```typescript
{
  images: Array<{ name: string; image: string }>;
  initialIndex: number;
  onClose: () => void;
}
```

## Configuration

### Adjusting Mockup Radius

The mockup corner radius is controlled by a CSS variable:

```typescript
// In FloatingStage component, adjust:
mockupRadius = "28px"; // Increase/decrease to match your exported PNGs
```

**How to test:**

1. Open the page in browser
2. Inspect a mockup container
3. If corners don't align with image, adjust the value
4. Test in both light and dark mode

### Moving Assets to Safe Path

**Current path:** `public/Temp Projects UI/Moonii/` (has spaces!)

**Recommended:**

```bash
# Move files
mv "public/Temp Projects UI/Moonii" "public/assets/moonii"

# Update projectData.basePublicPath
basePublicPath: "/assets/moonii"
```

**Why?** Spaces in URLs can cause issues with some CDNs and build tools.

### Enabling Shared Element Transition

The transition works via Framer Motion's `layoutId`:

**On overview page (`/work/page.tsx`):**

```typescript
<motion.div layoutId={`project-hero-${project.id}`}>
  <Image src={project.thumbnail} ... />
</motion.div>
```

**On detail page (`/work/moonii/page.tsx`):**

```typescript
<motion.div layoutId={`project-hero-5`}>
  <Image src={projectData.heroImage} ... />
</motion.div>
```

✅ **Already implemented** - The background preview on hover uses the same `layoutId`.

## Test Plan Checklist

### Performance

- [ ] **LCP (Largest Contentful Paint)**: Hero image loads < 2.5s
- [ ] **CLS (Cumulative Layout Shift)**: No layout shifts during animations (use aspect ratios)
- [ ] **FID (First Input Delay)**: Click interactions respond < 100ms

### Accessibility

- [ ] **Keyboard Navigation**:
  - [ ] Arrow Left/Right navigate modal images
  - [ ] Escape closes modal
  - [ ] Tab focuses interactive elements
- [ ] **Reduced Motion**:
  - [ ] Enable OS-level reduced motion
  - [ ] Verify all parallax/animations disabled
  - [ ] Confirm crossfade-only transitions
- [ ] **Screen Reader**:
  - [ ] All images have descriptive alt text
  - [ ] ARIA labels present on buttons
  - [ ] Focus order is logical

### Visual & Interaction

- [ ] **Shared Element**: Click Moonii on `/work` → thumbnail morphs to hero
- [ ] **Parallax**: Move mouse → mockups follow with correct intensity
- [ ] **Hover**: Hover mockup → lift + scale + glow
- [ ] **Modal**: Click mockup → fullscreen viewer opens
- [ ] **Responsive**:
  - [ ] Desktop shows 3-up layout
  - [ ] Mobile shows single centered mockup
  - [ ] Tablet layout adapts gracefully

### Browser Compatibility

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (Chrome Android, Safari iOS)

## Animation Constants Reference

```typescript
// Spring physics for shared element
{ type: 'spring', stiffness: 110, damping: 18, mass: 0.9 }

// Hover micro-lift
transform: translateY(-6px) scale(1.02)
transition: 180ms ease-out

// Parallax ranges
Primary: ±10px translate, 0deg rotate
Secondary: ±18px translate, ±3deg rotate

// Content stagger
0.04s delay between each section
(Hero → Title → Stage → Features → Nav)

// Reduced motion
duration: 0 (instant)
parallax: disabled
```

## File Structure

```
app/work/moonii/
└── page.tsx (Complete standalone page)

public/
└── Temp Projects UI/
    └── Moonii/
        ├── 1.png (Home screen)
        ├── 2.png (Story List)
        ├── 3.png (Recording)
        ├── 4.png (Recording Process)
        └── 5.png (Upload)
```

## Customization for Other Projects

To adapt this for another project:

1. **Duplicate the file**: `cp app/work/moonii/page.tsx app/work/[project-name]/page.tsx`
2. **Update projectData object**:
   ```typescript
   const projectData = {
     id: 6, // Change ID
     title: "Your Project",
     gallery: [...], // Update image paths
     orbColors: { primary: "#hex", secondary: "#hex" },
     // ... other fields
   };
   ```
3. **Update layoutId**: Change `layoutId="project-hero-5"` to match new ID
4. **Test**: Verify shared transition works from `/work` page

## Troubleshooting

### Shared transition not working?

- Verify both pages use same `layoutId` format
- Check that you're navigating between pages (not hard refresh)
- Ensure Framer Motion versions match

### Mockup corners misaligned?

- Adjust `mockupRadius` prop (try 24px, 32px, 36px)
- Check if your PNGs have transparency in corners
- Verify border-radius is applied to both container and image

### Parallax feels laggy?

- Check for `prefers-reduced-motion` setting
- Reduce orb count from 3 to 2
- Lower `stiffness` in spring config

### Images not loading?

- Verify paths don't have typos
- Check `public/` folder structure
- Test with relative paths `/assets/...`

## Browser DevTools Testing

### Reduced Motion

```javascript
// In DevTools Console
// Force reduced motion on
matchMedia("(prefers-reduced-motion: reduce)").matches = true;

// Check current state
window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

### Performance Monitoring

```javascript
// Measure layout shifts
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log("CLS:", entry);
  }
});
observer.observe({ entryTypes: ["layout-shift"] });
```

## Credits

- Design Pattern: Floating Stage with 3D Parallax
- Inspired by: Modern SaaS product pages (Linear, Vercel)
- Framework: Next.js 14+ with App Router
- Animation: Framer Motion
- Styling: Tailwind CSS + CSS Variables
