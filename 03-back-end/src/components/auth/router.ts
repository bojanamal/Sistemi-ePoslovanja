import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResorces from "../../common/IApplicationResorces.interface";
import AuthController from './controller';

    export default class AuthRouter implements IRouter {
        public setupRoutes(application: express.Application, resources: IApplicationResorces) {
            const authController: AuthController = new AuthController(resources);
    
            application.post("/auth/administrator/login",   authController.administratorLogin.bind(authController));
        }
    }
