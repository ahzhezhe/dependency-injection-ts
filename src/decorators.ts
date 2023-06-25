import { Container } from './Container';
import { MetadataKey, ParamInjections } from './internal-types';
import { InjectableOptions, InjectableToken, InjectableValue, Require, Scope, Token } from './types';

export const Register = (tokens: [token: Token, injectable: InjectableValue<any> | InjectableToken][]): ClassDecorator => () => {
  tokens.forEach(([token, injectable]) => Container.register(token as any, injectable as any));
};

export const Injectable = (options?: InjectableOptions): ClassDecorator => target => {
  Container.register(target as any, {
    class: target as any,
    scope: options?.scope || Scope.SINGLETON
  });
};

export const Inject = (token: Token, require = Require.ONE): ParameterDecorator => (target, _, paramIndex) => {
  const injections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) || new Map();
  injections.set(paramIndex, { token, require });
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};

export const InjectOne = (token: Token) => Inject(token, Require.ONE);

export const InjectAny = (token: Token) => Inject(token, Require.ANY);

export const InjectOneOrNone = (token: Token) => Inject(token, Require.ONE_OR_NONE);

export const InjectAnyOrNone = (token: Token) => Inject(token, Require.ANY_OR_NONE);

export const InjectAll = (token: Token) => Inject(token, Require.ALL);

export const InjectAllOrNone = (token: Token) => Inject(token, Require.ALL_OR_NONE);
