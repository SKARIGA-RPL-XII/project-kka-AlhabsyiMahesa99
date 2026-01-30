import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const role = req.cookies.get('user-role')?.value; // Ambil cookie role
  const url = req.nextUrl.clone();

  // 1. Cek Login (Security Guard)
  const isProtectedRoute = url.pathname.startsWith('/user') || 
                           url.pathname.startsWith('/admin') || 
                           url.pathname.startsWith('/kurir');

  if (!accessToken && isProtectedRoute) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Cek Akses Role (Access Control)
  if (accessToken && role) {
    // Jika User biasa coba masuk ke Admin atau Kurir
    if ((url.pathname.startsWith('/admin') || url.pathname.startsWith('/kurir')) && role === 'user') {
      url.pathname = '/user/dashboard';
      return NextResponse.redirect(url);
    }

    // Jika Kurir coba masuk ke Admin
    if (url.pathname.startsWith('/admin') && role === 'kurir') {
      url.pathname = '/kurir/dashboard';
      return NextResponse.redirect(url);
    }

    // Jika Admin coba masuk ke folder User (opsional, tergantung kebutuhan)
    if (url.pathname.startsWith('/user') && role === 'admin') {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // 3. Jika sudah login mau balik ke login
  if (accessToken && url.pathname.startsWith('/login')) {
    const redirectPath = role === 'admin' ? '/admin/dashboard' : role === 'kurir' ? '/kurir/dashboard' : '/user/dashboard';
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/kurir/:path*', '/login'],
};