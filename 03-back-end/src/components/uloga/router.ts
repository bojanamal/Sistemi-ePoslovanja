import * as express from "express";
import IRouter from "../../common/IRouter.interface";
import IApplicationResources from "../../common/IApplicationResources.interface";
import UlogaController from "./controller";
import AuthMiddleware from "../../middleware/auth.middleware";

export default class UlogaRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const ulogaController: UlogaController = new UlogaController(resources);
        application.get(
            "/api/category/:cid/uloga",
            AuthMiddleware.getVerifier("administrator"),
            ulogaController.getAllInCategory.bind(ulogaController),
        );
        application.post(
            "/api/uloga",
            AuthMiddleware.getVerifier("administrator"),
            ulogaController.add.bind(ulogaController),
        );
        application.put(
            "/api/uloga/:id",
            AuthMiddleware.getVerifier("administrator"),
            ulogaController.editById.bind(ulogaController),
        );
        application.delete(
            "/api/uloga/:id",
            AuthMiddleware.getVerifier("administrator"),
            ulogaController.deleteById.bind(ulogaController),
        );
    }
};
