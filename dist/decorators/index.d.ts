import { IUser } from '../types/index.js';
import * as _nestjs_common from '@nestjs/common';
import { SystemRoleName, OrganizationPermission } from '@bniddam-labs/tenant-core-shared';

/**
 * Parameter decorator to inject the current authenticated user
 *
 * The user object should be attached to the request by your authentication
 * guard/middleware (e.g., JwtAuthGuard, SessionGuard).
 *
 * @example
 * ```typescript
 * // Define your User type
 * interface User extends IUser {
 *   firstName: string;
 *   lastName: string;
 * }
 *
 * // Use in controller
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
declare const CurrentUser: <TUser extends IUser = IUser>(...dataOrPipes: unknown[]) => ParameterDecorator;

/**
 * Parameter decorator to inject the current organization ID from request context
 *
 * @example
 * ```typescript
 * @Get(':organizationId/settings')
 * async getSettings(@CurrentOrganization() organizationId: string) {
 *   return this.orgService.getSettings(organizationId);
 * }
 * ```
 */
declare const CurrentOrganization: (...dataOrPipes: unknown[]) => ParameterDecorator;

/**
 * Parameter decorator to inject the current organization membership
 * (user's membership in the current organization context)
 *
 * @example
 * ```typescript
 * @Get('my-role')
 * async getMyRole(@CurrentMembership() membership: OrganizationMember) {
 *   return membership.role;
 * }
 * ```
 */
declare const CurrentMembership: (...dataOrPipes: unknown[]) => ParameterDecorator;

/**
 * Metadata key for required organization roles
 */
declare const ORGANIZATION_ROLES_KEY = "organization_roles";
/**
 * Decorator to specify required organization roles for an endpoint
 *
 * @param roles - Array of required organization role names
 *
 * @example
 * ```typescript
 * @Post('members')
 * @RequireOrganizationRoles([SystemRoleName.OWNER, SystemRoleName.ADMIN])
 * async addMember(@Body() dto: AddMemberDto) {
 *   return this.memberService.add(dto);
 * }
 * ```
 */
declare const RequireOrganizationRoles: (...roles: SystemRoleName[]) => _nestjs_common.CustomDecorator<string>;

/**
 * Metadata key for required organization permissions
 */
declare const ORGANIZATION_PERMISSIONS_KEY = "organization_permissions";
/**
 * Decorator to specify required organization permissions for an endpoint
 *
 * @param permissions - Array of required organization permissions
 *
 * @example
 * ```typescript
 * @Delete('members/:id')
 * @RequireOrganizationPermissions(OrganizationPermission.MEMBERS_REMOVE)
 * async removeMember(@Param('id') id: string) {
 *   return this.memberService.remove(id);
 * }
 * ```
 */
declare const RequireOrganizationPermissions: (...permissions: OrganizationPermission[]) => _nestjs_common.CustomDecorator<string>;

export { CurrentMembership, CurrentOrganization, CurrentUser, ORGANIZATION_PERMISSIONS_KEY, ORGANIZATION_ROLES_KEY, RequireOrganizationPermissions, RequireOrganizationRoles };
