import { VAULT_NAME_MIN_LENGTH, VAULT_NAME_MAX_LENGTH } from "@/config/general";
import { VAULT_BAD_NAME } from "@/config/response";
import { err_route } from "@/config/shorthand";
import { PrismaClient } from "@prisma/client/extension";

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
}