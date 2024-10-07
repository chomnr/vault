import { LOGIN_REQUIRED, VAULT_KEY_NOT_FOUND, VAULT_NOT_FOUND, VAULT_NOT_SELECTED } from "@/config/response"
import { SessionData, SESSION_OPTIONS } from "@/config/session"
import { err_route } from "@/config/shorthand"
import { PrismaClient } from "@prisma/client"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import forge from 'node-forge'


export async function POST(request: Request, response: Response) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code)
    const prisma = new PrismaClient()
    try {
        if (session.vault === undefined)
            return err_route(VAULT_NOT_SELECTED.status,
                VAULT_NOT_SELECTED.msg,
                VAULT_NOT_SELECTED.code)
        if (session.vault.key === undefined)
            return err_route(VAULT_KEY_NOT_FOUND.status,
                VAULT_KEY_NOT_FOUND.msg,
                VAULT_KEY_NOT_FOUND.code)
        const vault = await prisma.vault.findUnique({
            where: {
                id: session.vault?.id
            }
        })
        if (vault) {
            const encryptedBytes = forge.util.decode64(vault.secret);
            const keyBytes = forge.util.decode64(encryptedBytes);
        } else {
            if (session.vault === undefined) {
                return err_route(VAULT_NOT_FOUND.status,
                    VAULT_NOT_FOUND.msg,
                    VAULT_NOT_FOUND.code)
            }
        }
    } catch(er) {
        console.log(er)
        return err_route(VAULT_NOT_FOUND.status,
            VAULT_NOT_FOUND.msg,
            VAULT_NOT_FOUND.code)
    }
}