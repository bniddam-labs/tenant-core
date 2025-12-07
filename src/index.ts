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

export * from './decorators/index.js';
export * from './entities/index.js';
export * from './guards/index.js';
export * from './services/index.js';
export * from './tenant-core.module.js';
export * from './types/index.js';
