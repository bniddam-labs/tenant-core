'use strict';

var common = require('@nestjs/common');
var typeorm$1 = require('@nestjs/typeorm');
var typeorm = require('typeorm');
var tenant_core_shared_star = require('@bniddam-labs/tenant-core-shared');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var tenant_core_shared_star__namespace = /*#__PURE__*/_interopNamespace(tenant_core_shared_star);

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/types/tenant.types.ts
var tenant_types_exports = {};
__reExport(tenant_types_exports, tenant_core_shared_star__namespace);
var BaseEntity = class {
  id;
  createdAt;
  updatedAt;
  deletedAt;
};
__decorateClass([
  typeorm.PrimaryGeneratedColumn("uuid")
], BaseEntity.prototype, "id", 2);
__decorateClass([
  typeorm.CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
], BaseEntity.prototype, "createdAt", 2);
__decorateClass([
  typeorm.UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
], BaseEntity.prototype, "updatedAt", 2);
__decorateClass([
  typeorm.DeleteDateColumn({
    type: "timestamptz",
    nullable: true
  })
], BaseEntity.prototype, "deletedAt", 2);
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
    return tenant_core_shared_star.hasPermission(this.permissions, permission);
  }
  /**
   * Check if role has any of the given permissions
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasAnyPermission(permissions) {
    return tenant_core_shared_star.hasAnyPermission(this.permissions, permissions);
  }
  /**
   * Check if role has all of the given permissions
   * Uses shared logic from @bniddam-labs/tenant-core-shared
   */
  hasAllPermissions(permissions) {
    return tenant_core_shared_star.hasAllPermissions(this.permissions, permissions);
  }
};
__decorateClass([
  typeorm.Column({ type: "varchar", length: 100 })
], OrganizationRole.prototype, "name", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 255 })
], OrganizationRole.prototype, "displayName", 2);
__decorateClass([
  typeorm.Column({ type: "text", nullable: true })
], OrganizationRole.prototype, "description", 2);
__decorateClass([
  typeorm.ManyToOne(
    () => Organization,
    (org) => org.customRoles,
    {
      nullable: true,
      onDelete: "CASCADE"
    }
  ),
  typeorm.JoinColumn({ name: "organizationId" })
], OrganizationRole.prototype, "organization", 2);
__decorateClass([
  typeorm.Column({ type: "jsonb", default: [] })
], OrganizationRole.prototype, "permissions", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: false })
], OrganizationRole.prototype, "isSystem", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: true })
], OrganizationRole.prototype, "isActive", 2);
__decorateClass([
  typeorm.OneToMany(
    () => OrganizationMember,
    (member) => member.role
  )
], OrganizationRole.prototype, "members", 2);
OrganizationRole = __decorateClass([
  typeorm.Entity("organization_roles"),
  typeorm.Index(["organization", "name"]),
  typeorm.Index(["isSystem"]),
  typeorm.Index(["isActive"])
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
  typeorm.Column({ type: "uuid" })
], OrganizationMember.prototype, "userId", 2);
__decorateClass([
  typeorm.ManyToOne(
    () => Organization,
    (org) => org.members,
    {
      onDelete: "CASCADE",
      eager: false
    }
  ),
  typeorm.JoinColumn({ name: "organizationId" })
], OrganizationMember.prototype, "organization", 2);
__decorateClass([
  typeorm.ManyToOne(() => OrganizationRole, { eager: false }),
  typeorm.JoinColumn({ name: "roleId" })
], OrganizationMember.prototype, "role", 2);
__decorateClass([
  typeorm.Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
], OrganizationMember.prototype, "joinedAt", 2);
__decorateClass([
  typeorm.Column({ type: "uuid", nullable: true })
], OrganizationMember.prototype, "invitedBy", 2);
__decorateClass([
  typeorm.Column({ type: "jsonb", nullable: true })
], OrganizationMember.prototype, "metadata", 2);
OrganizationMember = __decorateClass([
  typeorm.Entity("organization_members"),
  typeorm.Index(["userId", "organization"], { unique: true }),
  typeorm.Index(["organization"]),
  typeorm.Index(["userId"]),
  typeorm.Index(["role"])
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
  typeorm.Column({ type: "varchar", length: 255 })
], Organization.prototype, "name", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 255, unique: true })
], Organization.prototype, "slug", 2);
__decorateClass([
  typeorm.Column({ type: "text", nullable: true })
], Organization.prototype, "description", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 500, nullable: true })
], Organization.prototype, "logoUrl", 2);
__decorateClass([
  typeorm.Column({
    type: "enum",
    enum: tenant_types_exports.OrganizationTier,
    default: tenant_types_exports.OrganizationTier.FREE
  })
], Organization.prototype, "tier", 2);
__decorateClass([
  typeorm.Column({ type: "uuid" })
], Organization.prototype, "ownerId", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 255, nullable: true })
], Organization.prototype, "billingEmail", 2);
__decorateClass([
  typeorm.Column({
    type: "jsonb",
    default: {
      allowMemberInvite: false,
      features: []
    }
  })
], Organization.prototype, "settings", 2);
__decorateClass([
  typeorm.Column({ type: "int", default: 0 })
], Organization.prototype, "membersCount", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: false })
], Organization.prototype, "isUpgraded", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: true })
], Organization.prototype, "isActive", 2);
__decorateClass([
  typeorm.OneToMany(
    () => OrganizationMember,
    (member) => member.organization,
    {
      cascade: true
    }
  )
], Organization.prototype, "members", 2);
__decorateClass([
  typeorm.OneToMany(
    () => OrganizationRole,
    (role) => role.organization
  )
], Organization.prototype, "customRoles", 2);
Organization = __decorateClass([
  typeorm.Entity("organizations"),
  typeorm.Index(["slug"], { unique: true }),
  typeorm.Index(["createdAt"]),
  typeorm.Index(["tier"]),
  typeorm.Index(["ownerId"])
], Organization);

