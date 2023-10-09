import cors from 'cors';
import express, { Express } from 'express';

import { ServerConfiguration } from './config/server-configuration';

const server: Express = express();
server.use(cors());
ServerConfiguration.withControllers(server);

const port: number = 3000;
server.listen(port, (): void => {
  console.log(`Authentication Mock Server app listening on port ${port}`);
});
