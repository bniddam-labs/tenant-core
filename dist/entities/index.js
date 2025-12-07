'use strict';

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

exports.BaseEntity = BaseEntity;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map