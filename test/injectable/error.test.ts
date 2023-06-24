import { TestClass } from '..';
import { Container, NotInjectableError } from '../../src';

describe('Injectable token', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('Token not registered', () => {
    expect(() => Container.get('token')).toThrow(NotInjectableError);
    expect(() => Container.get(Symbol('token'))).toThrow(NotInjectableError);
    expect(() => Container.get(TestClass)).toThrow(NotInjectableError);

    expect(() => Container.getAll('token')).toThrow(NotInjectableError);
    expect(() => Container.getAll(Symbol('token'))).toThrow(NotInjectableError);
    expect(() => Container.getAll(TestClass)).toThrow(NotInjectableError);
  });

});

