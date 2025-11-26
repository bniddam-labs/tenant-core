import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationPermission } from '../types/tenant.types';
import { ORGANIZATION_PERMISSIONS_KEY } from '../decorators/organization-permissions.decorator';

/**
 * Guard that checks if the user has required organization permissions
 *
 * This guard verifies that the user's organization role
 * has all the required permissions specified via @RequireOrganizationPermissions decorator
 *
 * @example
 * ```typescript
 * @Delete('members/:id')
 * @RequireOrganizationPermissions(OrganizationPermission.MEMBERS_REMOVE)
 * @UseGuards(OrganizationPermissionGuard)
 * async removeMember(@Param('id') id: string) {
 *   return this.memberService.remove(id);
 * }
 * ```
 */
@Injectable()
export class OrganizationPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Only apply to HTTP contexts
    if (context.getType() !== 'http') {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<OrganizationPermission[]>(
      ORGANIZATION_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const membership = request.organizationMembership;

    if (!membership) {
      throw new ForbiddenException('Organization membership not found in request context');
    }

    if (!membership.role) {
      throw new ForbiddenException('User has no role assigned in this organization');
    }

    const role = membership.role;

    // Check if role has all required permissions
    const hasAllPermissions = requiredPermissions.every(
      (permission) => role.permissions.includes(permission) || role.permissions.includes('*'),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !role.permissions.includes(permission) && !role.permissions.includes('*'),
      );

      throw new ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
