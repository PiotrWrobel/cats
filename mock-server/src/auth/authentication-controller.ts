import { Express, Request, Response } from 'express';

import { AuthenticationMock } from './authentication-mock';

export class AuthenticationController {
  public static initController(server: Express): void {
    this.loginUser(server);
    this.refreshToken(server);
    this.logoutUser(server);
  }

  private static loginUser(server: Express): void {
    server.post('/user/login', (_req: Request, res: Response): void => {
      res.send({ token: AuthenticationMock.prepareRandomJwt() });
    });
  }

  private static refreshToken(server: Express): void {
    server.get('/user/refresh-token', (_req: Request, res: Response): void => {
      res.send({ token: AuthenticationMock.prepareRandomJwt() });
    });
  }

  private static logoutUser(server: Express): void {
    server.post('/user/logout', (_req: Request, res: Response) => {
      res.send();
    });
  }
}
