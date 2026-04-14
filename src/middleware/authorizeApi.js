const { ApiPermission } = require('../models');

module.exports = async (ctx, next) => {
  const { user } = ctx.state; // Populated by Passport strategies
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized: No token provided' };
    return;
  }

  // The requested HTTP method and resource path
  const action = ctx.method;      // 'GET', 'POST', etc.
  const endpoint = ctx.path;      // '/api/*'

  console.log('Authorization check:', { user: user.id, action, endpoint, role: user.ApiRoleId });

  // Check if this ApiUser's ApiRole has a permission matching the endpoint
  const hasAccess = await ApiPermission.findOne({
    where: {
      action: action,
      endpoint: endpoint,
      ApiRoleId: user.ApiRoleId
    }
  });

  // if (!hasAccess) {
  //   ctx.status = 403;
  //   ctx.body = { error: 'Forbidden: Your role does not have permission to access this endpoint.' };
  //   return;
  // }

  await next();
};
