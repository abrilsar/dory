import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SignInPageUrl } from './constants/urls'
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.redirect(new URL(SignInPageUrl, request.url))
    }
    return NextResponse.next();
}


//No poner como variable
export const config = {
    matcher: ['/config-project', '/dashboard/:path*'],
}