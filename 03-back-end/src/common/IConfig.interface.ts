import { Algorithm } from "jsonwebtoken";

interface AuthTokenOptions {
    authToken: {
        publicKey: string,
        privateKey: string,
        duration: number,
    },
    refreshToken: {
        publicKey: string,
        privateKey: string,
        duration: number,
    },
    issuer: string,
    algorithm: Algorithm,
};

export default interface IConfig {
    server: {
        port: number,
        static: {
            path: string,
            route: string,
            cacheControl: boolean,
            dotfiles: string,
            etag: boolean,
            maxAge: number,
            index: boolean,
        },
    },
    logger: {
        path: string,
    },
    database: {
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        charset: string,
        timezone: string,
    },
    fileUploadOptions: {
        maxFiles: number,
        maxSize: number,
        tempDirectory: string,
        timeout: number,
        uploadDestinationDirectory: string,
        photos: {
            limits: {
                minWidth: number,
                maxWidth: number,
                minHeight: number,
                maxHeight: number,
            },
            resizings: {
                sufix: string,
                width: number,
                height: number,
                fit: "cover"|"contain",
            }[],
        },
    },
    auth: {
        user: AuthTokenOptions,
        administrator: AuthTokenOptions,
        allowRequestsEvenWithoutValidTokens: boolean;
    },
}
