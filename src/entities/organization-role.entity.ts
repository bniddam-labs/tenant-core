import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from 'typeorm';
import {
  OrganizationPermission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '@bniddam-labs/tenant-core-shared';
import { BaseEntity } from './base.entity';
import { OrganizationMember } from './organization-member.entity';
import { Organization } from './organization.entity';

/**
 * Organization Role entity
 * Defines roles and permissions within an organization
 */
@Entity('organization_roles')
@Index(['organization', 'name'])
@Index(['isSystem'])
@Index(['isActive'])
export class OrganizationRole extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  displayName!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(
    () => Organization,
    (org) => org.customRoles,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'organizationId' })
  organization?: Relation<Organization>;

  @Column({ type: 'jsonb', default: [] })
  permissions!: (OrganizationPermission | '*')[];

  @Column({ type: 'boolean', default: false })
  isSystem!: boolean; // true for owner/admin/member/viewer

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(
    () => OrganizationMember,
    (member) => member.role,
  )
  members!: Relation<OrganizationMember>[];

  // Helper methods - delegate to shared business logic

  /**
   * Check if role has a specific permission
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasPermission(permission: OrganizationPermission): boolean {
    return hasPermission(this.permissions, permission);
  }

  /**
   * Check if role has any of the given permissions
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasAnyPermission(permissions: OrganizationPermission[]): boolean {
    return hasAnyPermission(this.permissions, permissions);
  }

  /**
   * Check if role has all of the given permissions
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasAllPermissions(permissions: OrganizationPermission[]): boolean {
    return hasAllPermissions(this.permissions, permissions);
  }
}
