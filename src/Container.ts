import 'reflect-metadata';
import { MultipleInjectableError, NotInjectableError } from './errors';
import { Class, Injectable, MetadataKey, ParamInjections } from './internal-types';
import { InjectableClass, InjectableToken, InjectableValue, Require, Scope, Token } from './types';

export class Container {

  static #injectables = new Map<Token, Injectable[]>();
  static #singletons = new Map<Class, any>();

  /**
   * Register injectable class.
   *
   * @param token token
   * @param injectable injectable class, if ommitted, the token class will be treated as injectable, default scope is singleton
   */
  static register<T extends Class>(token: T, injectable?: Partial<InjectableClass<T>>): void;
  /**
   * Register injectable class.
   *
   * @param token token
   * @param injectable injectable class, default scope is singleton
   */
  static register<T extends Class>(token: Token, injectable: Omit<InjectableClass<T>, 'scope'> & { scope?: Scope }): void;
  /**
   * Register injectable value.
   *
   * @param token token
   * @param injectable injectable value.
   */
  static register<T extends Class>(token: T, injectable: InjectableValue<InstanceType<T>>): void;
  /**
   * Register injectable value.
   *
   * @param token token
   * @param injectable injectable value.
   */
  static register<T>(token: string | symbol, injectable: InjectableValue<T>): void;
  /**
   * Register injectable token.
   *
   * @param token token
   * @param injectable injectable token.
   */
  static register(token: Token, injectable: InjectableToken): void;
  static register(token: Token, injectable?: Partial<InjectableClass<any> & InjectableValue<any> & InjectableToken>) {
    const tokens = this.#injectables.get(token) || [];
    tokens.push(this.#toInjectable(token, injectable));
    this.#injectables.set(token, tokens);
  }

  /**
   * Get one injectable.
   *
   * @param token token
   * @param require exactly one registered injectable or the first registered injectable, default behaviour is to get exactly one injectable
   */
  static get<T extends Class>(token: T, require?: Require.ONE | Require.ANY): InstanceType<T>;
  /**
   * Get one injectable.
   *
   * @param token token
   * @param require exactly one registered injectable or the first registered injectable, default behaviour is to get exactly one injectable
   */
  static get<T>(token: string | symbol, require?: Require.ONE | Require.ANY): T;
  /**
   * Get one injectable or `undefined` if injectable is registered.
   *
   * @param token token
   * @param require exactly one registered injectable or the first registered injectable
   */
  static get<T extends Class>(token: T, require: Require.ONE_OR_NONE | Require.ANY_OR_NONE): InstanceType<T> | undefined;
  /**
   * Get one injectable or `undefined` if injectable is registered.
   *
   * @param token token
   * @param require exactly one registered injectable or the first registered injectable
   */
  static get<T>(token: string | symbol, require: Require.ONE_OR_NONE | Require.ANY_OR_NONE): T | undefined;
  /**
   * Get all injectables.
   *
   * @param token token
   * @param require at least one registered injectable or allow empty array
   */
  static get<T extends Class>(token: T, require: Require.ALL | Require.ALL_OR_NONE): InstanceType<T>[];
  /**
   * Get all injectables.
   *
   * @param token token
   * @param require at least one registered injectable or allow empty array
   */
  static get<T>(token: string | symbol, require: Require.ALL | Require.ALL_OR_NONE): T[];
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
   *
   * @param token token
   */
  static getOne<T extends Class>(token: T): InstanceType<T>;
  static getOne<T>(token: string | symbol): T;
  static getOne(token: any) {
    return this.get(token, Require.ONE);
  }

  /**
   * Get the first registered injectable.
   *
   * @param token token
   */
  static getAny<T extends Class>(token: T): InstanceType<T>;
  static getAny<T>(token: string | symbol): T;
  static getAny(token: any) {
    return this.get(token, Require.ANY);
  }

  /**
   * Get exactly one injectable or `undefined` if no injectable is registered.
   *
   * @param token token
   */
  static getOneOrNone<T extends Class>(token: T): InstanceType<T> | undefined;
  static getOneOrNone<T>(token: string | symbol): T | undefined;
  static getOneOrNone(token: any) {
    return this.get(token, Require.ONE_OR_NONE);
  }

  /**
   * Get the first registered injectable or `undefined` if no injectable is registered.
   *
   * @param token token
   */
  static getAnyOrNone<T extends Class>(token: T): InstanceType<T> | undefined;
  static getAnyOrNone<T>(token: string | symbol): T | undefined;
  static getAnyOrNone(token: any) {
    return this.get(token, Require.ANY_OR_NONE);
  }

  /**
   * Get all injectables, requires at least one injectable.
   *
   * @param token token
   */
  static getAll<T extends Class>(token: T,): InstanceType<T>[];
  static getAll<T>(token: string | symbol,): T[];
  static getAll(token: any) {
    return this.get(token, Require.ALL);
  }

  /**
   * Get all injectables, could be empty array if no injectable is registered.
   *
   * @param token token
   */
  static getAllOrNone<T extends Class>(token: T): InstanceType<T>[];
  static getAllOrNone<T>(token: string | symbol): T[];
  static getAllOrNone(token: any) {
    return this.get(token, Require.ALL_OR_NONE);
  }

  static #toInjectable(token: Token, injectable?: Partial<InjectableClass<any> & InjectableValue<any> & InjectableToken>): Injectable {
    if (injectable?.value) {
      return {
        type: 'value',
        injectable: {
          value: injectable.value
        }
      };
    }

    if (injectable?.token) {
      return {
        type: 'token',
        injectable: {
          token: injectable.token
        }
      };
    }

    if (injectable) {
      return {
        type: 'class',
        injectable: {
          class: injectable.class || token,
          scope: injectable.scope || Scope.SINGLETON
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
    switch (type) {
      case 'class':
        if (injectable.scope === Scope.SINGLETON) {
          return this.#getSingleton(injectable.class);
        }
        return this.#createInstance(injectable.class);

      case 'token':
        return this.get(injectable.token as any, require as any);

      case 'value':
        return injectable.value;
    }
  }

  static #getSingleton<T extends Class>(cls: T): InstanceType<T> {
    let instance = this.#singletons.get(cls);
    if (!instance) {
      instance = this.#createInstance(cls);
    }
    this.#singletons.set(cls, instance);
    return instance;
  }

  static #createInstance<T extends Class>(cls: T): InstanceType<T> {
    const paramTypes: any[] = Reflect.getOwnMetadata(MetadataKey.PARAM_TYPES, cls) || [];
    const paramInjections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, cls) || new Map();

    const params = paramTypes.map((paramType, i) => {
      const injection = paramInjections.get(i);
      if (injection) {
        const { token, require } = injection;
        return this.get(token as any, require as any);
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
