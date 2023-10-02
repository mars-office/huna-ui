export interface UserClaims {
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  sub: string;
  at_hash: string;
  aud: string;
  nonce: string;
}
