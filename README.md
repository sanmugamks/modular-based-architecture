# Koa MyAccount POC

A modular, plugin-based Koa.js application designed to provide a flexible and extensible foundation for a "MyAccount" service. This project features a hybrid plugin loader, built-in identity management, and an integrated AdminJS dashboard.

## 🏗️ Architecture

The application is built on a **modular, plugin-driven architecture**. Instead of a monolithic structure, functionality is encapsulated within independent plugins.

- **Core Application**: Located in `src/index.js`, it handles bootstrapping, global middleware, database synchronization, and the dynamic loading of plugins.
- **Plugins**: Located in `src/plugins/`, each plugin is a self-contained module that can define its own models, controllers, services, routes, and AdminJS resources.
- **Extensions**: Located in `src/extensions/`, this layer allows the project to override or augment plugin-level controllers and services without modifying the original plugin code.
- **Models Registry**: A global registry that collects models from all enabled plugins, allowing for late-binding associations across different modules.

---

## 🚀 Code Flow

### 1. Bootstrap Phase (`src/index.js`)
1. **Environment Config**: Loads variables from `.env`.
2. **Database Initialization**: Connects to the database and initializes core models.
3. **Hybrid Plugin Loader**: Iterates through `src/config/plugins.js`.
   - Attempts to load the plugin from `node_modules` (supporting future NPM distribution).
   - Falls back to the local `src/plugins/` directory.
4. **Extension Check**: Checks if an extension exists for the specific plugin in `src/extensions/<plugin-name>/server/index.js`.
5. **Plugin Initialization**: Calls the plugin's entry function, passing the application context, specific configuration, and any detected extension.
6. **Model Registry**: Collects models returned by plugins into a global `allModels` object.

### 2. Association Phase
Once all plugins are loaded, `allModels.associateModels(allModels)` is called. This handles complex relationships (e.g., a "Note" in `my-plugin` belonging to an "Applicant" in `stb-myaccount`).

### 3. Startup Phase
- Initializes AdminJS with resources collected from plugins.
- Binds routers (API and Admin).
- Synchronizes the database schema.
- Starts the Koa server.

---

## 🔐 Auth Flow

Authentication and Identity are handled by the `stb-auth` plugin.

### Key Components:
- **Models**: Defines `ApiUser`, `ApiRole`, `ApiPermission` (for end users) and `AdminUser`, `AdminRole`, `AdminPermission` (for internal administration).
- **Strategy**: Uses **Passport.js** with a **JWT (JSON Web Token)** strategy.
- **Context Middlewares**:
  - `auth`: A standard JWT authentication check.
  - `authorizeApi`: A granular permission-based check for API routes.

### Login Process:
1. User posts credentials to `/auth/login`.
2. `stb-auth` verifies the user (using `argon2` for password hashing).
3. A JWT is generated and returned.
4. Subsequent requests must include the JWT in the `Authorization` header (`Bearer <token>`).

---

## 🛠️ Plugin Options

Plugins are managed via `src/config/plugins.js`. To enable a plugin and provide configuration:

```javascript
module.exports = {
  'stb-auth': {
    enabled: true,
    config: {
      jwtSecret: process.env.JWT_SECRET,
    },
  },
  // ...other plugins
};
```

Each plugin receives this `config` object during its initialization function.

---
 
## 🔄 Overwrite Options (Extension Mechanism)
 
The extension mechanism allows developers to customize plugin behavior without altering the plugin source.
 
### How it works:
1. Create a file at `src/extensions/<plugin-name>/server/index.js`.
2. This file should export a function that receives the plugin's internal `controllers`, `models`, `config`, and `services`.
3. You can use this to merge or replace controller methods and register model lifecycle hooks.
 
**Example Extension (`src/extensions/stb-auth/server/index.js`):**
```javascript
module.exports = ({ controllers, models, services }) => {
  const { ApiUser } = models;
  const { emailService } = services;

  // 1. Override a controller method
  const originalLogin = controllers.authController.login;
  controllers.authController.login = async (ctx) => {
    console.log('Intercepted login attempt!');
    return originalLogin(ctx);
  };

  // 2. Register a Model Lifecycle Hook
  ApiUser.addHook('afterCreate', async (user) => {
    await emailService.sendEmail({
      to: user.email,
      subject: 'Welcome!',
      text: 'Your account is ready.'
    });
  });
};
```

---

## 🛠️ Core Services

The application provides shared core services that can be used across plugins and extensions.

- **EmailService**: Located in `src/services/EmailService.js`. Currently a mock service that logs to the console, designed to be easily replaced by a dedicated Email Plugin (e.g., Mailgun integration) in the future.

---

## ✨ Other Features

### Dynamic AdminJS Dashboard
Plugins can return an `adminResources` array. These are automatically registered with the AdminJS dashboard, providing an instant UI for managing plugin-specific data.

### Standardized Folder Structure
To maintain consistency, plugins and the core follow a similar layout:
- `controllers/`: Request handling logic.
- `services/`: Business logic and external integrations.
- `models/`: Sequelize model definitions.
- `routes/`: API endpoint definitions.
- `config/`: Default plugin-level configuration.

### Global Error Handling
A centralized `errorHandler` middleware ensures that all errors (both from core and plugins) are caught and formatted consistently in the response.

---

## 📦 Getting Started

1. **Install Dependencies**: `npm install`
2. **Environment Variables**: Copy `.env.example` to `.env` and configure your database and secrets.
3. **Run Development Server**: `npm run dev`
4. **Access Dashboard**: Visit `http://localhost:3000/admin`
