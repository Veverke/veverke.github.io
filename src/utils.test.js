import { describe, it, expect } from 'vitest';
import { buildLikeClause, extractBookName, extractStartingImgId, formatResultsDescription, formatPageCount, buildNyplUrl } from './utils.js';

describe('buildLikeClause', () => {
  it('exact match — returns term unchanged', () => {
    expect(buildLikeClause('ברנשטיין', 'exact')).toBe('ברנשטיין');
  });

  it('contains match — wraps term in %', () => {
    expect(buildLikeClause('ברנשטיין', 'contains')).toBe('%ברנשטיין%');
  });

  it('empty term — returns empty string for exact', () => {
    expect(buildLikeClause('', 'exact')).toBe('');
  });

  it('empty term — returns empty string for contains', () => {
    expect(buildLikeClause('', 'contains')).toBe('');
  });

  it('latin term with contains', () => {
    expect(buildLikeClause('term', 'contains')).toBe('%term%');
  });
});

describe('extractBookName', () => {
  it('single-word book name', () => {
    expect(extractBookName('Briceva-5575305')).toBe('Briceva');
  });

  it('book name ending with digit (e.g. Lipcani1)', () => {
    expect(extractBookName('Lipcani1-5911177')).toBe('Lipcani1');
  });

  it('another single-word book name', () => {
    expect(extractBookName('Yedinetz-56633165')).toBe('Yedinetz');
  });

  it('book name with multiple hyphens', () => {
    // If book name itself contained a hyphen, all parts except the last are joined
    expect(extractBookName('Tel-Aviv-12345678')).toBe('Tel-Aviv');
  });
});

describe('extractStartingImgId', () => {
  it('returns numeric ID from value string', () => {
    expect(extractStartingImgId('Briceva-5575305')).toBe(5575305);
  });

  it('returns numeric ID for Lipcani1', () => {
    expect(extractStartingImgId('Lipcani1-5911177')).toBe(5911177);
  });

  it('last segment is used when value has multiple hyphens', () => {
    expect(extractStartingImgId('Tel-Aviv-12345678')).toBe(12345678);
  });

  it('result is a number, not a string', () => {
    const result = extractStartingImgId('Briceva-5575305');
    expect(typeof result).toBe('number');
    // verify it's integer addition, not string concatenation
    expect(result + 1).toBe(5575306);
  });
});

describe('formatResultsDescription', () => {
  it('returns countText and descHtml containing count, term, and bookName', () => {
    const result = formatResultsDescription(47, 'ברנשטיין', 'Briceva');
    expect(result.countText).toContain('47');
    expect(result.descHtml).toContain('ברנשטיין');
    expect(result.descHtml).toContain('Briceva');
  });

  it('count of 1 is represented correctly', () => {
    const result = formatResultsDescription(1, 'test', 'Ataci');
    expect(result.countText).toContain('1');
    expect(result.descHtml).toContain('test');
    expect(result.descHtml).toContain('Ataci');
  });

  it('countText format is "N matches"', () => {
    const result = formatResultsDescription(12, 'word', 'Khotin');
    expect(result.countText).toBe('12 matches');
  });
});

describe('formatPageCount', () => {
  it('formats "N pages" correctly', () => {
    expect(formatPageCount(243)).toBe('243 pages');
  });

  it('handles 0 pages', () => {
    expect(formatPageCount(0)).toBe('0 pages');
  });

  it('handles 1 page', () => {
    expect(formatPageCount(1)).toBe('1 pages');
  });
});

describe('buildNyplUrl', () => {
  it('returns correct NYPL image URL for given startingImgId and page offset', () => {
    expect(buildNyplUrl(5575305, 10)).toBe('https://images.nypl.org/index.php?id=5575315&t=w');
  });

  it('imgId addition is integer, not string concatenation', () => {
    const url = buildNyplUrl(5575305, 1);
    expect(url).toBe('https://images.nypl.org/index.php?id=5575306&t=w');
    expect(url).not.toContain('55753051');
  });

  it('works with page offset of 0', () => {
    expect(buildNyplUrl(5575305, 0)).toBe('https://images.nypl.org/index.php?id=5575305&t=w');
  });
});
