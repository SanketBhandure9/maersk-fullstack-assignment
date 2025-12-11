# Frontend Layout & Design System — Summary

This document explains the layout approach, design tokens, breakpoints, and accessibility considerations applied to the frontend in this project. It also includes quick verification steps and placeholders for before/after screenshots or a Loom recording.

---

**Files referenced**

- Global tokens & base styles: `frontend/src/style.css`
- App layout: `frontend/src/App.vue` (`.content-layout`)
- Vendor form: `frontend/src/components/VendorForm.vue`
- Vendor list: `frontend/src/components/VendorList.vue`

---

## Layout approach

Goals:

- Keep typography, paddings, and control sizes consistent across viewport sizes.
- Make the layout responsive only in structure (columns vs stacked), not in font sizing.
- Center primary content (form + list) horizontally and allow vertical scrolling on small screens.

Key decisions:

- Top-level layout uses a single flexible container `.content-layout` that stacks on small screens (column) and lays out as two columns on desktop (`@media (min-width: 1024px)`).
- The form column uses a fixed content width on large screens and full width on small screens. The list column expands to fill remaining space.
- Typography and paddings are intentionally constant: mobile-specific font-size reductions were removed so text and controls look identical across sizes.
- `html` and `body` are explicitly set to `width:100%; height:100%` and `background-color: var(--bg)` to guarantee the theme background fills the viewport across devices.
- Page-level scrolling is enabled on `body` (`overflow-y: auto`) so content can grow beyond the viewport on small devices.

Practical notes:

- Layout changes are implemented in `App.vue` via `.content-layout`.
- Component widths use `max-width` and `width:100%` so elements are readable and centered.

---

## Design tokens (CSS variables)

Defined in `frontend/src/style.css` under `:root` and `:root[data-theme="dark"]`.

Primary tokens (examples):

- `--bg` — page background
- `--surface` — card and panel background
- `--text` — main text color
- `--muted` — secondary text
- `--border` — divider / input border
- `--primary` — primary button / action
- `--primary-hover` — hover state for primary
- `--success`, `--danger` — semantic colors
- `--row-hover`, `--th-bg` — table row / header colors
- `--radius` — border radius
- `--gap` — standard spacing

Why tokens?

- Centralizes color, spacing, and radius values so themes and small visual tweaks are easy to apply globally.
- Enables CSS-first theming using `:root[data-theme="dark"]`.

Example usage:

```css
.vendor-form {
  background-color: var(--surface);
}
button {
  background-color: var(--primary);
}
```

---

## Breakpoints & responsive rules

Breakpoints used (practical summary):

- Mobile / Narrow screens: default (no media query) — `.content-layout` stacks vertically and is centered.
- Desktop: `@media (min-width: 1024px)` — `.content-layout` becomes a two-column layout.

Notes:

- We intentionally avoid changing `font-size` across breakpoints. The layout responds by changing flex-direction, gaps and column widths only.
- The form column uses a fixed width on desktop (e.g., `flex: 0 0 420px` in `App.vue`) while the vendor list column uses `flex: 1 1 auto` to take remaining space.

If you prefer different breakpoints (e.g., 768px for tablet), the rule in `App.vue` can be duplicated/adjusted accordingly.

---

## Accessibility considerations

I applied a set of accessibility-focused improvements:

- Semantic markup: forms use `<label>` and `<input>` controls with `required` attributes where appropriate.
- Keyboard focus: Buttons and interactive controls show clear focus outlines (`:focus-visible` / outline rules) and table rows use `:focus-within` to indicate focus on row children.
- Keyboard-accessible actions: Delete buttons have `aria-label` attributes (e.g., `Delete vendor X`) to describe their action for screen readers.
- Color & contrast: design tokens were chosen for reasonable contrast. Consider running a color contrast audit (e.g., Lighthouse or axe) to confirm WCAG 2.1 AA thresholds for your brand colors.
- Reduced motion: not explicitly implemented — can be added with `prefers-reduced-motion` media query to minimize transitions for users who opt out.
- Sticky table header: the table header is sticky to preserve column labels while scrolling large lists.
- Theming: CSS-first theme toggle uses `data-theme="dark"` to switch tokens; `color-scheme` is set in `:root` to hint the browser about preferred form control rendering.

Recommendations:

- Run automated accessibility scans (axe, Lighthouse) and manual keyboard + screen reader tests.
- Add `aria-live` for form success/error messages if you want screen readers to announce them.

---

## Developer verification steps

Run the frontend dev server and verify behavior across viewports:

```powershell
cd frontend
npm install   # if dependencies not installed
npm run dev
```

Open the app and verify:

- Content is horizontally centered on mobile and desktop.
- Form and list stack on mobile, and become two columns on desktop (`>=1024px`).
- Background color fills the entire viewport on mobile.
- Typography and control sizes do not shrink when switching to mobile viewport.
- Page scrolls vertically when content overflows.
- Submitting the form disables the submit button and clears the inputs while request is in-flight; errors restore inputs.
- Duplicate email attempts show an understandable error message.

---

## Before / After screenshots or Loom

I can't embed screenshots from this environment, but here are recommended placeholders and instructions:

- Placeholder images (add these files to the repo if you want local images):

  - `screenshots/before.png` — original layout (pre-change)
  - `screenshots/after.png` — layout after changes

- Loom / screen recording: record a short clip showing mobile vs desktop behavior and paste the Loom link here. Example placeholder:

  - `https://www.loom.com/share/REPLACE_WITH_YOUR_LINK`

How to capture a quick screenshot locally (Chrome):

1. Open app in Chrome.
2. Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M).
3. Choose an iPhone or a custom mobile width and capture a screenshot via the three-dot menu → "Capture screenshot".
4. Save as `screenshots/after.png` and commit the file.

If you want, I can:

- Add a short script/instruction to capture a headless screenshot with Playwright or Puppeteer, or
- Add a placeholder Markdown that automatically references `screenshots/after.png` once you add it.

---

## Notes, trade-offs & next steps

- Typography consistency: I enforced consistent font sizes across all breakpoints per your preference. If you later want a slightly larger display size on desktop for better hierarchy, we can set `h1`/`h2` using fixed px sizes rather than relative rem/em.
- IDs and data layer: IDs are now assigned by server logic to fill gaps; if you prefer DB `AUTOINCREMENT` behavior instead, we can revert to `MAX(id)+1` or rely on DB-generated ids.
- Further improvements:
  - Add `aria-live` to announce form success/error messages.
  - Add automated visual regression checks for layout changes (Percy / Playwright snapshots).

---

If you'd like, I can also:

- Add `screenshots/after.png` to the repo and update this README to embed it,
- Add automated Playwright script to produce before/after screenshots,
- Or record and upload a Loom video if you provide access.

File saved: `README_FRONTEND_LAYOUT.md`
