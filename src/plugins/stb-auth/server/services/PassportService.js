'use strict';

const passport = require('koa-passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

/**
 * Passport Service for stb-auth plugin
 */
module.exports = ({ models, config }) => {
  const { ApiUser, ApiRole } = models;

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret || process.env.JWT_SECRET,
  };

  passport.use(
    'jwt',
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // Find the user and eager load their ApiRole
        const user = await ApiUser.findByPk(jwt_payload.id, {
          include: [ApiRole],
        });

        if (user) {
          return done(null, user); // User is passed to ctx.state.user
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  return passport;
};
