# Work Plan: Port App to Dark Archive Layout

**Source layout:** `docs/layout-demos/layout-2-dark-archive.html`  
**Target file:** `yizkor-books-search.html` + `src/style.css` (+ `src/demo.css` retired)  
**JavaScript file:** `src/yizkor-books-search.js`

---

## Overview of Changes

The Dark Archive design requires changes across three layers:

1. **HTML** — restructure markup with semantic elements, new component structure
2. **CSS** — retire `demo.css` and `style.css`; replace with a single `src/style.css` derived from the Dark Archive design tokens
3. **JavaScript** — update DOM queries to match new element IDs/classes, add loading states, update result rendering

> **Testing note:** Unit tests cover extracted pure functions in `src/utils.js`. DOM wiring, XHR, and the sql.js Worker are covered by manual tests only — they have hard browser/network dependencies that are not cost-effective to mock at this project scale.

---

## Phase 1 — CSS Foundation

**File:** `src/style.css` (full replacement)  
**Action:** Delete contents of `src/demo.css` and `src/style.css`; merge into a single `src/style.css`.

- [x] Define CSS custom properties (`:root`) for all design tokens:
  - Colors: `--bg`, `--s1`, `--s2`, `--s3`, `--border`, `--b-gold`, `--gold`, `--gold-l`, `--text`, `--muted`, `--link`
  - Typography: `--font-d` (Cinzel), `--font-b` (Inter)
  - Layout: `--r` (border-radius 6px)
- [x] Add reset (`* { margin:0; padding:0; box-sizing:border-box }`)
- [x] Style `html` background (`#050609`) and `body` (max-width 980px, centered, box-shadow)
- [x] Remove `src/demo.css` reference from HTML (or blank its contents — do not delete the file if referenced elsewhere)

### Deliverables
- `src/style.css` — complete Dark Archive token definitions and base styles
- `src/demo.css` — emptied; `<link>` tag removed from HTML

### Manual Tests
- Open `yizkor-books-search.html` in browser: page background is near-black (`#0a0d13`), outer gutter is `#050609`
- No layout explosion — body is centered and max-width constrained
- Browser DevTools → Elements: confirm CSS custom properties present on `:root`
- No console errors from missing stylesheets

### Unit Tests
- No unit tests for Phase 1 (pure CSS, no logic to assert)

---

## Phase 2 — HTML: `<head>` Cleanup

**File:** `yizkor-books-search.html`

- [x] Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [x] Add Google Fonts link: `Cinzel` (400, 600, 700) + `Inter` (300, 400, 500, 600)
- [x] Remove the `codemirror.css` and `codemirror.js` CDN references (no longer used in new layout)
- [x] Remove the `gh-fork-ribbon` CSS CDN reference (GitHub link is now in the top-bar)
- [x] Update `<title>` to `Searchable Yizkor Books`
- [x] Keep only: viewport meta, Google Fonts, `src/style.css`, favicon

### Deliverables
- Lean `<head>` with only necessary resources; dead CDN refs removed

### Manual Tests
- DevTools → Network: confirm zero requests to `cdnjs.cloudflare.com/codemirror` or `gh-fork-ribbon`
- DevTools → Elements: `<meta name="viewport">` present
- Browser tab title reads "Searchable Yizkor Books"
- Cinzel and Inter fonts load (check Network → Fonts)

### Unit Tests
- No unit tests for Phase 2 (markup only)

---

## ✅ Phase 3 — HTML: Top Navigation Bar

**File:** `yizkor-books-search.html`  
**New element:** `<div class="top-bar">` — first element inside `<body>`

- [x] Left side: `<nav class="top-nav">` with links:
  - Home (anchor to `#`)
  - Getting Started → `https://github.com/Veverke/veverke.github.io/wiki/Getting-Started`
  - Known Issues → `https://github.com/Veverke/veverke.github.io/issues`
  - Feedback → `https://forms.gle/xutj9MaZ6xoHh9L67`
- [x] Right side: `<a class="gh-btn">` linking to `https://github.com/Veverke/veverke.github.io`
- [x] Remove old `<a class="github-fork-ribbon ...">` element

### Deliverables
- `.top-bar` rendered at the top of every page load with correct link targets

