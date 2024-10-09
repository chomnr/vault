import { CREDENTIAL_NOT_FOUND, CREDENTIAL_NOT_SELECTED, INVALID_DELETION_CONFIRMATION, LOGIN_REQUIRED, VAULT_NOT_DECRYPTED } from "@/config/response";
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
        const data = await request.json()
        const { confirmation } = data
        let credential = await prisma.credential.findUnique({
            where: {
                id: session.credential.id,
                vaultId: session.vault.id
            }
        })
        if (credential) {
            if (confirmation !== credential.name) {
                return err_route(INVALID_DELETION_CONFIRMATION.status,
                    INVALID_DELETION_CONFIRMATION.msg,
                    INVALID_DELETION_CONFIRMATION.code
                )
            }
            await prisma.credential.delete({
                where: {
                    id: session.credential.id,
                    vaultId: session.vault.id
                }
            })
            prisma.$disconnect()
        } else {
            return err_route(CREDENTIAL_NOT_FOUND.status,
                CREDENTIAL_NOT_FOUND.msg,
                CREDENTIAL_NOT_FOUND.code
            )
        }
        return NextResponse.json(null, {
            status: 200
        });
    } catch (er) {
        console.log(er)
        return err_route(CREDENTIAL_NOT_FOUND.status,
            CREDENTIAL_NOT_FOUND.msg,
            CREDENTIAL_NOT_FOUND.code)
    }
}