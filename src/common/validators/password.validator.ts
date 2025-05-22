import { Matches, MinLength, ValidatorOptions } from 'class-validator';

export function IsPassword(validatorOptions?: ValidatorOptions) {
  return function (object: Object, propertyName: string) {
    MinLength(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự.',
    })(object, propertyName);
    Matches(/[A-Z]/, {
      message: 'Mật khẩu phải có ít nhất 1 ký tự viết hoa.',
    })(object, propertyName);
    Matches(/[a-z]/, {
      message: 'Mật khẩu phải có ít nhất 1 ký tự viết thường.',
    })(object, propertyName);
    Matches(/[0-9]/, {
      message: 'Mật khẩu phải có ít nhất 1 ký tự số.',
    })(object, propertyName);
    Matches(/[!@#$%^&*()_+[\]{}|;:,.<>?]/, {
      message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt.',
    })(object, propertyName);
  };
}
