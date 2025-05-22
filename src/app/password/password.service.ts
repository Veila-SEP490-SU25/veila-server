import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly lowercase = 'abcdefghijklmnopqrstuvwxyz';
  private readonly numbers = '0123456789';
  private readonly specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  constructor(private readonly config: ConfigService) {}

  generatePassword(length: number): string {
    const allChars = this.uppercase + this.lowercase + this.numbers + this.specialChars;

    let password = '';
    password += this.getRandomChar(this.uppercase);
    password += this.getRandomChar(this.lowercase);
    password += this.getRandomChar(this.numbers);
    password += this.getRandomChar(this.specialChars);
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(allChars);
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  generateOTP(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += this.getRandomChar(this.numbers);
    }
    return otp;
  }

  private getRandomChar(chars: string): string {
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(this.config.get<string>('PASSWORD_SALT_ROUNDS') || '10', 10);
    if (isNaN(saltRounds)) {
      throw new Error('Invalid salt rounds value. It must be a number.');
    }
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
