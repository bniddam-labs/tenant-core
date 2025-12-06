import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import type { OrganizationSettings } from '../types/tenant.types';
import { OrganizationTier } from '../types/tenant.types';
import { BaseEntity } from './base.entity';
import { OrganizationMember } from './organization-member.entity';
import { OrganizationRole } from './organization-role.entity';

/**
 * Generic Organization entity for multi-tenant SaaS applications
 */
@Entity('organizations')
@Index(['slug'], { unique: true })
@Index(['createdAt'])
@Index(['tier'])
@Index(['ownerId'])
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Column({
    type: 'enum',
    enum: OrganizationTier,
    default: OrganizationTier.FREE,
  })
  tier!: OrganizationTier;

  /**
   * Foreign key to the organization owner (User)
   * The consuming application manages the User entity
   */
  @Column({ type: 'uuid' })
  ownerId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  billingEmail?: string;

  @Column({
    type: 'jsonb',
    default: {
      allowMemberInvite: false,
      features: [],
    },
  })
  settings!: OrganizationSettings;

  @Column({ type: 'int', default: 0 })
  membersCount!: number;

  @Column({ type: 'boolean', default: false })
  isUpgraded!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(
    () => OrganizationMember,
    (member) => member.organization,
    {
      cascade: true,
    },
  )
  members!: Relation<OrganizationMember>[];

  @OneToMany(
    () => OrganizationRole,
    (role) => role.organization,
  )
  customRoles!: Relation<OrganizationRole>[];

  // Helper methods

  /**
   * Get member count
   */
  get memberCount(): number {
    if (typeof this.membersCount === 'number') {
      return this.membersCount;
    }
    return this.members?.length ?? 0;
  }

  /**
   * Check if organization can invite more members
   */
  canInviteMoreMembers(): boolean {
    if (!this.settings.maxMembers) {
      return true;
    }
    return this.memberCount < this.settings.maxMembers;
  }

  /**
   * Check if a feature is enabled for this organization
   */
  hasFeature(featureName: string): boolean {
    return this.settings.features?.includes(featureName) ?? false;
  }
}
