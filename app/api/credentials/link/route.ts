import { CREDENTIAL_ID_MIN_LENGTH } from "@/config/general"
import { CREDENTIAL_ID_INVALID_LENGTH, CREDENTIAL_NOT_FOUND, CREDENTIAL_NOT_SELECTED, INVALID_CREDENTIAL_ACTION, LOGIN_REQUIRED, VAULT_LINKING_ERROR, VAULT_NOT_DECRYPTED, VAULT_NOT_FOUND } from "@/config/response"
import { SessionData, SESSION_OPTIONS } from "@/config/session"
import { err_route } from "@/config/shorthand"
import { PrismaClient } from "@prisma/client"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code)
    if (session.vault?.key === undefined)
        return err_route(VAULT_NOT_DECRYPTED.status,
            VAULT_NOT_DECRYPTED.msg,
            VAULT_NOT_DECRYPTED.code)
    const prisma = new PrismaClient()
    try {
        const data = await request.json()
        const { id, action } = data
        if ((id as string).length !== CREDENTIAL_ID_MIN_LENGTH) {
            console.log("test1")
            return err_route(CREDENTIAL_ID_INVALID_LENGTH.status,
                CREDENTIAL_ID_INVALID_LENGTH.msg,
                CREDENTIAL_ID_INVALID_LENGTH.code)
        }
        if ((action as string) !== "edit" && (action as string) !== "delete") {
            return err_route(INVALID_CREDENTIAL_ACTION.status,
                INVALID_CREDENTIAL_ACTION.msg,
                INVALID_CREDENTIAL_ACTION.code)
        }
        const credential = await prisma.credential.findUnique({
            where: {
                id: id,
                vaultId: session.vault.id
            }
        })
        if (credential) {
            session.credential = {
                id: id
            }
            await session.save()
            if (action === "edit") {
                return NextResponse.redirect(new URL("/vault/credential/edit", request.url), 303)
            }
            if (action === "delete") {
                return NextResponse.redirect(new URL("/vault/credential/delete", request.url), 303)
            }
        } else {
            session.credential = undefined
            await session.save()
            return err_route(CREDENTIAL_NOT_FOUND.status,
                CREDENTIAL_NOT_FOUND.msg,
                CREDENTIAL_NOT_FOUND.code)
        }
    } catch (er) {
        console.log(er)
        return err_route(VAULT_LINKING_ERROR.status,
            VAULT_LINKING_ERROR.msg,
            VAULT_LINKING_ERROR.code)
    }
}