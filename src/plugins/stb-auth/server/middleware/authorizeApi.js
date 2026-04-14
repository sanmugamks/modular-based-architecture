'use strict';

/**
 * authorizeApi middleware for stb-auth plugin
 */
module.exports = ({ models }) => {
  const { ApiPermission, ApiRole } = models;

  return async (ctx, next) => {
    const user = ctx.state.user;

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized: No user found in session' };
      return;
    }

    // RBAC: Check if the user's role has permission for this endpoint + action
    const roleId = user.ApiRoleId;
    if (!roleId) {
      ctx.status = 403;
      ctx.body = { error: 'Forbidden: User has no assigned role' };
      return;
    }

    const { method, path } = ctx;
    
    const permissions = await ApiPermission.findAll({
      where: { ApiRoleId: roleId }
    });

    const hasAccess = permissions.some(p => {
      const endpointMatch = path.startsWith(p.endpoint);
      const actionMatch = p.action === '*' || p.action === method;
      return endpointMatch && actionMatch;
    });

    if (!hasAccess) {
      ctx.status = 403;
      ctx.body = { error: 'Forbidden: Your role does not have permission to access this endpoint.' };
      return;
    }

    await next();
  };
};
