import { TestClass } from '..';
import { Container, MultipleInjectableError } from '../../src';

describe('Injectable token', () => {

  const otherToken = 'otherToken';
  const otherValue = 'otherValue';
  const otherToken2 = 'otherToken2';
  const otherValue2 = 'otherValue2';

  beforeEach(() => {
    Container.dispose();
    Container.register(otherToken, { value: otherValue });
    Container.register(otherToken2, { value: otherValue2 });
  });

  test('Token = string', () => {
    const token = 'token';
    Container.register(token, { token: otherToken });

    const one = Container.get(token);
    expect(one).toStrictEqual(otherValue);

    const all = Container.getAll(token);
    expect(all).toStrictEqual([otherValue]);
  });

  test('Token = symbol', () => {
    const token = Symbol('token');
    Container.register(token, { token: otherToken });

    const one = Container.get(token);
    expect(one).toStrictEqual(otherValue);

    const all = Container.getAll(token);
    expect(all).toStrictEqual([otherValue]);
  });

  test('Token = class', () => {
    const token = TestClass;
    Container.register(token, { token: otherToken });

    const one = Container.get(token);
    expect(one).toStrictEqual(otherValue);

    const all = Container.getAll(token);
    expect(all).toStrictEqual([otherValue]);
  });

  test('Multiple token registered', () => {
    const token = 'token';
    Container.register(token, { token: otherToken });
    Container.register(token, { token: otherToken2 });
    Container.register(TestClass, { token: otherToken });
    Container.register(TestClass, { token: otherToken2 });

    expect(() => Container.get(token)).toThrow(MultipleInjectableError);
    expect(() => Container.get(TestClass)).toThrow(MultipleInjectableError);

    let all = Container.getAll(token);
    expect(all).toStrictEqual([otherValue, otherValue2]);

    all = Container.getAll(TestClass);
    expect(all).toStrictEqual([otherValue, otherValue2]);
  });

});

