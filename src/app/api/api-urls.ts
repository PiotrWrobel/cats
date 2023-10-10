export class ApiUrls {
  private static readonly USER_PREFIX: string = '/user';

  public static readonly catInformationUrl: string = 'https://meowfacts.herokuapp.com/';
  public static readonly userLoginUrl: string = `${this.USER_PREFIX}/login`;
  public static readonly userLogoutUrl: string = `${ApiUrls.USER_PREFIX}/logout`;
  public static readonly refreshTokenUrl: string = `${ApiUrls.USER_PREFIX}/refresh-token`;
}
