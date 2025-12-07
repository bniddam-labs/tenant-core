import { createParamDecorator, Injectable, Module, NotFoundException, Logger, ConflictException, BadRequestException, SetMetadata, ForbiddenException } from '@nestjs/common';
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, ManyToOne, JoinColumn, OneToMany, Entity, Index } from 'typeorm';
import * as tenant_core_shared_star from '@bniddam-labs/tenant-core-shared';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@bniddam-labs/tenant-core-shared';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BaseEntity: () => BaseEntity,
  CurrentMembership: () => CurrentMembership,
  CurrentOrganization: () => CurrentOrganization,
  CurrentUser: () => CurrentUser,
  MembershipService: () => MembershipService,
  ORGANIZATION_PERMISSIONS_KEY: () => ORGANIZATION_PERMISSIONS_KEY,
  ORGANIZATION_ROLES_KEY: () => ORGANIZATION_ROLES_KEY,
  Organization: () => Organization,
  OrganizationContextGuard: () => OrganizationContextGuard,
  OrganizationContextService: () => OrganizationContextService,
  OrganizationMember: () => OrganizationMember,
  OrganizationPermissionGuard: () => OrganizationPermissionGuard,
  OrganizationRole: () => OrganizationRole,
  OrganizationRoleGuard: () => OrganizationRoleGuard,
  RequireOrganizationPermissions: () => RequireOrganizationPermissions,
  RequireOrganizationRoles: () => RequireOrganizationRoles,
  TenantCoreModule: () => TenantCoreModule
});
var CurrentUser = createParamDecorator(
  (_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
var CurrentOrganization = createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationId;
});
var CurrentMembership = createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationMembership;
});
var ORGANIZATION_ROLES_KEY = "organization_roles";
var RequireOrganizationRoles = (...roles) => SetMetadata(ORGANIZATION_ROLES_KEY, roles);
var ORGANIZATION_PERMISSIONS_KEY = "organization_permissions";
var RequireOrganizationPermissions = (...permissions) => SetMetadata(ORGANIZATION_PERMISSIONS_KEY, permissions);
var BaseEntity = class {
  id;
  createdAt;
  updatedAt;
  deletedAt;
};
__decorateClass([
  PrimaryGeneratedColumn("uuid")
], BaseEntity.prototype, "id", 2);
__decorateClass([
  CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
], BaseEntity.prototype, "createdAt", 2);
__decorateClass([
  UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
], BaseEntity.prototype, "updatedAt", 2);
__decorateClass([
  DeleteDateColumn({
    type: "timestamptz",
    nullable: true
  })
], BaseEntity.prototype, "deletedAt", 2);

