import 'reflect-metadata';
import { MultipleInjectableError, NotInjectableError } from './errors';
import { Class, Injectable, MetadataKey, ParamInjections } from './internal-types';
import { InjectableClass, InjectableToken, InjectableValue, Require, Scope, Token } from './types';

export class Container {

  static #injectables = new Map<Token, Injectable[]>();
  static #singletons = new Map<Class, any>();

  /**
   * Register injectable class.
   * If injectable class is omitted, the token class will be treated as injectable.
   * Default scope is singleton.
   */
  static register<T extends Class, U = InstanceType<T>>(token: T, injectable?: Partial<InjectableClass<T, U>>): void;
  /**
   * Register injectable class.
   * Default scope is singleton.
   */
  static register<T extends Class, U = InstanceType<T>>(token: Token, injectable: Omit<InjectableClass<T, U>, 'scope'> & { scope?: Scope }): void;
  /**
   * Register injectable value.
   */
  static register<T, U = T>(token: Token, injectable: InjectableValue<T, U>): void;
  /**
   * Register injectable token.
   */
  static register<T, U = T>(token: Token, injectable: InjectableToken<T, U>): void;
  static register(token: Token, injectable?: Partial<InjectableClass<any, any> & InjectableValue<any, any> & InjectableToken<any, any>>) {
    const tokens = this.#injectables.get(token) || [];
    tokens.push(this.#toInjectable(token, injectable));
    this.#injectables.set(token, tokens);
  }

  /**
   * Get one injectable.
   */
  static get<T extends Class, U = InstanceType<T>>(token: T, require?: Require.ONE | Require.ANY): U;
  /**
   * Get one injectable.
   */
  static get<T, U = T>(token: string | symbol, require?: Require.ONE | Require.ANY): U;
  /**
   * Get one injectable or `undefined` if injectable is registered.
   */
  static get<T extends Class, U = InstanceType<T> | undefined>(token: T, require: Require.ONE_OR_NONE | Require.ANY_OR_NONE): U;
  /**
   * Get one injectable or `undefined` if injectable is registered.
   */
  static get<T, U = T | undefined>(token: string | symbol, require: Require.ONE_OR_NONE | Require.ANY_OR_NONE): U;
  /**
   * Get all injectables.
   */
  static get<T extends Class, U = InstanceType<T>[]>(token: T, require: Require.ALL | Require.ALL_OR_NONE): U;
  /**
   * Get all injectables.
   */
  static get<T, U = T[]>(token: string | symbol, require: Require.ALL | Require.ALL_OR_NONE): U;
  static get(token: Token, require = Require.ONE) {
    const injectables = this.#injectables.get(token);

    switch (require) {
      case Require.ONE:
        if (!injectables?.length) {
          throw new NotInjectableError(token);
        }
        if (injectables.length > 1) {
          throw new MultipleInjectableError(token);
        }
        return this.#resolve(injectables[0], require);

      case Require.ONE_OR_NONE:
        if (!injectables?.length) {
          return undefined;
        }
        if (injectables.length > 1) {
          throw new MultipleInjectableError(token);
        }
        return this.#resolve(injectables[0], require);

      case Require.ANY:
        if (!injectables?.length) {
          throw new NotInjectableError(token);
        }
        return this.#resolve(injectables[0], require);

      case Require.ANY_OR_NONE:
        if (!injectables?.length) {
          return undefined;
        }
        return this.#resolve(injectables[0], require);

      case Require.ALL:
        if (!injectables?.length) {
          throw new NotInjectableError(token);
        }
        return injectables.map(injectable => this.#resolve(injectable, require)).flat();

      case Require.ALL_OR_NONE:
        if (!injectables?.length) {
          return [];
        }
        return injectables.map(injectable => this.#resolve(injectable, require)).flat();
    }
  }

  /**
   * Get exactly one injectable.
   */
  static getOne<T extends Class, U = InstanceType<T>>(token: T): U;
  static getOne<T, U = T>(token: string | symbol): U;
  static getOne(token: any) {
    return this.get(token, Require.ONE);
  }

  /**
   * Get the first registered injectable.
   */
  static getAny<T extends Class, U = InstanceType<T>>(token: T): U;
  static getAny<T, U = T>(token: string | symbol): U;
  static getAny(token: any) {
    return this.get(token, Require.ANY);
  }

  /**
   * Get exactly one injectable or `undefined` if no injectable is registered.
   */
  static getOneOrNone<T extends Class, U = InstanceType<T>>(token: T): U;
  static getOneOrNone<T, U = T | undefined>(token: string | symbol): U;
  static getOneOrNone(token: any) {
    return this.get(token, Require.ONE_OR_NONE);
  }

  /**
   * Get the first registered injectable or `undefined` if no injectable is registered.
   */
  static getAnyOrNone<T extends Class, U = InstanceType<T>>(token: T): U;
  static getAnyOrNone<T, U = T | undefined>(token: string | symbol): U;
  static getAnyOrNone(token: any) {
    return this.get(token, Require.ANY_OR_NONE);
  }

  /**
   * Get all injectables, requires at least one injectable.
   */
  static getAll<T extends Class, U = InstanceType<T>[]>(token: T): U;
  static getAll<T, U = T[]>(token: string | symbol): U;
  static getAll(token: any) {
    return this.get(token, Require.ALL);
  }

  /**
   * Get all injectables, could be empty array if no injectable is registered.
   */
  static getAllOrNone<T extends Class, U = InstanceType<T>[]>(token: T): U;
  static getAllOrNone<T, U = T[]>(token: string | symbol): U;
  static getAllOrNone(token: any) {
    return this.get(token, Require.ALL_OR_NONE);
  }

  static #toInjectable(
    token: Token, injectable?: Partial<InjectableClass<any, any> & InjectableValue<any, any> & InjectableToken<any, any>>): Injectable {
    if (injectable?.value) {
      return {
        type: 'value',
        injectable: {
          value: injectable.value,
          transformer: injectable.transformer
        }
      };
    }

    if (injectable?.token) {
      return {
        type: 'token',
        injectable: {
          token: injectable.token,
          transformer: injectable.transformer
        }
      };
    }

    if (injectable) {
      return {
        type: 'class',
        injectable: {
          class: injectable.class || token,
          scope: injectable.scope || Scope.SINGLETON,
          transformer: injectable.transformer
        }
      };
    }

    return {
      type: 'class',
      injectable: {
        class: token,
        scope: Scope.SINGLETON
      }
    };
  }

  static #resolve({ type, injectable }: Injectable, require: Require) {
    let value: any;

    switch (type) {
      case 'class':
        if (injectable.scope === Scope.SINGLETON) {
          value = this.#getSingleton(injectable.class);
          break;
        }
        value = this.#createInstance(injectable.class);
        break;

      case 'token':
        value = this.get(injectable.token as any, require as any);
        break;

      case 'value':
        value = injectable.value;
        break;
    }

    if (injectable.transformer) {
      return injectable.transformer(value);
    }
    return value;
  }

  static #getSingleton<T extends Class>(cls: T): InstanceType<T> {
    let instance = this.#singletons.get(cls);
    if (!instance) {
      instance = this.#createInstance(cls);
      this.#singletons.set(cls, instance);
    }
    return instance;
  }

  static #createInstance<T extends Class>(cls: T): InstanceType<T> {
    const paramTypes: any[] = Reflect.getOwnMetadata(MetadataKey.PARAM_TYPES, cls) || [];
    const paramInjections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, cls) || new Map();

    const params = paramTypes.map((paramType, i) => {
      const injection = paramInjections.get(i);
      if (injection) {
        const { token, require, transformer } = injection;
        const value = this.get(token as any, require as any);
        if (transformer) {
          return transformer(value);
        }
        return value;
      }
      return this.getOne(paramType);
    });

    return new cls(...params);
  }

  /**
   * Dispose the container.
   */
  static dispose() {
    this.#injectables = new Map();
    this.#singletons = new Map();
  }

}
