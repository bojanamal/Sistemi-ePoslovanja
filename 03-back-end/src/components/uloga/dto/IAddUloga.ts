import * as Ajv from "ajv";
const ajv = Ajv();

interface IAddUloga {
	role: string;
	glumacId: number;
	predstavaId: number;
}

const IAddUlogaSchemaValidator = ajv.compile({
    type: "object",
    properties: {
		role: {
            type: "string",
            minLength: 2,
            maxLength: 100,
        },
        glumacId: {
            type: "integer",
            minimum: 1,
        },
		predstavaId: {
            type: "integer",
            minimum: 1,
        },
    },
    required: [
        "role",
        "glumacId",
		"predstavaId",
    ],
    additionalProperties: false,
});

export { IAddUlogaSchemaValidator };
export { IAddUloga };
