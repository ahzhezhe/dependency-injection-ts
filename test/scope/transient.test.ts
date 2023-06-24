import { TestClass, TestClass2 } from '..';
import { Container, Scope } from '../../src';

describe('Transient', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('Explicit', () => {
    Container.register(TestClass, { scope: Scope.TRANSIENT });

    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);

    expect.assertions(5);
  });

  test('Explicit, other class', () => {
    Container.register(TestClass, { class: TestClass2, scope: Scope.TRANSIENT });

    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);

    expect.assertions(10);
  });

});

