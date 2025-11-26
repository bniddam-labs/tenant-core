import { Exclude } from 'class-transformer';
import { Column, Entity, Index, ManyToMany, OneToMany, type Relation } from 'typeorm';
import { UserStatus } from '../types/tenant.types';
import { BaseEntity } from './base.entity';
import { OrganizationMember } from './organization-member.entity';

/**
 * Generic User entity for multi-tenant SaaS applications
 *
 * NOTE: Business-specific fields (like subscriptionPlan, stripeCustomerId, avatarFile, etc.)
 * should be added in the consuming application by extending this entity or creating
 * a UserProfile entity with a OneToOne relationship.
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['email', 'deletedAt'])
@Index(['status'])
@Index(['status', 'deletedAt'])
@Index(['lastLoginAt'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date | null;

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled!: boolean;

  /**
   * User's memberships in organizations
   */
  @OneToMany(
    () => OrganizationMember,
    (member) => member.user,
    {
      cascade: false,
      eager: false,
    },
  )
  organizationMemberships!: Relation<OrganizationMember>[];

  /**
   * Check if user has any organization memberships
   */
  hasOrganizations(): boolean {
    return (this.organizationMemberships?.length ?? 0) > 0;
  }

  /**
   * Get all organizations where user is a member
   */
  getOrganizations(): OrganizationMember[] {
    return this.organizationMemberships ?? [];
  }
}
