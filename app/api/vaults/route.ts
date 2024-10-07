import { VAULT_NAME_MIN_LENGTH, VAULT_NAME_MAX_LENGTH, VAULT_CREDENTIAL_LIMIT } from "@/config/general";
import { VAULT_BAD_NAME, VAULT_CREDENTIALS_EXCEEDED, VAULT_CREDENTIALS_INVALID, VAULT_FIELDS_REQUIRED, VAULT_INVALID_AES_KEY, VAULT_INVALID_AES_KEY_LENGTH, VAULT_MAX_CREDENTIALS_NOT_INTEGER } from "@/config/response";
import { err_route } from "@/config/shorthand";
import { NextResponse } from "next/server";
import { randomBytes } from 'crypto';
import forge from 'node-forge'
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request, response: Response) {
    const prisma = new PrismaClient()
    try {
        const formData = await request.formData()
        const name = formData.get('name') as string
        const maxCredentials = parseInt(formData.get('maxCredentials') as string)
        const keyFile = formData.get('key-upload') as File | null
        if (name.length < VAULT_NAME_MIN_LENGTH || name.length > VAULT_NAME_MAX_LENGTH)
            return err_route(VAULT_BAD_NAME.status,
                VAULT_BAD_NAME.msg,
                VAULT_BAD_NAME.code)
        if (isNaN(maxCredentials))
            return err_route(VAULT_MAX_CREDENTIALS_NOT_INTEGER.status,
                VAULT_MAX_CREDENTIALS_NOT_INTEGER.msg,
                VAULT_MAX_CREDENTIALS_NOT_INTEGER.code)

        if (maxCredentials > VAULT_CREDENTIAL_LIMIT)
            return err_route(VAULT_CREDENTIALS_EXCEEDED.status,
                VAULT_CREDENTIALS_EXCEEDED.msg,
                VAULT_CREDENTIALS_EXCEEDED.code)

        if (maxCredentials <= 0)
            return err_route(VAULT_CREDENTIALS_INVALID.status,
                VAULT_CREDENTIALS_INVALID.msg,
                VAULT_CREDENTIALS_INVALID.code)
        let aesKey: string
        if (!keyFile) {
            const generatedKey = randomBytes(32)
            const headers = new Headers()
            headers.set("Content-Disposition", 'attachment; filename="aes-key.aes"')
            headers.set("Content-Type", 'application/octet-stream')
            await prisma.vault.create({
                data: {
                    name: name,
                    maxCredentials: maxCredentials,
                    credentials: {}
                },
            });
            return new NextResponse(Buffer.from(generatedKey).toString('base64'), { status: 200, headers })
        } else {
            const fileName = keyFile.name
            if (!fileName.endsWith(".aes")) {
                return err_route(VAULT_INVALID_AES_KEY.status,
                    VAULT_INVALID_AES_KEY.msg,
                    VAULT_INVALID_AES_KEY.code)
            }
            const arrayBuffer = await keyFile.arrayBuffer()
            const base64String = new TextDecoder().decode(arrayBuffer)
            const keyBuffer = Buffer.from(base64String, 'base64')
            if (keyBuffer.length !== 32) {
                return err_route(VAULT_INVALID_AES_KEY_LENGTH.status,
                    VAULT_INVALID_AES_KEY_LENGTH.msg,
                    VAULT_INVALID_AES_KEY_LENGTH.code)
            }
            aesKey = keyBuffer.toString('hex')
            const iv = forge.random.getBytesSync(16)
            const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(aesKey))
            cipher.start({ iv })
            cipher.update(forge.util.createBuffer('data'))
            cipher.finish()
            const encrypted = cipher.output
            const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(aesKey))
            decipher.start({ iv })
            decipher.update(encrypted)
            const success = decipher.finish()
            if (success) {
                await prisma.vault.create({
                    data: {
                        name: name,
                        maxCredentials: maxCredentials,
                        credentials: {}
                    },
                });
                return new NextResponse("REDACTED", { status: 200 })
            } else {
                return err_route(VAULT_INVALID_AES_KEY.status,
                    VAULT_INVALID_AES_KEY.msg,
                    VAULT_INVALID_AES_KEY.code)
            }
        }
    } catch (er) {
        console.log(er)
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