import { INVALID_DELETION_CONFIRMATION, LOGIN_REQUIRED, VAULT_NAME_INVALID, VAULT_NOT_DECRYPTED, VAULT_NOT_FOUND, VAULT_NOT_SELECTED_OR_DECRYPTED, VAULT_NOT_SELECTED_OR_NOT_DECRYPTED } from "@/config/response";
import { SessionData, SESSION_OPTIONS } from "@/config/session";
import { err_route } from "@/config/shorthand";
import { PrismaClient } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code)
    if (session.vault?.key === undefined)
        return err_route(VAULT_NOT_DECRYPTED.status,
            VAULT_NOT_DECRYPTED.msg,
            VAULT_NOT_DECRYPTED.code)
    const prisma = new PrismaClient();
    try {
        const data = await request.json()
        const { confirmation } = data
        if (session.vault === undefined || session.vault.key === undefined) {
            return err_route(VAULT_NOT_SELECTED_OR_NOT_DECRYPTED.status,
                VAULT_NOT_SELECTED_OR_NOT_DECRYPTED.msg,
                VAULT_NOT_SELECTED_OR_NOT_DECRYPTED.code
            )
        }
        if (confirmation !== session.vault.name) {
            return err_route(INVALID_DELETION_CONFIRMATION.status,
                INVALID_DELETION_CONFIRMATION.msg,
                INVALID_DELETION_CONFIRMATION.code
            )
        }
        await prisma.credential.deleteMany({
            where: {
                vaultId: session.vault.id
            }
        });
        await prisma.vault.delete({
            where: {
                id: session.vault.id
            }
        })
        return NextResponse.json(null, {
            status: 200
        });
    } catch (er) {
        console.log(er)
        return err_route(VAULT_NOT_FOUND.status,
            VAULT_NOT_FOUND.msg,
            VAULT_NOT_FOUND.code)
    }
}

/**
 * 
 * 
 */