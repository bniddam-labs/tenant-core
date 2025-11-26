import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationRole } from './entities/organization-role.entity';
import { User } from './entities/user.entity';
import { MembershipService } from './services/membership.service';
import { OrganizationContextService } from './services/organization-context.service';

/**
 * Tenant Core Module
 *
 * Provides tenant entities, services, guards, and decorators
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     TenantCoreModule,
 *     // ... other modules
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization, OrganizationMember, OrganizationRole]),
  ],
  providers: [OrganizationContextService, MembershipService],
  exports: [
    TypeOrmModule,
    OrganizationContextService,
    MembershipService,
  ],
})
export class TenantCoreModule {}
