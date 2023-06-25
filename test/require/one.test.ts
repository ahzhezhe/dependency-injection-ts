import { Container, MultipleInjectableError, NotInjectableError, Require } from '../../src';

describe('One', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('None registered', () => {
    expect(() => Container.get('token', Require.ONE)).toThrow(NotInjectableError);
    expect(() => Container.getOne('token')).toThrow(NotInjectableError);
  });

  test('One registered', () => {
    Container.register('token', { value: 'value' });

    let result = Container.get('token', Require.ONE);
    expect(result).toStrictEqual('value');

    result = Container.getOne('token');
    expect(result).toStrictEqual('value');
  });

  test('Multiple registered', () => {
    Container.register('token', { value: 'value' });
    Container.register('token', { value: 'value2' });

    expect(() => Container.get('token', Require.ONE)).toThrow(MultipleInjectableError);
    expect(() => Container.getOne('token')).toThrow(MultipleInjectableError);
  });

});

