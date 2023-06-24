import 'reflect-metadata';
import { MultipleInjectableError, NotInjectableError } from './errors';
import { Class, Injections, MetadataKey, TokenOptions } from './internal-types';
import { InjectableOptions, RegisterWithToken, RegisterWithValue, Scope, Token } from './types';

export class Container {

  static readonly #injectables = new Map<Class, InjectableOptions>();
  static readonly #tokens = new Map<Token, TokenOptions[]>();
  static readonly #singletons = new Map<Class, any>();

  static register(token: Class, options?: InjectableOptions): void;
  static register(token: Token, options: RegisterWithToken): void;
  static register<T extends Class>(token: T, options: RegisterWithValue<InstanceType<T>>): void;
  static register<T>(token: string | symbol, options: RegisterWithValue<T>): void;
  static register(token: Token, options: Partial<InjectableOptions & TokenOptions> = {}) {
    if (options.token || typeof token === 'string' || typeof token === 'symbol' || options.value instanceof token) {
      const tokens = this.#tokens.get(token) || [];
      tokens.push(options as any);
      this.#tokens.set(token, tokens);
      return;
    }

    this.#injectables.set(token, options);
  }

  static get<T extends Class>(token: T): InstanceType<T>;
  static get<T>(token: string | symbol): T;
  static get(token: Token) {
    const options = this.#tokens.get(token);
    if (options) {
      if (options.length > 1) {
        throw new MultipleInjectableError(token);
      }
      if (options.length === 1) {
        const option = options[0];
        if (option.value) {
          return option.value;
        }
        return this.get(option.token as any);
      }
    }

    if (typeof token === 'string' || typeof token === 'symbol') {
      throw new NotInjectableError(token);
    }

    return this.#getInstance(token);
  }

  static getAll<T extends Class>(token: T): InstanceType<T>[];
  static getAll<T>(token: string | symbol): T[];
  static getAll(token: Token) {
    const options = this.#tokens.get(token);
    if (options) {
      return options.map(option => {
        if (option.value) {
          return option.value;
        }
        return this.getAll(option.token as any);
      }).flat();
    }

    if (typeof token === 'string' || typeof token === 'symbol') {
      throw new NotInjectableError(token);
    }

    return [this.#getInstance(token)];
  }

  static #getInstance(token: Class) {
    const options = this.#injectables.get(token);
    if (!options) {
      throw new NotInjectableError(token);
    }

    if (!options.scope || options.scope === Scope.SINGLETON) {
      return this.#getSingleton(token);
    }
    return this.#createInstance(token);
  }

  static #getSingleton<T extends Class>(token: T): InstanceType<T> {
    let instance = this.#singletons.get(token);
    if (!instance) {
      instance = this.#createInstance(token);
    }
    this.#singletons.set(token, instance);
    return instance;
  }

  static #createInstance<T extends Class>(cls: T): InstanceType<T> {
    const paramTypes: any[] = Reflect.getOwnMetadata(MetadataKey.PARAM_TYPES, cls) || [];
    const injections: Injections = Reflect.getOwnMetadata(MetadataKey.INJECT, cls) || new Map();
    const allInjections: Injections = Reflect.getOwnMetadata(MetadataKey.INJECT_ALL, cls) || new Map();

    const params = paramTypes.map((paramType, i) => {
      const injectToken = injections.get(i);
      const injectAllToken = allInjections.get(i);
      if (injectToken) {
        return this.get(injectToken as any);
      }
      if (injectAllToken) {
        return this.getAll(injectAllToken as any);
      }
      return this.get(paramType);
    });

    return new cls(...params);
  }

}
