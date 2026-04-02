export type SavedItem = {
  id: string;
  name: string;
  price: number;
  itemUrl: string;
  savedAt: string;
};

const STORAGE_KEY = 'rakuten-select-saved-items';

export function getSavedItems(): SavedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveItem(item: SavedItem): void {
  const items = getSavedItems();
  const exists = items.some((i) => i.id === item.id);
  if (exists) return;
  items.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function removeItem(id: string): void {
  const items = getSavedItems().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isItemSaved(id: string): boolean {
  return getSavedItems().some((i) => i.id === id);
}
