import { Role } from '../enum/role.enum';
import { Address } from 'server/address/entities/address.entity';

export interface UserLogin {
  id: string;
  role: Role;
  defaultAddress?: Address;
}

declare global {
  namespace Express {
    interface User extends UserLogin {}
  }
}
