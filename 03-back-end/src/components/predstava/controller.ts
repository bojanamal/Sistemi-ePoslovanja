import * as express from "express";
import PredstavaModel from "./model";
import { IAddPredstava, IAddPredstavaSchemaValidator } from "./dto/IAddPredstava";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IEditPredstava, IEditPredstavaSchemaValidator } from "./dto/IEditPredstava";
import BaseController from "../../common/BaseController";

class PredstavaController extends BaseController {
    async getAllInDvorana(req: express.Request, res: express.Response, next: express.NextFunction) {
        const dvoranaId: number = +req.params?.cid;
        res.send(await this.services.predstavaService.getAllByParentDvoranaId(dvoranaId));
    }

    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        if (!IAddPredstavaSchemaValidator(item)) {
            res.status(400).send(IAddPredstavaSchemaValidator.errors);
            return;
        }
        const data: IAddPredstava = item;
        const newPredstava: PredstavaModel|IErrorResponse = await this.services.predstavaService.add(data);
        res.send(newPredstava);
    }

    async editById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        const predstavaId = Number(req.params.id);
        if (predstavaId <= 0) {
            res.status(400).send(["The predstava ID must be a numerical value larger than 0."]);
            return;
        }
        if (!IEditPredstavaSchemaValidator(item)) {
            res.status(400).send(IEditPredstavaSchemaValidator.errors);
            return;
        }
        const data: IEditPredstava = item;
        const editedPredstava: PredstavaModel|IErrorResponse = await this.services.predstavaService.edit(predstavaId, data);
        res.send(editedPredstava);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const predstavaId = Number(req.params.id);
        if (predstavaId <= 0) {
            res.status(400).send(["The predstava ID must be a numerical value larger than 0."]);
            return;
        }
        res.send(await this.services.predstavaService.delete(predstavaId));
    }
}
export default PredstavaController;
