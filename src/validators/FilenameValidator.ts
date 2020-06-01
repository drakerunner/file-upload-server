import Validator from './Validator';
import ValidationResult from './ValidationResult';
import * as path from 'path';

export const FilenamePattern = /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/; // eslint-disable-line
const allowedExtensions = ['.JPG', '.PNG', '.JPEG']

export default class extends Validator {
  constructor(private filename: string) {
    super();
  }

  validate(): ValidationResult {
    const errors = [];
    const extention = path.extname(this.filename).toUpperCase();

    if (typeof (this.filename) !== 'string') errors.push('filename must be a string');
    if (this.filename.length === 0) errors.push('filename empty');
    if (this.filename.length > 256) errors.push('filename too long');
    if (!FilenamePattern.test(this.filename)) errors.push('filename must be a valid file name');
    if (allowedExtensions.indexOf(extention) < 0) errors.push('extension not allowed');

    return new ValidationResult(errors);
  }
}
