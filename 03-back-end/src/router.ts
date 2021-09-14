import * as express from "express";
import IApplicationResorces from './common/IApplicationResorces.interface';
import IRouter from "./common/IRouter.interface";
export default class Router {
    static setupRoutes(application: express.Application, resources: IApplicationResorces, routers: IRouter[]){
        for(const router of routers){
            router.setupRoutes(application, resources);
        }

    }

}