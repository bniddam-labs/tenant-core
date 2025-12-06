# @bniddam-labs/tenant-core-nestjs

Multi-tenant core infrastructure for NestJS SaaS applications. Provides entities, services, decorators, and guards for organization-based multi-tenancy with role-based access control (RBAC).

> **⚠️ Important**: This package does NOT include a User entity to avoid conflicts with your application's User entity. You define your own User entity - see [Quick Start](#quick-start) below.

## Features

- **TypeORM Entities**: Organization, OrganizationMember, OrganizationRole (no User entity - you define your own!)
- **User Interface**: `IUser` interface for type safety without entity conflicts
- **Multi-Tenancy**: Organization-based data isolation
- **RBAC**: Role-based access control with permissions
- **Decorators**: @CurrentUser, @CurrentOrganization, @CurrentMembership
- **Guards**: OrganizationRoleGuard, OrganizationPermissionGuard, OrganizationContextGuard
- **Services**: MembershipService, OrganizationContextService
- **TypeScript**: Full type safety with TypeORM and NestJS
- **Flexible**: Easily extendable for custom business logic
- **No Conflicts**: Your User entity, your way

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

## Quick Start

### Step 1: Define Your User Entity

This package does NOT include a User entity. Define your own with whatever fields you need:

```typescript
// src/users/entities/user.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@bniddam-labs/tenant-core-nestjs/entities';
import { IUser } from '@bniddam-labs/tenant-core-nestjs/types';
import { OrganizationMember } from '@bniddam-labs/tenant-core-nestjs/entities';

@Entity('users')
export class User extends BaseEntity implements IUser {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  // Optional: Add relation to memberships
  @OneToMany(() => OrganizationMember, member => member.userId)
  organizationMemberships?: OrganizationMember[];

  // Add any other fields you need!
}
```

### Step 2: Module Setup

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantCoreModule } from '@bniddam-labs/tenant-core-nestjs';
import { Organization, OrganizationMember, OrganizationRole } from '@bniddam-labs/tenant-core-nestjs/entities';
import { User } from './users/entities/user.entity'; // Your User entity

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // ... database config
      entities: [
        User, // Your User entity
        Organization,
        OrganizationMember,
        OrganizationRole,
      ],
    }),
    TypeOrmModule.forFeature([User]), // Make User available
    TenantCoreModule, // Provides Organization entities and services
  ],
})
export class AppModule {}
```

### Step 3: Using Decorators

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import {
  CurrentUser,
  CurrentOrganization,
  CurrentMembership
} from '@bniddam-labs/tenant-core-nestjs/decorators';
import { Organization, OrganizationMember } from '@bniddam-labs/tenant-core-nestjs/entities';
import { User } from './users/entities/user.entity'; // Your User entity

@Controller('projects')
export class ProjectsController {
  @Get()
  async findAll(
    @CurrentUser() user: User, // Your User type
    @CurrentOrganization() organization: Organization,
    @CurrentMembership() membership: OrganizationMember,
  ) {
    // Access current user, organization, and membership
    return this.projectsService.findByOrganization(organization.id);
  }

  @Post()
  async create(
    @CurrentUser() user: User, // Your User type
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
import { Organization } from '@bniddam-labs/tenant-core-nestjs/entities';
import { User } from '../users/entities/user.entity'; // Your User entity

@Entity('projects')
export class Project {
  @Column()
  name: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: string;

  // You can create relations to your User entity
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

## Architecture Decision: No User Entity

This package intentionally **does not include a User entity**. Here's why:

### The Problem
Most NestJS applications already have a User entity with custom fields (firstName, lastName, avatarUrl, subscriptionPlan, etc.). Including a User entity in this package would:
- ❌ Conflict with your existing User entity
- ❌ Force you to extend or merge entities
- ❌ Limit your flexibility to customize user fields
- ❌ Create tight coupling between this library and your user management

### The Solution
We provide:
- ✅ `IUser` interface - defines the minimal contract (just `id` and `email`)
- ✅ `userId: string` fields - store references without enforcing relationships
- ✅ Full flexibility - add whatever fields you need to your User entity
- ✅ Clean separation - organization logic separate from user logic

### How OrganizationMember Works
```typescript
// OrganizationMember stores just the userId
@Entity('organization_members')
export class OrganizationMember {
  @Column({ type: 'uuid' })
  userId: string; // Reference to your User entity

  @ManyToOne(() => Organization)
  organization: Organization;

  @ManyToOne(() => OrganizationRole)
  role: OrganizationRole;
}

// Your User entity (optional: add the reverse relation)
@Entity('users')
export class User implements IUser {
  id: string;
  email: string;
  // ... your custom fields

  @OneToMany(() => OrganizationMember, m => m.userId)
  memberships?: OrganizationMember[];
}
```

This approach gives you complete control over your User entity while providing all the multi-tenant organization features you need!

### Migration from Previous Version
If you were using an older version that included a User entity, see [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for detailed migration instructions.

## Requirements

- Node.js >= 20
- pnpm >= 9
- NestJS >= 11
- TypeORM >= 0.3
- PostgreSQL (recommended)

## License

MIT © bniddam
