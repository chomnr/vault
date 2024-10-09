
/* =======================================
   ENV
   ======================================= */

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export const VAULT_LIMIT = Number(process.env.VAULT_LIMIT)
export const VAULT_CREDENTIAL_LIMIT = Number(process.env.VAULT_CREDENTIAL_LIMIT)

export const COOKIE_SECRET = process.env.COOKIE_SECRET as string

export const MONGODB_URI = process.env.MONGODB_URI

export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL
export const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME
export const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSSWORD

export const HOST_URL = process.env.URL
export const NODE_ENV = process.env.NODE_ENV
export const PORT = process.env.PORT

/* =======================================
   COOKIE
   ======================================= */

export const COOKIE_NAME = "session"
export const COOKIE_MAX_AGE = (remember: boolean = false) => remember ? 24 * 24 * 60 * 60 : 24 * 60 * 60

/* =======================================
   CONSTRAINT
   ======================================= */

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 37

export const VAULT_NAME_MIN_LENGTH = 3
export const VAULT_NAME_MAX_LENGTH = 23

export const VAULT_ID_MIN_LENGTH = 36
export const CREDENTIAL_ID_MIN_LENGTH = 36
