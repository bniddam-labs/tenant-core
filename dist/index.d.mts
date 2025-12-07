export { CurrentMembership, CurrentOrganization, CurrentUser, ORGANIZATION_PERMISSIONS_KEY, ORGANIZATION_ROLES_KEY, RequireOrganizationPermissions, RequireOrganizationRoles } from './decorators/index.mjs';
export { BaseEntity, Organization, OrganizationMember, OrganizationRole } from './entities/index.mjs';
export { OrganizationContextGuard, OrganizationPermissionGuard, OrganizationRoleGuard } from './guards/index.mjs';
export { MembershipService, OrganizationContextService } from './services/index.mjs';
export * from '@bniddam-labs/tenant-core-shared';
export { IAuthUser, IUser } from './types/index.mjs';
import '@nestjs/common';
import 'typeorm';
import '@nestjs/core';

/**
 * Tenant Core Module
 *
 * Provides tenant entities, services, guards, and decorators for multi-tenant SaaS applications.
 *
 * NOTE: This module does NOT include a User entity. Your application should define
 * its own User entity with whatever fields you need.
 *
 * @example
 * ```typescript
 * // 1. Define your User entity
 * @Entity('users')
 * export class User extends BaseEntity {
 *   @Column()
 *   email: string;
 *
 *   @Column()
 *   firstName: string;
 *
 *   // Optional: Add relation to memberships
 *   @OneToMany(() => OrganizationMember, member => member.userId)
 *   organizationMemberships: OrganizationMember[];
 * }
 *
 * // 2. Import TenantCoreModule
 * @Module({
 *   imports: [
 *     TypeOrmModule.forFeature([User]), // Your User entity
 *     TenantCoreModule, // Organization entities
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
declare class TenantCoreModule {
}

export { TenantCoreModule };
