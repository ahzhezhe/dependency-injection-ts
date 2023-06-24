import { Token } from '../types';

export class MultipleInjectableError extends Error {

  constructor(token: Token) {
    super(
      `${typeof token === 'string' || typeof token === 'symbol' ? `[${token.toString()}]` : `Class [${token.name}]`} ` +
      "has multiple injectables. Use '@InjectAll' or 'Container.getAll' instead."
    );
  }

}
