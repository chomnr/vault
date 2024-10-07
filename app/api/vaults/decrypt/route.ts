import { VAULT_NOT_SELECTED, VAULT_NOT_FOUND, LOGIN_REQUIRED, VAULT_DECRYPTION_FAILED, VAULT_INVALID_AES_KEY, VAULT_INVALID_AES_KEY_LENGTH } from "@/config/response";
import { err_route } from "@/config/shorthand";
import { NextResponse } from "next/server";
import forge from 'node-forge';
import { PrismaClient } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, SESSION_OPTIONS } from "@/config/session";

export async function POST(request: Request) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code);
    const prisma = new PrismaClient();
    try {
        const formData = await request.formData();
        const keyFile = formData.get('key-upload') as File | null;
        if (session.vault === undefined)
            return err_route(VAULT_NOT_SELECTED.status,
                VAULT_NOT_SELECTED.msg,
                VAULT_NOT_SELECTED.code)
        const vault = await prisma.vault.findUnique({
            where: { id: session.vault?.id }
        });
        if (vault) {
            if (keyFile) {
                const fileName = keyFile.name;
                if (!fileName.endsWith(".aes")) {
                    return err_route(VAULT_INVALID_AES_KEY.status,
                        VAULT_INVALID_AES_KEY.msg,
                        VAULT_INVALID_AES_KEY.code)
                }
                const arrayBuffer = await keyFile.arrayBuffer();
                const base64String = new TextDecoder().decode(arrayBuffer)
                const keyBuffer = Buffer.from(base64String, 'base64')
                if (keyBuffer.length !== 32) {
                    return err_route(VAULT_INVALID_AES_KEY_LENGTH.status,
                        VAULT_INVALID_AES_KEY_LENGTH.msg,
                        VAULT_INVALID_AES_KEY_LENGTH.code)
                }
                const aesKey = keyBuffer.toString('hex')
                const encryptedBytes = forge.util.decode64(vault.secret)
                const iv = forge.util.decode64(vault.iv)
                const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(aesKey))
                decipher.start({ iv: iv })
                decipher.update(forge.util.createBuffer(encryptedBytes))
                const success = decipher.finish()
                if (success) {
                    session.vault.key = aesKey
                    await session.save()
                    // todo: redirect to vault...
                    return NextResponse.json({
                        code: "SUCCESS",
                        msg: "Vault decrypted successfully. Redirecting..."
                    }, {
                        status: 200
                    });
                } else {
                    return err_route(VAULT_DECRYPTION_FAILED.status,
                        VAULT_DECRYPTION_FAILED.msg,
                        VAULT_DECRYPTION_FAILED.code);
                }
            } else {
                return err_route(VAULT_INVALID_AES_KEY.status,
                    VAULT_INVALID_AES_KEY.msg,
                    VAULT_INVALID_AES_KEY.code);
            }
        } else {
            return err_route(VAULT_NOT_FOUND.status,
                VAULT_NOT_FOUND.msg,
                VAULT_NOT_FOUND.code);
        }
    } catch (er) {
        console.log(er);
        return err_route(VAULT_NOT_FOUND.status,
            VAULT_NOT_FOUND.msg,
            VAULT_NOT_FOUND.code);
    } finally {
        await prisma.$disconnect();
    }
}
