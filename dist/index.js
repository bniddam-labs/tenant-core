'use strict';

var common = require('@nestjs/common');
var typeorm = require('typeorm');
var tenant_core_shared_star = require('@bniddam-labs/tenant-core-shared');
var typeorm$1 = require('@nestjs/typeorm');

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
  MembershipService: () => exports.MembershipService,
  ORGANIZATION_PERMISSIONS_KEY: () => ORGANIZATION_PERMISSIONS_KEY,
  ORGANIZATION_ROLES_KEY: () => ORGANIZATION_ROLES_KEY,
  Organization: () => exports.Organization,
  OrganizationContextGuard: () => exports.OrganizationContextGuard,
  OrganizationContextService: () => exports.OrganizationContextService,
  OrganizationMember: () => exports.OrganizationMember,
  OrganizationPermissionGuard: () => exports.OrganizationPermissionGuard,
  OrganizationRole: () => exports.OrganizationRole,
  OrganizationRoleGuard: () => exports.OrganizationRoleGuard,
  RequireOrganizationPermissions: () => RequireOrganizationPermissions,
  RequireOrganizationRoles: () => RequireOrganizationRoles,
  TenantCoreModule: () => exports.TenantCoreModule
});
var CurrentUser = common.createParamDecorator(
  (_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
var CurrentOrganization = common.createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationId;
});
var CurrentMembership = common.createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationMembership;
});
var ORGANIZATION_ROLES_KEY = "organization_roles";
var RequireOrganizationRoles = (...roles) => common.SetMetadata(ORGANIZATION_ROLES_KEY, roles);
var ORGANIZATION_PERMISSIONS_KEY = "organization_permissions";
var RequireOrganizationPermissions = (...permissions) => common.SetMetadata(ORGANIZATION_PERMISSIONS_KEY, permissions);
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

// src/types/tenant.types.ts
var tenant_types_exports = {};
__reExport(tenant_types_exports, tenant_core_shared_star__namespace);
exports.OrganizationRole = class OrganizationRole extends BaseEntity {
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
], exports.OrganizationRole.prototype, "name", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 255 })
], exports.OrganizationRole.prototype, "displayName", 2);
__decorateClass([
  typeorm.Column({ type: "text", nullable: true })
], exports.OrganizationRole.prototype, "description", 2);
__decorateClass([
  typeorm.ManyToOne(
    () => exports.Organization,
    (org) => org.customRoles,
    {
      nullable: true,
      onDelete: "CASCADE"
    }
  ),
  typeorm.JoinColumn({ name: "organizationId" })
], exports.OrganizationRole.prototype, "organization", 2);
__decorateClass([
  typeorm.Column({ type: "jsonb", default: [] })
], exports.OrganizationRole.prototype, "permissions", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: false })
], exports.OrganizationRole.prototype, "isSystem", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: true })
], exports.OrganizationRole.prototype, "isActive", 2);
__decorateClass([
  typeorm.OneToMany(
    () => exports.OrganizationMember,
    (member) => member.role
  )
], exports.OrganizationRole.prototype, "members", 2);
exports.OrganizationRole = __decorateClass([
  typeorm.Entity("organization_roles"),
  typeorm.Index(["organization", "name"]),
  typeorm.Index(["isSystem"]),
  typeorm.Index(["isActive"])
], exports.OrganizationRole);

// src/entities/organization-member.entity.ts
exports.OrganizationMember = class OrganizationMember extends BaseEntity {
  userId;
  organization;
  role;
  joinedAt;
  invitedBy;
  metadata;
};
__decorateClass([
  typeorm.Column({ type: "uuid" })
], exports.OrganizationMember.prototype, "userId", 2);
__decorateClass([
  typeorm.ManyToOne(
    () => exports.Organization,
    (org) => org.members,
    {
      onDelete: "CASCADE",
      eager: false
    }
  ),
  typeorm.JoinColumn({ name: "organizationId" })
], exports.OrganizationMember.prototype, "organization", 2);
__decorateClass([
  typeorm.ManyToOne(() => exports.OrganizationRole, { eager: false }),
  typeorm.JoinColumn({ name: "roleId" })
], exports.OrganizationMember.prototype, "role", 2);
__decorateClass([
  typeorm.Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
], exports.OrganizationMember.prototype, "joinedAt", 2);
__decorateClass([
  typeorm.Column({ type: "uuid", nullable: true })
], exports.OrganizationMember.prototype, "invitedBy", 2);
__decorateClass([
  typeorm.Column({ type: "jsonb", nullable: true })
], exports.OrganizationMember.prototype, "metadata", 2);
exports.OrganizationMember = __decorateClass([
  typeorm.Entity("organization_members"),
  typeorm.Index(["userId", "organization"], { unique: true }),
  typeorm.Index(["organization"]),
  typeorm.Index(["userId"]),
  typeorm.Index(["role"])
], exports.OrganizationMember);

