import { Repository } from 'typeorm';
import { Organization, OrganizationMember, OrganizationRole } from '../entities/index.mjs';
import { SystemRoleName } from '@bniddam-labs/tenant-core-shared';

/**
 * Service for managing organization context in requests
 *
 * This service provides helpers to retrieve and validate
 * the current organization and user's membership within it.
 */
declare class OrganizationContextService {
    private readonly organizationRepository;
    private readonly memberRepository;
    constructor(organizationRepository: Repository<Organization>, memberRepository: Repository<OrganizationMember>);
    /**
     * Get organization by ID
     */
    getOrganization(organizationId: string): Promise<Organization>;
    /**
     * Get user's membership in an organization
     */
    getMembership(organizationId: string, userId: string): Promise<OrganizationMember | null>;
    /**
     * Check if user is a member of an organization
     */
    isMember(organizationId: string, userId: string): Promise<boolean>;
    /**
     * Check if user has a specific role in an organization
     */
    hasRole(organizationId: string, userId: string, roleName: SystemRoleName): Promise<boolean>;
    /**
     * Check if user has any of the specified roles in an organization
     */
    hasAnyRole(organizationId: string, userId: string, roleNames: SystemRoleName[]): Promise<boolean>;
    /**
     * Check if user is owner of an organization
     */
    isOwner(organizationId: string, userId: string): Promise<boolean>;
    /**
     * Check if user is admin or owner of an organization
     */
    isAdminOrOwner(organizationId: string, userId: string): Promise<boolean>;
    /**
     * Get all organizations where user is a member
     */
    getUserOrganizations(userId: string): Promise<OrganizationMember[]>;
}

/**
 * Service for managing organization memberships
 *
 * This service handles adding, removing, and updating members
 * in organizations. Business-specific logic (like notifications,
 * plan limits, etc.) should be handled in the consuming application.
 */
declare class MembershipService {
    private readonly memberRepository;
    private readonly organizationRepository;
    private readonly roleRepository;
    private readonly logger;
    constructor(memberRepository: Repository<OrganizationMember>, organizationRepository: Repository<Organization>, roleRepository: Repository<OrganizationRole>);
    /**
     * Get a member by organization and user ID
     */
    getMember(organizationId: string, userId: string): Promise<OrganizationMember | null>;
    /**
     * Add a member to an organization
     * NOTE: Business logic like plan limits and notifications should be handled
     * in the consuming application before calling this method
     */
    addMember(organizationId: string, userId: string, roleId: string, invitedBy: string): Promise<OrganizationMember>;
    /**
     * Remove a member from an organization
     */
    removeMember(organizationId: string, userId: string): Promise<void>;
    /**
     * Change a member's role
     */
    changeMemberRole(organizationId: string, userId: string, newRoleId: string): Promise<OrganizationMember>;
    /**
     * List all members of an organization
     */
    listMembers(organizationId: string): Promise<OrganizationMember[]>;
    /**
     * Get count of owners in an organization
     */
    private getOwnerCount;
    /**
     * Check if organization can add more members
     * NOTE: This is a basic check. Additional logic (like plan limits)
     * should be implemented in the consuming application
     */
    canAddMoreMembers(organizationId: string): Promise<boolean>;
}

export { MembershipService, OrganizationContextService };
