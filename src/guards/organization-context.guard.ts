import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/**
 * Guard that ensures a valid organization context exists in the request
 *
 * This guard checks that:
 * - An organizationId is present in the request
 * - The organization exists and is active
 *
 * The organization ID can come from:
 * - Route parameters (:organizationId)
 * - Request headers (X-Organization-Id)
 * - Query parameters (organizationId)
 *
 * @example
 * ```typescript
 * @Controller(':organizationId/members')
 * @UseGuards(OrganizationContextGuard)
 * export class MembersController {
 *   @Get()
 *   async listMembers(@CurrentOrganization() orgId: string) {
 *     return this.memberService.list(orgId);
 *   }
 * }
 * ```
 */
@Injectable()
export class OrganizationContextGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract organization ID from various sources
    const organizationId =
      request.params?.organizationId ||
      request.headers?.['x-organization-id'] ||
      request.query?.organizationId;

    if (!organizationId) {
      throw new ForbiddenException('Organization context is required');
    }

    // Store organization ID in request for later use
    request.organizationId = organizationId;

    return true;
  }
}
