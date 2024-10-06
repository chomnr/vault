import { PrismaClient } from "@prisma/client/extension";

// create vualt...
export async function POST(request: Request) {
    const prisma = new PrismaClient()
    const data = await request.json()
    const env = process.env
    const { username, password, remember } = data
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