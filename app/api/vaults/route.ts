import { VAULT_NAME_MIN_LENGTH, VAULT_NAME_MAX_LENGTH, VAULT_CREDENTIAL_LIMIT } from "@/config/general";
import { VAULT_BAD_NAME, VAULT_CREDENTIALS_EXCEEDED, VAULT_CREDENTIALS_INVALID, VAULT_FIELDS_REQUIRED, VAULT_INVALID_AES_KEY, VAULT_INVALID_AES_KEY_LENGTH, VAULT_MAX_CREDENTIALS_NOT_INTEGER } from "@/config/response";
import { err_route } from "@/config/shorthand";
import { NextResponse } from "next/server";
import { randomBytes } from 'crypto';
import forge from 'node-forge'

// create vualt...
export async function POST(request: Request, response: Response) {
    try {
        const data = await request.json()
        const { name, maxCredentials, key = "auto" } = data
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
        if ((key as string) === "auto") {
            const generatedKey = randomBytes(32)
            const headers = new Headers()
            headers.set("Content-Disposition", 'attachment; filename="aes-key.aes"')
            headers.set("Content-Type", 'application/octet-stream')
            return new NextResponse(generatedKey, { status: 200, headers })
        } else {
            if (!key.name.endsWith(".aes")) {
                return err_route(VAULT_INVALID_AES_KEY.status,
                    VAULT_INVALID_AES_KEY.msg,
                    VAULT_INVALID_AES_KEY.code)
            }
            const keyBuffer = Buffer.from(key.data, 'base64')
            if (keyBuffer.length !== 32) {
                return err_route(VAULT_INVALID_AES_KEY_LENGTH.status,
                    VAULT_INVALID_AES_KEY_LENGTH.msg,
                    VAULT_INVALID_AES_KEY_LENGTH.code)
            }
            const hexKey = keyBuffer.toString('hex');
            const iv = forge.random.getBytesSync(16)
            const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(hexKey));
            cipher.start({ iv })
            cipher.update(forge.util.createBuffer('data'))
            cipher.finish()
            const encrypted = cipher.output
            const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(hexKey))
            decipher.start({ iv })
            decipher.update(encrypted)
            const success = decipher.finish()
            if (success) {
                return new NextResponse(null, { status: 200 })
            } else {
                return err_route(VAULT_INVALID_AES_KEY.status,
                    VAULT_INVALID_AES_KEY.msg,
                    VAULT_INVALID_AES_KEY.code)
            }
        }
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