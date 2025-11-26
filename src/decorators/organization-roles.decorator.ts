import { SetMetadata } from '@nestjs/common';
import { SystemRoleName } from '../types/tenant.types';

/**
 * Metadata key for required organization roles
 */
export const ORGANIZATION_ROLES_KEY = 'organization_roles';

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
export const RequireOrganizationRoles = (...roles: SystemRoleName[]) =>
  SetMetadata(ORGANIZATION_ROLES_KEY, roles);
