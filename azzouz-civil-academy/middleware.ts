import createMiddleware from 'next-intl/middleware';

import {defaultLocale, locales} from '@/lib/i18n';

export default createMiddleware({
  defaultLocale,
  locales,
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\.[\\w]+$).*)',
  ],
};

