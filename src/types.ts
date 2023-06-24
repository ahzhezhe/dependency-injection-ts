import { Class } from './internal-types';

export type Token = string | symbol | Class;

export enum Scope {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient'
}

export interface InjectableOptions {
  scope?: Scope;
}

export type RegistrationOptions<T> = RegisterWithToken | RegisterWithValue<T>;

export interface RegisterWithToken {
  token: Token;
}

export interface RegisterWithValue<T> {
  value: T;
}
