---
trigger: always_on
---

---
name: Iridescent Clarity
colors:
  surface: '#fcf8f9'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf8f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e2'
  on-surface: '#1c1b1c'
  on-surface-variant: '#45474b'
  inverse-surface: '#313031'
  inverse-on-surface: '#f3f0f0'
  outline: '#76777b'
  outline-variant: '#c6c6cb'
  surface-tint: '#5b5e66'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#181c22'
  on-primary-container: '#80848c'
  inverse-primary: '#c3c6cf'
  secondary: '#5a5f68'
  on-secondary: '#ffffff'
  secondary-container: '#dee2ed'
  on-secondary-container: '#60656e'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#231a12'
  on-tertiary-container: '#918176'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe2eb'
  primary-fixed-dim: '#c3c6cf'
  on-primary-fixed: '#181c22'
  on-primary-fixed-variant: '#43474e'
  secondary-fixed: '#dee2ed'
  secondary-fixed-dim: '#c2c6d1'
  on-secondary-fixed: '#171c23'
  on-secondary-fixed-variant: '#424750'
  tertiary-fixed: '#f3dfd2'
  tertiary-fixed-dim: '#d6c3b7'
  on-tertiary-fixed: '#231a12'
  on-tertiary-fixed-variant: '#51443b'
  background: '#fcf8f9'
  on-background: '#1c1b1c'
  surface-variant: '#e5e2e2'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  stats-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 20px
  stack-gap-sm: 12px
  stack-gap-md: 24px
  stack-gap-lg: 48px
  section-margin: 80px
---

## Brand & Style

This design system is built on the intersection of technical precision and ethereal fluidity. It targets high-growth tech teams who need sophisticated tools that don't feel clinical or cold. The brand personality is **optimistic, intelligent, and transparent.**

The visual style is a refined **Glassmorphism-Modern hybrid**. It utilizes light-refracting gradients (iridescence) to suggest the "prism" of data processing—taking chaotic light and focusing it into clear spectrums. This is achieved through heavy use of white space, subtle backdrop blurs, and a "soft-tech" aesthetic that prioritizes approachability without sacrificing professional authority.

## Colors

The palette is defined by a high-contrast relationship between a deep obsidian primary (used for core text and primary actions) and a wash of iridescent pastels.

- **Primary & Neutrals:** Uses a true white base to allow iridescent gradients to "glow." Typography primarily uses the deep obsidian for maximum legibility.
- **Iridescent Accents:** Soft, semi-transparent versions of pink, blue, yellow, and green are used for data visualization, card backgrounds, and decorative highlights.
- **Functional Gradients:** Backgrounds should utilize large, soft radial blurs of the accent colors (opacity 5-15%) to create a sense of depth and movement behind the UI layer.

## Typography

The system employs a sophisticated pairing of a literary serif for high-level messaging and a modern geometric sans-serif for functional interface elements.

- **The Voice (Serif):** Use *Newsreader* for hero statements and major section headings. It provides the "human" and "authoritative" element of the brand.
- **The Engine (Sans):** Use *Plus Jakarta Sans* for everything else. Its open counters and friendly curves maintain the playful aesthetic while ensuring high readability on mobile screens.
- **Hierarchy:** Maintain clear vertical rhythm. Mobile headers should prioritize centered alignment for high-impact statements, switching to left-aligned for data-heavy sections.

## Layout & Spacing

Designed for a **mobile-first fluid experience**, the system uses a generous spacing scale to prevent the UI from feeling cluttered.

- **Safe Zones:** A standard 20px lateral margin is required for all mobile screens.
- **Vertical Rhythm:** Use the 4px base unit. Components should be separated by 24px (md) or 48px (lg) increments to maintain the "airy" brand feeling.
- **Stacking:** Elements should follow a vertical flow. Avoid horizontal scrolling for primary content; reserve it only for specific "Carousel Cards" (e.g., trust badges or small feature chips).

## Elevation & Depth

Depth is not created with traditional drop shadows, but through **translucency and refraction.**

- **Glassmorphism:** Secondary containers (cards, modals) use a semi-transparent white background (e.g., `rgba(255, 255, 255, 0.7)`) with a `backdrop-filter: blur(12px)`.
- **Soft Diffusion:** Use very large, low-opacity shadows (e.g., `0 20px 40px rgba(0,0,0,0.04)`) to lift cards off the iridescent backgrounds.
- **Inner Glow:** Apply a 1px solid white border at 40% opacity to "glass" elements to simulate light catching the edge of a lens.

## Shapes

The shape language is consistently **Rounded (Level 2)**. 

- **Containers:** Cards and primary UI blocks use a 16px (1rem) radius.
- **Interactive Elements:** Buttons and input fields use a slightly tighter 8px (0.5rem) radius to feel more precise.
- **Icon Enclosures:** Icons should be housed in "squircle" or soft-hexagonal shapes with subtle pastel strokes, mirroring the prismatic diamond motif.

## Components

- **Buttons:** 
  - *Primary:* Solid obsidian background, white text, 8px radius. High contrast.
  - *Secondary:* White background with a 1px light grey stroke or subtle glass effect.
- **Prismatic Cards:** Use a light pastel tint for the background (5% opacity) corresponding to the content's category. Include a subtle top-border in the full-saturation accent color.
- **Data Chips:** Small, pill-shaped labels with a 10% opacity background of the accent color and 100% opacity text of the same hue.
- **Input Fields:** Minimalist design with a soft 1px stroke that glows with a blue accent when focused.
- **Visual Dividers:** Instead of lines, use 48px-80px of whitespace or a very soft iridescent radial gradient to separate major content sections.
- **Process Indicators:** Use "Step Circles"—small, bordered circles containing a number, connected by a dashed light-grey line to indicate flow.