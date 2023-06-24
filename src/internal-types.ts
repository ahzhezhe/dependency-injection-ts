import { InjectableOptions, RegisterWithToken, RegisterWithValue, Token } from './types';

export type Class = new(...args: any) => any;

export type TokenOptions = Partial<InjectableOptions & RegisterWithToken & RegisterWithValue<any>>;

export type Injections = Map<number, Token>;

export const MetadataKey = {
  PARAM_TYPES: 'design:paramtypes',
  TYPE: 'design:type',
  INJECT: Symbol('INJECT'),
  INJECT_ALL: Symbol('INJECT_ALL')
};