// src/entities/organization.entity.ts
exports.Organization = class Organization extends BaseEntity {
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
], exports.Organization.prototype, "name", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 255, unique: true })
], exports.Organization.prototype, "slug", 2);
__decorateClass([
  typeorm.Column({ type: "text", nullable: true })
], exports.Organization.prototype, "description", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 500, nullable: true })
], exports.Organization.prototype, "logoUrl", 2);
__decorateClass([
  typeorm.Column({
    type: "enum",
    enum: tenant_types_exports.OrganizationTier,
    default: tenant_types_exports.OrganizationTier.FREE
  })
], exports.Organization.prototype, "tier", 2);
__decorateClass([
  typeorm.Column({ type: "uuid" })
], exports.Organization.prototype, "ownerId", 2);
__decorateClass([
  typeorm.Column({ type: "varchar", length: 255, nullable: true })
], exports.Organization.prototype, "billingEmail", 2);
__decorateClass([
  typeorm.Column({
    type: "jsonb",
    default: {
      allowMemberInvite: false,
      features: []
    }
  })
], exports.Organization.prototype, "settings", 2);
__decorateClass([
  typeorm.Column({ type: "int", default: 0 })
], exports.Organization.prototype, "membersCount", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: false })
], exports.Organization.prototype, "isUpgraded", 2);
__decorateClass([
  typeorm.Column({ type: "boolean", default: true })
], exports.Organization.prototype, "isActive", 2);
__decorateClass([
  typeorm.OneToMany(
    () => exports.OrganizationMember,
    (member) => member.organization,
    {
      cascade: true
    }
  )
], exports.Organization.prototype, "members", 2);
__decorateClass([
  typeorm.OneToMany(
    () => exports.OrganizationRole,
    (role) => role.organization
  )
], exports.Organization.prototype, "customRoles", 2);
exports.Organization = __decorateClass([
  typeorm.Entity("organizations"),
  typeorm.Index(["slug"], { unique: true }),
  typeorm.Index(["createdAt"]),
  typeorm.Index(["tier"]),
  typeorm.Index(["ownerId"])
], exports.Organization);
exports.OrganizationContextGuard = class OrganizationContextGuard {
  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.params?.organizationId || request.headers?.["x-organization-id"] || request.query?.organizationId;
    if (!organizationId) {
      throw new common.ForbiddenException("Organization context is required");
    }
    request.organizationId = organizationId;
    return true;
  }
};
exports.OrganizationContextGuard = __decorateClass([
  common.Injectable()
], exports.OrganizationContextGuard);
exports.OrganizationRoleGuard = class OrganizationRoleGuard {
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
      throw new common.ForbiddenException("Organization membership not found in request context");
    }
    if (!membership.role) {
      throw new common.ForbiddenException("User has no role assigned in this organization");
    }
    const userRoleName = membership.role.name;
    const hasRequiredRole = requiredRoles.includes(userRoleName);
    if (!hasRequiredRole) {
      throw new common.ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(", ")}. User role: ${userRoleName}`
      );
    }
    return true;
  }
};
exports.OrganizationRoleGuard = __decorateClass([
  common.Injectable()
], exports.OrganizationRoleGuard);
exports.OrganizationPermissionGuard = class OrganizationPermissionGuard {
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
      throw new common.ForbiddenException("Organization membership not found in request context");
    }
    if (!membership.role) {
      throw new common.ForbiddenException("User has no role assigned in this organization");
    }
    const role = membership.role;
    const hasAllPermissions2 = requiredPermissions.every(
      (permission) => role.permissions.includes(permission) || role.permissions.includes("*")
    );
    if (!hasAllPermissions2) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !role.permissions.includes(permission) && !role.permissions.includes("*")
      );
      throw new common.ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(", ")}`
      );
    }
    return true;
  }
};
exports.OrganizationPermissionGuard = __decorateClass([
  common.Injectable()
], exports.OrganizationPermissionGuard);
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
  __decorateParam(0, typeorm$1.InjectRepository(exports.Organization)),
  __decorateParam(1, typeorm$1.InjectRepository(exports.OrganizationMember))
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
  __decorateParam(0, typeorm$1.InjectRepository(exports.OrganizationMember)),
  __decorateParam(1, typeorm$1.InjectRepository(exports.Organization)),
  __decorateParam(2, typeorm$1.InjectRepository(exports.OrganizationRole))
], exports.MembershipService);
exports.TenantCoreModule = class TenantCoreModule {
};
exports.TenantCoreModule = __decorateClass([
  common.Module({
    imports: [typeorm$1.TypeOrmModule.forFeature([exports.Organization, exports.OrganizationMember, exports.OrganizationRole])],
    providers: [exports.OrganizationContextService, exports.MembershipService],
    exports: [typeorm$1.TypeOrmModule, exports.OrganizationContextService, exports.MembershipService]
  })
], exports.TenantCoreModule);

// src/types/index.ts
var types_exports = {};
__reExport(types_exports, tenant_types_exports);

// src/index.ts
__reExport(src_exports, types_exports);

exports.BaseEntity = BaseEntity;
exports.CurrentMembership = CurrentMembership;
exports.CurrentOrganization = CurrentOrganization;
exports.CurrentUser = CurrentUser;
exports.ORGANIZATION_PERMISSIONS_KEY = ORGANIZATION_PERMISSIONS_KEY;
exports.ORGANIZATION_ROLES_KEY = ORGANIZATION_ROLES_KEY;
exports.RequireOrganizationPermissions = RequireOrganizationPermissions;
exports.RequireOrganizationRoles = RequireOrganizationRoles;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map