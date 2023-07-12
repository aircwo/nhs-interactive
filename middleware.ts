import createMiddleware from 'next-intl/middleware';
import { LOCALES } from '@/app/utils/constants';
 
export default createMiddleware({
  locales: LOCALES,
  defaultLocale: 'en'
});
 
export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};