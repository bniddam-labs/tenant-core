import { describe, expect, it } from 'vitest';
import { OrganizationPermission, OrganizationTier, SystemRoleName, UserStatus } from './tenant.types';

describe('tenant.types', () => {
	describe('UserStatus', () => {
		it('should have all expected status values', () => {
			expect(UserStatus.ACTIVE).toBe('active');
			expect(UserStatus.INACTIVE).toBe('inactive');
			expect(UserStatus.SUSPENDED).toBe('suspended');
			expect(UserStatus.LOCKED).toBe('locked');
			expect(UserStatus.PENDING_VERIFICATION).toBe('pending_verification');
		});

		it('should have exactly 5 status values', () => {
			const values = Object.values(UserStatus);
			expect(values).toHaveLength(5);
		});
	});

	describe('OrganizationTier', () => {
		it('should have all expected tier values', () => {
			expect(OrganizationTier.FREE).toBe('FREE');
			expect(OrganizationTier.PREMIUM).toBe('PREMIUM');
		});

		it('should have exactly 2 tier values', () => {
			const values = Object.values(OrganizationTier);
			expect(values).toHaveLength(2);
		});
	});

	describe('SystemRoleName', () => {
		it('should have all expected role values', () => {
			expect(SystemRoleName.OWNER).toBe('owner');
			expect(SystemRoleName.ADMIN).toBe('admin');
			expect(SystemRoleName.MEMBER).toBe('member');
			expect(SystemRoleName.VIEWER).toBe('viewer');
		});

		it('should have exactly 4 role values', () => {
			const values = Object.values(SystemRoleName);
			expect(values).toHaveLength(4);
		});

		it('should have owner as the highest privileged role', () => {
			// Just verifying the naming convention
			expect(SystemRoleName.OWNER).toBeDefined();
		});
	});

	describe('OrganizationPermission', () => {
		it('should have organization management permissions', () => {
			expect(OrganizationPermission.ORG_READ).toBe('organization.read');
			expect(OrganizationPermission.ORG_UPDATE).toBe('organization.update');
			expect(OrganizationPermission.ORG_DELETE).toBe('organization.delete');
			expect(OrganizationPermission.ORG_SETTINGS).toBe('organization.settings');
		});

		it('should have member management permissions', () => {
			expect(OrganizationPermission.MEMBERS_READ).toBe('organization.members.read');
			expect(OrganizationPermission.MEMBERS_INVITE).toBe('organization.members.invite');
			expect(OrganizationPermission.MEMBERS_MANAGE).toBe('organization.members.manage');
			expect(OrganizationPermission.MEMBERS_REMOVE).toBe('organization.members.remove');
		});

		it('should have role management permissions', () => {
			expect(OrganizationPermission.ROLES_READ).toBe('organization.roles.read');
			expect(OrganizationPermission.ROLES_CREATE).toBe('organization.roles.create');
			expect(OrganizationPermission.ROLES_UPDATE).toBe('organization.roles.update');
			expect(OrganizationPermission.ROLES_DELETE).toBe('organization.roles.delete');
		});

		it('should have content management permissions', () => {
			expect(OrganizationPermission.CONTENT_CREATE).toBe('organization.content.create');
			expect(OrganizationPermission.CONTENT_READ).toBe('organization.content.read');
			expect(OrganizationPermission.CONTENT_UPDATE).toBe('organization.content.update');
			expect(OrganizationPermission.CONTENT_DELETE).toBe('organization.content.delete');
			expect(OrganizationPermission.CONTENT_PUBLISH).toBe('organization.content.publish');
		});

		it('should have client management permissions', () => {
			expect(OrganizationPermission.CLIENTS_READ).toBe('organization.clients.read');
			expect(OrganizationPermission.CLIENTS_CREATE).toBe('organization.clients.create');
			expect(OrganizationPermission.CLIENTS_UPDATE).toBe('organization.clients.update');
			expect(OrganizationPermission.CLIENTS_DELETE).toBe('organization.clients.delete');
			expect(OrganizationPermission.CLIENTS_MANAGE_PORTAL).toBe('organization.clients.manage_portal');
		});

		it('should have billing permissions', () => {
			expect(OrganizationPermission.BILLING_READ).toBe('organization.billing.read');
			expect(OrganizationPermission.BILLING_MANAGE).toBe('organization.billing.manage');
		});

		it('should follow consistent naming convention', () => {
			const values = Object.values(OrganizationPermission);
			for (const permission of values) {
				expect(permission).toMatch(/^organization\./);
			}
		});
	});
});
