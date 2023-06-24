import { InjectableClass, InjectableToken, InjectableValue, Token } from './types';

export type Class = new(...args: any) => any;

export type Require = 'one' | 'all';

export type ParamInjections = Map<number, { token: Token; require: Require }>;

export type Injectable =
  { type: 'class'; injectable: InjectableClass<any> } |
  { type: 'value'; injectable: InjectableValue<any> } |
  { type: 'token'; injectable: InjectableToken }

export const MetadataKey = {
  PARAM_TYPES: 'design:paramtypes',
  TYPE: 'design:type',
  INJECT: Symbol('INJECT')
};
