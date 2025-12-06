import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationRole } from './entities/organization-role.entity';
import { Organization } from './entities/organization.entity';
import { MembershipService } from './services/membership.service';
import { OrganizationContextService } from './services/organization-context.service';

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
@Module({
	imports: [TypeOrmModule.forFeature([Organization, OrganizationMember, OrganizationRole])],
	providers: [OrganizationContextService, MembershipService],
	exports: [TypeOrmModule, OrganizationContextService, MembershipService],
})
export class TenantCoreModule {}
