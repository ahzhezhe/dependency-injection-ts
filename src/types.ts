import { Class } from './internal-types';

export type Token = string | symbol | Class;

export enum Scope {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient'
}

export enum Require {
  ONE = 'one',
  ONE_OR_NONE = 'one_or_none',
  ANY = 'any',
  ANY_OR_NONE = 'any_or_none',
  ALL = 'all',
  ALL_OR_NONE = 'all_or_none'
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
