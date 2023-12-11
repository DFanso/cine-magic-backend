import { ClsStore } from 'nestjs-cls';

export enum UserRoles {
  admin = 'ADMIN',
  customer = 'CUSTOMER',
  director = 'DIRECTOR',
}

export interface MinimalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AppClsStore extends ClsStore {
  'x-request-id': string;
  user: MinimalUser;
}

export interface MinimalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
