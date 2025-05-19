import { UserRole } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
  username: string;
  role: UserRole;
}

export interface TokenOptions {
  isRefresh?: boolean;
  ignoreExpiration?: boolean;
}