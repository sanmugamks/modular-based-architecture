'use strict';

const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

/**
 * AuthController for stb-auth plugin
 */
module.exports = ({ models, config }) => {
  const { ApiUser, ApiRole } = models;
  const JWT_SECRET = config.jwtSecret || process.env.JWT_SECRET || 'very-secure-jwt-secret-key';

  return {
    // POST /api/auth/register
    async register(ctx) {
      try {
        const { email, password, contact_id, company_id, ApiRoleId } = ctx.request.body;

        if (!email || !password) {
          ctx.status = 400;
          ctx.body = { error: 'Email and password are required' };
          return;
        }

        // Check if user already exists
        const existing = await ApiUser.findOne({ where: { email } });
        if (existing) {
          ctx.status = 409;
          ctx.body = { error: 'User with this email already exists' };
          return;
        }

        const hashedPassword = await argon2.hash(password);
        const user = await ApiUser.create({
          email,
          password: hashedPassword,
          contact_id: contact_id || null,
          company_id: company_id || null,
          ApiRoleId: ApiRoleId || null,
        });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        ctx.status = 201;
        ctx.body = {
          message: 'User registered successfully',
          user: { id: user.id, email: user.email },
          token,
        };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Registration failed', details: error.message };
      }
    },

    // POST /api/auth/login
    async login(ctx) {
      try {
        const { email, password } = ctx.request.body;

        if (!email || !password) {
          ctx.status = 400;
          ctx.body = { error: 'Email and password are required' };
          return;
        }

        const user = await ApiUser.findOne({ where: { email }, include: [ApiRole] });
        if (!user) {
          ctx.status = 401;
          ctx.body = { error: 'Invalid email or password' };
          return;
        }

        const isValid = await argon2.verify(user.password, password);
        if (!isValid) {
          ctx.status = 401;
          ctx.body = { error: 'Invalid email or password' };
          return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        ctx.status = 200;
        ctx.body = {
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            role: user.ApiRole ? user.ApiRole.name : null,
          },
          token,
        };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Login failed', details: error.message };
      }
    },

    // GET /api/auth/me (Protected)
    async me(ctx) {
      try {
        const user = await ApiUser.findByPk(ctx.state.user.id, {
          include: [ApiRole],
        });

        console.log("user => ", user);

        ctx.status = 200;
        ctx.body = { user };
      } catch (error) {
        console.log('Authorization check:', { error: error });
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch user profile' };
      }
    },
  };
};
