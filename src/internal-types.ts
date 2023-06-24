import { InjectableClass, InjectableToken, InjectableValue, Token } from './types';

export type Class = new(...args: any) => any;

export type Injections = Map<number, Token>;

export type Injectable =
  { type: 'class'; injectable: InjectableClass<any> } |
  { type: 'value'; injectable: InjectableValue<any> } |
  { type: 'token'; injectable: InjectableToken }

export const MetadataKey = {
  PARAM_TYPES: 'design:paramtypes',
  TYPE: 'design:type',
  INJECT: Symbol('INJECT'),
  INJECT_ALL: Symbol('INJECT_ALL')
};
