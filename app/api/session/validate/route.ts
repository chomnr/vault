import { COOKIE_MAX_AGE } from "@/config/general"
import { LOGIN_EXPIRED } from "@/config/response"
import { SessionData, SESSION_OPTIONS } from "@/config/session"
import { err_route } from "@/config/shorthand"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const COOKIE_AGE_OFFSET = COOKIE_MAX_AGE * 1000

export async function GET() {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_EXPIRED.status,
            LOGIN_EXPIRED.msg,
            LOGIN_EXPIRED.code)
    if (Date.now() > (session.timeStamp + COOKIE_AGE_OFFSET)) {
        return err_route(LOGIN_EXPIRED.status,
            LOGIN_EXPIRED.msg,
            LOGIN_EXPIRED.code)
    }
    return new NextResponse(null, { status: 200 })
}