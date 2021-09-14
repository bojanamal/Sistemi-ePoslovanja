import * as express from "express";
import * as cors from "cors";
import * as fs from "fs";
import * as morgan from "morgan";
import * as path from "path";
import * as mysql2 from "mysql2/promise";
import Config from "./config/dev"
import IApplicationResources from "./common/IApplicationResources.interface";
import Router from "./router";
import AuthRouter from "./components/auth/router";
import AdministratorService from "./components/administrator/service";
import AdministratorRouter from "./components/administrator/router";
import DvoranaService from "./components/dvorana/service";
import DvoranaRouter from "./components/dvorana/router";
import GlumacService from "./components/glumac/service";
import GlumacRouter from "./components/glumac/router";
import PredstavaService from "./components/predstava/service";
import PredstavaRouter from "./components/predstava/router";
import UlogaService from "./components/uloga/service";
import UlogaRouter from "./components/uloga/router";

async function main() {
		const application: express.Application = express();

		fs.mkdirSync(path.dirname(Config.logger.path),{
			mode: 0o755,
			recursive: true
		});

		application.use(morgan(":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms", {
			stream: fs.createWriteStream(Config.logger.path),
		}));

		application.use(

			Config.server.static.route,
			express.static(
				Config.server.static.path,
				{
					cacheControl: Config.server.static.cacheControl,
					dotfiles:     Config.server.static.dotfiles,
					etag:         Config.server.static.etag,
					maxAge:       Config.server.static.maxAge,
					index:        Config.server.static.index,
				},
			),

		);

		application.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
		}));
		application.use(express.json());

		const resources: IApplicationResources = {
		databaseConnection: await mysql2.createConnection({
			host: Config.database.host,
			port: Config.database.port,
			user: Config.database.user,
			password: Config.database.password,
			database: Config.database.database,
			charset: Config.database.charset,
			timezone: Config.database.timezone,
			supportBigNumbers: true,
    }),
}
		resources.databaseConnection.connect();
		
		const databaseConnectionMonitor = () => {
        resources.databaseConnection.on('error', async error => {
            if (!error.fatal) return;
            if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw error;
            console.log("Reconnecting to the database...");
            resources.databaseConnection = await mysql2.createConnection({
                host: Config.database.host,
                port: Config.database.port,
                user: Config.database.user,
                password: Config.database.password,
                database: Config.database.database,
                charset: Config.database.charset,
                timezone: Config.database.timezone,
                supportBigNumbers: true,
            });
            resources.databaseConnection.connect();
            await new Promise(resolve => setTimeout(resolve, 3000));
            databaseConnectionMonitor();
        });
    };
	
		resources.services = {
			administratorService: new AdministratorService(resources),
			dvoranaService: new DvoranaService(resources),
			glumacService:  new GlumacService(resources),
			predstavaService:  new PredstavaService(resources),
			ulogaService:  new UlogaService(resources),
    };
		application.use((req, res) =>{
			res.sendStatus(404);
		});
		
		application.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });
	
		Router.setupRoutes(application, resources, [
		    new AdministratorRouter(),
			new DvoranaRouter(),
			new GlumacRouter(),
			new PredstavaRouter(),
			new UlogaRouter(),
			new AuthRouter()
    ]);
	
		application.listen(Config.server.port);
}

main();