### Manual Tests
- Top bar is visible with dark surface background
- Each nav link opens the correct URL
- GitHub button hover state applies gold border
- Old fork-ribbon no longer appears at top-left

### Unit Tests
- No unit tests for Phase 3 (markup and links only)

---

## ✅ Phase 4 — HTML: Header

**File:** `yizkor-books-search.html`  
**New element:** `<header>` replacing the current `<h1>` + surrounding markup

- [x] Eyebrow line: `<div class="eyebrow">` with two decorative `<span>` lines and text "Digital Jewish Memorial Archive"
- [x] `<h1>` using Cinzel font: `Searchable <em>Yizkor</em> Books` (em → gold-l color)
- [x] Tagline paragraph: `<p class="tagline">`
- [x] Stats row: `<div class="stats-row">` with four `.stat` items:
  - Total books count (dynamically set by JS, currently hardcoded `11`)
  - Pages count (currently shown as `lblPages` — now lives here as `id="lblPages"`)
  - Languages: `He / Yi`
  - Image source: `NYPL`
- [x] Move the `<b><label id="lblYBsCount"></label></b>` content into the stats row
- [x] Remove the old `feedbackDiv` (feedback images + links) from the header area — moved to footer
- [x] Remove the `<p>` block containing the Yizkor Books description + instructions prose — replaced by collapsible sections (Phase 7)

### Deliverables
- Styled `<header>` with gradient background, gold bottom border, eyebrow, h1, tagline, and stats row
- `id="lblYBsCount"` still present and populated by JS with book count
- `id="lblPages"` still present within stats row; updated by JS after DB load

### Manual Tests
- Header renders with near-black gradient, gold bottom border
- "Searchable Yizkor Books" heading uses Cinzel; "Yizkor" renders in gold-light color
- Stats row shows "11 Books" on load
- Pages stat updates to a real number after the initial DB fetch completes
- Old smileys/feedback images and Wikipedia prose block are gone

### Unit Tests
- **`formatPageCount(n)`** (to be added to `src/utils.js` in Phase 10):
  - `formatPageCount(243)` → `"243 pages"`
  - `formatPageCount(0)` → `"0 pages"`
  - `formatPageCount(1)` → `"1 pages"` (or `"1 page"` if pluralisation is added)

---

## ✅ Phase 5 — HTML: Book Selection Panel

**File:** `yizkor-books-search.html`  
**New element:** Section with `.sec-hdr` + `.book-panel`

- [x] Add section header: `<div class="sec-hdr"><h2>Select a book</h2></div>` (styled with extending line)
- [x] Wrap in `<div class="book-panel">`
- [x] Inner `<div class="book-row">`:
  - Wrap existing `<select id="ddlDbSelect">` in `<div class="select-wrap">` and add `class="styled-select"` to the select
  - `<span class="lang-pill" id="lblLanguageValue">` — replaces the old bare `<label id="lblLanguageValue">`
  - `<a class="tf-link" id="lnkTownFinderLink">` — keep existing id, update class
  - `<span class="pg-count" id="lblPages">` — page count badge (remove old `<label id="lblPages">`)
- [x] Remove old orphaned `<label id="lblLanguageHeader">Language: </label>` label
- [x] Remove `<hr>` separators — sections are now separated by `.sec-hdr` dividers

### Deliverables
- Book panel with styled dropdown, language pill, TownFinder link, and page-count badge, all wired to existing JS IDs

### Manual Tests
- Book dropdown renders with dark surface and custom chevron arrow
- Changing dropdown selection updates the language pill text (e.g. "Hebrew" vs "Yiddish/Hebrew")
- Changing dropdown updates the JewishGen TownFinder `href`
- Page count badge updates after the DB fetch for the newly selected book
- No raw `<label>` elements or `<hr>` separators remain visible

### Unit Tests
- **`extractBookName(selectValue)`** (to be added to `src/utils.js`):
  - `extractBookName("Briceva-5575305")` → `"Briceva"`
  - `extractBookName("Lipcani1-5911177")` → `"Lipcani1"`
  - `extractBookName("Yedinetz-56633165")` → `"Yedinetz"`
