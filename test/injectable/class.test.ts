import { TestClass, TestClass2 } from '..';
import { Container, MultipleInjectableError } from '../../src';

describe('Injectable class', () => {

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

  test('Multiple token registered', () => {
    const token = 'token';
    Container.register(token, { class: TestClass });
    Container.register(token, { class: TestClass2 });
    Container.register(TestClass, { class: TestClass });
    Container.register(TestClass, { class: TestClass2 });

    expect(() => Container.get(token)).toThrow(MultipleInjectableError);
    expect(() => Container.get(TestClass)).toThrow(MultipleInjectableError);

    let all = Container.getAll(token);
    expect(all.length).toBe(2);
    expect(all[0] instanceof TestClass).toBe(true);
    expect(all[1] instanceof TestClass2).toBe(true);

    all = Container.getAll(TestClass);
    expect(all.length).toBe(2);
    expect(all[0] instanceof TestClass).toBe(true);
    expect(all[1] instanceof TestClass2).toBe(true);
  });

});

