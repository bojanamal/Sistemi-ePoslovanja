import * as express from "express";
import IRouter from "../../common/IRouter.interface";
import IApplicationResources from "../../common/IApplicationResources.interface";
import GlumacController from "./controller";
import AuthMiddleware from "../../middleware/auth.middleware";

export default class GlumacRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {

        const glumacController: GlumacController = new GlumacController(resources);
        application.get(
            "/api/category/:cid/glumac",
            AuthMiddleware.getVerifier("administrator"),
            glumacController.getAllInCategory.bind(glumacController),
        );
        application.post(
            "/api/glumac",
            AuthMiddleware.getVerifier("administrator"),
            glumacController.add.bind(glumacController),
        );
        application.put(
            "/api/glumac/:id",
            AuthMiddleware.getVerifier("administrator"),
            glumacController.editById.bind(glumacController),
        );
        application.delete(
            "/api/glumac/:id",
            AuthMiddleware.getVerifier("administrator"),
            glumacController.deleteById.bind(glumacController),
        );
    }
};
