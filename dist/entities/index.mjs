import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, ManyToOne, JoinColumn, OneToMany, Entity, Index } from 'typeorm';
import * as tenant_core_shared_star from '@bniddam-labs/tenant-core-shared';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@bniddam-labs/tenant-core-shared';

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

export { BaseEntity, Organization, OrganizationMember, OrganizationRole };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map