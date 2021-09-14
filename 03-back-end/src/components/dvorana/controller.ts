import * as express from "express";
import DvoranaModel from "./model";
import { IAddDvorana, IAddDvoranaSchemaValidator } from "./dto/IAddDvorana";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IEditDvorana, IEditDvoranaSchemaValidator } from "./dto/IEditDvorana";
import BaseController from "../../common/BaseController";

class DvoranaController extends BaseController {
    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        if (!IAddDvoranaSchemaValidator(item)) {
            res.status(400).send(IAddDvoranaSchemaValidator.errors);
            return;
        }
        const data: IAddDvorana = item;
        const newDvorana: DvoranaModel|IErrorResponse = await this.services.DvoranaService.add(data);
        res.send(newDvorana);
    }

    async editById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        const dvoranaId = Number(req.params.id);
        if (dvoranaId <= 0) {
            res.status(400).send(["The dvorana ID must be a numerical value larger than 0."]);
            return;
        }
        if (!IEditDvoranaSchemaValidator(item)) {
            res.status(400).send(IEditDvoranaSchemaValidator.errors);
            return;
        }
        const data: IEditDvorana = item;
        const editedDvorana: DvoranaModel|IErrorResponse = await this.services.dvoranaService.edit(dvoranaId, data);
        res.send(editedDvorana);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const dvoranaId = Number(req.params.id);
        if (dvoranaId <= 0) {
            res.status(400).send(["The dvorana ID must be a numerical value larger than 0."]);
            return;
        }
        res.send(await this.services.DvoranaService.delete(dvoranaId));
    }
}
export default DvoranaController;
