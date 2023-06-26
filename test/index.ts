export class TestClass {

  private value = 'value';

  constructor() {
    expect(true).toBeTruthy();
  }

  getValue() {
    return this.value;
  }

  updateValue(newValue: string) {
    this.value = newValue;
    return this;
  }

}

export class TestClass2 {

  constructor() {
    expect(true).toBeTruthy();
    expect(true).toBeTruthy();
  }

}
