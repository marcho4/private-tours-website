
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  TOURS: '/tours',
  CONTACTS: '/contacts',
  BLOG: '/blog',
  
  // Аутентификация
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Личный кабинет
  PROFILE: {
    DASHBOARD: '/profile',
    BOOKINGS: '/profile/bookings',
    SETTINGS: '/profile/settings',
    FAVORITES: '/profile/favorites',
  },
  
  // Детальные страницы
  TOUR_DETAILS: (id: string) => `/tours/${id}`,
  SERVICE_DETAILS: (id: string) => `/services/${id}`,
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  
  // API-пути
  API: {
    BASE: '/api',
    TOURS: '/api/tours',
    BOOKINGS: '/api/bookings',
    AUTH: '/api/auth',
    USER: '/api/user',
  }
};

/**
 * Внешние ссылки
 */
export const EXTERNAL_LINKS = {
  FACEBOOK: 'https://facebook.com/company',
  INSTAGRAM: 'https://instagram.com/company',
  TWITTER: 'https://twitter.com/company',
  WHATSAPP: 'https://wa.me/1234567890',
  TELEGRAM: 'https://t.me/company',
};

/**
 * Хелпер для создания полного URL-адреса с базовым URL сайта
 */
export function createFullUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://privat-tours.com';
  return `${baseUrl}${path}`;
} 