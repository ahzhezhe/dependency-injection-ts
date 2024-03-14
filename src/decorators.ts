import { Container } from './Container';
import { Class, MetadataKey, ParamInjections } from './internal-types';
import { InjectOptions, InjectableOptions, InjectableToken, InjectableValue, Require, Scope, Token } from './types';

/**
 * Register injectable values and/or tokens.
 */
export const Register = (tokens: [token: Token, injectable: InjectableValue<any, any> | InjectableToken<any, any>][]): ClassDecorator => () => {
  tokens.forEach(([token, injectable]) => Container.register(token as any, injectable as any));
};

/**
 * Register this class as injectable class.
 * Default scope is singleton.
 */
export const Injectable = (options?: InjectableOptions): ClassDecorator => target => {
  const cls: Class = target as any;
  const { scope = Scope.SINGLETON, token } = options ?? {};

  Container.register(cls, { class: cls, scope });

  if (token) {
    Container.register(token, { class: cls, scope });
  }
};

/**
 * Inject injectable to this parameter.
 * Default require exactly one injectable.
 */
export const Inject = (token: Token, options?: InjectOptions): ParameterDecorator => (target, _, paramIndex) => {
  const { require = Require.ONE, transformer } = options ?? {};
  const injections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) ?? new Map();
  injections.set(paramIndex, { token, require, transformer });
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};

const buildInject = (require: Require) => (token: Token, options?: Omit<InjectOptions, 'require'>) => Inject(token, { ...options, require });

/**
 * Inject exactly one injectable.
 */
export const InjectOne = buildInject(Require.ONE);

/**
 * Inject the first registered injectable.
 */
export const InjectAny = buildInject(Require.ANY);

/**
 * Inject exactly one injectable or `undefined` if no injectable is registered.
 */
export const InjectOneOrNone = buildInject(Require.ONE_OR_NONE);

/**
 * Inject the first registered injectable or `undefined` if no injectable is registered.
 */
export const InjectAnyOrNone = buildInject(Require.ANY_OR_NONE);

/**
 * Inject all injectables, requires at least one injectable.
 */
export const InjectAll = buildInject(Require.ALL);

/**
 * Inject all injectables, could be empty array if no injectable is registered.
 */
export const InjectAllOrNone = buildInject(Require.ALL_OR_NONE);
