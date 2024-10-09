import { CREDENTIAL_NOT_FOUND, CREDENTIAL_NOT_SELECTED, LOGIN_REQUIRED, VAULT_NOT_DECRYPTED, VAULT_NOT_FOUND } from "@/config/response";
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
    if (session.credential === undefined)
        return err_route(CREDENTIAL_NOT_SELECTED.status,
            CREDENTIAL_NOT_SELECTED.msg,
            CREDENTIAL_NOT_SELECTED.code)
    const prisma = new PrismaClient();
    try {
        let credential = await prisma.credential.findUnique({
            where: {
                id: session.credential.id,
                vaultId: session.vault.id
            }
        })
        if (credential) {
            return NextResponse.json({
                id: credential.id,
                name: credential.name
            });
        } else {
            return err_route(CREDENTIAL_NOT_FOUND.status,
                CREDENTIAL_NOT_FOUND.msg,
                CREDENTIAL_NOT_FOUND.code)
        }
    } catch (er) {
        console.log(er)
        return err_route(VAULT_NOT_FOUND.status,
            VAULT_NOT_FOUND.msg,
            VAULT_NOT_FOUND.code)
    }
}

        /*
        if (session.vault === undefined) {
            return err_route(VAULT_NOT_SELECTED_OR_NOT_DECRYPTED.status,
                VAULT_NOT_SELECTED_OR_NOT_DECRYPTED.msg,
                VAULT_NOT_SELECTED_OR_NOT_DECRYPTED.code
            )
        }
        if (session.vault.key === undefined) {
            return err_route(VAULT_DECRYPTION_EMPTY_KEY.status,
                VAULT_DECRYPTION_EMPTY_KEY.msg,
                VAULT_DECRYPTION_EMPTY_KEY.code
            )
        }
        */