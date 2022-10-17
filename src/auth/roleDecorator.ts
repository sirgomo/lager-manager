import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/entity/userEntity';


export const ROLE_KEY = 'role';
export const ROLES = (...role: ROLE[]) => SetMetadata(ROLE_KEY, role);