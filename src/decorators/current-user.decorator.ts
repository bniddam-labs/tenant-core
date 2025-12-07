import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { IUser } from '../types/user.interface.js';

/**
 * Parameter decorator to inject the current authenticated user
 *
 * The user object should be attached to the request by your authentication
 * guard/middleware (e.g., JwtAuthGuard, SessionGuard).
 *
 * @example
 * ```typescript
 * // Define your User type
 * interface User extends IUser {
 *   firstName: string;
 *   lastName: string;
 * }
 *
 * // Use in controller
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  <TUser extends IUser = IUser>(_data: unknown, ctx: ExecutionContext): TUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
