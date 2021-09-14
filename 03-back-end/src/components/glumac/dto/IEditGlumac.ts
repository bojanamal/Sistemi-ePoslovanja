import * as Ajv from "ajv";

const ajv = Ajv();

interface IEditGlumac {
    name: string;
	surname: string;
	bio: string;
	image_path: string;
}

const IEditGlumacSchemaValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
		surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
		bio: {
            type: "string",
			minLength: 5,
			maxLength: 255,
        },
        image_path: {
            type: "string",
            minLength: 2,
			maxLength: 255,
        },
    },
    required: [
        "name",
		"surname",
		"bio",
		"image_path",
    ],
    additionalProperties: false,
});
export { IEditGlumacSchemaValidator };
export { IEditGlumac };
