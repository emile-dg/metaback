import {Container} from "typedi";
import {UserResources} from "./src/apps/users/users.resources";

import server from "./src/libs/app.server";
import {AuthResources} from "./src/apps/auth/auth.resources";
import EErrorCode from "./src/errors/codes";
import {connect as mongodbConnect} from "mongoose";
import AppDatabaseConnectionError from "./src/errors/database";


// registers the resources
Container.get(UserResources);
Container.get(AuthResources);

const databaseConnectionUri = process.env.DB_URI;
if (!databaseConnectionUri)
    throw new AppDatabaseConnectionError(EErrorCode.DATABASE_CONNECTION_ERROR, "Missing connection string!");

mongodbConnect(<string>databaseConnectionUri).then(() => {
    console.debug(`> 🔥 Database connected`);
    server.startServer();
});