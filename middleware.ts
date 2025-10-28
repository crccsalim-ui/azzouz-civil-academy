import createMiddleware from 'next-intl/middleware';

import {defaultLocale, locales} from './lib/i18n';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\.[\\w]+$).*)',
  ],
};
