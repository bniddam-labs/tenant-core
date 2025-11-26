import { Column, Entity, Index, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationRole } from './organization-role.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

/**
 * Organization Member entity
 * Links users to organizations with roles
 */
@Entity('organization_members')
@Index(['user', 'organization'], { unique: true })
@Index(['organization'])
@Index(['user'])
@Index(['role'])
export class OrganizationMember extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;

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
