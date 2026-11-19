import { useMemo } from 'react';

/**
 * Filters an array of items by checking if any of the specified field selectors match the searchTerm.
 * @param {Array} items
 * @param {string} searchTerm
 * @param {Array<(item: any) => string|number|null|undefined>} selectors
 */
export function useTableSearch(items = [], searchTerm = '', selectors = []) {
  return useMemo(() => {
    const term = searchTerm?.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) =>
      selectors.some((selector) => {
        const val = selector(item);
        return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
      })
    );
  }, [items, searchTerm, selectors]);
}
