import { LOGIN_REQUIRED } from "@/config/response"
import { SessionData, SESSION_OPTIONS } from "@/config/session"
import { err_route } from "@/config/shorthand"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code)
    session.vault = undefined
    await session.save()
}