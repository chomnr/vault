import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "./general"

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
    msg: "A valid session is required to access this resource",
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
    code: "CRED_BAD_USERNAME"
}