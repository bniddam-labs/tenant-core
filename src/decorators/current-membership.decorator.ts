import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to inject the current organization membership
 * (user's membership in the current organization context)
 *
 * @example
 * ```typescript
 * @Get('my-role')
 * async getMyRole(@CurrentMembership() membership: OrganizationMember) {
 *   return membership.role;
 * }
 * ```
 */
export const CurrentMembership = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationMembership;
});
