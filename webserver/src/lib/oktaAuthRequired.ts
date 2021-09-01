import { oktaJwtVerifier } from './oktaJwtVerifier';

export const oktaAuthRequired = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];
  const audience = 'api://default';
  return (
    oktaJwtVerifier
      .verifyAccessToken(accessToken, audience)
      // eslint-disable-next-line promise/always-return
      .then((jwt: any) => {
        req.jwt = jwt;
        // eslint-disable-next-line promise/no-callback-in-promise
        next();
      })
      .catch((err: any) => {
        res.status(401).send(err.message);
      })
  );
};
