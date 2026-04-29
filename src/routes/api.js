const Router = require('@koa/router');
const { koaBody } = require('koa-body');

const router = new Router({ prefix: '/api' });
router.use(koaBody({ multipart: true }));

// Apply Rate Limiting
const ratelimit = require('koa-ratelimit');
const rateLimitDb = new Map();

router.use(
  ratelimit({
    driver: 'memory',
    db: rateLimitDb,
    duration: 60000, // 1 minute
    errorMessage: 'Too many requests, please try again later',
    id: (ctx) => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total',
    },
    max: 100, // max requests per minute per IP
    disableHeader: false,
  })
);

// ============================
// Runtime Auth Proxies
// These look up middlewares attached by the stb-auth plugin to app.context
// ============================
const auth = async (ctx, next) => {
  if (!ctx.auth) {
    ctx.status = 500;
    ctx.body = { error: 'Authentication plugin (stb-auth) not initialized' };
    return;
  }
  return ctx.auth(ctx, next);
};

const authorizeApi = async (ctx, next) => {
  if (!ctx.authorizeApi) {
    ctx.status = 500;
    ctx.body = { error: 'Authorization middleware not initialized' };
    return;
  }
  return ctx.authorizeApi(ctx, next);
};

// ============================
// Public Routes (No JWT needed)
// ============================

// Health Check
router.get('/health', (ctx) => {
  ctx.body = { status: 'healthy', version: '1.0.0 POC' };
});

// ============================
// NOTE: Core Business Routes (Negotiators, Properties, etc.)
// have been moved to the 'stb-myaccount' plugin.
// Auth routes have been moved to the 'stb-auth' plugin.
// ============================

module.exports = router;
