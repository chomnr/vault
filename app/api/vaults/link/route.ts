import { VAULT_ID_MIN_LENGTH } from "@/config/general"
import { LOGIN_REQUIRED, VAULT_ID_INVALID_LENGTH, VAULT_LINKING_ERROR, VAULT_NOT_FOUND } from "@/config/response"
import { SessionData, SESSION_OPTIONS } from "@/config/session"
import { err_route } from "@/config/shorthand"
import { PrismaClient } from "@prisma/client"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// link the vault to a session. (does not decrypt vault...)
export async function POST(request: Request) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code)
    const prisma = new PrismaClient()
    try {
        const data = await request.json()
        const { id } = data
        if ((id as string).length !== VAULT_ID_MIN_LENGTH) {
            return err_route(VAULT_ID_INVALID_LENGTH.status,
                VAULT_ID_INVALID_LENGTH.msg,
                VAULT_ID_INVALID_LENGTH.code)
        }
        const vault = await prisma.vault.findUnique({
            where: {
                id: id
            }
        })
        if (vault) {
            session.vault = {
                id: vault.id,
                name: vault.name,
                key: undefined
            }
        return new NextResponse(null, { status: 200 })
        } else {
            return err_route(VAULT_NOT_FOUND.status,
                VAULT_NOT_FOUND.msg,
                VAULT_NOT_FOUND.code)
        }
    } catch(er) {
        console.log(er)
        return err_route(VAULT_LINKING_ERROR.status,
            VAULT_LINKING_ERROR.msg,
            VAULT_LINKING_ERROR.code)
    }
}