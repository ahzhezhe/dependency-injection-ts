import { Container, Require } from '../../src';

describe('Any or none', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('None registered', () => {
    let result = Container.get('token', Require.ANY_OR_NONE);
    expect(result).toStrictEqual(undefined);

    result = Container.getAnyOrNone('token');
    expect(result).toStrictEqual(undefined);
  });

  test('One registered', () => {
    Container.register('token', { value: 'value' });

    let result = Container.get('token', Require.ANY_OR_NONE);
    expect(result).toStrictEqual('value');

    result = Container.getAnyOrNone('token');
    expect(result).toStrictEqual('value');
  });

  test('Multiple registered', () => {
    Container.register('token', { value: 'value' });
    Container.register('token', { value: 'value2' });

    let result = Container.get('token', Require.ANY_OR_NONE);
    expect(result).toStrictEqual('value');

    result = Container.getAnyOrNone('token');
    expect(result).toStrictEqual('value');
  });

});

