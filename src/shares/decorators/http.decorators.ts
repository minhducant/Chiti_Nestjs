import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { UserRole } from '../enums/user.enum';

export const Roles = (roles: number[]): MethodDecorator & ClassDecorator => {
  const setMetaData = SetMetadata('roles', roles);
  return setMetaData;
};

export const UserAuth = (
  UserRole?: UserRole[],
): MethodDecorator & ClassDecorator => {
  return applyDecorators(Roles(UserRole));
};

export const ClientUserAuthPermission = (): MethodDecorator &
  ClassDecorator => {
  return applyDecorators(UseGuards());
};
