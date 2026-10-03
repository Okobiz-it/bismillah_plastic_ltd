import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostHeader = request.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAdminSubdomain = hostname.startsWith('admin.');

  const primaryDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'bismillahplastic.com';
  const adminDomain = process.env.NEXT_PUBLIC_ADMIN_DOMAIN || `admin.${primaryDomain}`;

  if (isAdminSubdomain) {
    if (url.pathname === '/admin') {
      url.pathname = '/';
      return NextResponse.redirect(url, 307);
    }

    if (url.pathname.startsWith('/admin/')) {
      url.pathname = url.pathname.replace(/^\/admin/, '') || '/';
      return NextResponse.redirect(url, 307);
    }

    const internalPath = url.pathname === '/' ? '/admin' : `/admin${url.pathname}`;
    return NextResponse.rewrite(new URL(internalPath, request.url));
  }

  if (!isLocalhost && (url.pathname === '/admin' || url.pathname.startsWith('/admin/'))) {
    const cleanPath = url.pathname === '/admin' ? '/' : url.pathname.replace(/^\/admin/, '');
    const targetUrl = new URL(cleanPath, `https://${adminDomain}`);
    targetUrl.search = url.search;
    return NextResponse.redirect(targetUrl, 307);
  }

  return NextResponse.next();
}

// Support backward compatibility
export const middleware = proxy;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|woff2?|ttf|eot|css|js)$).*)',
  ],
};
