/**
 * @saas/tenant-core
 *
 * Multi-tenant core package for SaaS applications
 *
 * This package provides:
 * - Generic tenant entities (User, Organization, OrganizationMember, OrganizationRole)
 * - Tenant types and enums
 * - Organization context and membership services
 * - Tenant decorators (@CurrentUser, @CurrentOrganization, @CurrentMembership)
 * - Organization guards (context, role, permission)
 *
 * @example
 * ```typescript
 * // Import entities
 * import { User, Organization, OrganizationMember } from '@saas/tenant-core/entities';
 *
 * // Import decorators
 * import { CurrentUser, CurrentOrganization } from '@saas/tenant-core/decorators';
 *
 * // Import guards
 * import { OrganizationRoleGuard } from '@saas/tenant-core/guards';
 *
 * // Import services
 * import { OrganizationContextService } from '@saas/tenant-core/services';
 *
 * // Import types
 * import { SystemRoleName, OrganizationPermission } from '@saas/tenant-core/types';
 * ```
 */

export * from './entities';
export * from './services';
export * from './decorators';
export * from './guards';
export * from './types';
export * from './tenant-core.module';
