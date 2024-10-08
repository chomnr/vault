import { LOGIN_REQUIRED, VAULT_DECRYPTION_EMPTY_KEY, VAULT_LINKING_ERROR, VAULT_NOT_FOUND, VAULT_NOT_SELECTED_OR_DECRYPTED, VAULT_NOT_SELECTED_OR_NOT_DECRYPTED } from "@/config/response";
import { SessionData, SESSION_OPTIONS } from "@/config/session";
import { err_route } from "@/config/shorthand";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// returns results when it is decrypted.
export async function POST(request: Request, response: Response) {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    if (Object.keys(session).length === 0)
        return err_route(LOGIN_REQUIRED.status,
            LOGIN_REQUIRED.msg,
            LOGIN_REQUIRED.code)
    try {
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
        return NextResponse.json({
            id: session.vault.id,
            name: session.vault.name,
            key: session.vault.key
        });
    } catch (er) {
        console.log(er)
        return err_route(VAULT_NOT_FOUND.status,
            VAULT_NOT_FOUND.msg,
            VAULT_NOT_FOUND.code)
    }
}