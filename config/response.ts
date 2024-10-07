import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, VAULT_CREDENTIAL_LIMIT, VAULT_LIMIT, VAULT_NAME_MAX_LENGTH, VAULT_NAME_MIN_LENGTH } from "./general"

interface ResponseError {
    status: number,
    msg: string,
    code: string
}

/* =======================================
   LOGIN ERROR
   ======================================= */

export const LOGIN_REQUIRED: ResponseError = {
    status: 400,
    msg: "A valid login session is required to access this resource",
    code: "ERR_MISSING_LOGIN_SESSION"
}

export const LOGIN_CRED_REQUIRED: ResponseError = {
    status: 400,
    msg: "Username and password are required",
    code: "ERR_MISSING_CREDENTIALS"
}

export const LOGIN_CRED_INCORRECT: ResponseError = {
    status: 401,
    msg: "The account either does not exist or the password is incorrect",
    code: "ERR_INCORRECT_CREDENTIALS"
}

export const LOGIN_BAD_USERNAME: ResponseError = {
    status: 400,
    msg: `The username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long`,
    code: "ERR_CRED_BAD_USERNAME"
}

export const LOGIN_EXPIRED: ResponseError = {
    status: 401,
    msg: `The session has expired, please log in again`,
    code: "ERR_LOGIN_SESSION_EXPIRED"
}

/* =======================================
   VAULT ERROR
   ======================================= */
   
export const VAULT_BAD_NAME: ResponseError = {
    status: 400,
    msg: `The vault name must be between ${VAULT_NAME_MIN_LENGTH} and ${VAULT_NAME_MAX_LENGTH} characters long`,
    code: "ERR_VAULT_BAD_NAME"
}

export const VAULT_MAX_CREDENTIALS_NOT_INTEGER: ResponseError = {
    status: 400,
    msg: `The max credentials value must be an integer`,
    code: "ERR_VAULT_MAX_CREDENTIALS_NOT_INTEGER"
}

export const VAULT_CREDENTIALS_EXCEEDED: ResponseError = {
    status: 400,
    msg: `The number of credentials exceeds the maximum allowed for this vault ${VAULT_CREDENTIAL_LIMIT}`,
    code: "ERR_VAULT_CREDENTIALS_EXCEEDED"
}

export const VAULT_CREDENTIALS_INVALID: ResponseError = {
    status: 400,
    msg: `The number of credentials must be greater than zero`,
    code: "ERR_VAULT_CREDENTIALS_INVALID"
}

export const VAULT_FIELDS_REQUIRED: ResponseError = {
    status: 400,
    msg: "Vault name and maxCredentials fields are required",
    code: "ERR_MISSING_VAULT_FIELDS"
}

export const VAULT_INVALID_AES_KEY: ResponseError = {
    status: 400,
    msg: "The provided AES key that was uploaded is not valid",
    code: "ERR_INVALID_AES_KEY"
}

export const VAULT_INVALID_AES_KEY_LENGTH: ResponseError = {
    status: 400,
    msg: "The length of the provided AES key is invalid. It must be 256 bits (32 bytes).",
    code: "ERR_INVALID_AES_KEY_LENGTH"
}

export const VAULT_FAILED_TO_RETRIEVE: ResponseError = {
    status: 500,
    msg: "Failed to retrieve vaults. Please try again later.",
    code: "ERR_FAILED_TO_RETRIEVE_VAULTS"
}

export const VAULT_LIMIT_EXCEEDED: ResponseError = {
    status: 403, // or another appropriate status code
    msg: `Cannot create vault: The limit of ${VAULT_LIMIT} vaults has been exceeded.`,
    code: "ERR_VAULT_LIMIT_EXCEEDED"
}