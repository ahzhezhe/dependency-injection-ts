import { Container, MultipleInjectableError, Require } from '../../src';

describe('One or none', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('None registered', () => {
    let result = Container.get('token', Require.ONE_OR_NONE);
    expect(result).toStrictEqual(undefined);

    result = Container.getOneOrNone('token');
    expect(result).toStrictEqual(undefined);
  });

  test('One registered', () => {
    Container.register('token', { value: 'value' });

    let result = Container.get('token', Require.ONE_OR_NONE);
    expect(result).toStrictEqual('value');

    result = Container.getOneOrNone('token');
    expect(result).toStrictEqual('value');
  });

  test('Multiple registered', () => {
    Container.register('token', { value: 'value' });
    Container.register('token', { value: 'value2' });

    expect(() => Container.get('token', Require.ONE_OR_NONE)).toThrow(MultipleInjectableError);
    expect(() => Container.getOneOrNone('token')).toThrow(MultipleInjectableError);
  });

});

