# UI Revamp Work Plan

## Current State — Key Problems

- Two CSS files (`demo.css` from a sql.js demo, `style.css` for minor overrides) with overlapping and contradictory rules
- No `<meta name="viewport">` — page is unusable on mobile
- `<br>` tags used throughout for spacing instead of CSS margin/padding
- Invalid HTML: `<div>` nested inside `<p>`
- No loading states during `.db` file fetch (which can be large)
- No RTL support for Hebrew/Yiddish content in the search input or results
- `.button` class in `demo.css` is never applied to the actual search button
- `padding: 5` (no unit) in `style.css` — silently ignored

---

## Recommendations

### 1. Foundation (must-fix before anything else)

- [ ] Add `<meta name="viewport" content="width=device-width, initial-scale=1">` — the page is completely unusable on mobile today
- [ ] Fix HTML semantics — use `<header>`, `<main>`, `<section>`, `<footer>` instead of flat `<p>`, `<hr>`, `<br>` soup; fix the `<div>` inside `<p>` (invalid HTML)
- [ ] Establish CSS custom properties — define a color palette, spacing scale, and font scale as `--var` tokens so everything is consistent and themeable
- [ ] Consolidate `demo.css` and `style.css` into a single well-organized stylesheet

---

### 2. Typography & Color Theme

- [ ] Choose intentional fonts — a dignified serif (e.g. *Playfair Display* or *Lora*) for the title, a clean sans-serif (*Inter* or system-ui stack) for body; Yizkor books are historically significant — the type should feel deliberate, not default
- [ ] Replace the flat gradient background with a warm parchment/sepia tone (`#faf7f2` body, `#1a1008` text) that evokes aged paper without being kitschy — or a dignified dark theme; avoid the current arbitrary `#aaa → #fff` gradient
- [ ] Establish color roles: primary, surface, muted text, link, error — so components look coordinated

---

### 3. Book Selection UI

- [ ] Replace the raw `<select>` with a styled card-list or a visually rich custom dropdown showing book name, language badge, and town finder link as a group — the user's first action deserves more than a browser-default select box
- [ ] Show the language badge and JewishGen link inline next to the selector in a pill/chip style, not as orphaned labels

---

### 4. Search Bar

- [ ] Unify the search input, search-type toggle, and button into a single search bar component — right now they are three separate, visually disconnected elements on one line
- [ ] Add a search icon inside the input (magnifier glyph via Unicode or SVG)
- [ ] Change the search type toggle from a `<select>` to two visually clear toggle-pill buttons ("Exact" / "Contains")
- [ ] Add RTL `dir` attribute handling on the search input — users are entering Hebrew/Yiddish text and the cursor and text alignment should support RTL

---

### 5. Loading & Feedback States

- [ ] Add a loading indicator (e.g. a pulsing bar or spinner) when a `.db` file is being fetched — the DB files can be large and the UI currently gives zero feedback during the wait
- [ ] Add a loading state to the Search button while the query runs (disable it + show "Searching…")
- [ ] Style the error/no-results state as a proper empty-state panel, not a red line of text

---

### 6. Results Table

- [ ] Replace the `<pre>` placeholder ("Results will be displayed here") with a styled empty-state illustration or prompt
- [ ] Style the results table with proper padding (fix the unitless `padding: 5`), clear column headers, alternating row shading, and a hover highlight
- [ ] Make page-number links visually prominent — style them as small buttons or badges rather than bare anchor text; these are the primary actionable item in every result row
- [ ] Show a result count pill ("47 matches") above the table instead of embedding it in `innerHTML` as plain text with `<br>` tags
- [ ] Add RTL support in result cells — matched Hebrew/Yiddish words in the Word column need `dir="rtl"` and a font that supports the script

---

### 7. Content Structure — Instructions & Known Issues

- [ ] Collapse the instructions and known issues into accordion/disclosure elements (`<details>`/`<summary>`) — they dominate the page above the fold and are only needed by new users; returning users should land straight on the search
- [ ] Add an inline "About Yizkor Books" expandable blurb rather than dumping the full Wikipedia quote as running prose

---

### 8. Header / Branding

- [ ] Create a proper hero header with a title, a one-line tagline ("Search digitized memorial books of Jewish communities"), and optionally a subtle historical image or pattern as background
- [ ] Integrate the GitHub link into the header as a styled icon-badge instead of the old fork-ribbon overlay

---

### 9. Footer

- [ ] Move feedback, visitor counter, and flag counter to a dedicated `<footer>` with light background and small text — these do not belong inline in the main content flow

---

### 10. Responsive Design

- [ ] Make the layout fluid using CSS Grid/Flexbox — the current `width: 80%` on `html` with no breakpoints collapses badly on narrow screens
- [ ] Make the results table horizontally scrollable on small viewports rather than overflowing

---

### 11. Polish / Micro-interactions

- [ ] Add smooth `transition` on row hover, button states, and the error/results fade-in
- [ ] Animate result rows appearing (staggered fade-in) to give a sense of the content "arriving"
- [ ] Add a "back to top" button when the results table is long
