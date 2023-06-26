import { InjectableClass, InjectableToken, InjectableValue, Require, Token, Transformer } from './types';

export type Class = new(...args: any) => any;

export type ParamInjections = Map<number, {
  token: Token;
  require: Require;
  transformer?: Transformer<any, any>;
}>;

export type Injectable =
  { type: 'class'; injectable: InjectableClass<any, any> } |
  { type: 'value'; injectable: InjectableValue<any, any> } |
  { type: 'token'; injectable: InjectableToken<any, any> }

export const MetadataKey = {
  PARAM_TYPES: 'design:paramtypes',
  TYPE: 'design:type',
  INJECT: Symbol('INJECT')
};
