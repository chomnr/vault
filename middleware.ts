import { COOKIE_MAX_AGE } from '@/config/general';
import { SESSION_OPTIONS, SessionData } from '@/config/session';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const result = NextResponse.next()
    const session = await getIronSession<SessionData>(request, result, SESSION_OPTIONS)
    const COOKIE_AGE_OFFSET = COOKIE_MAX_AGE(session?.remember) * 1000
    if (!session || Object.keys(session).length === 0 || Date.now() > (session.timeStamp + COOKIE_AGE_OFFSET)) {
        if (request.nextUrl.pathname !== '/login') {
            session?.destroy()
            return NextResponse.redirect(new URL('/login', request.url))
        }
    } else {
        if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/api/login') {
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (request.nextUrl.pathname === "/vault/decrypt" && session.vault === undefined) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (request.nextUrl.pathname === "/" && session.vault !== undefined) {
            session.vault = undefined
            await session.save()
        }

        if (request.nextUrl.pathname === "/vault/credential/create" && session.vault !== undefined && session.vault.key !== undefined) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (request.nextUrl.pathname === "/vault/delete" && session.vault?.key === undefined) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
    return result
}

export const config = {
    matcher: [
        '/((?!api/login|api|_next/static|_next/image|favicon.ico).*)'
    ]
}

/*
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}
    */