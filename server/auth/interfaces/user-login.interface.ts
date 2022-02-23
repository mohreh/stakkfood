import { Role } from '../enum/role.enum';

export interface UserLogin {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface User extends UserLogin {}
  }
}
