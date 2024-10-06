import { VAULT_NAME_MIN_LENGTH, VAULT_NAME_MAX_LENGTH, VAULT_CREDENTIAL_LIMIT } from "@/config/general";
import { VAULT_BAD_NAME, VAULT_CREDENTIALS_EXCEEDED, VAULT_CREDENTIALS_INVALID, VAULT_FIELDS_REQUIRED, VAULT_MAX_CREDENTIALS_NOT_INTEGER } from "@/config/response";
import { err_route } from "@/config/shorthand";
import { NextResponse } from "next/server";

// create vualt...
export async function POST(request: Request) {
    //const prisma = new PrismaClient()
    try {
        const data = await request.json()
        const { name, maxCredentials } = data
        if ((name as string).length < VAULT_NAME_MIN_LENGTH ||
            (name as string).length > VAULT_NAME_MAX_LENGTH)
            return err_route(VAULT_BAD_NAME.status,
                VAULT_BAD_NAME.msg,
                VAULT_BAD_NAME.code)
        if (typeof maxCredentials !== 'number' || isNaN(maxCredentials))
            return err_route(VAULT_MAX_CREDENTIALS_NOT_INTEGER.status,
                VAULT_MAX_CREDENTIALS_NOT_INTEGER.msg,
                VAULT_MAX_CREDENTIALS_NOT_INTEGER.code)
        if ((maxCredentials as number) > VAULT_CREDENTIAL_LIMIT)
            return err_route(VAULT_CREDENTIALS_EXCEEDED.status,
                VAULT_CREDENTIALS_EXCEEDED.msg,
                VAULT_CREDENTIALS_EXCEEDED.code)
        if ((maxCredentials as number) <= 0)
            return err_route(VAULT_CREDENTIALS_INVALID.status,
                VAULT_CREDENTIALS_INVALID.msg,
                VAULT_CREDENTIALS_INVALID.code)
        return new NextResponse(null, { status: 200 })
    } catch {
        return err_route(VAULT_FIELDS_REQUIRED.status,
            VAULT_FIELDS_REQUIRED.msg,
            VAULT_FIELDS_REQUIRED.code)
    }
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