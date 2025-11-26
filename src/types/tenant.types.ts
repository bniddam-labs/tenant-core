/**
 * Multi-tenant types and enums for SaaS applications
 */

/**
 * User status enum
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  PENDING_VERIFICATION = 'pending_verification',
}

/**
 * Organization tier/plan enum
 */
export enum OrganizationTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

/**
 * System role names for organization members
 */
export enum SystemRoleName {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

/**
 * Granular permissions for organizations
 * These can be extended per application needs
 */
export enum OrganizationPermission {
  // Organization management
  ORG_READ = 'organization.read',
  ORG_UPDATE = 'organization.update',
  ORG_DELETE = 'organization.delete',
  ORG_SETTINGS = 'organization.settings',

  // Member management
  MEMBERS_READ = 'organization.members.read',
  MEMBERS_INVITE = 'organization.members.invite',
  MEMBERS_MANAGE = 'organization.members.manage',
  MEMBERS_REMOVE = 'organization.members.remove',

  // Role management
  ROLES_READ = 'organization.roles.read',
  ROLES_CREATE = 'organization.roles.create',
  ROLES_UPDATE = 'organization.roles.update',
  ROLES_DELETE = 'organization.roles.delete',

  // Content management (generic, can be adapted)
  CONTENT_CREATE = 'organization.content.create',
  CONTENT_READ = 'organization.content.read',
  CONTENT_UPDATE = 'organization.content.update',
  CONTENT_DELETE = 'organization.content.delete',
  CONTENT_PUBLISH = 'organization.content.publish',

  // Client management (if applicable)
  CLIENTS_READ = 'organization.clients.read',
  CLIENTS_CREATE = 'organization.clients.create',
  CLIENTS_UPDATE = 'organization.clients.update',
  CLIENTS_DELETE = 'organization.clients.delete',
  CLIENTS_MANAGE_PORTAL = 'organization.clients.manage_portal',

  // Billing
  BILLING_READ = 'organization.billing.read',
  BILLING_MANAGE = 'organization.billing.manage',
}

/**
 * Organization settings interface
 */
export interface OrganizationSettings {
  /** Whether members can invite other members */
  allowMemberInvite: boolean;
  /** Default role ID for new members */
  defaultRoleId?: string;
  /** Feature flags */
  features: string[];
  /** Custom domain (if applicable) */
  customDomain?: string;
  /** Maximum number of members (according to plan) */
  maxMembers?: number;
}

/**
 * Organization context for current request
 */
export interface OrganizationContext {
  /** Current organization ID */
  organizationId: string;
  /** Current user ID */
  userId: string;
  /** User's roles in this organization */
  roles: SystemRoleName[];
  /** User's permissions in this organization */
  permissions: (OrganizationPermission | '*')[];
}

/**
 * Authenticated request interface
 * Extended by backend applications
 */
export interface TenantRequest {
  /** Authenticated user */
  user: any;
  /** Current organization ID */
  organizationId?: string;
  /** Current organization membership */
  organizationMembership?: any;
}
