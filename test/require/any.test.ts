import { Container, NotInjectableError, Require } from '../../src';

describe('Any', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('None registered', () => {
    expect(() => Container.get('token', Require.ANY)).toThrow(NotInjectableError);
    expect(() => Container.getAny('token')).toThrow(NotInjectableError);
  });

  test('One registered', () => {
    Container.register('token', { value: 'value' });

    let result = Container.get('token', Require.ANY);
    expect(result).toStrictEqual('value');

    result = Container.getAny('token');
    expect(result).toStrictEqual('value');
  });

  test('Multiple registered', () => {
    Container.register('token', { value: 'value' });
    Container.register('token', { value: 'value2' });

    let result = Container.get('token', Require.ANY);
    expect(result).toStrictEqual('value');

    result = Container.getAny('token');
    expect(result).toStrictEqual('value');
  });

});

