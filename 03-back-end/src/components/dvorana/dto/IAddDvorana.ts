import * as Ajv from "ajv";
const ajv = Ajv();

interface IAddDvorana {
    name: string;
}


const IAddDvoranaSchemaValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1,
            maxLength: 50,
        },
    },
    required: [
        "name",
    ],
    additionalProperties: false,
});

export { IAddDvoranaSchemaValidator };
export { IAddDvorana };
