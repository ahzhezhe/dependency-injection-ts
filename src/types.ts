import { Class } from './internal-types';

export type Token = string | symbol | Class;

export enum Scope {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient'
}

export interface InjectableOptions {
  scope?: Scope;
}

export interface InjectableClass<T extends Class> {
  class: T;
  scope: Scope;
}

export interface InjectableValue<T> {
  value: T;
}

export interface InjectableToken {
  token: Token;
}
