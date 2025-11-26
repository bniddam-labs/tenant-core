import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemRoleName } from '../types/tenant.types';
import { ORGANIZATION_ROLES_KEY } from '../decorators/organization-roles.decorator';

/**
 * Guard that checks if the user has required organization roles
 *
 * This guard verifies that the user's organization membership
 * has one of the required roles specified via @RequireOrganizationRoles decorator
 *
 * @example
 * ```typescript
 * @Post('settings')
 * @RequireOrganizationRoles(SystemRoleName.OWNER, SystemRoleName.ADMIN)
 * @UseGuards(OrganizationRoleGuard)
 * async updateSettings(@Body() dto: UpdateSettingsDto) {
 *   return this.orgService.updateSettings(dto);
 * }
 * ```
 */
@Injectable()
export class OrganizationRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Only apply to HTTP contexts
    if (context.getType() !== 'http') {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<SystemRoleName[]>(
      ORGANIZATION_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const membership = request.organizationMembership;

    if (!membership) {
      throw new ForbiddenException('Organization membership not found in request context');
    }

    if (!membership.role) {
      throw new ForbiddenException('User has no role assigned in this organization');
    }

    const userRoleName = membership.role.name;
    const hasRequiredRole = requiredRoles.includes(userRoleName);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${userRoleName}`,
      );
    }

    return true;
  }
}
