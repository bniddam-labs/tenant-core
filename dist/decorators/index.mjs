import { createParamDecorator, SetMetadata } from '@nestjs/common';

// src/decorators/current-user.decorator.ts
var CurrentUser = createParamDecorator(
  (_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
var CurrentOrganization = createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationId;
});
var CurrentMembership = createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationMembership;
});
var ORGANIZATION_ROLES_KEY = "organization_roles";
var RequireOrganizationRoles = (...roles) => SetMetadata(ORGANIZATION_ROLES_KEY, roles);
var ORGANIZATION_PERMISSIONS_KEY = "organization_permissions";
var RequireOrganizationPermissions = (...permissions) => SetMetadata(ORGANIZATION_PERMISSIONS_KEY, permissions);

export { CurrentMembership, CurrentOrganization, CurrentUser, ORGANIZATION_PERMISSIONS_KEY, ORGANIZATION_ROLES_KEY, RequireOrganizationPermissions, RequireOrganizationRoles };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map