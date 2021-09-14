import * as express from "express";
import IRouter from "../../common/IRouter.interface";
import IApplicationResources from "../../common/IApplicationResources.interface";
import DvoranaController from "./controller";
import AuthMiddleware from "../../middleware/auth.middleware";

export default class DvoranaRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {

        const dvoranaController: DvoranaController = new DvoranaController(resources);
        application.get(
            "/api/category/:cid/dvorana",
            AuthMiddleware.getVerifier("administrator"),
            dvoranaController.getAllInCategory.bind(dvoranaController),
        );
        application.post(
            "/api/dvorana",
            AuthMiddleware.getVerifier("administrator"),
            dvoranaController.add.bind(dvoranaController),
        );
        application.put(
            "/api/dvorana/:id",
            AuthMiddleware.getVerifier("administrator"),
            dvoranaController.editById.bind(dvoranaController),
        );
        application.delete(
            "/api/dvorana/:id",
            AuthMiddleware.getVerifier("administrator"),
            dvoranaController.deleteById.bind(dvoranaController),
        );
    }
};
