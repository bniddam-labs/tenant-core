import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../entities/organization-member.entity';
import { OrganizationRole } from '../entities/organization-role.entity';
import { SystemRoleName } from '../types/tenant.types';

/**
 * Service for managing organization memberships
 *
 * This service handles adding, removing, and updating members
 * in organizations. Business-specific logic (like notifications,
 * plan limits, etc.) should be handled in the consuming application.
 */
@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationRole)
    private readonly roleRepository: Repository<OrganizationRole>,
  ) {}

  /**
   * Get a member by organization and user ID
   */
  async getMember(organizationId: string, userId: string): Promise<OrganizationMember | null> {
    return this.memberRepository.findOne({
      where: { organization: { id: organizationId }, user: { id: userId } },
      relations: ['role', 'user', 'organization'],
    });
  }

  /**
   * Add a member to an organization
   * NOTE: Business logic like plan limits and notifications should be handled
   * in the consuming application before calling this method
   */
  async addMember(
    organizationId: string,
    userId: string,
    roleId: string,
    invitedBy: string,
  ): Promise<OrganizationMember> {
    // Check if user is already a member
    const existing = await this.memberRepository.findOne({
      where: { organization: { id: organizationId }, user: { id: userId } },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this organization');
    }

    // Validate role exists
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const member = this.memberRepository.create({
      organization: { id: organizationId },
      user: { id: userId },
      role: { id: roleId },
      invitedBy,
      joinedAt: new Date(),
    });

    const saved = await this.memberRepository.save(member);
    await this.organizationRepository.increment({ id: organizationId }, 'membersCount', 1);

    this.logger.log(`Member added: userId=${userId}, orgId=${organizationId}`);

    return saved;
  }

  /**
   * Remove a member from an organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    const member = await this.getMember(organizationId, userId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if member is owner and if it's the last owner
    if (member.role?.name === SystemRoleName.OWNER) {
      const ownerCount = await this.getOwnerCount(organizationId);

      if (ownerCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the only Owner. Promote another member to Owner first.',
        );
      }
    }

    await this.memberRepository.remove(member);
    await this.organizationRepository.decrement({ id: organizationId }, 'membersCount', 1);

    this.logger.log(`Member removed: userId=${userId}, orgId=${organizationId}`);
  }

  /**
   * Change a member's role
   */
  async changeMemberRole(
    organizationId: string,
    userId: string,
    newRoleId: string,
  ): Promise<OrganizationMember> {
    const member = await this.getMember(organizationId, userId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Validate new role exists
    const newRole = await this.roleRepository.findOne({ where: { id: newRoleId } });
    if (!newRole) {
      throw new NotFoundException(`Role with ID ${newRoleId} not found`);
    }

    // Check if demoting last owner
    if (member.role?.name === SystemRoleName.OWNER && newRole.name !== SystemRoleName.OWNER) {
      const ownerCount = await this.getOwnerCount(organizationId);

      if (ownerCount <= 1) {
        throw new BadRequestException(
          'Cannot change role of the only Owner. Promote another member to Owner first.',
        );
      }
    }

    member.role = newRole;
    const updated = await this.memberRepository.save(member);

    this.logger.log(
      `Member role changed: userId=${userId}, orgId=${organizationId}, newRole=${newRole.name}`,
    );

    return updated;
  }

  /**
   * List all members of an organization
   */
  async listMembers(organizationId: string): Promise<OrganizationMember[]> {
    return this.memberRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['user', 'role'],
      order: { joinedAt: 'ASC' },
    });
  }

  /**
   * Get count of owners in an organization
   */
  private async getOwnerCount(organizationId: string): Promise<number> {
    const ownerRole = await this.roleRepository.findOne({
      where: {
        name: SystemRoleName.OWNER,
        isSystem: true,
      },
    });

    if (!ownerRole) {
      return 0;
    }

    return this.memberRepository.count({
      where: {
        organization: { id: organizationId },
        role: { id: ownerRole.id },
      },
    });
  }

  /**
   * Check if organization can add more members
   * NOTE: This is a basic check. Additional logic (like plan limits)
   * should be implemented in the consuming application
   */
  async canAddMoreMembers(organizationId: string): Promise<boolean> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }

    return organization.canInviteMoreMembers();
  }
}
