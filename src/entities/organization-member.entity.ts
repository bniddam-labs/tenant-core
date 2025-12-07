import { Column, Entity, Index, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { OrganizationRole } from './organization-role.entity.js';
import { Organization } from './organization.entity.js';

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
@Entity('organization_members')
@Index(['userId', 'organization'], { unique: true })
@Index(['organization'])
@Index(['userId'])
@Index(['role'])
export class OrganizationMember extends BaseEntity {
  /**
   * Foreign key to the user
   * The consuming application manages the User entity
   */
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(
    () => Organization,
    (org) => org.members,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinColumn({ name: 'organizationId' })
  organization!: Relation<Organization>;

  @ManyToOne(() => OrganizationRole, { eager: false })
  @JoinColumn({ name: 'roleId' })
  role!: Relation<OrganizationRole>;
          
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  invitedBy?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;
}
