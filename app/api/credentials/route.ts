import { CREDENTIAL_DATA_EMPTY, CREDENTIAL_DATA_PARSE_ERROR, CREDENTIAL_NAME_EMPTY, CREDENTIAL_TYPE_EMPTY, LOGIN_REQUIRED, VAULT_FAILED_TO_RETRIEVE, VAULT_NOT_DECRYPTED, VAULT_NOT_FOUND } from "@/config/response";
import { SessionData, SESSION_OPTIONS } from "@/config/session";
import { err_route } from "@/config/shorthand";
import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import forge from 'node-forge';

export async function POST(request: Request) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code);
    if (session.vault?.key === undefined)
        return err_route(VAULT_NOT_DECRYPTED.status,
            VAULT_NOT_DECRYPTED.msg,
            VAULT_NOT_DECRYPTED.code)
    const prisma = new PrismaClient();
    try {
        const dataj = await request.json()
        const { type, name, data } = dataj
        if (!type)
            return err_route(CREDENTIAL_TYPE_EMPTY.status,
                CREDENTIAL_TYPE_EMPTY.msg,
                CREDENTIAL_TYPE_EMPTY.code)
        if (!name)
            return err_route(CREDENTIAL_NAME_EMPTY.status,
                CREDENTIAL_NAME_EMPTY.msg,
                CREDENTIAL_NAME_EMPTY.code)
        if (!data)
            return err_route(CREDENTIAL_DATA_EMPTY.status,
                CREDENTIAL_DATA_EMPTY.msg,
                CREDENTIAL_DATA_EMPTY.code)
        try {
            JSON.parse(data)
        } catch (error) {
            return err_route(CREDENTIAL_DATA_PARSE_ERROR.status,
                CREDENTIAL_DATA_PARSE_ERROR.msg,
                CREDENTIAL_DATA_PARSE_ERROR.code)
        }
        const aesKey = session.vault.key;
        const iv = forge.random.getBytesSync(16);
        const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(aesKey));
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(JSON.stringify(data)));
        cipher.finish();
        const encryptedData = forge.util.encode64(cipher.output.getBytes());
        const base64IV = forge.util.encode64(iv);
        const credentials = await prisma.credential.create({
            data: {
                type: type as string,
                name: name as string,
                data: encryptedData,
                iv: base64IV,
                updatedAt: new Date().toISOString(),
                vaultId: session.vault.id!,
            }
        });
        return NextResponse.json(credentials);
    } catch (error) {
        console.log(error);
        return err_route(VAULT_FAILED_TO_RETRIEVE.status,
            VAULT_FAILED_TO_RETRIEVE.msg,
            VAULT_FAILED_TO_RETRIEVE.code);
    } finally {
        await prisma.$disconnect();
    }
}
export async function GET() {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code);
    if (session.vault?.key === undefined)
        return err_route(VAULT_NOT_DECRYPTED.status,
            VAULT_NOT_DECRYPTED.msg,
            VAULT_NOT_DECRYPTED.code)
    const prisma = new PrismaClient();
    try {
        const credentials = await prisma.credential.findMany({
            where: {
                vaultId: session.vault.id,
            },
            select: {
                id: true,
                type: true,
                name: true
            }
        });
        return NextResponse.json(credentials);
    } catch (error) {
        return err_route(VAULT_FAILED_TO_RETRIEVE.status,
            VAULT_FAILED_TO_RETRIEVE.msg,
            VAULT_FAILED_TO_RETRIEVE.code);
    } finally {
        await prisma.$disconnect();
    }
}
