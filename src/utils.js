/**
 * Build a LIKE clause value for a SQL search query.
 * @param {string} term        The search term entered by the user
 * @param {string} searchType  "exact" or "contains"
 * @returns {string}           The term, optionally wrapped in % wildcards
 */
export function buildLikeClause(term, searchType) {
  if (!term) return '';
  return searchType === 'contains' ? `%${term}%` : term;
}

/**
 * Extract the book name from a select option value.
 * Format: "BookName-ImgId" — ImgId is always the last hyphen-separated segment.
 * @param {string} selectValue  e.g. "Briceva-5575305"
 * @returns {string}            e.g. "Briceva"
 */
export function extractBookName(selectValue) {
  const parts = selectValue.split('-');
  return parts.slice(0, parts.length - 1).join('-');
}

/**
 * Extract the starting image ID from a select option value.
 * Format: "BookName-ImgId" — ImgId is always the last hyphen-separated segment.
 * @param {string} selectValue  e.g. "Briceva-5575305"
 * @returns {number}            e.g. 5575305
 */
export function extractStartingImgId(selectValue) {
  const parts = selectValue.split('-');
  return parseInt(parts[parts.length - 1], 10);
}

/**
 * Build the results description data for display after a search.
 * @param {number} count     Number of results found
 * @param {string} term      The search term used
 * @param {string} bookName  The name of the book searched
 * @returns {{ countText: string, descHtml: string }}
 */
export function formatResultsDescription(count, term, bookName) {
  return {
    countText: `${count} matches`,
    descHtml: `for <strong>"${term}"</strong> in <strong>${bookName}</strong>`,
  };
}

/**
 * Format a page count for display in the page-count badge.
 * @param {number} n  Number of pages
 * @returns {string}  e.g. "243 pages"
 */
export function formatPageCount(n) {
  return `${n} pages`;
}

/**
 * Build the NYPL image viewer URL for a given starting image ID and page offset.
 * The offset is added as an integer to prevent string concatenation bugs.
 * @param {number} startingImgId  The base image ID for the selected book
 * @param {number} pageOffset     The page number (row value) from the results table
 * @returns {string}              Full NYPL image URL
 */
export function buildNyplUrl(startingImgId, pageOffset) {
  const imgId = startingImgId + pageOffset;
  return `https://images.nypl.org/index.php?id=${imgId}&t=w`;
}
