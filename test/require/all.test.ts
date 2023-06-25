import { Container, NotInjectableError, Require } from '../../src';

describe('All', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('None registered', () => {
    expect(() => Container.get('token', Require.ALL)).toThrow(NotInjectableError);
    expect(() => Container.getAll('token')).toThrow(NotInjectableError);
  });

  test('One registered', () => {
    Container.register('token', { value: 'value' });

    let result = Container.get('token', Require.ALL);
    expect(result).toStrictEqual(['value']);

    result = Container.getAll('token');
    expect(result).toStrictEqual(['value']);
  });

  test('Multiple registered', () => {
    Container.register('token', { value: 'value' });
    Container.register('token', { value: 'value2' });

    let result = Container.get('token', Require.ALL);
    expect(result).toStrictEqual(['value', 'value2']);

    result = Container.getAll('token');
    expect(result).toStrictEqual(['value', 'value2']);
  });

});

