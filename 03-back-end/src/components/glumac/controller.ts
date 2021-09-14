import * as express from "express";
import GlumacModel from "./model";
import { IAddGlumac, IAddGlumacSchemaValidator } from "./dto/IAddGlumac";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IEditGlumac, IEditGlumacSchemaValidator } from "./dto/IEditGlumac";
import BaseController from "../../common/BaseController";

class GlumacController extends BaseController {
    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        if (!IAddGlumacSchemaValidator(item)) {
            res.status(400).send(IAddGlumacSchemaValidator.errors);
            return;
        }
        const data: IAddGlumac = item;
        const newGlumac: GlumacModel|IErrorResponse = await this.services.GlumacService.add(data);
        res.send(newGlumac);
    }

    async editById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        const glumacId = Number(req.params.id);
        if (glumacId <= 0) {
            res.status(400).send(["The glumac ID must be a numerical value larger than 0."]);
            return;
        }
        if (!IEditGlumacSchemaValidator(item)) {
            res.status(400).send(IEditGlumacSchemaValidator.errors);
            return;
        }
        const data: IEditGlumac = item;
        const editedGlumac: GlumacModel|IErrorResponse = await this.services.glumacService.edit(glumacId, data);
        res.send(editedGlumac);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const glumacId = Number(req.params.id);
        if (glumacId <= 0) {
            res.status(400).send(["The glumac ID must be a numerical value larger than 0."]);
            return;
        }
        res.send(await this.services.GlumacService.delete(glumacId));
    }
}

export default GlumacController;
