# Design Showdown - Style Guide
**Last Updated**: January 2025
**For**: Claude Code implementation reference

This style guide extracts the complete design system from the Design Showdown furniture voting game. Use this to replicate the aesthetic in new pages or projects.

---

## Design Philosophy

**Editorial Minimalism** - Clean typography, ample whitespace, and subtle interactions inspired by Pale Blue Magazine's aesthetic.

### Core Principles
- Minimalist black/white/gray palette
- Editorial presentation with designer attribution
- Card-based layouts with subtle borders
- Smooth transitions and fade animations
- Mobile-responsive with stacked layouts

---

## Typography

### Font Families
```css
Primary: 'Diatype', sans-serif
Fallback: 'Inter', sans-serif (for specific elements)
```

### Font Weights
- 300 - Light (body text, subtle elements)
- 400 - Regular (descriptions, secondary content)
- 500 - Medium (labels, metadata)
- 600 - Semibold (buttons, emphasis)
- 700 - Bold (titles, headings)
- 800 - Extra Bold (uppercase labels)

### Text Styles

#### Headings
```css
/* Main Title */
font-size: clamp(24px, 1.5rem + ((1vw - 3.2px) * 0.625), 32px);
font-weight: 700;
letter-spacing: -0.02em;
text-transform: uppercase;
color: #636363;

/* Section Title */
font-size: clamp(16px, 1rem + ((1vw - 3.2px) * 0.417), 20px);
font-weight: 700;
letter-spacing: 0.05em;
text-transform: uppercase;
color: #636363;

/* Large Display (Modal) */
font-size: 2.2rem;
font-weight: 700;
text-transform: uppercase;
line-height: 0.9;
letter-spacing: -0.04em;
color: #222;
```

#### Body Text
```css
/* Standard Body */
font-size: 14px;
font-weight: 400;
line-height: 1.5;
color: #636363;

/* Large Body (Modal) */
font-size: 1.1rem;
font-weight: 400;
line-height: 1.6;
color: #666;

/* Small Body */
font-size: 12px;
font-weight: 400;
color: #636363;
```

#### Labels & Metadata
```css
/* Uppercase Label */
font-size: 12px;
font-weight: 500;
letter-spacing: 0.1em;
text-transform: uppercase;
color: #636363;

/* Subtitle Label */
font-size: 14px;
font-weight: 500;
color: #636363;

/* Small Label */
font-size: 0.625rem; /* 10px */
font-weight: 500;
letter-spacing: 0.1em;
text-transform: uppercase;
color: #999999;
```

#### Product Card Text
```css
/* Product Name */
font-size: clamp(14px, 1.5vw, 16px);
font-weight: 700;
letter-spacing: 0.02em;
text-transform: uppercase;
color: #636363;

/* Designer Name */
font-size: clamp(12px, 1.2vw, 14px);
font-weight: 500;
font-style: italic;
color: #888888;
text-decoration: underline;
text-decoration-color: rgba(136, 136, 136, 0.4);

/* Materials */
font-size: clamp(11px, 1.1vw, 13px);
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.03em;
color: #999999;

/* Retailer */
font-size: clamp(0.625rem, 1.1vw, 0.75rem);
font-weight: 300;
font-style: italic;
color: #999999;
```

---

## Color Palette

### Primary Colors
```css
/* Backgrounds */
--bg-primary: #E9EFF4;        /* Light blue-gray */
--bg-card: #ffffff;           /* Pure white */
--bg-subtle: #fafafa;         /* Off-white */

/* Text Colors */
--text-primary: #000000;      /* Pure black */
--text-secondary: #636363;    /* Medium gray */
--text-tertiary: #888888;     /* Light gray */
--text-metadata: #999999;     /* Lighter gray */
--text-muted: #666666;        /* Dark gray */

/* Borders */
--border-default: #e5e5e5;    /* Light border */
--border-subtle: #f0f0f0;     /* Very light border */
--border-dark: #000000;       /* Black border */

/* Interactive States */
--hover-border: #cccccc;
--chosen-bg: #fafafa;
--chosen-border: #000000;
```

