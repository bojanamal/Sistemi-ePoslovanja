import * as express from "express";
import IRouter from "../../common/IRouter.interface";
import IApplicationResources from "../../common/IApplicationResources.interface";
import PredstavaController from "./controller";
import AuthMiddleware from "../../middleware/auth.middleware";

export default class PredstavaRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const predstavaController: PredstavaController = new PredstavaController(resources);
        application.get(
            "/api/aerodrom/:cid/predstava",
            AuthMiddleware.getVerifier("administrator"),
            predstavaController.getAllInAerodrom.bind(predstavaController),
        );
        application.post(
            "/api/predstava",
            AuthMiddleware.getVerifier("administrator"),
            predstavaController.add.bind(predstavaController),
        );
        application.put(
            "/api/predstava/:id",
            AuthMiddleware.getVerifier("administrator"),
            predstavaController.editById.bind(predstavaController),
        );
        application.delete(
            "/api/predstava/:id",
            AuthMiddleware.getVerifier("administrator"),
            predstavaController.deleteById.bind(predstavaController),
        );
    }
};
