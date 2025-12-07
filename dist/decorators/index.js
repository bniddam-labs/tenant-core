'use strict';

var common = require('@nestjs/common');

// src/decorators/current-user.decorator.ts
var CurrentUser = common.createParamDecorator(
  (_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
var CurrentOrganization = common.createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationId;
});
var CurrentMembership = common.createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationMembership;
});
var ORGANIZATION_ROLES_KEY = "organization_roles";
var RequireOrganizationRoles = (...roles) => common.SetMetadata(ORGANIZATION_ROLES_KEY, roles);
var ORGANIZATION_PERMISSIONS_KEY = "organization_permissions";
var RequireOrganizationPermissions = (...permissions) => common.SetMetadata(ORGANIZATION_PERMISSIONS_KEY, permissions);

exports.CurrentMembership = CurrentMembership;
exports.CurrentOrganization = CurrentOrganization;
exports.CurrentUser = CurrentUser;
exports.ORGANIZATION_PERMISSIONS_KEY = ORGANIZATION_PERMISSIONS_KEY;
exports.ORGANIZATION_ROLES_KEY = ORGANIZATION_ROLES_KEY;
exports.RequireOrganizationPermissions = RequireOrganizationPermissions;
exports.RequireOrganizationRoles = RequireOrganizationRoles;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map