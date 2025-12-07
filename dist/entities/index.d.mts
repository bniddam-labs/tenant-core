import { Relation } from 'typeorm';
import { OrganizationPermission, OrganizationTier, OrganizationSettings } from '@bniddam-labs/tenant-core-shared';

/**
 * Base entity with common fields for all tenant entities
 */
declare abstract class BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

/**
 * Organization Role entity
 * Defines roles and permissions within an organization
 */
declare class OrganizationRole extends BaseEntity {
    name: string;
    displayName: string;
    description?: string;
    organization?: Relation<Organization>;
    permissions: (OrganizationPermission | '*')[];
    isSystem: boolean;
    isActive: boolean;
    members: Relation<OrganizationMember>[];
    /**
     * Check if role has a specific permission
     * Uses shared logic from @bniddam-labs/tenant-core-shared
     */
    hasPermission(permission: OrganizationPermission): boolean;
    /**
     * Check if role has any of the given permissions
     * Uses shared logic from @bniddam-labs/tenant-core-shared
     */
    hasAnyPermission(permissions: OrganizationPermission[]): boolean;
    /**
     * Check if role has all of the given permissions
     * Uses shared logic from @bniddam-labs/tenant-core-shared
     */
    hasAllPermissions(permissions: OrganizationPermission[]): boolean;
}

/**
 * Organization Member entity
 * Links users to organizations with roles
 *
 * NOTE: This entity stores userId as a string reference.
 * The consuming application should create their own User entity
 * and establish the relation if needed.
 *
 * @example
 * ```typescript
 * // In your User entity:
 * @OneToMany(() => OrganizationMember, member => member.userId)
 * organizationMemberships: OrganizationMember[];
 * ```
 */
declare class OrganizationMember extends BaseEntity {
    /**
     * Foreign key to the user
     * The consuming application manages the User entity
     */
    userId: string;
    organization: Relation<Organization>;
    role: Relation<OrganizationRole>;
    joinedAt: Date;
    invitedBy?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Generic Organization entity for multi-tenant SaaS applications
 */
declare class Organization extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    tier: OrganizationTier;
    /**
     * Foreign key to the organization owner (User)
     * The consuming application manages the User entity
     */
    ownerId: string;
    billingEmail?: string;
    settings: OrganizationSettings;
    membersCount: number;
    isUpgraded: boolean;
    isActive: boolean;
    members: Relation<OrganizationMember>[];
    customRoles: Relation<OrganizationRole>[];
    /**
     * Get member count
     */
    get memberCount(): number;
    /**
     * Check if organization can invite more members
     */
    canInviteMoreMembers(): boolean;
    /**
     * Check if a feature is enabled for this organization
     */
    hasFeature(featureName: string): boolean;
}

export { BaseEntity, Organization, OrganizationMember, OrganizationRole };
