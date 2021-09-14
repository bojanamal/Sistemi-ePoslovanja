import {Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import Config from '../config/dev';
import ITokenData from '../components/auth/dto/ITokenData.interface';

type AdminRole = "admin";
export default class AuthMiddleware {
    public static verifyAuthToken(req:Request, res:Response, next:NextFunction ){
        if(Config.auth.allowRequestsEvenWithoutValidTokens){
            return next();
        }

        if(typeof req.headers.authorization !== "string"){
            return res.status(401).send("No auth token specified.");
        }

        const token: string = req.headers.authorization;
        const [tokenType, tokenString]  = token.trim().split(" ");

        if (tokenType !== "Bearer"){
            return res.send(400).send("Invalid auth token type");
        }

        if (typeof tokenString !== "string" || tokenString.length === 0 ){
            return res.send(400).send("Invalid auth token length");
        }

        let result;
        
        try{
            result =jwt.verify(tokenString, Config.auth.admin.auth.public)
            
        } catch(e){
            return res.status(500).send("Token validation problem:" + e?.message);
        }

        if (typeof result !== "object"){
            return res.status(400).send("Invalid auth token data");
        }

        const data: ITokenData = result as ITokenData;


        req.authorized = data;

        next();    
    }

    }
