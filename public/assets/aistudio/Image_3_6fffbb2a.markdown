---
name: YojanaSaathi Civic Platform
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#43474d'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#001428'
  on-primary: '#ffffff'
  primary-container: '#0f2942'
  on-primary-container: '#7991af'
  inverse-primary: '#b0c9e8'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#00170e'
  on-tertiary: '#ffffff'
  tertiary-container: '#002e1f'
  on-tertiary-container: '#409f7b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#97f5cc'
  tertiary-fixed-dim: '#7bd8b1'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-trust, institutional, yet approachable civic-technology environment built specifically for Indian public welfare navigation. The emotional tone is authoritative, reassuring, transparent, and completely barrier-free. 

The aesthetic is a calibrated hybrid of **Modern Civic Functionalism** and **High-Contrast Utilitarianism**:
- Clear, unpretentious UI layers prioritizing rapid scanability across varied literacy and digital-competency levels.
- Institutional stability without the bureaucratic density of legacy state portals.
- Strict WCAG AAA compliance across primary workflows, ensuring legibility on entry-level mobile devices, high-glare environments, and regional language translations.
- Restrained, purpose-driven micro-interactions that communicate state changes without distracting decorative clutter.

## Colors

The color palette modernizes classic civic motifs into a functional digital utility:

- **Primary (`#0F2942`)**: Deep Slate Navy. Used for institutional authority, navigation headers, primary structural anchors, and key action buttons.
- **Secondary (`#B45309`)**: Deep Warm Saffron. Applied selectively to high-intent highlights, active interactive states, and informational callouts without creating visual alarm.
- **Tertiary (`#047857`)**: Deep Emerald. Dedicated to positive eligibility confirmation, successful submissions, and verification checkmarks.
- **Neutral Tone (`#334155`)**: Slate Core. Dictates typography and micro-borders, guaranteeing crisp optical definition against light backgrounds.

### Functional Status Tokens
- **Eligible / Verified**: `#047857` (Background tint: `#ECFDF5`, Border: `#A7F3D0`).
- **Not Eligible / Critical**: `#BE123C` (Background tint: `#FFF1F2`, Border: `#FECDD3`).
- **Action Required / More Info**: `#B45309` (Background tint: `#FFFBEB`, Border: `#FDE68A`).
- **Informational / Neutral State**: `#1E3A8A` (Background tint: `#EFF6FF`, Border: `#BFDBFE`).

### Background Canvas
- **Primary Canvas**: `#F8FAFC` (Off-white/slate-tinted neutral).
- **Surface Elevation 0 (Card/Modal)**: `#FFFFFF`.
- **Surface Inset/Muted Canvas**: `#F1F5F9`.

## Typography

The typography leverages **Public Sans** across all roles. Designed explicitly for civic and governmental interfaces, its tall x-height, neutral aperture, and distinct glyph differentiation prevent ambiguity between similar numbers and letters across varying screen densities.

### Implementation Guidelines
- **Text Contrast Enforcement**: Core copy uses `#0F172A` (900 slate) on light containers to surpass 7:1 contrast. Secondary labels never drop below `#475569` (600 slate).
- **Multilingual Accommodation**: Vertical line heights are calibrated 4–6px taller than standard web defaults to gracefully support non-Latin scripts (Devanagari, Tamil, Bengali) without letterform clipping or vertical collisions.
- **Numbers & Metrics**: Beneficiary quotas, rupee sums, and application IDs must use tabular lining figures (`font-variant-numeric: tabular-nums`) for scanability in tabular datasets.

## Layout & Spacing

The layout is structured around an adaptive 12-column responsive fluid grid with fixed outer boundaries on high-resolution displays:

- **Mobile (< 640px)**: 4-column layout, `1rem` (16px) margins and gutters. Single-column stacked forms and vertically arranged card layouts to support single-hand operation.
- **Tablet (640px – 1024px)**: 8-column layout, `2rem` (32px) margins, `1.5rem` (24px) gutters. Scheme listings and criteria split into 2-column modules.
- **Desktop (> 1024px)**: 12-column layout, capped at a maximum width of `1280px` centered canvas, `3rem` (48px) margins, `2rem` (32px) gutters. Sticky navigation sidebars and persistent eligibility summary panels.

### Structural Rhythm
- Spacing follows an 8pt base grid (`0.5rem`, `1rem`, `1.5rem`, `2.5rem`).
- Group related fields with `space-sm` to `space-md`. Distinct form sections and card partitions must use `space-lg` to prevent visual blending of disparate citizen data categories.

