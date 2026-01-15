export const isAuthenticatedClient = () =>
  typeof localStorage !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';

