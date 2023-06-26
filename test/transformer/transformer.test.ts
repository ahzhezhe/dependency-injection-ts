import { TestClass } from '..';
import { Container } from '../../src';

describe('Transformer', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('One', () => {
    Container.register('token', { value: 'test' });
    Container.register('token2', { value: 'test', transformer: () => 'value' });
    Container.register('token3', { class: TestClass, transformer: test => test.updateValue('test') });

    let result = Container.getOne('token');
    expect(result).toStrictEqual('test');

    result = Container.getOne('token2');
    expect(result).toStrictEqual('value');

    result = Container.getOne('token3');
    expect(result instanceof TestClass).toBe(true);
    expect((result as TestClass).getValue()).toStrictEqual('test');
  });

  test('All', () => {
    Container.register('token', { value: 'test' });
    Container.register('token', { value: 'test', transformer: () => 'value' });
    Container.register('token', { value: 'test', transformer: () => 'value2' });
    Container.register('token', { value: 'test', transformer: value => value + value });

    const result = Container.getAll('token');
    expect(result).toStrictEqual(['test', 'value', 'value2', 'testtest']);
  });

});