### Accent Colors
```css
/* Success/Winner */
--accent-green: #5a8a5a;      /* Muted green for poll bars */

/* Interactive Elements */
--button-bg: #000000;
--button-hover: #333333;
--button-text: #ffffff;
```

### Opacity Values
```css
/* Common opacity levels */
--opacity-disabled: 0.5;
--opacity-subtle: 0.6;
--opacity-overlay: 0.8;
--opacity-full: 1.0;
```

---

## Spacing System

### Base Units
```css
/* Spacing scale (based on rem) */
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 0.75rem;    /* 12px */
--space-lg: 1rem;       /* 16px */
--space-xl: 1.5rem;     /* 24px */
--space-2xl: 2rem;      /* 32px */
--space-3xl: 3rem;      /* 48px */
--space-4xl: 4rem;      /* 64px */
```

### Common Patterns
```css
/* Card padding */
padding: 3rem;                    /* Desktop */
padding: 1.5rem;                  /* Tablet */
padding: 1rem;                    /* Mobile */

/* Section margins */
margin-bottom: 2rem;              /* Standard section */
margin-bottom: 1.5rem;            /* Tight section */

/* Container padding */
padding: 6rem 2rem 4rem 2rem;    /* Desktop */
padding: 4rem 0.25rem 1rem 0.25rem; /* Mobile */
```

---

## Layout Patterns

### Cards
```css
.card {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    transition: all 0.4s ease;
}

.card:hover {
    border-color: #cccccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Chosen/Active State */
.card.chosen {
    border-color: #000000;
    background: #fafafa;
}

/* Disabled State */
.card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border: 1px dashed #999999;
}
```

### Two-Column Layout (Desktop)
```css
.two-column {
    display: flex;
    gap: 0;
    max-width: 800px;
}

.column {
    flex: 1;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    padding: 1.5rem;
}

/* Mobile: Stack vertically */
@media (max-width: 768px) {
    .two-column {
        flex-direction: column;
    }
}
```

### Product Card Structure
```css
.product-card {
    display: flex;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    min-height: 300px;
}

/* Image Container (60% width) */
.card-image {
    width: 60%;
    background: #fafafa;
    border-right: 1px solid #e5e5e5;
    aspect-ratio: 4/5;  /* Taller for portrait products */
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: bottom;  /* Desktop: anchor from bottom */
}

/* Content Container (40% width) */
.card-content {
    width: 40%;
    padding: min(2vw, 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* Mobile: Horizontal layout with different proportions */
@media (max-width: 800px) {
    .product-card {
        height: 280px;
    }

    .card-image {
        width: 65%;
    }

    .card-content {
        width: 35%;
        padding: 0.75rem 0.5rem;
    }

    .card-image img {
        object-position: center 75%;  /* Mobile: 25% from bottom */
    }
}
```

---

## Buttons

### Primary Button (Dark)
```css
.button-primary {
    background: #000000;
    color: #ffffff;
    border: 1px solid #000000;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.button-primary:hover {
    background: #333333;
    border-color: #333333;
}
```

### Secondary Button (Outline)
```css
.button-secondary {
    background: transparent;
    color: #000000;
    border: 1px solid #000000;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.button-secondary:hover {
    background: #000000;
    color: #ffffff;
}
```

### Large Modal Button
```css
.button-large {
    background: #222;
    color: white;
    border: 2px solid #222;
    padding: 1rem 2rem;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.button-large:hover {
    background: transparent;
    color: #222;
}
```

---

## Animations & Transitions

### Fade Animations
```css
/* Standard fade in */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.8s ease-in-out;
}

/* Fast fade in */
.fade-in-fast {
    animation: fadeIn 0.4s ease-in-out;
}

/* Fade out */
@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-10px);
    }
}

.fade-out {
    animation: fadeOut 0.8s ease-in-out;
}
```

