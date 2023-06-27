# **tsinject**
[![npm package](https://img.shields.io/npm/v/tsinject)](https://www.npmjs.com/package/tsinject)
[![npm downloads](https://img.shields.io/npm/dt/tsinject)](https://www.npmjs.com/package/tsinject)
[![GitHub test](https://github.com/ahzhezhe/tsinject/workflows/test/badge.svg?branch=master)](https://github.com/ahzhezhe/tsinject)
[![GitHub issues](https://img.shields.io/github/issues/ahzhezhe/tsinject)](https://github.com/ahzhezhe/tsinject/issues)
[![GitHub license](https://img.shields.io/github/license/ahzhezhe/tsinject)](https://github.com/ahzhezhe/tsinject/blob/master/LICENSE)

<br />

## **What is tsinject?**
tsinject is a dependency injection library for TypeScript.

It provides:
- Constructor parameters injection.
- Class, value & token injection.
- Singleton & transient injectable.
- Decorators for injectable classes and parameter injections.

[API Documentation](https://ahzhezhe.github.io/docs/tsinject-v0/index.html)

<br />

## **Install via NPM**
```
npm install tsinject
```

<br />

# **tsconfig.json**
Make sure that these 2 options are set to true
```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

<br />

# **Injectable**
Injectable can be a class instance or any value.

<br />

# **Token**
A token will be resolved to an injectable during injection.

A token can be a class, a string or a symbol.

<br />

# **Register an injectable class**
```typescript
@Injectable()
export class ClassA {
}

// or

Container.register(ClassA);
```

## **Scope**
```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class ClassA {
}

// or

Container.register(ClassA, { scope: Scope.TRANSIENT });
```

Available scopes:
- `Singleton` - Class will only be instantiated once and resued throughout the container.
- `Transient` - Class will be instantiated everytime it is retrieved/injected from container.

Default scope is singleton.

<br />

# **Register an injectable value**
```typescript
Container.register('A', { value: 'hello world' });
```
Token `'A'` will be resolved to string value `'hello world'`.

<br />

# **Register an injectable token alias**
```typescript
Container.register('B', { token: 'A' });
```
Token `'B'` will be resolved to whatever token `'A'` is registered as.

That makes token `'B'` an alias of token `'A'`.

<br />

# **Register an injectable class alias**
```typescript
export class ParentClass {
}

@Injectable({ token: ParentClass })
export class ClassA extends ParentClass {
}

// or

Container.register(ParentClass, { class: ClassA });
```
Token `ParentClass` will be resolved to an instance of `ClassA` instead of `ParentClass` itself.

<br />

# **Register using decorator**
```typescript
@Register([
  ['A', { value: 'hello world' }]
  ['B', { token: 'A' }]
])
@Injectable()
export class ClassA {
}
```

<br />

# **Inject constructor parameters**

## **Auto injection**
```typescript
@Injectable()
export class ClassA {
}

@Injectable()
export class ClassB {

  constructor(
    readonly a: ClassA // will be injected with an instance of ClassA based on parameter type
  ) {}

}
```

## **Explicit injection**
```typescript
export class ParentClass {
}

@Injectable()
export class ClassA extends ParentClass {
}

@Injectable()
export class ClassB {

  constructor(
    @Inject(ClassA) readonly a: ParentClass // will be injected with an instance of ClassA despite the parameter type is ParentClass
  ) {}

}
```

## **Token injection**
```typescript
Container.register('A', { value: 'hello world' });
Container.register('B', { token: 'A' });

@Injectable()
export class ClassA {

  constructor(
    @Inject('A') readonly a: string, // will be injected with string value 'hello world'
    @Inject('B') readonly b: string // will be injected with token 'A', which resolved as string value 'hello world'
  ) {}

}
```

## **Array injection**
```typescript
Container.register('A', { value: 'hello' });
Container.register('A', { value: 'world' });

export class ParentClass {
}

@Injectable({ token: ParentClass })
export class ClassA extends ParentClass {
}

@Injectable({ token: ParentClass })
export class ClassB extends ParentClass {
}

@Injectable()
export class ClassC {

  constructor(
    @InjectAll('A') readonly a: string[], // will be injected with string array ['hello', 'world']
    @InjectAll(ParentClass) readonly b: ParentClass[], // will be injected with an array that contains instances of ClassA and ClassB
  ) {}

}
```

## **All kind of injections**
- `@Inject` or `@InjectOne` - inject exactly one injectable in the container, no injectable or more than one injectable will result in error.
- `@InjectOneOrNone` - inject exactly one injectable in the container, no injectable will result in `undefined`, more than one injectable will result in error.
- `@InjectAny` - inject the first registered injectable in the container, no injectable will result in error.
- `@InjectAnyOrNone` - inject the first registered injectable in the container, no injectable will result in `undefined`.
- `@InjectAll` - inject all and at least one injectable, no injectable will result in error.
- `@InjectAllOrNone` - inject all injectables, no injectable will result in empty array.

<br />

# **Transformer**

## **Transform during registration**
```typescript
Container.register('A', { value: 'hello' });
Container.register('B', { token: 'A', transformer: value => value + ' world' });

@Injectable()
export class ClassA {

  constructor(
    @Inject('B') readonly a: string, // will be injected with string value 'hello world'
  ) {}

}
```

## **Transform during injection**
```typescript
Container.register('A', { value: 'hello' });

@Injectable()
export class ClassA {

  constructor(
    @Inject('A', { transformer: value => value + ' world' }) readonly a: string, // will be injected with string value 'hello world'
  ) {}

}
```

## **Transform during both registration and injection**
```typescript
Container.register('A', { value: 'hello' });
Container.register('B', { token: 'A', transformer: value => value + ' 1' });

@Injectable()
export class ClassA {

  constructor(
    @Inject('B', { transformer: value => value + ' 2' }) readonly a: string, // will be injected with string value 'hello 1 2'
  ) {}

}
```

<br />

## **Getting injectable from container**
```typescript
Container.register('A', { value: 'hello world' });

@Injectable()
export class ClassA {

  private readonly val = Container.get<string>('A'); // returns string value 'hello world'

}

const a = Container.get(ClassA); // returns an instance of ClassA
```
