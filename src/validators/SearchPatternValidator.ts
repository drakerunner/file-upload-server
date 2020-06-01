import Validator from './Validator';
import ValidationResult from './ValidationResult';

import { FilenamePattern } from './FilenameValidator';

export default class extends Validator {
  constructor(private pattern: string) {
    super();
  }

  validate(): ValidationResult {
    const errors = [];

    if (this.pattern?.length > 0) {
      if (typeof (this.pattern) !== 'string') errors.push('pattern must be a string');
      if (this.pattern.length > 256) errors.push('pattern too long');
      if (!FilenamePattern.test(this.pattern)) errors.push('pattern must be a valid file name');
    }

    return new ValidationResult(errors);
  }
}
