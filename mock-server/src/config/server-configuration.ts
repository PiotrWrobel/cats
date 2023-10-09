import { Express } from 'express';

import { AuthenticationController } from '../auth/authentication-controller';

export class ServerConfiguration {
  public static withControllers(server: Express): void {
    AuthenticationController.initController(server);
  }
}
