export * from '@bniddam-labs/tenant-core-shared';

/**
 * Minimal user interface required by the tenant-core package
 *
 * Consuming applications should implement their own User entity
 * that satisfies this interface.
 *
 * @example
 * ```typescript
 * // In your application
 * @Entity('users')
 * export class User extends BaseEntity implements IUser {
 *   @Column()
 *   email: string;
 *
 *   // Add your custom fields
 *   @Column()
 *   firstName: string;
 *
 *   @Column()
 *   lastName: string;
 *
 *   // Add the relation back to OrganizationMember if needed
 *   @OneToMany(() => OrganizationMember, member => member.userId)
 *   organizationMemberships: OrganizationMember[];
 * }
 * ```
 */
interface IUser {
    /**
     * Unique identifier for the user
     */
    id: string;
    /**
     * User's email address (used for identification)
     */
    email: string;
}
/**
 * Extended user interface with common authentication fields
 * This is optional - use if your User entity has these fields
 */
interface IAuthUser extends IUser {
    /**
     * User status (active, suspended, deleted, etc.)
     */
    status?: string;
    /**
     * Last login timestamp
     */
    lastLoginAt?: Date;
    /**
     * Email verification timestamp
     */
    emailVerifiedAt?: Date | null;
}

export type { IAuthUser, IUser };
