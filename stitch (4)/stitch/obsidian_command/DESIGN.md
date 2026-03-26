# Design System: The Obsidian Command Paradigm

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Kinetic Archive."** We are moving away from the "SaaS dashboard" cliché and toward a high-end, editorial command center that feels like a high-precision instrument. 

This design system rejects the "flat" web. It utilizes intentional asymmetry—large, architectural display type juxtaposed with ultra-refined mono-spaced data points—to create a sense of focused power. We avoid the "template" look by layering deep, ink-like surfaces with "light-leak" accents, ensuring every screen feels like a bespoke, dark-luxury interface designed for high-performance decision-making.

---

### 2. Colors: Tonal Depth & Luminous Accents
Our palette is rooted in the depth of `background` (#131318), a near-black blue that provides a sophisticated base for our electric highlights.

*   **Primary (`primary`: #c4c0ff):** An ethereal violet used for high-importance actions and brand moments.
*   **Secondary (`secondary`: #41eec2):** A sharp teal-mint for "System Ready" or "Completed" states.
*   **Surface Hierarchy (The "No-Line" Rule):** 
    Hard 1px borders are strictly prohibited for layout sectioning. Separation is achieved through background shifts. 
    - Use `surface_container_lowest` (#0e0e13) for the main application canvas.
    - Use `surface_container_low` (#1b1b20) for primary content cards.
    - Use `surface_container_high` (#2a292f) for interactive hovered states or fly-out menus.
*   **The Glass & Gradient Rule:** For elements that float above the main UI (like voice-input overlays), use a 40% opacity blur with `surface_variant`. Main CTAs should utilize a subtle linear gradient from `primary` (#c4c0ff) to `primary_container` (#8781ff) at a 135-degree angle to provide a "machined" metallic sheen.

---

### 3. Typography: Architectural Precision
We pair the brutalist, wide geometry of `Syne` (interpreted here via `spaceGrotesk` tokens) with the humanistic clarity of `manrope`.

*   **Display & Headlines (`spaceGrotesk`):** These are our "Command" styles. Use `display-lg` (3.5rem) with tight letter-spacing (-0.04em) for primary task counts or voice-transcription headers. The goal is an architectural, heavy-set presence.
*   **Body & Titles (`manrope`):** Our "Instructional" styles. These provide the high-end editorial feel. Use `body-md` for general task descriptions, ensuring a generous line-height (1.6) to allow the "ink" to breathe.
*   **The Mono-Utility:** For metadata (time-stamps, task IDs, or voice-confidence scores), use `JetBrains Mono`. This injects a "Command Center" aesthetic, suggesting precision and technical accuracy.

---

### 4. Elevation & Depth: The Layering Principle
We do not use shadows to lift elements; we use **Tonal Layering**.

*   **Nesting:** Depth is created by "sinking" and "lifting" containers. A `surface_container_low` card sitting on a `surface` background creates a soft, natural containment.
*   **Ambient Glows:** When a floating element (like an active Voice Modal) requires a shadow, it must be an **Ambient Glow**. Use the `accent-glow` (#6C63FF40) with a 24px blur and 0px offset. This mimics a light-emitting screen rather than a physical shadow.
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline_variant` (#464555) at 20% opacity. It should feel like a suggestion of an edge, not a hard boundary.
*   **Glassmorphism:** To maintain the "Futuristic" pillar, use `backdrop-filter: blur(12px)` on all modal overlays and top-level navigation bars to allow the deep background tones to bleed through.

---

### 5. Components: The Command Toolset

*   **Buttons:**
    - **Primary:** Gradient-filled (`primary` to `primary_container`), 12px radius, with a subtle `accent-glow`.
    - **Secondary:** Ghost-style. No background, 10% `primary` border, `on_surface` text.
*   **Task Chips:** Use a `full` (9999px) radius. Completed tasks use `on_secondary_container` backgrounds with `secondary` text. Pending tasks use `primary_container` with `primary` text.
*   **Input Fields:** Strictly no "box" inputs. Use a bottom-border only (the "Ghost Border") or a `surface_container_highest` background with no border. Labels should use `label-sm` in `text-secondary`.
*   **The Voice Visualizer (Custom Component):** A horizontal frequency wave using the `secondary` (#41eec2) color, utilizing a 400ms ease-in-out transition for fluid motion.
*   **Lists:** Forbid divider lines. Use `0.7rem` (2) spacing between items and a background shift (`surface_container_low`) on hover to define the active row.

---

### 6. Do’s and Don’ts

#### **Do:**
*   **Embrace Negative Space:** Use the `24` (8.5rem) spacing token for major section margins to create an elite, editorial feel.
*   **Use Intentional Asymmetry:** Align headings to the far left while placing action buttons on a custom off-grid coordinate to break the "SaaS template" feel.
*   **Prioritize Typography Scale:** If a screen feels cluttered, increase the size of the headline and decrease the opacity of the metadata.

#### **Don't:**
*   **Don't use pure #000000 or #FFFFFF:** It destroys the premium "Dark-Luxury" depth. Use our specific surface and on-surface tokens.
*   **Don't use standard shadows:** Avoid "Drop Shadow: 0 4 4 Black". It looks cheap. Use Tonal Layering or Ambient Glows.
*   **Don't use 1px Dividers:** They create visual noise. Use whitespace or background-color shifts (`surface_container_lowest` vs `surface_container_low`) to separate ideas.
*   **Don't use standard icons:** Use ultra-thin (1pt) stroke icons to match the high-precision architectural feel of the typography.