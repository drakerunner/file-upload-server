import FilenameValidator from './FilenameValidator';
import ValidationResult from './ValidationResult';

export default function (pattern: string): ValidationResult {
  const validator = new FilenameValidator(pattern);
  return validator.validate();
}
