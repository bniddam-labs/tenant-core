import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity.js';
import { OrganizationMember } from '../entities/organization-member.entity.js';
import { SystemRoleName } from '../types/tenant.types.js';

/**
 * Service for managing organization context in requests
 *
 * This service provides helpers to retrieve and validate
 * the current organization and user's membership within it.
 */
@Injectable()
export class OrganizationContextService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }

    if (!organization.isActive) {
      throw new NotFoundException(`Organization with ID ${organizationId} is not active`);
    }

    return organization;
  }

  /**
   * Get user's membership in an organization
   */
  async getMembership(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationMember | null> {
    return this.memberRepository.findOne({
      where: {
        organization: { id: organizationId },
        userId,
      },
      relations: ['role', 'organization'],
    });
  }

  /**
   * Check if user is a member of an organization
   */
  async isMember(organizationId: string, userId: string): Promise<boolean> {
    const membership = await this.getMembership(organizationId, userId);
    return membership !== null;
  }

  /**
   * Check if user has a specific role in an organization
   */
  async hasRole(
    organizationId: string,
    userId: string,
    roleName: SystemRoleName,
  ): Promise<boolean> {
    const membership = await this.getMembership(organizationId, userId);
    return membership?.role?.name === roleName;
  }

  /**
   * Check if user has any of the specified roles in an organization
   */
  async hasAnyRole(
    organizationId: string,
    userId: string,
    roleNames: SystemRoleName[],
  ): Promise<boolean> {
    const membership = await this.getMembership(organizationId, userId);
    return membership?.role ? roleNames.includes(membership.role.name as SystemRoleName) : false;
  }

  /**
   * Check if user is owner of an organization
   */
  async isOwner(organizationId: string, userId: string): Promise<boolean> {
    return this.hasRole(organizationId, userId, SystemRoleName.OWNER);
  }

  /**
   * Check if user is admin or owner of an organization
   */
  async isAdminOrOwner(organizationId: string, userId: string): Promise<boolean> {
    return this.hasAnyRole(organizationId, userId, [SystemRoleName.OWNER, SystemRoleName.ADMIN]);
  }

  /**
   * Get all organizations where user is a member
   */
  async getUserOrganizations(userId: string): Promise<OrganizationMember[]> {
    return this.memberRepository.find({
      where: { userId },
      relations: ['organization', 'role'],
    });
  }
}
