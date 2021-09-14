import * as Ajv from "ajv";
const ajv = Ajv();

interface IAddPredstava {
    name: string;
	summary: string;
    image_path: string;
    duration: number;
	actors: string;
	dvorana_id: number;
}

const IAddPredstavaSchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 3,
            maxLength: 50,
        },
        summary: {
            type: "string",
            minLength: 5,
            maxLength: 255,
        },
        image_path: {
            type: "string",
            minLength: 5,
            maxLength: 255,
        },
		duration: {
            type: "integer",
            minimum: 1,
        },
		actors: {
            type: "string",
            minLength: 5,
            maxLength: 255,
        },
		dvorana_id: {
            type: "integer",
            minimum: 1,
        },
    },
    required: [
        "name",
        "summary",
		"image_path",
		"duration",
		"actors",
		"dvorana_id",
    ],
    additionalProperties: false,
}
const IAddPredstavaSchemaValidator = ajv.compile(IAddPredstavaSchema);

export { IAddPredstavaSchema };
export { IAddPredstavaSchemaValidator };
export { IAddPredstava };
