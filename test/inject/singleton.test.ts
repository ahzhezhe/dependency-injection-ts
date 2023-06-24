import { TestClass, TestClass2 } from '..';
import { Container, Scope } from '../../src';

describe('Inject', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('Explicit', () => {
    Container.register(TestClass, { scope: Scope.SINGLETON });

    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);

    expect.assertions(1);
  });

  test('Explicit, other class', () => {
    Container.register(TestClass, { class: TestClass2, scope: Scope.SINGLETON });

    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);

    expect.assertions(2);
  });

  test('Implicit', () => {
    Container.register(TestClass);

    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);

    expect.assertions(1);
  });

  test('Implicit, other class', () => {
    Container.register(TestClass, { class: TestClass2 });

    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);
    Container.get(TestClass);

    expect.assertions(2);
  });

});

