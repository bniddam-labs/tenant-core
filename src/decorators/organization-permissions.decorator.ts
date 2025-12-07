import { SetMetadata } from '@nestjs/common';
import { OrganizationPermission } from '../types/tenant.types.js';

/**
 * Metadata key for required organization permissions
 */
export const ORGANIZATION_PERMISSIONS_KEY = 'organization_permissions';

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
export const RequireOrganizationPermissions = (...permissions: OrganizationPermission[]) =>
  SetMetadata(ORGANIZATION_PERMISSIONS_KEY, permissions);