- **`extractStartingImgId(selectValue)`**:
  - `extractStartingImgId("Briceva-5575305")` → `5575305`
  - `extractStartingImgId("Lipcani1-5911177")` → `5911177`

---

## ✅ Phase 6 — HTML: Search Bar

**File:** `yizkor-books-search.html`  
**New element:** Section with `.sec-hdr` + unified search bar

- [x] Add section header: `<div class="sec-hdr"><h2>Search the archive</h2></div>`
- [x] Build `<div class="search-bar">` containing three parts in a single row:
  1. `<div class="toggle-group">` — two `<button class="t-btn">` elements: "Exact" (default active) and "Contains"  
     Replace the old `<select id="ddlSearchType">` entirely
  2. `<input class="search-input" id="txtSearch" dir="auto">` — add `dir="auto"` for RTL support
  3. `<button class="search-btn" id="btnSearch">Search</button>`
- [x] Remove old `<label id="lblSearch">`, `<label id="lblSearchType">`, `<select id="ddlSearchType">` markup
- [x] Remove remaining `<hr>` elements

### Deliverables
- Single unified search bar component: toggle group + input + button rendered as one horizontal unit
- Search input supports `dir="auto"` (RTL flip on Hebrew/Yiddish entry)

### Manual Tests
- "Exact" button is visually active (gold background) by default
- Clicking "Contains" switches active state to that button; "Exact" deactivates
- Typing Hebrew characters in the input causes text to align right
- Search button is disabled on page load when input is empty
- Typing any character enables the Search button
- Clearing the input disables the button again
- Old dropdown (`<select id="ddlSearchType">`) and its labels are gone

### Unit Tests
- **`buildLikeClause(term, searchType)`** (to be added to `src/utils.js`):
  - `buildLikeClause("ברנשטיין", "exact")` → `"ברנשטיין"`
  - `buildLikeClause("ברנשטיין", "contains")` → `"%ברנשטיין%"`
  - `buildLikeClause("", "exact")` → `""`
  - `buildLikeClause("term", "contains")` → `"%term%"`

---

## ✅ Phase 7 — HTML: Collapsible Info Sections

**File:** `yizkor-books-search.html`

### 7a — "About Yizkor Books" accordion (above book selection)
- [x] Replace the long `<p>` prose block with:
  ```html
  <details class="about">
    <summary>What are Yizkor Books?</summary>
    <div class="about-body">...</div>
  </details>
  ```
- [x] Keep the Wikipedia quote and site description as the body content (condensed)

### 7b — "Instructions & Known Issues" accordion (below results)
- [x] Wrap existing `<ol>` instructions and known issues in:
  ```html
  <details class="info">
    <summary>Instructions & Known Issues</summary>
    <div class="info-body">
      <div class="info-cols">...</div>
    </div>
  </details>
  ```
- [x] Use two-column `<div class="info-cols">` grid: left = Instructions, right = Known Issues

### Deliverables
- Two `<details>` accordions replacing the flat prose blocks; page loads with both collapsed

### Manual Tests
- Page loads with both accordions collapsed — long prose is hidden above the fold
- Clicking "What are Yizkor Books?" summary expands the body; chevron rotates
- Clicking again collapses it
- Same behavior for "Instructions & Known Issues"
- Instructions two-column grid renders side-by-side on desktop

### Unit Tests
- No unit tests for Phase 7 (native HTML `<details>` behavior; no JS logic involved)

---

## ✅ Phase 8 — HTML: Results Area

**File:** `yizkor-books-search.html`  
**Replaces:** `<main>` block with `<pre id="output">` and `<div id="error">`

- [x] Add section header: `<div class="sec-hdr"><h2>Results</h2></div>`
- [x] Add result count + query description row:
  ```html
  <div class="results-meta" id="resultsMeta" style="display:none">
    <span class="count-chip" id="resultsCount"></span>
    <p id="resultsDesc" class="results-info-p"></p>
  </div>
  ```
- [x] Replace `<pre id="output">` with `<div id="output" class="table-wrap"></div>`
- [x] Keep `<div id="error" class="error"></div>` — update CSS to match dark theme error style

