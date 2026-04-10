const passport = require('koa-passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { ApiUser, ApiRole } = require('../models');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'very-secure-jwt-secret-key' // Should come from .env
};

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Find the user and eager load their ApiRole so we know their group ID
      const user = await ApiUser.findByPk(jwt_payload.id, {
        include: [ApiRole]
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

module.exports = passport;
