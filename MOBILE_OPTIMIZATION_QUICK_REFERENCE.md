# Mobile Optimization - Quick Reference

## 🎯 Core Pattern

```typescript
import { useIsMobile, useHasHover } from "@/lib/device-detect";

function MyComponent() {
  const isMobile = useIsMobile();
  const hasHover = useHasHover();
  
  // Early return for mobile-only components
  if (!hasHover) return null; // For CustomCursor
  
  // Conditional rendering
  return (
    <div>
      {/* Desktop-only heavy effects */}
      {!isMobile && (
        <ExpensiveAnimation />
      )}
      
      {/* Mobile gets simple version */}
      {isMobile ? (
        <SimpleGradient />
      ) : (
        <AnimatedBackground />
      )}
      
      {/* Conditional animations */}
      <motion.div
        whileHover={hasHover ? { scale: 1.1 } : {}}
        animate={isMobile ? {} : { y: 10, rotate: 5 }}
      />
      
      {/* Touch + Mouse support */}
      <div
        onMouseEnter={hasHover ? handleHover : undefined}
        onTouchStart={!hasHover ? handleTouch : undefined}
      />
    </div>
  );
}
```

---

## 📱 Device Detection Hooks

### useIsMobile()
```typescript
const isMobile = useIsMobile(); // true if width < 768px
```
**Use for**: Disabling animations, showing mobile layouts

### useHasHover()
```typescript
const hasHover = useHasHover(); // true if device has fine pointer
```
**Use for**: Conditional hover effects, showing/hiding cursor

### useDeviceTier()
```typescript
const tier = useDeviceTier(); // "mobile" | "tablet" | "desktop" | null
```
**Use for**: Complex responsive logic

### useIsTouchDevice()
```typescript
const isTouch = useIsTouchDevice(); // true if touch events supported
```
**Use for**: Touch-specific features

---

## 🎨 Optimization Patterns

### Pattern 1: Disable Component
```typescript
// CustomCursor.tsx
if (!hasHover) return null;
```

### Pattern 2: Conditional Rendering
```typescript
// AnimatedBackground.tsx
if (!mounted || isMobile) return <SimpleBackground />;
```

### Pattern 3: Wrap Expensive JSX
```typescript
// Contact page
{!isMobile && (
  <FloatingOrbs count={3} />
)}
```

### Pattern 4: Conditional Animation Props
```typescript
// BrowserMockup.tsx
<motion.div
  animate={isMobile ? {} : { scale: 1.05, rotateY: 10 }}
/>
```

### Pattern 5: Conditional Event Handlers
```typescript
// Work page
<div
  onMouseEnter={hasHover ? handler : undefined}
  onTouchStart={!hasHover ? handler : undefined}
/>
```

### Pattern 6: Conditional 3D Transforms
```typescript
// Resume cards
style={{
  transform: (isMobile || !hasHover) ? 'none' : 'rotateX(10deg)',
  transformStyle: hasHover ? 'preserve-3d' : 'flat'
}}
```

---

## ⚡ Performance Tips

### ✅ DO
- Use early returns for mobile (`if (isMobile) return <Simple />`)
- Wrap JSX in conditionals (`{!isMobile && <Heavy />}`)
- Return null for decorative components on mobile
- Use empty objects for disabled animations (`animate={isMobile ? {} : variants}`)

### ❌ DON'T
- Use `className="hidden"` for performance-critical components (still renders)
- Disable animations with `animate={false}` (still calculates)
- Use CSS `display: none` for expensive components (still in DOM)
- Forget to add `undefined` to disabled handlers (`onClick={isMobile ? undefined : handler}`)

---

## 🔧 Common Scenarios

### Scenario: Floating Orb Background
```typescript
// OrbBackground.tsx
if (!mounted || isMobile) return null;

return (
  <div>
    {orbs.map(orb => (
      <motion.div
        animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
      />
    ))}
  </div>
);
```

