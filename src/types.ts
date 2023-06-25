import { Class } from './internal-types';

export type Token = string | symbol | Class;

export enum Scope {
  /**
   * Class will only be instantiated once and resued throughout the container.
   */
  SINGLETON = 'singleton',
  /**
   * Class will be instantiated everytime it is retrieved/injected from container.
   */
  TRANSIENT = 'transient'
}

export enum Require {
  /**
   * Require exactly one injectable in the container, no injectable or more than one injectable will result in error.
   */
  ONE = 'one',
  /**
   * Require exactly one injectable in the container, no injectable will result in `undefined`, more than one injectable will result in error.
   */
  ONE_OR_NONE = 'one_or_none',
  /**
   * Require the first registered injectable in the container, no injectable will result in error.
   */
  ANY = 'any',
  /**
   * Require the first registered injectable in the container, no injectable will result in `undefined`.
   */
  ANY_OR_NONE = 'any_or_none',
  /**
   * Require all and at least one injectable, no injectable will result in error.
   */
  ALL = 'all',
  /**
   * Require all injectables, no injectable will result in empty array.
   */
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
