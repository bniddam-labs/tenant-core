# @bniddam/tenant-core

Multi-tenant core infrastructure for NestJS SaaS applications. Provides entities, services, decorators, and guards for organization-based multi-tenancy with role-based access control (RBAC).

## Features

- **TypeORM Entities**: User, Organization, OrganizationMember, OrganizationRole
- **Multi-Tenancy**: Organization-based data isolation
- **RBAC**: Role-based access control with permissions
- **Decorators**: @CurrentUser, @CurrentOrganization, @CurrentMembership
- **Guards**: OrganizationRoleGuard, OrganizationPermissionGuard, OrganizationContextGuard
- **Services**: MembershipService, OrganizationContextService
- **TypeScript**: Full type safety with TypeORM and NestJS
- **Flexible**: Easily extendable for custom business logic

## Installation

### Using pnpm link (local development)

```bash
# Make sure dependencies are linked first
cd /path/to/@bniddam/utils
pnpm install && pnpm build && pnpm link --global

cd /path/to/@bniddam/core
pnpm install && pnpm link --global @bniddam/utils
pnpm build && pnpm link --global

# In @bniddam/tenant-core directory
pnpm install
pnpm link --global @bniddam/core @bniddam/utils
pnpm build
pnpm link --global

# In your project
pnpm link --global @bniddam/tenant-core @bniddam/core @bniddam/utils
```

### Using npm/pnpm (when published)

```bash
pnpm add @bniddam/tenant-core @bniddam/core @bniddam/utils
# or
npm install @bniddam/tenant-core @bniddam/core @bniddam/utils
```

## Usage

### Module Setup

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantCoreModule } from '@bniddam/tenant-core';
import { User, Organization, OrganizationMember, OrganizationRole } from '@bniddam/tenant-core/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // ... database config
      entities: [User, Organization, OrganizationMember, OrganizationRole],
    }),
    TenantCoreModule,
  ],
})
export class AppModule {}
```

### Using Decorators

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import {
  CurrentUser,
  CurrentOrganization,
  CurrentMembership
} from '@bniddam/tenant-core/decorators';
import { User, Organization, OrganizationMember } from '@bniddam/tenant-core/entities';

@Controller('projects')
export class ProjectsController {
  @Get()
  async findAll(
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization,
    @CurrentMembership() membership: OrganizationMember,
  ) {
    // Access current user, organization, and membership
    return this.projectsService.findByOrganization(organization.id);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization,
  ) {
    return this.projectsService.create({
      organizationId: organization.id,
      createdBy: user.id,
    });
  }
}
```

### Using Guards

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  OrganizationRoleGuard,
  OrganizationPermissionGuard,
  OrganizationContextGuard
} from '@bniddam/tenant-core/guards';
import {
  OrganizationRoles,
  OrganizationPermissions
} from '@bniddam/tenant-core/decorators';

@Controller('admin')
@UseGuards(OrganizationContextGuard, OrganizationRoleGuard)
export class AdminController {
  @Get('users')
  @OrganizationRoles('ADMIN', 'OWNER')
  async listUsers() {
    // Only accessible to ADMIN or OWNER roles
  }

  @Get('settings')
  @UseGuards(OrganizationPermissionGuard)
  @OrganizationPermissions('settings:write')
  async updateSettings() {
    // Only accessible with settings:write permission
  }
}
```

### Using Services

```typescript
import { Injectable } from '@nestjs/common';
import {
  MembershipService,
  OrganizationContextService
} from '@bniddam/tenant-core/services';

@Injectable()
export class ProjectService {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly orgContextService: OrganizationContextService,
  ) {}

  async getUserProjects(userId: string) {
    // Get all organizations the user belongs to
    const memberships = await this.membershipService.getUserMemberships(userId);

    // Get projects from all organizations
    const projects = [];
    for (const membership of memberships) {
      const orgProjects = await this.findByOrganization(membership.organizationId);
      projects.push(...orgProjects);
    }

    return projects;
  }

  async checkMemberRole(userId: string, organizationId: string, requiredRole: string) {
    return this.membershipService.hasRole(userId, organizationId, requiredRole);
  }

  async checkMemberPermission(userId: string, organizationId: string, permission: string) {
    return this.membershipService.hasPermission(userId, organizationId, permission);
  }
}
```

### Entity Relationships

```typescript
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User, Organization } from '@bniddam/tenant-core/entities';

