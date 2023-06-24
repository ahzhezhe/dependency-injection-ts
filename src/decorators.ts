import { Container } from './Container';
import { Injections, MetadataKey } from './internal-types';
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
  const injections: Injections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) || new Map();
  injections.set(paramIndex, token);
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};

export const InjectAll = (token: Token): ParameterDecorator => (target, _, paramIndex) => {
  const injections: Injections = Reflect.getOwnMetadata(MetadataKey.INJECT_ALL, target) || new Map();
  injections.set(paramIndex, token);
  Reflect.defineMetadata(MetadataKey.INJECT_ALL, injections, target);
};
