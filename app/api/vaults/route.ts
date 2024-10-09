import {
    VAULT_NAME_MIN_LENGTH,
    VAULT_NAME_MAX_LENGTH,
    VAULT_CREDENTIAL_LIMIT,
    VAULT_LIMIT
} from "@/config/general";
import {
    LOGIN_REQUIRED,
    VAULT_BAD_NAME,
    VAULT_CREDENTIALS_EXCEEDED,
    VAULT_CREDENTIALS_INVALID,
    VAULT_ENCRYPTION_FAILED,
    VAULT_FAILED_TO_RETRIEVE,
    VAULT_FIELDS_REQUIRED,
    VAULT_INVALID_AES_KEY,
    VAULT_INVALID_AES_KEY_LENGTH,
    VAULT_LIMIT_EXCEEDED,
    VAULT_MAX_CREDENTIALS_NOT_INTEGER
} from "@/config/response";
import { err_route } from "@/config/shorthand";
import { NextResponse } from "next/server";
import { randomBytes } from 'crypto';
import forge from 'node-forge';
import { PrismaClient } from "@prisma/client";
import { SessionData, SESSION_OPTIONS } from "@/config/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status, LOGIN_REQUIRED.msg, LOGIN_REQUIRED.code);
    const prisma = new PrismaClient();
    try {
        const vaults = await prisma.vault.findMany();
        if (vaults.length > VAULT_LIMIT)
            return err_route(VAULT_LIMIT_EXCEEDED.status,
                VAULT_LIMIT_EXCEEDED.msg,
                VAULT_LIMIT_EXCEEDED.code);
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const maxCredentials = parseInt(formData.get('maxCredentials') as string);
        const keyFile = formData.get('key-upload') as File | null;
        if (name.length < VAULT_NAME_MIN_LENGTH || name.length > VAULT_NAME_MAX_LENGTH)
            return err_route(VAULT_BAD_NAME.status,
                VAULT_BAD_NAME.msg,
                VAULT_BAD_NAME.code);
        if (isNaN(maxCredentials))
            return err_route(VAULT_MAX_CREDENTIALS_NOT_INTEGER.status,
                VAULT_MAX_CREDENTIALS_NOT_INTEGER.msg,
                VAULT_MAX_CREDENTIALS_NOT_INTEGER.code);
        if (maxCredentials > VAULT_CREDENTIAL_LIMIT)
            return err_route(VAULT_CREDENTIALS_EXCEEDED.status,
                VAULT_CREDENTIALS_EXCEEDED.msg,
                VAULT_CREDENTIALS_EXCEEDED.code);
        if (maxCredentials <= 0)
            return err_route(VAULT_CREDENTIALS_INVALID.status,
                VAULT_CREDENTIALS_INVALID.msg,
                VAULT_CREDENTIALS_INVALID.code);
        const iv = forge.random.getBytesSync(16);
        let aesKey;
        if (!keyFile) {
            const generatedKey = randomBytes(32);
            const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(generatedKey));
            cipher.start({ iv });
            cipher.update(forge.util.createBuffer("secret"));
            const success = cipher.finish();
            if (!success)
                return err_route(VAULT_ENCRYPTION_FAILED.status,
                    VAULT_ENCRYPTION_FAILED.msg,
                    VAULT_ENCRYPTION_FAILED.code);
            const encrypted = cipher.output;
            const headers = new Headers();
            headers.set("Content-Disposition", 'attachment; filename="aes-key.aes"');
            headers.set("Content-Type", 'application/octet-stream');
            await prisma.vault.create({
                data: {
                    name: name,
                    maxCredentials: maxCredentials,
                    secret: Buffer.from(encrypted.getBytes(), 'binary').toString("base64"),
                    iv: Buffer.from(iv, 'binary').toString("base64")
                }
            });
            prisma.$disconnect();
            return new NextResponse(Buffer.from(generatedKey).toString('base64'), { status: 200, headers });
        } else {
            const fileName = keyFile.name;
            if (!fileName.endsWith(".aes"))
                return err_route(VAULT_INVALID_AES_KEY.status,
                    VAULT_INVALID_AES_KEY.msg,
                    VAULT_INVALID_AES_KEY.code);
            const arrayBuffer = await keyFile.arrayBuffer();
            const base64String = new TextDecoder().decode(arrayBuffer);
            const keyBuffer = Buffer.from(base64String, 'base64');
            if (keyBuffer.length !== 32)
                return err_route(VAULT_INVALID_AES_KEY_LENGTH.status,
                    VAULT_INVALID_AES_KEY_LENGTH.msg,
                    VAULT_INVALID_AES_KEY_LENGTH.code);
            aesKey = keyBuffer.toString('hex');
            const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(aesKey));
            cipher.start({ iv });
            cipher.update(forge.util.createBuffer('secret'));
            const success = cipher.finish();
            const encrypted = cipher.output;
            if (!success)
                return err_route(VAULT_ENCRYPTION_FAILED.status,
                    VAULT_ENCRYPTION_FAILED.msg,
                    VAULT_ENCRYPTION_FAILED.code);
            await prisma.vault.create({
                data: {
                    name: name,
                    maxCredentials: maxCredentials,
                    secret: Buffer.from(encrypted.getBytes(), 'binary').toString("base64"),
                    iv: Buffer.from(iv, 'binary').toString("base64")
                }
            });
            prisma.$disconnect();
            return new NextResponse("REDACTED", { status: 200 });
        }
    } catch (er) {
        console.log(er);
        return err_route(VAULT_FIELDS_REQUIRED.status,
            VAULT_FIELDS_REQUIRED.msg,
            VAULT_FIELDS_REQUIRED.code);
    }
}
export async function GET() {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status, LOGIN_REQUIRED.msg, LOGIN_REQUIRED.code);
    const prisma = new PrismaClient();
    try {
        const vaults = await prisma.vault.findMany({
            select: {
                id: true,
                name: true,
                maxCredentials: true
            }
        });
        return NextResponse.json(vaults);
    } catch (error) {
        return err_route(VAULT_FAILED_TO_RETRIEVE.status,
            VAULT_FAILED_TO_RETRIEVE.msg,
            VAULT_FAILED_TO_RETRIEVE.code);
    } finally {
        await prisma.$disconnect();
    }
}