### Deliverables
- Results section with count chip and query descriptor (hidden until a search runs)
- `<div id="output">` replaces `<pre>` — ready for dynamic table injection
- Error container styled for dark theme

### Manual Tests
- On page load: results section shows only the section header; no placeholder "Results will be displayed here" text
- `#resultsMeta` is not visible before a search
- `#error` container is not visible before a search
- After a search with results: count chip appears (e.g. "47 matches"), descriptor shows term and book name
- After a search with no results: error message appears in red; results meta is hidden

### Unit Tests
- **`formatResultsDescription(count, term, bookName)`** (to be added to `src/utils.js`):
  - `formatResultsDescription(47, "ברנשטיין", "Briceva")` → object or HTML string containing `"47"`, `"ברנשטיין"`, `"Briceva"`
  - `formatResultsDescription(1, "test", "Ataci")` → contains `"1"`

---

## ✅ Phase 9 — HTML: Footer

**File:** `yizkor-books-search.html`

- [x] Add `<footer>` as last element before `</body>`:
  - Left: copyright/project text
  - Right: `<div class="footer-links">` with:
    - Feedback Form → existing Google Forms link
    - Report an Issue → GitHub issues link
    - Getting Started Wiki → wiki link
- [x] Move visitor counter and flag counter into the footer (or remove — assess whether they are still desired)
- [x] Remove inline `<a href="...">Feedback Form</a><br><br>` from body

### Deliverables
- Semantic `<footer>` with correct links; visitor/flag counters relocated or removed; no stray inline links remain in body

### Manual Tests
- Footer is visible at the bottom of the page with dark surface background
- All three footer links open correct targets in a new tab
- No duplicate "Feedback Form" link in main body content
- Visitor counter and flag counter render inside footer (or are confirmed removed)

### Unit Tests
- No unit tests for Phase 9 (markup only)

---

## ✅ Phase 10 — JavaScript Updates

**File:** `src/yizkor-books-search.js`  
**New file:** `src/utils.js` — pure functions extracted for testability

> All functions in `src/utils.js` are pure (no DOM, no XHR, no Worker). They are exported as ES modules and imported into `yizkor-books-search.js`. The test suite (`src/utils.test.js`) covers only this file.

### 10a — Search type toggle (replaces `<select id="ddlSearchType">`)
- [x] Remove reference to `document.getElementById('ddlSearchType')`
- [x] Add toggle logic for `.t-btn` buttons:
  ```js
  document.querySelectorAll('.t-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  ```
- [x] Replace `searchType.value == 'contains'` check with:  
  `document.querySelector('.t-btn.active').textContent.trim().toLowerCase() === 'contains'`

### 10b — Loading state: DB fetch
- [x] On `select` change (and initial load), add/remove a `.loading` class or spinner element to indicate the DB is being fetched
- [x] Disable the search button (`btnSearch.disabled = true`) while the DB is loading; re-enable in `loadPageCount()`

### 10c — Loading state: Search button
- [x] On search click: set `btnSearch.textContent = 'Searching…'` and `btnSearch.disabled = true`
- [x] Restore button text and state after results are rendered or on error

### 10d — Result count and description display
- [x] Replace the `outputElm.innerHTML = results[0].values.length + " entries found..."` string-concat with:
  ```js
  document.getElementById('resultsCount').textContent = `${results[0].values.length} matches`;
  document.getElementById('resultsDesc').innerHTML = `for <strong>"${txtSearch.value}"</strong> in <strong>${bookName}</strong>`;
  document.getElementById('resultsMeta').style.display = 'flex';
  ```

### 10e — Table rendering update
- [x] Update `tableCreate` so generated `<table>` has `class="results-table"` (for CSS targeting)
- [x] Ensure page-link cells use `<a class="pg-btn">` instead of bare `<a>` (update the `tds[i].innerHTML` template string)

### 10f — Error display
- [x] Update `error()` function to also show the `#resultsMeta` as hidden when showing an error
- [x] Ensure the error container uses the dark-theme `.error` style (red text, `transition: 0.5s`, height animation)

### 10g — `lblPages` element reference
- [x] Update `loadPageCount()` to target `<span id="lblPages">` (may be same id, just verify it still exists in new HTML)
- [x] Update text format from `"Pages: N"` to just `"N pages"` to match the badge style

