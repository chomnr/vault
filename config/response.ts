import { CREDENTIAL_ID_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, VAULT_CREDENTIAL_LIMIT, VAULT_ID_MIN_LENGTH, VAULT_LIMIT, VAULT_NAME_MAX_LENGTH, VAULT_NAME_MIN_LENGTH } from "./general"

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
    msg: "Failed to retrieve vault. Please try again later.",
    code: "ERR_FAILED_TO_RETRIEVE_VAULTS"
}

export const VAULT_LIMIT_EXCEEDED: ResponseError = {
    status: 403,
    msg: `Cannot create vault: The limit of ${VAULT_LIMIT} vaults has been exceeded.`,
    code: "ERR_VAULT_LIMIT_EXCEEDED"
}

export const VAULT_LINKING_ERROR: ResponseError = {
    status: 500,
    msg: "An unknown error has occurred while linking the vault to the current session.",
    code: "ERR_VAULT_LINKING_FAILED"
}

export const VAULT_NOT_FOUND: ResponseError = {
    status: 404,
    msg: "Vault not found: The requested vault does not exist.",
    code: "ERR_VAULT_NOT_FOUND"
}

export const VAULT_ID_INVALID_LENGTH: ResponseError = {
    status: 400,
    msg: `Invalid vault ID: The ID must be exactly ${VAULT_ID_MIN_LENGTH} characters long.`,
    code: "ERR_VAULT_ID_INVALID_LENGTH"
}

export const VAULT_NOT_SELECTED_OR_DECRYPTED: ResponseError = {
    status: 400,
    msg: "You must have a vault selected and not decrypted to obtain information about it through this api. Use api/vaults/info instead.",
    code: "ERR_VAULT_NOT_SELECTED_OR_DECRYPTED"
}

export const VAULT_KEY_NOT_FOUND: ResponseError = {
    status: 404,
    msg: "The decryption key for the selected vault was not found. Please ensure you have the correct key uploaded.",
    code: "ERR_VAULT_KEY_NOT_FOUND"
};

export const VAULT_DECRYPTION_FAILED: ResponseError = {
    status: 500,
    msg: "Decryption of the selected vault has failed. Please check the key and try again.",
    code: "ERR_VAULT_DECRYPTION_FAILED"
};

export const VAULT_NOT_SELECTED: ResponseError = {
    status: 400,
    msg: "No vault has been selected. Please select a vault before proceeding.",
    code: "ERR_VAULT_NOT_SELECTED"
};

export const VAULT_ENCRYPTION_FAILED: ResponseError = {
    status: 500,
    msg: "Encryption of the vault has failed. Please check your input and try again.",
    code: "ERR_VAULT_ENCRYPTION_FAILED"
};

export const VAULT_DECRYPTION_EMPTY_KEY: ResponseError = {
    status: 400,
    msg: "Decryption failed: The provided key is empty. Please provide a valid AES 256 encryption key and try again.",
    code: "ERR_VAULT_DECRYPTION_EMPTY_KEY"
};

export const VAULT_NOT_SELECTED_OR_NOT_DECRYPTED: ResponseError = {
    status: 400,
    msg: "You must have a vault selected and decrypted to obtain information through this API. Use api/vaults/selected to retrieve information.",
    code: "ERR_VAULT_NOT_SELECTED_OR_NOT_DECRYPTED"
};

export const VAULT_NAME_INVALID: ResponseError = {
    status: 400,
    msg: "The vault name you entered is invalid. Please check the spelling and try again. Ensure that the vault exists and that you have access to it.",
    code: "ERR_VAULT_NAME_INVALID"
};

export const VAULT_NOT_DECRYPTED: ResponseError = {
    status: 403,
    msg: "The vault must be decrypted to proceed. Please decrypt the vault and try again.",
    code: "ERR_VAULT_NOT_DECRYPTED"
};

export const VAULT_CAPACITY_REACHED: ResponseError = {
    status: 400,
    msg: "Vault capacity reached: You cannot add more credentials as the maximum capacity has been reached.",
    code: "ERR_VAULT_CAPACITY_REACHED"
};

/* =======================================
   CREDENTIAL ERROR
   ======================================= */
export const CREDENTIAL_TYPE_EMPTY: ResponseError = {
    status: 400,
    msg: "The credential type cannot be empty. Please provide a valid type.",
    code: "ERR_CREDENTIAL_TYPE_EMPTY"
};

export const CREDENTIAL_NAME_EMPTY: ResponseError = {
    status: 400,
    msg: "The credential name cannot be empty. Please provide a valid name.",
    code: "ERR_CREDENTIAL_NAME_EMPTY"
};

export const CREDENTIAL_DATA_EMPTY: ResponseError = {
    status: 400,
    msg: "The credential data cannot be empty. Please provide valid JSON data.",
    code: "ERR_CREDENTIAL_DATA_EMPTY"
};

export const CREDENTIAL_DATA_PARSE_ERROR: ResponseError = {
    status: 400,
    msg: "The credential data could not be parsed. Please ensure it is valid JSON format.",
    code: "ERR_CREDENTIAL_DATA_PARSE_ERROR"
};

export const CREDENTIAL_ID_INVALID_LENGTH: ResponseError = {
    status: 400,
    msg: `Invalid credential ID: The ID must be exactly ${CREDENTIAL_ID_MIN_LENGTH} characters long.`,
    code: "CREDENTIAL_ID_INVALID_LENGTH"
}

export const CREDENTIAL_NOT_SELECTED: ResponseError = {
    status: 400,
    msg: "No credential selected: Please select a credential to proceed.",
    code: "CREDENTIAL_NOT_SELECTED"
}

export const CREDENTIAL_NOT_FOUND: ResponseError = {
    status: 404,
    msg: "Credential not found: The requested credential does not exist.",
    code: "CREDENTIAL_NOT_FOUND"
}

export const INVALID_CREDENTIAL_ACTION: ResponseError = {
    status: 400,
    msg: "Invalid credential action: The action requested cannot be performed on this credential.",
    code: "INVALID_CREDENTIAL_ACTION"
}



/* =======================================
   UNIVERSAL ERROR
   ======================================= */
export const INVALID_DELETION_CONFIRMATION: ResponseError = {
    status: 400,
    msg: "Invalid deletion confirmation: The name provided does not match the required confirmation.",
    code: "INVALID_DELETION_CONFIRMATION"
}