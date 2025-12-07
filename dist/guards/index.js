'use strict';

var common = require('@nestjs/common');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.OrganizationContextGuard = class OrganizationContextGuard {
  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.params?.organizationId || request.headers?.["x-organization-id"] || request.query?.organizationId;
    if (!organizationId) {
      throw new common.ForbiddenException("Organization context is required");
    }
    request.organizationId = organizationId;
    return true;
  }
};
exports.OrganizationContextGuard = __decorateClass([
  common.Injectable()
], exports.OrganizationContextGuard);
var ORGANIZATION_ROLES_KEY = "organization_roles";

// src/guards/organization-role.guard.ts
exports.OrganizationRoleGuard = class OrganizationRoleGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }
  canActivate(context) {
    if (context.getType() !== "http") {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride(
      ORGANIZATION_ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const membership = request.organizationMembership;
    if (!membership) {
      throw new common.ForbiddenException("Organization membership not found in request context");
    }
    if (!membership.role) {
      throw new common.ForbiddenException("User has no role assigned in this organization");
    }
    const userRoleName = membership.role.name;
    const hasRequiredRole = requiredRoles.includes(userRoleName);
    if (!hasRequiredRole) {
      throw new common.ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(", ")}. User role: ${userRoleName}`
      );
    }
    return true;
  }
};
exports.OrganizationRoleGuard = __decorateClass([
  common.Injectable()
], exports.OrganizationRoleGuard);
var ORGANIZATION_PERMISSIONS_KEY = "organization_permissions";

// src/guards/organization-permission.guard.ts
exports.OrganizationPermissionGuard = class OrganizationPermissionGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }
  canActivate(context) {
    if (context.getType() !== "http") {
      return true;
    }
    const requiredPermissions = this.reflector.getAllAndOverride(
      ORGANIZATION_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const membership = request.organizationMembership;
    if (!membership) {
      throw new common.ForbiddenException("Organization membership not found in request context");
    }
    if (!membership.role) {
      throw new common.ForbiddenException("User has no role assigned in this organization");
    }
    const role = membership.role;
    const hasAllPermissions = requiredPermissions.every(
      (permission) => role.permissions.includes(permission) || role.permissions.includes("*")
    );
    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !role.permissions.includes(permission) && !role.permissions.includes("*")
      );
      throw new common.ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(", ")}`
      );
    }
    return true;
  }
};
exports.OrganizationPermissionGuard = __decorateClass([
  common.Injectable()
], exports.OrganizationPermissionGuard);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map