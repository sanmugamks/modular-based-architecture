# Koa MyAccount POC

A modular, plugin-based Koa.js application designed as an extensible foundation for "MyAccount" services. Featuring a hybrid plugin loader, built-in identity management, template-based notifications, and a hardened security layer.

---

## 🛠️ Technology Stack
- **Core**: Koa.js (v3)
- **Database**: Sequelize (MySQL/MariaDB)
- **Auth**: Passport.js (JWT Strategy)
- **UI**: AdminJS (Dashboard)
- **Security**: Helmet, CORS, Rate-Limiting
- **Logic**: Closure-based Modular Architecture

---

## 🏗️ Architecture & Core Principles

The application is built on a **modular, plugin-driven architecture**. Instead of a monolithic structure, functionality is encapsulated within independent plugins.

### 1. Hybrid Plugin Loader
Located in `src/index.js`, the loader follows a priority-based discovery mechanism:
1. **NPM Modules**: Attempts to load the plugin from `node_modules` (e.g., `@sanmugamks/my-plugin`).
2. **Local Plugins**: Falls back to the `src/plugins/` directory.

### 2. Global Registry (`app.context.plugins`)
Each plugin registers its `models`, `services`, and `config` into the global context. This allows for **Cross-Plugin Service Discovery**:
```javascript
// Example: Accessing the EmailService from an unrelated plugin
const emailService = ctx.plugins['stb-email'].services.EmailService;
await emailService.sendTemplate('welcome', { to: user.email });
```

### 3. Extension Mechanism (`src/extensions/`)
Developers can override plugin behavior without modifying the core plugin source:
- **Controllers**: Wrap or replace factory-initialized methods.
- **Models**: Register additional lifecycle hooks (e.g., `afterCreate`).
- **Schema**: Add dynamic attributes/fields to existing models.

---

## 🔐 Security & Production Hardening

The application implements industry-standard security practices out-of-the-box:

### 1. Hardened Middlewares
- **Helmet**: Injected at the top level to set secure HTTP headers (CSP, XSS Protection, etc.).
- **CORS**: Configured via `@koa/cors` for secure cross-origin communication.
- **Rate Limiting**: Global and per-router rate limiting via `koa-ratelimit` to mitigate brute-force/DoS attacks.

### 2. Environment Enforcement (Fail-Fast Policy)
The application strictly requires the following environment variables. It will **refuse to boot** if they are missing or using insecure fallbacks:
- `JWT_SECRET`: Used for signing authentication tokens.
- `COOKIE_PASSWORD`: Used for AdminJS session encryption.

### 3. Input Sanitization
Built-in utilities (`src/utils/sanitizer.js`) prevent **Mass-Assignment** vulnerabilities by filtering request bodies against the model schema:
```javascript
// Example in AuthController.register
const sanitizedInput = ApiUser.sanitizeInput(ctx.request.body);
const user = await ApiUser.create(sanitizedInput);
```

---

## 📧 Notification System (`stb-email`)

The `stb-email` plugin provides a robust, template-based notification engine using **Lodash Templates**.

### Usage Example:
```javascript
// Inside a service or controller
const emailService = app.context.plugins['stb-email'].services.EmailService;

await emailService.sendTemplate('offer-accepted', {
  to: 'applicant@example.com',
  applicantName: 'John Doe',
  propertyTitle: 'The Shard, London'
});
```

### Managing Templates:
Templates are managed via **AdminJS** (`Email Templates` resource) or directly in the database.
- **Slug**: Unique identifier (e.g., `welcome-email`).
- **Subject/Body**: Support `<%= var %>` interpolation.

---

## 🛠️ Developer's Implementation Guide

### Adding a New Plugin
1. Create a directory in `src/plugins/my-new-plugin`.
2. Follow the standard structure:
   - `server/models/`: Export a Sequelize model factory.
   - `server/services/`: Export a factory taking `{ models, config }`.
   - `server/controllers/`: Export a factory taking `{ models, services, config }`.
   - `index.js`: Initialization entry point.
3. Enable it in `src/config/plugins.js`.

### Extending an Existing Plugin
To modify a plugin's behavior (e.g., `stb-auth`):
1. Create `src/extensions/stb-auth/server/index.js`.
2. Export a function:
```javascript
module.exports = ({ controllers, models, services, config }) => {
  // Override or add hooks here
  models.ApiUser.addHook('afterUpdate', async (user) => {
    // Custom logic
  });
};
```

---

## 📦 Getting Started

1.  **Install Dependencies**: `npm install`
2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    # Set DB_HOST, DB_USER, DB_PASS, JWT_SECRET, COOKIE_PASSWORD
    ```
3.  **Run**: `npm run dev`
4.  **Dashboard**: http://localhost:3000/admin (Default login managed via `AdminUser` model).

---

## 🚀 API Quick Reference

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new end-user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| GET | `/api/auth/me` | Get current user data | JWT |
| GET | `/api/offers` | List offers (example) | JWT + Role |

---

*This project is a Proof of Concept (POC) demonstrating modularity and security in Koa.js.*
