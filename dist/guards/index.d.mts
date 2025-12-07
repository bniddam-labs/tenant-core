import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard that ensures a valid organization context exists in the request
 *
 * This guard checks that:
 * - An organizationId is present in the request
 * - The organization exists and is active
 *
 * The organization ID can come from:
 * - Route parameters (:organizationId)
 * - Request headers (X-Organization-Id)
 * - Query parameters (organizationId)
 *
 * @example
 * ```typescript
 * @Controller(':organizationId/members')
 * @UseGuards(OrganizationContextGuard)
 * export class MembersController {
 *   @Get()
 *   async listMembers(@CurrentOrganization() orgId: string) {
 *     return this.memberService.list(orgId);
 *   }
 * }
 * ```
 */
declare class OrganizationContextGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}

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
declare class OrganizationRoleGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}

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
declare class OrganizationPermissionGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}

export { OrganizationContextGuard, OrganizationPermissionGuard, OrganizationRoleGuard };
