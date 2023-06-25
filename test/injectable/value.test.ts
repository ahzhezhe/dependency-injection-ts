import { TestClass } from '..';
import { Container } from '../../src';

describe('Value', () => {

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

});