### Transitions
```css
/* Standard transitions */
transition: all 0.3s ease;        /* Hover states, small changes */
transition: all 0.4s ease;        /* Card states */
transition: opacity 0.6s ease;    /* Visibility changes */
transition: opacity 0.8s ease;    /* Smooth fades */

/* Background color changes */
transition: background-color 0.8s ease-in-out;
```

### Subtle Pulse Animation
```css
@keyframes gentle-border-pulse {
    0%, 100% {
        border-color: #999999;
        opacity: 1;
    }
    50% {
        border-color: #bbbbbb;
        opacity: 0.9;
    }
}

.pulsing-element {
    animation: gentle-border-pulse 2s ease-in-out infinite;
}
```

---

## Forms & Inputs

### Text Links
```css
.text-link {
    color: #636363;
    text-decoration: underline;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: opacity 0.3s ease;
    cursor: pointer;
}

.text-link:hover {
    opacity: 0.7;
}

/* Designer link with subtle underline */
.designer-link {
    color: #888888;
    font-style: italic;
    text-decoration: underline;
    text-decoration-color: rgba(136, 136, 136, 0.4);
    transition: all 0.3s ease;
}

.designer-link:hover {
    color: #636363;
    text-decoration-color: rgba(99, 99, 99, 0.8);
}
```

---

## Special Components

### VS Badge
```css
.vs-badge {
    background: #636363;
    color: #ffffff;
    border: 1px solid #636363;
    padding: 0.75rem 1.25rem;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
    width: 80px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

### Poll Results Bar
```css
.poll-bar {
    width: 100%;
    height: 0.25rem;
    background: #e5e5e5;
    overflow: hidden;
    border-radius: 2px;
}

.poll-fill {
    height: 100%;
    background: #cccccc;
    border-radius: 0 2px 2px 0;
    width: 0%;
    transition: width 0.4s ease;
}

.poll-fill.chosen {
    background: #5a8a5a;  /* Green for winner */
}

.poll-percentage {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #000000;
}
```

### Leaderboard List
```css
.leaderboard-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.leaderboard-item:last-child {
    border-bottom: none;
}

.leaderboard-rank {
    font-size: 0.625rem;
    font-weight: 500;
    color: #999999;
    width: 1.5rem;
    text-align: center;
}

.leaderboard-name {
    flex: 1;
    margin: 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: #000000;
    text-decoration: underline;
    cursor: pointer;
}

.leaderboard-stats {
    font-size: 0.625rem;
    color: #666666;
    white-space: nowrap;
}
```

---

## Modal/Overlay Patterns

### Full-Screen Overlay
```css
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
```

### Modal Card
```css
.modal {
    background: #ffffff;
    max-width: 900px;
    width: 90%;
    height: 500px;
    display: flex;
}

/* Split modal: Image + Content */
.modal-image {
    width: 500px;
    position: relative;
    overflow: hidden;
}

.modal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.modal-content {
    width: 400px;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Mobile: Stack vertically */
@media (max-width: 768px) {
    .modal {
        flex-direction: column;
        width: 95%;
        height: auto;
    }

    .modal-image {
        width: 100%;
        height: 280px;
    }

    .modal-content {
        width: 100%;
        padding: 2rem;
    }
}
```

### Image Overlay Text
```css
.image-overlay {
    position: absolute;
    left: 0;
    right: 0;
    padding: 1rem;
    color: black;
    text-align: center;
}

.image-overlay.top {
    top: 0;
}

.image-overlay.bottom {
    bottom: 0;
}
```

---

## Header/Navigation

### Fixed Header with Blur
```css
.site-header {
    position: fixed;
    width: 100%;
    z-index: 7;
    background: rgba(233, 239, 244, 0.7);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    box-shadow: 0 2px 4px 0 rgba(31, 38, 135, 0.1);
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.site-logo {
    margin-left: 2.5%;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    color: #636363;
    mix-blend-mode: difference;
}

.site-nav {
    margin-right: 2.5%;
    display: flex;
    gap: 2rem;
}

.site-nav a {
    color: #636363;
    text-decoration: none;
    font-weight: 500;
}
```

### Mobile Menu
```css
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #E9EFF4;
    padding: 30px 40px;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
}

.mobile-menu.is-open {
    opacity: 1;
    visibility: visible;
}

.hamburger {
    background: none;
    border: none;
    width: 20px;
    height: 16px;
    cursor: pointer;
}

/* Hamburger icon */
.hamburger-lines {
    position: relative;
    width: 18px;
    height: 2px;
    background: #636363;
}

.hamburger-lines::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 0;
    width: 18px;
    height: 2px;
    background: #636363;
}
```

---

## Responsive Breakpoints

```css
/* Mobile-first approach */

