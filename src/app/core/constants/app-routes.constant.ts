export const APP_ROUTES = {
  login:     '/login',
  register:  '/register',
  hub:       '/starian-hub',
  dashboard: '/starian-hub/dashboard',
  products:  '/starian-hub/products',
  profile:   '/starian-hub/profile',
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
