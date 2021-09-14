import * as express from "express";
import UlogaModel from "./model";
import { IAddUloga, IAddUlogaSchemaValidator } from "./dto/IAddUloga";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IEditUloga, IEditUlogaSchemaValidator } from "./dto/IEditUloga";
import BaseController from "../../common/BaseController";

class UlogaController extends BaseController {
    async getAllInPredstava(req: express.Request, res: express.Response, next: express.NextFunction) {
        const predstavaId: number = +req.params?.cid;
        res.send(await this.services.ulogaService.getAllByParentPredstavaId(predstavaId));
    }
    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item = req.body;
        if (!IAddUlogaSchemaValidator(item)) {
            res.status(400).send(IAddUlogaSchemaValidator.errors);
            return;
        }
        const data: IAddUloga = item;
        const newUloga: UlogaModel|IErrorResponse = await this.services.ulogaService.add(data);
        res.send(newUloga);
    }

    async editById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const item       = req.body;
        const ulogaId = Number(req.params.id);
        if (ulogaId <= 0) {
            res.status(400).send(["The uloga ID must be a numerical value larger than 0."]);
            return;
        }
        if (!IEditUlogaSchemaValidator(item)) {
            res.status(400).send(IEditUlogaSchemaValidator.errors);
            return;
        }
        const data: IEditUloga = item;
        const editedUloga: UlogaModel|IErrorResponse = await this.services.ulogaService.edit(ulogaId, data);
        res.send(editedUloga);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const ulogaId = Number(req.params.id);
        if (ulogaId <= 0) {
            res.status(400).send(["The uloga ID must be a numerical value larger than 0."]);
            return;
        }
        res.send(await this.services.ulogaService.delete(ulogaId));
    }
}
export default UlogaController;
