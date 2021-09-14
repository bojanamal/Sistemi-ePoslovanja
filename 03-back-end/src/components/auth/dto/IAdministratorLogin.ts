import * as Ajv from "ajv";
const ajv = Ajv();

interface IAdministratorLogin {
    username: string;
    password: string;
}

const IAdministratorLoginSchemaValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        },
        password: {
            type: "string",
            minLength: 7,
            maxLength: 128
        },
    },
    required: [
        "username",
        "password",
    ],
    additionalProperties: false,
});

export { IAdministratorLoginSchemaValidator };
export { IAdministratorLogin };
