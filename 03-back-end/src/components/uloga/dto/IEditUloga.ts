import * as Ajv from "ajv";
const ajv = Ajv();

interface IEditUloga {
	role: string;
}

const IEditUlogaSchemaValidator = ajv.compile({
    type: "object",
    properties: {
        role: {
            type: "string",
            minLength: 2,
            maxLength: 100,
        },
    },
    required: [
        "role",
    ],
    additionalProperties: false,
});
export { IEditUlogaSchemaValidator };
export { IEditUloga };
