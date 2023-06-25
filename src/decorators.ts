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

const buildInject = (require: Require) => (token: Token) => Inject(token, require);

export const InjectOne = buildInject(Require.ONE);

export const InjectAny = buildInject(Require.ANY);

export const InjectOneOrNone = buildInject(Require.ONE_OR_NONE);

export const InjectAnyOrNone = buildInject(Require.ANY_OR_NONE);

export const InjectAll = buildInject(Require.ALL);

export const InjectAllOrNone = buildInject(Require.ALL_OR_NONE);
