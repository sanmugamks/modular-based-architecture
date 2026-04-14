'use strict';

/**
 * Global Error Handler Middleware
 * 
 * Catches errors from downstream middlewares/plugins and returns
 * a standardized JSON response.
 */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // Determine status code (default to 500)
    const status = err.status || err.statusCode || 500;
    
    // Log error internally
    console.error(`[Error Handler] ${ctx.method} ${ctx.url} - ${status}: ${err.message}`);
    if (status === 500) {
      console.error(err.stack);
    }

    // Standardized error response
    ctx.status = status;
    ctx.body = {
      error: err.name || 'InternalServerError',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    };

    // Emit error for app-level logging if needed
    ctx.app.emit('error', err, ctx);
  }
};
