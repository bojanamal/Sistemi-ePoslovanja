import * as Ajv from "ajv";
const ajv = Ajv();

interface IEditDvorana {
    name: string;
}
const IEditDvoranaSchemaValidator = ajv.compile({
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
export { IEditDvoranaSchemaValidator };
export { IEditDvorana };
