# Shopify Web Development Technical Assignment

Implementation of **Test 1** (Landing Page Sections) and **Test 2** (Reusable Product Card & Grid) built on the Shopify Dawn theme[cite: 20].

## Overview

This repository contains custom, theme-editor-safe Shopify sections and snippets built with Liquid, vanilla CSS, and vanilla JavaScript[cite: 20]. No page builders, CSS frameworks (like Tailwind or Bootstrap), or jQuery were used[cite: 20].

---

## Deliverables & Structure

* **`sections/assignment-hero.liquid`** — Test 1.1 Hero (Full-bleed background, customizable headline, CTA button linking to a merchant collection, and collapsible vertical "Reviews" tab)[cite: 20].
* **`sections/assignment-drop-teaser.liquid`** — Test 1.2 Drop Teaser (Two-panel layout featuring a patterned background, script heading, real-time digit countdown timer, sneak peek card, and native Shopify customer newsletter form)[cite: 20].
* **`sections/assignment-display-text.liquid`** — Test 1.3 Display Text (CSS background-clipped text showing imagery through indexable DOM text with a safe browser fallback)[cite: 20].
* **`sections/assignment-product-grid.liquid`** — Test 2 Collection Grid section[cite: 20].
* **`snippets/assignment-product-card.liquid`** — Test 2 Reusable Product Card (`214 × 415px`)[cite: 20].
* **`assets/assignment-card.js`** — Client-side logic handling swatch color-switching, variant image/URL updates, and race-condition-safe AJAX quick-adds via `/cart/add.js`[cite: 20].

---

## Key Technical Decisions & Notes

### 1. Countdown Design & Zero-State Handling (`Test 1.2`)
* **Label Discrepancy Resolution:** The design specs were reviewed for alignment; standard time units (`Days`, `Hours`, `Minutes`, `Seconds`) with individual digit tiles were implemented[cite: 20].
* **Zero-State Behavior:** When the target timestamp is reached, the timer tiles gracefully hide and reveal a merchant-configurable "Drop is live" message[cite: 20].

### 2. Typography & Font Decisions (`General`)
* **Figma Fonts:** Configured to match the styling specifications using **Instrument Serif** and **Pinyon Script** via custom `@font-face` declarations in `theme.liquid`[cite: 20].

### 3. Responsive Breakpoints
While Figma specified desktop layouts at `1440px`, the components have been built with a mobile-first responsive strategy[cite: 20]:
* **Desktop:** `>= 1200px` (Exact Figma dimensions, two-panel drop teaser grid, full-bleed hero)[cite: 20].
* **Tablet:** `768px` to `1199px` (Adjusted padding and scaled typography)[cite: 20].
* **Mobile:** `< 768px` (Stacked single-column layout for the drop teaser panels and responsive card grids)[cite: 20].

### 4. Edge-Case Resilience (`Test 2`)
The product card successfully survives and adapts to:
* Products with single variants vs. products with 12+ color variants (rendered with an overflow `+` indicator)[cite: 20].
* Fully sold-out items and partially sold-out variants (disabling quick-add interactions accordingly)[cite: 20].
* Missing images (falling back cleanly to placeholders without layout collapse)[cite: 20].
* Extremely long product titles (handled via CSS line clamping)[cite: 20].
* Unhidden Figma states: Clearance badges, Final Sale badges, vendor lines, and compare-at ("was") prices[cite: 20].

---

## Testing & Quality Assurance

* **Theme Check:** Passes all `shopify theme check` rules with zero errors or warnings[cite: 20].
* **Console:** Clean browser console with no JavaScript errors during theme editor reordering or AJAX cart operations[cite: 20].
* **Accessibility:** Built with proper heading hierarchies, visible focus-visible states, keyboard accessibility, and `prefers-reduced-motion` queries for animations[cite: 20].
