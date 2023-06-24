import { Container } from './Container';
import { MetadataKey, ParamInjections } from './internal-types';
import { InjectableOptions, InjectableToken, InjectableValue, Scope, Token } from './types';

export const Register = (tokens: [token: Token, injectable: InjectableValue<any> | InjectableToken][]): ClassDecorator => () => {
  tokens.forEach(([token, injectable]) => Container.register(token as any, injectable as any));
};

export const Injectable = (options?: InjectableOptions): ClassDecorator => target => {
  Container.register(target as any, {
    class: target as any,
    scope: options?.scope || Scope.SINGLETON
  });
};

export const Inject = (token: Token): ParameterDecorator => (target, _, paramIndex) => {
  const injections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) || new Map();
  injections.set(paramIndex, { token, require: 'one' });
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};

export const InjectAll = (token: Token): ParameterDecorator => (target, _, paramIndex) => {
  const injections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) || new Map();
  injections.set(paramIndex, { token, require: 'all' });
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};
