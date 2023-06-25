import { Container, Require } from '../../src';

describe('All or none', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('None registered', () => {
    let result = Container.get('token', Require.ALL_OR_NONE);
    expect(result).toStrictEqual([]);

    result = Container.getAllOrNone('token');
    expect(result).toStrictEqual([]);
  });

  test('One registered', () => {
    Container.register('token', { value: 'value' });

    let result = Container.get('token', Require.ALL_OR_NONE);
    expect(result).toStrictEqual(['value']);

    result = Container.getAllOrNone('token');
    expect(result).toStrictEqual(['value']);
  });

  test('Multiple registered', () => {
    Container.register('token', { value: 'value' });
    Container.register('token', { value: 'value2' });

    let result = Container.get('token', Require.ALL_OR_NONE);
    expect(result).toStrictEqual(['value', 'value2']);

    result = Container.getAllOrNone('token');
    expect(result).toStrictEqual(['value', 'value2']);
  });

});

