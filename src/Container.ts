import 'reflect-metadata';
import { MultipleInjectableError, NotInjectableError } from './errors';
import { Class, Injectable, Injections, MetadataKey } from './internal-types';
import { InjectableClass, InjectableToken, InjectableValue, Scope, Token } from './types';

export class Container {

  static #injectables = new Map<Token, Injectable[]>();
  static #singletons = new Map<Class, any>();

  static register<T extends Class>(token: T, injectable?: Partial<InjectableClass<T>>): void;
  static register<T extends Class>(token: Token, injectable: Omit<InjectableClass<T>, 'scope'> & { scope?: Scope }): void;
  static register<T extends Class>(token: T, injectable: InjectableValue<InstanceType<T>>): void;
  static register<T>(token: string | symbol, injectable: InjectableValue<T>): void;
  static register(token: Token, injectable: InjectableToken): void;
  static register(token: Token, injectable?: Partial<InjectableClass<any> & InjectableValue<any> & InjectableToken>) {
    const tokens = this.#injectables.get(token) || [];
    tokens.push(this.#toInjectable(token, injectable));
    this.#injectables.set(token, tokens);
  }

  static get<T extends Class>(token: T): InstanceType<T>;
  static get<T>(token: string | symbol): T;
  static get(token: Token) {
    const injectable = this.#getOneInjectable(token);
    return this.#resolve(injectable, 'one');
  }

  static getAll<T extends Class>(token: T): InstanceType<T>[];
  static getAll<T>(token: string | symbol): T[];
  static getAll(token: Token) {
    const injectables = this.#getAllInjectables(token);
    return injectables.map(injectable => this.#resolve(injectable, 'all')).flat();
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

  static #getAllInjectables(token: Token): Injectable[] {
    const injectables = this.#injectables.get(token);
    if (!injectables) {
      throw new NotInjectableError(token);
    }
    return injectables;
  }

  static #getOneInjectable(token: Token): Injectable {
    const injectables = this.#getAllInjectables(token);
    if (injectables.length > 1) {
      throw new MultipleInjectableError(token);
    }
    return injectables[0];
  }

  static #resolve({ type, injectable }: Injectable, require: 'one' | 'all') {
    switch (type) {
      case 'class':
        if (injectable.scope === Scope.SINGLETON) {
          return this.#getSingleton(injectable.class);
        }
        return this.#createInstance(injectable.class);

      case 'token':
        if (require === 'one') {
          return this.get(injectable.token as any);
        }
        return this.getAll(injectable.token as any);

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

  static dispose() {
    this.#injectables = new Map();
    this.#singletons = new Map();
  }

}
