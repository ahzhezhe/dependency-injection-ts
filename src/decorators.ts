import { Container } from './Container';
import { MetadataKey, ParamInjections } from './internal-types';
import { InjectableOptions, InjectableToken, InjectableValue, Require, Scope, Token } from './types';

/**
 * Register injectable values and/or tokens.
 *
 * @param tokens tokens
 */
export const Register = (tokens: [token: Token, injectable: InjectableValue<any> | InjectableToken][]): ClassDecorator => () => {
  tokens.forEach(([token, injectable]) => Container.register(token as any, injectable as any));
};

/**
 * Register this class as injectable class.
 *
 * @param options options, default scope is singleton
 */
export const Injectable = (options?: InjectableOptions): ClassDecorator => target => {
  Container.register(target as any, {
    class: target as any,
    scope: options?.scope || Scope.SINGLETON
  });
};

/**
 * Inject injectable to this parameter.
 *
 * @param token token
 * @param require requirement, default behaviour is to inject exactly one injectable
 */
export const Inject = (token: Token, require = Require.ONE): ParameterDecorator => (target, _, paramIndex) => {
  const injections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) || new Map();
  injections.set(paramIndex, { token, require });
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};

const buildInject = (require: Require) => (token: Token) => Inject(token, require);

/**
 * Inject exactly one injectable.
 *
 * @param token token
 */
export const InjectOne = buildInject(Require.ONE);

/**
 * Inject the first registered injectable.
 *
 * @param token token
 */
export const InjectAny = buildInject(Require.ANY);

/**
 * Inject exactly one injectable or `undefined` if no injectable is registered.
 *
 * @param token token
 */
export const InjectOneOrNone = buildInject(Require.ONE_OR_NONE);

/**
 * Inject the first registered injectable or `undefined` if no injectable is registered.
 *
 * @param token token
 */
export const InjectAnyOrNone = buildInject(Require.ANY_OR_NONE);

/**
 * Inject all injectables, requires at least one injectable.
 *
 * @param token token
 */
export const InjectAll = buildInject(Require.ALL);

/**
 * Inject all injectables, could be empty array if no injectable is registered.
 *
 * @param token token
 */
export const InjectAllOrNone = buildInject(Require.ALL_OR_NONE);
