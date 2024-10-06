import { VAULT_NAME_MIN_LENGTH, VAULT_NAME_MAX_LENGTH, VAULT_CREDENTIAL_LIMIT } from "@/config/general";
import { VAULT_BAD_NAME, VAULT_CREDENTIALS_EXCEEDED, VAULT_MAX_CREDENTIALS_NOT_INTEGER } from "@/config/response";
import { err_route } from "@/config/shorthand";
import { PrismaClient } from "@prisma/client/extension";
import { NextResponse } from "next/server";

// create vualt...
export async function POST(request: Request) {
    const prisma = new PrismaClient()
    const data = await request.json()
    const { name, maxCredentials } = data
    if ((name as string).length > VAULT_NAME_MIN_LENGTH &&
        (name as string).length < VAULT_NAME_MAX_LENGTH) {
            return err_route(VAULT_BAD_NAME.status,
                VAULT_BAD_NAME.msg,
                VAULT_BAD_NAME.code)
    }
    if (typeof maxCredentials !== 'number' || isNaN(maxCredentials)) {
        return err_route(VAULT_MAX_CREDENTIALS_NOT_INTEGER.status,
            VAULT_MAX_CREDENTIALS_NOT_INTEGER.msg,
            VAULT_MAX_CREDENTIALS_NOT_INTEGER.code)
    }
    if((maxCredentials as number) > VAULT_CREDENTIAL_LIMIT) {
        return err_route(VAULT_CREDENTIALS_EXCEEDED.status,
            VAULT_CREDENTIALS_EXCEEDED.msg,
            VAULT_CREDENTIALS_EXCEEDED.code)
    }
    return new NextResponse(null, { status: 200 })
}

   /*
    const vault = await prisma.vault.create({
        data: {
            name: "name..",
            maxCredentials: 100,
            credentials: {
                create: []
            }
        }
    })
        */