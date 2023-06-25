import { TestClass } from '..';
import { Container } from '../../src';

describe('Class', () => {

  beforeEach(() => {
    Container.dispose();
  });

  test('Token = string', () => {
    const token = 'token';
    Container.register(token, { class: TestClass });

    const one = Container.get(token);
    expect(one instanceof TestClass).toBe(true);

    const all = Container.getAll(token);
    expect(all.length).toBe(1);
    expect(all[0] instanceof TestClass).toBe(true);
  });

  test('Token = symbol', () => {
    const token = Symbol('token');
    Container.register(token, { class: TestClass });

    const one = Container.get(token);
    expect(one instanceof TestClass).toBe(true);

    const all = Container.getAll(token);
    expect(all.length).toBe(1);
    expect(all[0] instanceof TestClass).toBe(true);
  });

  test('Token = class, explicit', () => {
    Container.register(TestClass, { class: TestClass });

    const one = Container.get(TestClass);
    expect(one instanceof TestClass).toBe(true);

    const all = Container.getAll(TestClass);
    expect(all.length).toBe(1);
    expect(all[0] instanceof TestClass).toBe(true);
  });

  test('Token = class, implicit', () => {
    Container.register(TestClass);

    const one = Container.get(TestClass);
    expect(one instanceof TestClass).toBe(true);

    const all = Container.getAll(TestClass);
    expect(all.length).toBe(1);
    expect(all[0] instanceof TestClass).toBe(true);
  });

});

