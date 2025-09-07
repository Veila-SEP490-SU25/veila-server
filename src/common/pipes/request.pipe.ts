import { TokenPayload } from '@/app/token';
import { UserRole } from '@/common/models';

declare module 'express-serve-static-core' {
  interface Request {
    tokenPayload?: TokenPayload;
    currentRole?: UserRole;
  }
}