### Deliverables
- `src/utils.js` with all extracted pure functions, exported as ES modules
- `src/utils.test.js` with full unit test coverage of `utils.js`
- `src/yizkor-books-search.js` updated with new DOM wiring, loading states, and imports from `utils.js`

### Manual Tests
Full end-to-end workflow:
- Select a book from the dropdown → DB loading indicator appears, search button is disabled
- After loading completes → page count badge updates, search button enabled
- Type a Hebrew term → input aligns right; Search button activates
- Click "Contains" toggle → button becomes active; search uses `%term%` operator
- Click Search → button shows "Searching…" and is disabled
- Results appear: count chip shows correct count, term and book name shown in descriptor
- Click a page number → correct NYPL image URL opens in new tab
- Search with a term that yields no results → error message appears, results area clears
- Clear input → Search button becomes disabled again

### Unit Tests (in `src/utils.test.js`)

All tests below belong to the **same Vitest test file**. Grouped by function:

```
buildLikeClause
  ✓ exact match — returns term unchanged
  ✓ contains match — wraps term in %
  ✓ empty term — returns empty string for both types

extractBookName
  ✓ single-word book name
  ✓ hyphenated book name (e.g. "Lipcani1-5911177")
  ✓ book name with multiple hyphens

extractStartingImgId
  ✓ returns numeric ID from value string
  ✓ last segment is used when value has multiple hyphens

buildNyplUrl
  ✓ returns correct NYPL image URL for given imgId + page offset
  ✓ imgId addition is integer, not string concatenation

formatPageCount
  ✓ formats "N pages" correctly
  ✓ handles 0 pages

formatResultsDescription
  ✓ returns count, term, and bookName
```

---

## ✅ Phase 11 — Responsive / Polish

- [x] Verify layout at 768px and 480px widths (`.book-row`, `.search-bar`, `.info-cols` need flex-wrap or stacking)
- [x] Add `@media (max-width: 700px)` rules:
  - `.info-cols` → `grid-template-columns: 1fr` (stack columns)
  - `.search-bar` → wrap toggle group above input+button row
  - `header` padding reduction
  - `.stats-row` → wrap or reduce font size
- [x] Add `overflow-x: auto` on `.table-wrap` for wide result tables on narrow screens

### Deliverables
- Responsive media query block in `src/style.css`
- Layout verified at 480px, 768px, and 1024px breakpoints

### Manual Tests
- Resize browser to 480px width:
  - `.search-bar` toggle group stacks above the input row
  - `.info-cols` columns stack vertically
  - Header padding is reduced; stats row wraps without overflow
  - Results table scrolls horizontally rather than overflowing the viewport
- At 768px: layout is comfortable with no horizontal scrollbar on the page itself
- At full desktop width: no regression from Phase 1–10 appearance

### Unit Tests
- No unit tests for Phase 11 (CSS media queries; no JS logic)

---

## File Change Summary

| File | Action |
|------|--------|
| `yizkor-books-search.html` | Full restructure — phases 2–9 |
| `src/style.css` | Full replacement with Dark Archive CSS |
| `src/demo.css` | Clear all content (keep file, remove `<link>` tag) |
| `src/yizkor-books-search.js` | Targeted updates — phases 10a–10g |
| `src/utils.js` | **New** — pure functions extracted for testability |
| `src/utils.test.js` | **New** — Vitest unit test suite for `utils.js` |
| `package.json` | **New** — npm init + Vitest dependencies |
| `vitest.config.js` | **New** — Vitest configuration |

---

## Suggested Implementation Order

1. Phase 1 (CSS tokens + reset) — establishes the visual foundation
2. Phase 2 (head cleanup) — remove dead dependencies
3. Phases 3–6 (nav, header, book panel, search) — top-down HTML rebuild
4. Phase 8 (results area HTML) — new output structure
5. Phase 10 (JS updates + utils extraction + tests) — wire up new markup, establish test baseline
6. Phase 7 (accordions) — collapsible sections
7. Phase 9 (footer) — last structural piece
8. Phase 11 (responsive) — final polish pass
