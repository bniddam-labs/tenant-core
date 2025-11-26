import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { OrganizationPermission } from '../types/tenant.types';
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

  // Helper methods

  /**
   * Check if role has a specific permission
   */
  hasPermission(permission: OrganizationPermission): boolean {
    return this.permissions.includes(permission) || this.permissions.includes('*');
  }

  /**
   * Check if role has any of the given permissions
   */
  hasAnyPermission(permissions: OrganizationPermission[]): boolean {
    if (this.permissions.includes('*')) {
      return true;
    }
    return permissions.some((p) => this.permissions.includes(p));
  }

  /**
   * Check if role has all of the given permissions
   */
  hasAllPermissions(permissions: OrganizationPermission[]): boolean {
    if (this.permissions.includes('*')) {
      return true;
    }
    return permissions.every((p) => this.permissions.includes(p));
  }
}