## Elevation & Depth

To maximize clarity under direct sunlight and on budget mobile panels, this design system avoids blurry drop-shadows, neomorphic bevels, or glassmorphic blur filters. 

Depth is achieved via **Structural Outlines & Tonal Surface Layering**:
- **Baseline Cards & Surfaces**: Pure `#FFFFFF` surface framed by a crisp, high-contrast 1px border (`#CBD5E1`).
- **Interactive Elevate (Hover/Focus)**: Surface shifts border to `#0F2942` with an ambient, micro-tinted anchor shadow (`0 2px 4px rgba(15, 41, 66, 0.08)`).
- **Critical Dialogs & Drawers**: Pure `#FFFFFF` surface overlaying a high-contrast `#0F172A` backdrop scrim at 60% opacity with a structured 1px outline (`#94A3B8`) and an elevated structural drop (`0 8px 24px rgba(15, 23, 42, 0.16)`).
- **Inset / Muted Tiers**: Embedded sub-sections (e.g., eligibility criteria check blocks) use `#F1F5F9` surfaces without borders to indicate nested groupings cleanly.

## Shapes

The design system uses **Soft** geometric architecture (`roundedness: 1`):
- Base interactive controls, text fields, badges, and list rows use `0.25rem` (4px) corner radiuses.
- Primary scheme cards, filter drawers, and modal containers use `0.5rem` (8px, `rounded-lg`).
- Tab pills and notification status chips use a disciplined `0.25rem` corner radius rather than full capsule rounds, preserving an organized, official architectural aesthetic.

## Components

### Buttons
- **Primary Civic Action**: `#0F2942` background, `#FFFFFF` text, `44px` minimum touch target, `0.25rem` radius. Hover state: `#1E3A8A`. Active state: `#0A1C2E`. Focus: 3px solid `#B45309` offset outline.
- **Secondary (Assistive/Explore)**: Transparent background, 1.5px border `#0F2942`, text `#0F2942`. Hover: `#F1F5F9` background fill.
- **High-Priority/Accent (Check Eligibility)**: `#B45309` background, `#FFFFFF` text. Focus: 3px solid `#0F2942` outline.

### Status Badges & Chips
- **Eligibility Verdict Badges**: Height `28px`, padding `0 10px`, typography `label-md`. 
  - *Eligible*: `#ECFDF5` background, `#047857` border (1px), `#065F46` bold text with leading checkmark icon.
  - *Ineligible*: `#FFF1F2` background, `#BE123C` border (1px), `#9F1239` bold text.
  - *Documents Needed*: `#FFFBEB` background, `#B45309` border (1px), `#92400E` bold text.
- **Filter Chips**: Neutral bordered tags (`#E2E8F0`), active state switches to solid `#0F2942` with white label.

### Form Inputs & Selectors
- **Text Inputs**: Minimum height `44px`, background `#FFFFFF`, border `1.5px` solid `#94A3B8`. Inner padding `8px 12px`.
- **Focus Rings**: Mandatory 2px solid `#0F2942` with 2px offset for assistive keyboard navigation.
- **Labels & Hints**: Labels placed permanently above input in `label-lg` (`#0F172A`). Helper text sits below input in `body-sm` (`#475569`). Error text renders in `#BE123C` alongside an alert triangle icon.

### Checkboxes & Radio Buttons
- Box size: `20px x 20px` to guarantee physical tap precision.
- Inactive: 2px solid `#64748B`.
- Selected: `#0F2942` fill with high-contrast white tick/dot.

### Scheme Cards
- Structure: White `#FFFFFF` card, 1px solid `#CBD5E1` outline, `space-lg` internal padding.
- Anatomy: Top row housing ministry/department attribution and status chip; mid-tier containing bold scheme title (`title-md`) and brief 2-line summary (`body-sm`); bottom action row featuring key deadline metadata and direct action link button.
- Interaction: Subdued vertical translation (-2px) and dark slate border transition on pointer hover.

### Scheme Requirement Matrix (Custom Civic Component)
- Distinct stepped list element displaying user qualification parameters against scheme criteria (e.g., Annual Income, Caste/Category, Landholding, Age).
- Uses two-column key-value ledger styling alternating with subtle `#F8FAFC` row striping and clear pass/fail status glyphs on the right margin.