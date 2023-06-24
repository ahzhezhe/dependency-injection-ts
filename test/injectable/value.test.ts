import { TestClass } from '..';
import { Container, MultipleInjectableError } from '../../src';

describe('Injectable value', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('Token = string', () => {
    const token = 'token';
    Container.register(token, { value: 'value' });

    const one = Container.get(token);
    expect(one).toStrictEqual('value');

    const all = Container.getAll(token);
    expect(all).toStrictEqual(['value']);
  });

  test('Token = symbol', () => {
    const token = Symbol('token');
    Container.register(token, { value: 'value' });

    const one = Container.get(token);
    expect(one).toStrictEqual('value');

    const all = Container.getAll(token);
    expect(all).toStrictEqual(['value']);
  });

  test('Token = class', () => {
    const token = TestClass;
    Container.register(token, { value: 'value' });

    const one = Container.get(token);
    expect(one).toStrictEqual('value');

    const all = Container.getAll(token);
    expect(all).toStrictEqual(['value']);
  });

  test('Multiple token registered', () => {
    const token = 'token';
    Container.register(token, { value: 'value1' });
    Container.register(token, { value: 'value2' });
    Container.register(TestClass, { value: 'value1' });
    Container.register(TestClass, { value: 'value2' });

    expect(() => Container.get(token)).toThrow(MultipleInjectableError);
    expect(() => Container.get(TestClass)).toThrow(MultipleInjectableError);

    let all = Container.getAll(token);
    expect(all).toStrictEqual(['value1', 'value2']);

    all = Container.getAll(TestClass);
    expect(all).toStrictEqual(['value1', 'value2']);
  });

});

