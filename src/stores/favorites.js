import { writable } from 'svelte/store';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize from localStorage if available
const storedFavorites = isBrowser ? localStorage.getItem('popcorn_favorites') : null;
const initialFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

export const favorites = writable(initialFavorites);

// Subscribe to changes and save to localStorage
if (isBrowser) {
  favorites.subscribe(value => {
    localStorage.setItem('popcorn_favorites', JSON.stringify(value));
  });
}

export function toggleFavorite(serviceId) {
  favorites.update(items => {
    if (items.includes(serviceId)) {
      return items.filter(id => id !== serviceId);
    }
    return [...items, serviceId];
  });
}

export function isFavorite(serviceId) {
  let result = false;
  favorites.subscribe(items => {
    result = items.includes(serviceId);
  })();
  return result;
}