/* Small mobile */
@media (max-width: 600px) {
    /* Ultra-compact layouts */
}

/* Mobile */
@media (max-width: 800px) {
    /* Primary mobile breakpoint */
    /* Stack layouts vertically */
    /* Reduce padding/margins */
    /* Smaller font sizes */
}

/* Tablet/Desktop threshold */
@media (min-width: 769px) {
    /* Desktop-specific enhancements */
}

/* Desktop minimum */
@media (min-width: 768px) {
    /* Multi-column layouts */
    /* Larger spacing */
    /* Hover states active */
}
```

### Common Responsive Patterns

#### Container Padding
```css
/* Desktop */
padding: 6rem 2rem 4rem 2rem;

/* Mobile (800px) */
padding: 4rem 0.25rem 1rem 0.25rem;

/* Small mobile (600px) */
padding: 4rem 0.125rem 1rem 0.125rem;
```

#### Font Size Scaling
```css
/* Desktop */
font-size: clamp(14px, 1.5vw, 16px);

/* Mobile (800px) */
font-size: 0.85rem;

/* Small mobile (600px) */
font-size: 0.75rem;
```

---

## Utility Classes

```css
/* Visibility */
.hidden {
    display: none !important;
}

.show {
    opacity: 1 !important;
}

/* States */
.active {
    opacity: 1;
    border: 1px solid #e5e5e5;
}

.locked {
    cursor: default;
    opacity: 1;
}

.disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
}

.chosen {
    border-color: #000000;
    background: #fafafa;
}

.not-chosen {
    opacity: 0.5;
}
```

---

## Best Practices

### CSS Organization
1. **Reset/Base** → Global styles, box-sizing
2. **Typography** → Font declarations, text styles
3. **Layout** → Container, grid, flexbox patterns
4. **Components** → Cards, buttons, modals
5. **Utilities** → Helper classes
6. **Responsive** → Media queries at end

### Performance
- Use `will-change` sparingly for animated elements
- Apply `backface-visibility: hidden` for smoother transforms
- Use `transform: translateZ(0)` for hardware acceleration
- Prefer `opacity` and `transform` for animations

### Accessibility
- Maintain 4.5:1 contrast ratio minimum
- Use semantic HTML elements
- Ensure focus states are visible
- Support keyboard navigation

### Mobile Considerations
- Use `100dvh` instead of `100vh` for mobile browsers
- Test touch targets (minimum 44x44px)
- Use `-webkit-` prefixes for Safari
- Apply `backdrop-filter` with fallbacks

---

## Implementation Notes

### For Claude Code
When implementing pages with this style:

1. **Start with semantic HTML structure**
2. **Apply base styles from this guide**
3. **Build components using provided patterns**
4. **Add responsive breakpoints last**
5. **Test animations and transitions**

### Quick Start Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.cdnfonts.com/css/diatype" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Diatype', sans-serif;
            background-color: #E9EFF4;
            color: #000000;
            line-height: 1.6;
            font-weight: 300;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 6rem 2rem 4rem 2rem;
        }

        /* Add additional styles from guide */
    </style>
</head>
<body>
    <div class="container">
        <!-- Content here -->
    </div>
</body>
</html>
```

---

**End of Style Guide**