### Scenario: 3D Tilt Card
```typescript
// Resume cards
const handleMouseMove = (e) => {
  if (!hasHover || isMobile) return;
  // Calculate tilt
};

<motion.div
  onMouseMove={hasHover ? handleMouseMove : undefined}
  style={{
    rotateX: (isMobile || !hasHover) ? 0 : tiltX,
    transformStyle: hasHover ? 'preserve-3d' : 'flat'
  }}
/>
```

### Scenario: Hover + Touch Interaction
```typescript
// Social cards, project items
<div
  onMouseEnter={hasHover ? () => setHovered(true) : undefined}
  onMouseLeave={hasHover ? () => setHovered(false) : undefined}
  onTouchStart={!hasHover ? () => setHovered(true) : undefined}
  onTouchEnd={!hasHover ? () => setHovered(false) : undefined}
/>
```

### Scenario: Framer Motion whileHover
```typescript
// Buttons, FAB
<motion.button
  whileTap={{ scale: 0.95 }} // Keep - touch feedback
  whileHover={hasHover ? { scale: 1.05 } : {}} // Conditional
/>
```

---

## 📊 Breakpoints Reference

```typescript
// lib/device-detect.ts
const BREAKPOINTS = {
  mobile: 768,   // < 768px
  tablet: 1024   // 768-1023px
};

// Tailwind (tailwind.config.js)
screens: {
  sm: '640px',
  md: '768px',   // Matches mobile breakpoint
  lg: '960px',
  xl: '1200px'
}
```

**Mobile**: < 768px  
**Tablet**: 768-1023px  
**Desktop**: ≥ 1024px

---

## 🐛 Debugging

### Check Device Detection
```typescript
import { useDeviceTier, useIsMobile, useHasHover } from "@/lib/device-detect";

function Debug() {
  const tier = useDeviceTier();
  const isMobile = useIsMobile();
  const hasHover = useHasHover();
  
  console.log({ tier, isMobile, hasHover, width: window.innerWidth });
  
  return null;
}
```

### Check Animation States
```typescript
<motion.div
  animate={isMobile ? {} : variants}
  onAnimationStart={() => console.log('Animation started')}
  onAnimationComplete={() => console.log('Animation complete')}
/>
```

### Force Mobile/Desktop
```typescript
// Temporarily override for testing
const isMobile = true; // Force mobile
const hasHover = false; // Force touch
```

---

## 📝 Checklist for New Components

- [ ] Import device detection hooks
- [ ] Add `const isMobile = useIsMobile()`
- [ ] Add `const hasHover = useHasHover()`
- [ ] Wrap heavy animations in `{!isMobile && ( ... )}`
- [ ] Make `whileHover` conditional: `whileHover={hasHover ? {...} : {}}`
- [ ] Add touch handlers: `onTouchStart={!hasHover ? handler : undefined}`
- [ ] Disable 3D transforms on mobile
- [ ] Return simple version for mobile if needed
- [ ] Test on mobile, tablet, desktop breakpoints

---

## 🎯 Priority Ranking

### Critical (Always optimize)
- Animated backgrounds with multiple orbs
- 3D transform effects on cards
- Mouse parallax tracking
- Particle systems
- Morphing animations

### Important (Optimize when possible)
- Hover scale effects on buttons
- Floating shadows
- Custom cursors
- Complex transitions

### Optional (Can keep on mobile)
- Simple fades/slides
- WhileTap feedback
- Basic opacity changes
- Static gradients

---

## 🔄 Migration Checklist

When adding to existing component:

1. **Add imports**
   ```typescript
   import { useIsMobile, useHasHover } from "@/lib/device-detect";
   ```

2. **Add hooks**
   ```typescript
   const isMobile = useIsMobile();
   const hasHover = useHasHover();
   ```

3. **Update render logic**
   - Early returns
   - Conditional JSX
   - Conditional props

4. **Test**
   - Mobile (<768px)
   - Tablet (768-1023px)
   - Desktop (≥1024px)

---

## ✅ Validation

Component is optimized when:
- [ ] No console errors on mobile
- [ ] Heavy effects disabled on mobile
- [ ] Touch interactions work
- [ ] Desktop unchanged
- [ ] Smooth 60fps on mobile
- [ ] No hydration mismatches

---

**Last Updated**: [Current Date]  
**Status**: Production Ready ✅
