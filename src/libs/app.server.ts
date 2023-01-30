import Http from "http";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";
import cookieParser from "cookie-parser";
import express, {Express, Router} from "express";
import * as expressWinston from "express-winston";

class Server {

    private _server!: Http.Server;
    private readonly _app: Express;

    get app(): Express {
        return this._app;
    }

    // get server(): Http.Server {
    //     return this._server;
    // }

    constructor() {
        dotenv.config();

        this._app = express();
        this._app.set("PORT", process.env.SERVER_PORT || 3000);

        this.configureMiddlewares();
    }

    private onServerStarted() {
        console.debug(`> 🚀 Listening on port ${this._app.get('PORT')}\n---------------------------\n`);
    }

    public configureMiddlewares() {
        this._app.use(express.json());
        this._app.use(cookieParser());
        this._app.use(express.urlencoded({extended: true}));

        this._app.use(cors());

        const loggerOptions: expressWinston.LoggerOptions = {
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({all: true}),
                winston.format.printf(({level, message, timestamp}) => {
                    return `${timestamp} ${level}: ${message}`
                }),
            ),
        }

        if (process.env.APP_ENVIRONMENT === 'development') loggerOptions.meta = false;
        this._app.use(expressWinston.logger(loggerOptions));
    }

    public startServer() {
        console.debug("> 🔃 Server starting...")
        this._server = this._app.listen(this._app.get("PORT"), () => this.onServerStarted());
    }

}

const server = new Server();
const router = Router();
server.app.use(router);

export default server;
export {router as appRouter}