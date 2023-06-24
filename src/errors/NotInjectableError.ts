import { Token } from '../types';

export class NotInjectableError extends Error {

  constructor(token: Token) {
    super(typeof token === 'string' || typeof token === 'symbol' ?
      `[${token.toString()}] is not injectable. Use '@Register' or 'Container.register' to register the token.` :
      `Class [${token.name}] is not injectable. Use '@Injectable', '@Register' or 'Container.register' to register the class.`
    );
  }

}