// src/types/tenant.types.ts
var tenant_types_exports = {};
__reExport(tenant_types_exports, tenant_core_shared_star);
var OrganizationRole = class extends BaseEntity {
  name;
  displayName;
  description;
  organization;
  permissions;
  isSystem;
  isActive;
  members;
  // Helper methods - delegate to shared business logic
  /**
   * Check if role has a specific permission
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasPermission(permission) {
    return hasPermission(this.permissions, permission);
  }
  /**
   * Check if role has any of the given permissions
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasAnyPermission(permissions) {
    return hasAnyPermission(this.permissions, permissions);
  }
  /**
   * Check if role has all of the given permissions
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasAllPermissions(permissions) {
    return hasAllPermissions(this.permissions, permissions);
  }
};
__decorateClass([
  Column({ type: "varchar", length: 100 })
], OrganizationRole.prototype, "name", 2);
__decorateClass([
  Column({ type: "varchar", length: 255 })
], OrganizationRole.prototype, "displayName", 2);
__decorateClass([
  Column({ type: "text", nullable: true })
], OrganizationRole.prototype, "description", 2);
__decorateClass([
  ManyToOne(
    () => Organization,
    (org) => org.customRoles,
    {
      nullable: true,
      onDelete: "CASCADE"
    }
  ),
  JoinColumn({ name: "organizationId" })
], OrganizationRole.prototype, "organization", 2);
__decorateClass([
  Column({ type: "jsonb", default: [] })
], OrganizationRole.prototype, "permissions", 2);
__decorateClass([
  Column({ type: "boolean", default: false })
], OrganizationRole.prototype, "isSystem", 2);
__decorateClass([
  Column({ type: "boolean", default: true })
], OrganizationRole.prototype, "isActive", 2);
__decorateClass([
  OneToMany(
    () => OrganizationMember,
    (member) => member.role
  )
], OrganizationRole.prototype, "members", 2);
OrganizationRole = __decorateClass([
  Entity("organization_roles"),
  Index(["organization", "name"]),
  Index(["isSystem"]),
  Index(["isActive"])
], OrganizationRole);

// src/entities/organization-member.entity.ts
var OrganizationMember = class extends BaseEntity {
  userId;
  organization;
  role;
  joinedAt;
  invitedBy;
  metadata;
};
__decorateClass([
  Column({ type: "uuid" })
], OrganizationMember.prototype, "userId", 2);
__decorateClass([
  ManyToOne(
    () => Organization,
    (org) => org.members,
    {
      onDelete: "CASCADE",
      eager: false
    }
  ),
  JoinColumn({ name: "organizationId" })
], OrganizationMember.prototype, "organization", 2);
__decorateClass([
  ManyToOne(() => OrganizationRole, { eager: false }),
  JoinColumn({ name: "roleId" })
], OrganizationMember.prototype, "role", 2);
__decorateClass([
  Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
], OrganizationMember.prototype, "joinedAt", 2);
__decorateClass([
  Column({ type: "uuid", nullable: true })
], OrganizationMember.prototype, "invitedBy", 2);
__decorateClass([
  Column({ type: "jsonb", nullable: true })
], OrganizationMember.prototype, "metadata", 2);
OrganizationMember = __decorateClass([
  Entity("organization_members"),
  Index(["userId", "organization"], { unique: true }),
  Index(["organization"]),
  Index(["userId"]),
  Index(["role"])
], OrganizationMember);

// src/entities/organization.entity.ts
var Organization = class extends BaseEntity {
  name;
  slug;
  description;
  logoUrl;
  tier;
  ownerId;
  billingEmail;
  settings;
  membersCount;
  isUpgraded;
  isActive;
  members;
  customRoles;
  // Helper methods
  /**
   * Get member count
   */
  get memberCount() {
    if (typeof this.membersCount === "number") {
      return this.membersCount;
    }
    return this.members?.length ?? 0;
  }
  /**
   * Check if organization can invite more members
   */
  canInviteMoreMembers() {
    if (!this.settings.maxMembers) {
      return true;
    }
    return this.memberCount < this.settings.maxMembers;
  }
  /**
   * Check if a feature is enabled for this organization
   */
  hasFeature(featureName) {
    return this.settings.features?.includes(featureName) ?? false;
  }
};
__decorateClass([
  Column({ type: "varchar", length: 255 })
], Organization.prototype, "name", 2);
__decorateClass([
  Column({ type: "varchar", length: 255, unique: true })
], Organization.prototype, "slug", 2);
__decorateClass([
  Column({ type: "text", nullable: true })
], Organization.prototype, "description", 2);
__decorateClass([
  Column({ type: "varchar", length: 500, nullable: true })
], Organization.prototype, "logoUrl", 2);
__decorateClass([
  Column({
    type: "enum",
    enum: tenant_types_exports.OrganizationTier,
    default: tenant_types_exports.OrganizationTier.FREE
  })
], Organization.prototype, "tier", 2);
__decorateClass([
  Column({ type: "uuid" })
], Organization.prototype, "ownerId", 2);
__decorateClass([
  Column({ type: "varchar", length: 255, nullable: true })
], Organization.prototype, "billingEmail", 2);
__decorateClass([
  Column({
    type: "jsonb",
    default: {
      allowMemberInvite: false,
      features: []
    }
  })
], Organization.prototype, "settings", 2);
__decorateClass([
  Column({ type: "int", default: 0 })
], Organization.prototype, "membersCount", 2);
__decorateClass([
  Column({ type: "boolean", default: false })
], Organization.prototype, "isUpgraded", 2);
__decorateClass([
  Column({ type: "boolean", default: true })
], Organization.prototype, "isActive", 2);
__decorateClass([
  OneToMany(
    () => OrganizationMember,
    (member) => member.organization,
    {
      cascade: true
    }
  )
], Organization.prototype, "members", 2);
__decorateClass([
  OneToMany(
    () => OrganizationRole,
    (role) => role.organization
  )
], Organization.prototype, "customRoles", 2);
Organization = __decorateClass([
  Entity("organizations"),
  Index(["slug"], { unique: true }),
  Index(["createdAt"]),
  Index(["tier"]),
  Index(["ownerId"])
], Organization);
var OrganizationContextGuard = class {
  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.params?.organizationId || request.headers?.["x-organization-id"] || request.query?.organizationId;
    if (!organizationId) {
      throw new ForbiddenException("Organization context is required");
    }
    request.organizationId = organizationId;
    return true;
  }
};
OrganizationContextGuard = __decorateClass([
  Injectable()
], OrganizationContextGuard);
var OrganizationRoleGuard = class {
  constructor(reflector) {
    this.reflector = reflector;
  }
  canActivate(context) {
    if (context.getType() !== "http") {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride(
      ORGANIZATION_ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const membership = request.organizationMembership;
    if (!membership) {
      throw new ForbiddenException("Organization membership not found in request context");
    }
    if (!membership.role) {
      throw new ForbiddenException("User has no role assigned in this organization");
    }
    const userRoleName = membership.role.name;
    const hasRequiredRole = requiredRoles.includes(userRoleName);
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(", ")}. User role: ${userRoleName}`
      );
    }
    return true;
  }
};
OrganizationRoleGuard = __decorateClass([
  Injectable()
], OrganizationRoleGuard);
var OrganizationPermissionGuard = class {
  constructor(reflector) {
    this.reflector = reflector;
  }
  canActivate(context) {
    if (context.getType() !== "http") {
      return true;
    }
    const requiredPermissions = this.reflector.getAllAndOverride(
      ORGANIZATION_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const membership = request.organizationMembership;
    if (!membership) {
      throw new ForbiddenException("Organization membership not found in request context");
    }
    if (!membership.role) {
      throw new ForbiddenException("User has no role assigned in this organization");
    }
    const role = membership.role;
    const hasAllPermissions2 = requiredPermissions.every(
      (permission) => role.permissions.includes(permission) || role.permissions.includes("*")
    );
    if (!hasAllPermissions2) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !role.permissions.includes(permission) && !role.permissions.includes("*")
      );
      throw new ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(", ")}`
      );
    }
    return true;
  }
};
OrganizationPermissionGuard = __decorateClass([
  Injectable()
], OrganizationPermissionGuard);
var OrganizationContextService = class {
  constructor(organizationRepository, memberRepository) {
    this.organizationRepository = organizationRepository;
    this.memberRepository = memberRepository;
  }
  /**
   * Get organization by ID
   */
  async getOrganization(organizationId) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId }
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
  async getMembership(organizationId, userId) {
    return this.memberRepository.findOne({
      where: {
        organization: { id: organizationId },
        userId
      },
      relations: ["role", "organization"]
    });
  }
  /**
   * Check if user is a member of an organization
   */
  async isMember(organizationId, userId) {
    const membership = await this.getMembership(organizationId, userId);
    return membership !== null;
  }
  /**
   * Check if user has a specific role in an organization
   */
  async hasRole(organizationId, userId, roleName) {
    const membership = await this.getMembership(organizationId, userId);
    return membership?.role?.name === roleName;
  }
  /**
   * Check if user has any of the specified roles in an organization
   */
  async hasAnyRole(organizationId, userId, roleNames) {
    const membership = await this.getMembership(organizationId, userId);
    return membership?.role ? roleNames.includes(membership.role.name) : false;
  }
  /**
   * Check if user is owner of an organization
   */
  async isOwner(organizationId, userId) {
    return this.hasRole(organizationId, userId, tenant_types_exports.SystemRoleName.OWNER);
  }
  /**
   * Check if user is admin or owner of an organization
   */
  async isAdminOrOwner(organizationId, userId) {
    return this.hasAnyRole(organizationId, userId, [tenant_types_exports.SystemRoleName.OWNER, tenant_types_exports.SystemRoleName.ADMIN]);
  }
  /**
   * Get all organizations where user is a member
   */
  async getUserOrganizations(userId) {
    return this.memberRepository.find({
      where: { userId },
      relations: ["organization", "role"]
    });
  }
};
OrganizationContextService = __decorateClass([
  Injectable(),
  __decorateParam(0, InjectRepository(Organization)),
  __decorateParam(1, InjectRepository(OrganizationMember))
], OrganizationContextService);
var MembershipService = class {
  constructor(memberRepository, organizationRepository, roleRepository) {
    this.memberRepository = memberRepository;
    this.organizationRepository = organizationRepository;
    this.roleRepository = roleRepository;
  }
  logger = new Logger(MembershipService.name);
  /**
   * Get a member by organization and user ID
   */
  async getMember(organizationId, userId) {
    return this.memberRepository.findOne({
      where: { organization: { id: organizationId }, userId },
      relations: ["role", "organization"]
    });
  }
  /**
   * Add a member to an organization
   * NOTE: Business logic like plan limits and notifications should be handled
   * in the consuming application before calling this method
   */
  async addMember(organizationId, userId, roleId, invitedBy) {
    const existing = await this.memberRepository.findOne({
      where: { organization: { id: organizationId }, userId }
    });
    if (existing) {
      throw new ConflictException("User is already a member of this organization");
    }
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    const member = this.memberRepository.create({
      organization: { id: organizationId },
      userId,
      role: { id: roleId },
      invitedBy,
      joinedAt: /* @__PURE__ */ new Date()
    });
    const saved = await this.memberRepository.save(member);
    await this.organizationRepository.increment({ id: organizationId }, "membersCount", 1);
    this.logger.log(`Member added: userId=${userId}, orgId=${organizationId}`);
    return saved;
  }
  /**
   * Remove a member from an organization
   */
  async removeMember(organizationId, userId) {
    const member = await this.getMember(organizationId, userId);
    if (!member) {
      throw new NotFoundException("Member not found");
    }
    if (member.role?.name === tenant_types_exports.SystemRoleName.OWNER) {
      const ownerCount = await this.getOwnerCount(organizationId);
      if (ownerCount <= 1) {
        throw new BadRequestException(
          "Cannot remove the only Owner. Promote another member to Owner first."
        );
      }
    }
    await this.memberRepository.remove(member);
    await this.organizationRepository.decrement({ id: organizationId }, "membersCount", 1);
    this.logger.log(`Member removed: userId=${userId}, orgId=${organizationId}`);
  }
  /**
   * Change a member's role
   */
  async changeMemberRole(organizationId, userId, newRoleId) {
    const member = await this.getMember(organizationId, userId);
    if (!member) {
      throw new NotFoundException("Member not found");
    }
    const newRole = await this.roleRepository.findOne({ where: { id: newRoleId } });
    if (!newRole) {
      throw new NotFoundException(`Role with ID ${newRoleId} not found`);
    }
    if (member.role?.name === tenant_types_exports.SystemRoleName.OWNER && newRole.name !== tenant_types_exports.SystemRoleName.OWNER) {
      const ownerCount = await this.getOwnerCount(organizationId);
      if (ownerCount <= 1) {
        throw new BadRequestException(
          "Cannot change role of the only Owner. Promote another member to Owner first."
        );
      }
    }
    member.role = newRole;
    const updated = await this.memberRepository.save(member);
    this.logger.log(
      `Member role changed: userId=${userId}, orgId=${organizationId}, newRole=${newRole.name}`
    );
    return updated;
  }
  /**
   * List all members of an organization
   */
  async listMembers(organizationId) {
    return this.memberRepository.find({
      where: { organization: { id: organizationId } },
      relations: ["role"],
      order: { joinedAt: "ASC" }
    });
  }
  /**
   * Get count of owners in an organization
   */
  async getOwnerCount(organizationId) {
    const ownerRole = await this.roleRepository.findOne({
      where: {
        name: tenant_types_exports.SystemRoleName.OWNER,
        isSystem: true
      }
    });
    if (!ownerRole) {
      return 0;
    }
    return this.memberRepository.count({
      where: {
        organization: { id: organizationId },
        role: { id: ownerRole.id }
      }
    });
  }
  /**
   * Check if organization can add more members
   * NOTE: This is a basic check. Additional logic (like plan limits)
   * should be implemented in the consuming application
   */
  async canAddMoreMembers(organizationId) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId }
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    return organization.canInviteMoreMembers();
  }
};
MembershipService = __decorateClass([
  Injectable(),
  __decorateParam(0, InjectRepository(OrganizationMember)),
  __decorateParam(1, InjectRepository(Organization)),
  __decorateParam(2, InjectRepository(OrganizationRole))
], MembershipService);
var TenantCoreModule = class {
};
TenantCoreModule = __decorateClass([
  Module({
    imports: [TypeOrmModule.forFeature([Organization, OrganizationMember, OrganizationRole])],
    providers: [OrganizationContextService, MembershipService],
    exports: [TypeOrmModule, OrganizationContextService, MembershipService]
  })
], TenantCoreModule);

// src/types/index.ts
var types_exports = {};
__reExport(types_exports, tenant_types_exports);

// src/index.ts
__reExport(src_exports, types_exports);

export { BaseEntity, CurrentMembership, CurrentOrganization, CurrentUser, MembershipService, ORGANIZATION_PERMISSIONS_KEY, ORGANIZATION_ROLES_KEY, Organization, OrganizationContextGuard, OrganizationContextService, OrganizationMember, OrganizationPermissionGuard, OrganizationRole, OrganizationRoleGuard, RequireOrganizationPermissions, RequireOrganizationRoles, TenantCoreModule };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map