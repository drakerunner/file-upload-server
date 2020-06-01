import SearchPatternValidator from './SearchPatternValidator';
import ValidationResult from './ValidationResult';

export default function (pattern: string): ValidationResult {
  const validator = new SearchPatternValidator(pattern);
  return validator.validate();
}