// src/services/organization-context.service.ts
exports.OrganizationContextService = class OrganizationContextService {
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
      throw new common.NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    if (!organization.isActive) {
      throw new common.NotFoundException(`Organization with ID ${organizationId} is not active`);
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
exports.OrganizationContextService = __decorateClass([
  common.Injectable(),
  __decorateParam(0, typeorm$1.InjectRepository(Organization)),
  __decorateParam(1, typeorm$1.InjectRepository(OrganizationMember))
], exports.OrganizationContextService);
exports.MembershipService = class MembershipService {
  constructor(memberRepository, organizationRepository, roleRepository) {
    this.memberRepository = memberRepository;
    this.organizationRepository = organizationRepository;
    this.roleRepository = roleRepository;
  }
  logger = new common.Logger(exports.MembershipService.name);
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
      throw new common.ConflictException("User is already a member of this organization");
    }
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new common.NotFoundException(`Role with ID ${roleId} not found`);
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
      throw new common.NotFoundException("Member not found");
    }
    if (member.role?.name === tenant_types_exports.SystemRoleName.OWNER) {
      const ownerCount = await this.getOwnerCount(organizationId);
      if (ownerCount <= 1) {
        throw new common.BadRequestException(
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
      throw new common.NotFoundException("Member not found");
    }
    const newRole = await this.roleRepository.findOne({ where: { id: newRoleId } });
    if (!newRole) {
      throw new common.NotFoundException(`Role with ID ${newRoleId} not found`);
    }
    if (member.role?.name === tenant_types_exports.SystemRoleName.OWNER && newRole.name !== tenant_types_exports.SystemRoleName.OWNER) {
      const ownerCount = await this.getOwnerCount(organizationId);
      if (ownerCount <= 1) {
        throw new common.BadRequestException(
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
      throw new common.NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    return organization.canInviteMoreMembers();
  }
};
exports.MembershipService = __decorateClass([
  common.Injectable(),
  __decorateParam(0, typeorm$1.InjectRepository(OrganizationMember)),
  __decorateParam(1, typeorm$1.InjectRepository(Organization)),
  __decorateParam(2, typeorm$1.InjectRepository(OrganizationRole))
], exports.MembershipService);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map