@Entity('projects')
export class Project {
  @Column()
  name: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column()
  createdById: string;
}
```

## API Reference

### Entities (`@bniddam/tenant-core/entities`)

- `User` - Base user entity
  - `id`, `email`, `firstName`, `lastName`
  - `organizations: OrganizationMember[]`
- `Organization` - Organization/tenant entity
  - `id`, `name`, `slug`, `settings`
  - `members: OrganizationMember[]`
- `OrganizationMember` - User-organization membership
  - `user`, `organization`, `role`
  - `joinedAt`, `invitedBy`
- `OrganizationRole` - Custom roles per organization
  - `name`, `permissions`
  - `organization`, `isDefault`

### Decorators (`@bniddam/tenant-core/decorators`)

- `@CurrentUser()` - Get current authenticated user
- `@CurrentOrganization()` - Get current organization from context
- `@CurrentMembership()` - Get current user's membership in organization
- `@OrganizationRoles(...roles)` - Require specific roles
- `@OrganizationPermissions(...permissions)` - Require specific permissions

### Guards (`@bniddam/tenant-core/guards`)

- `OrganizationContextGuard` - Extract organization from request
- `OrganizationRoleGuard` - Check user has required role
- `OrganizationPermissionGuard` - Check user has required permission

### Services (`@bniddam/tenant-core/services`)

- `MembershipService`
  - `getUserMemberships(userId)` - Get user's memberships
  - `getMemberRole(userId, organizationId)` - Get member's role
  - `hasRole(userId, organizationId, role)` - Check role
  - `hasPermission(userId, organizationId, permission)` - Check permission
  - `addMember(organizationId, userId, role)` - Add member
  - `removeMember(organizationId, userId)` - Remove member
  - `updateMemberRole(organizationId, userId, newRole)` - Update role

- `OrganizationContextService`
  - `getCurrentOrganization(request)` - Extract organization from request
  - `setOrganizationContext(request, organizationId)` - Set context

### Types (`@bniddam/tenant-core/types`)

- `TenantContext` - Tenant context type
- `MembershipInfo` - Membership information type
- `OrganizationSettings` - Organization settings type

## Multi-Tenancy Patterns

### Organization-Based Isolation

```typescript
@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly orgContext: OrganizationContextService,
  ) {}

  async findAll(request: Request): Promise<Project[]> {
    const organization = await this.orgContext.getCurrentOrganization(request);

    return this.projectRepo.find({
      where: { organizationId: organization.id },
    });
  }
}
```

### Row-Level Security (RLS)

For PostgreSQL RLS integration:

```typescript
// Enable RLS policies in your migrations
CREATE POLICY organization_isolation ON projects
  USING (organization_id = current_setting('app.current_organization_id')::uuid);
```

## Best Practices

1. **Always use guards**: Protect all organization-specific routes
2. **Validate organization access**: Check user membership before operations
3. **Use decorators**: Avoid manual context extraction
4. **Separate public routes**: Keep auth/public routes separate
5. **Audit trail**: Log all organization-level actions

## Peer Dependencies

This package requires:

- `@nestjs/common`: ^11.0.0
- `@nestjs/core`: ^11.0.0
- `@nestjs/typeorm`: ^11.0.0
- `typeorm`: ^0.3.20

Install them in your project:

```bash
pnpm add @nestjs/common @nestjs/core @nestjs/typeorm typeorm
```

## Development

```bash
# Install dependencies
pnpm install

# Link dependencies (required)
pnpm link --global @bniddam/core @bniddam/utils

# Build the package
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Requirements

- Node.js >= 20
- pnpm >= 9
- NestJS >= 11
- TypeORM >= 0.3
- PostgreSQL (recommended)

## License

MIT © bniddam
