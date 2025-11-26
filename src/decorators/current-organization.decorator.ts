import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to inject the current organization ID from request context
 *
 * @example
 * ```typescript
 * @Get(':organizationId/settings')
 * async getSettings(@CurrentOrganization() organizationId: string) {
 *   return this.orgService.getSettings(organizationId);
 * }
 * ```
 */
export const CurrentOrganization = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organizationId;
});
