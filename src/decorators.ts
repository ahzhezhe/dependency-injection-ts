import { Container } from './Container';
import { Class, Injections, MetadataKey } from './internal-types';
import { InjectableOptions, RegistrationOptions, Token } from './types';

export const Register = (tokens: [token: Token, options: RegistrationOptions<any>][]): ClassDecorator => () => {
  tokens.forEach(([token, options]) => Container.register(token as any, options as any));
};

export const Injectable = (options?: InjectableOptions): ClassDecorator => target => {
  Container.register(target as any, options);
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

export const PropInject = (token?: Class): PropertyDecorator => (target, propertyKey) => {
  target[propertyKey] = Container.get(token || Reflect.getOwnMetadata(MetadataKey.TYPE, target, propertyKey));
};

export const PropInjectAll = (token: Class): PropertyDecorator => (target, propertyKey) => {
  target[propertyKey] = Container.getAll(token);
};
