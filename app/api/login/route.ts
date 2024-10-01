import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/config/general"
import { LOGIN_CRED_REQUIRED, LOGIN_BAD_USERNAME, LOGIN_CRED_INCORRECT } from "@/config/response"
import { SessionData, SESSION_OPTIONS } from "@/config/session"
import { err_route } from "@/config/shorthand"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const env = process.env
        const { username, password, remember } = data
        const remembered = typeof remember === 'boolean' ? remember : false
        if (!username || !password)
            return err_route(LOGIN_CRED_REQUIRED.status,
                LOGIN_CRED_REQUIRED.msg,
                LOGIN_CRED_REQUIRED.code)
        if ((username as string).length < USERNAME_MIN_LENGTH || 
            (username as string).length > USERNAME_MAX_LENGTH)
            return err_route(LOGIN_BAD_USERNAME.status,
                LOGIN_BAD_USERNAME.msg,
                LOGIN_BAD_USERNAME.code)
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = env
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD)
            return err_route(LOGIN_CRED_INCORRECT.status,
                LOGIN_CRED_INCORRECT.msg,
                LOGIN_CRED_INCORRECT.code)
        const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
        session.timeStamp = Date.now()
        session.aesKey = undefined
        session.currentVault = undefined
        session.remember = remembered
        await session.save()
        return new NextResponse(null, { status: 200 })
    } catch {
        return err_route(LOGIN_CRED_REQUIRED.status,
            LOGIN_CRED_REQUIRED.msg,
            LOGIN_CRED_REQUIRED.code)
    }
}