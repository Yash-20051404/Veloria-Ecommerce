export const toast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
};