# Release Notes - v1.1.0

## [1.1.0] - 2026-04-14

### Added

- **Plugin Extension Mechanism**: Added support for overriding plugin controllers and services via `src/extensions/<plugin-name>/server/index.js`.
- **Hybrid Plugin Loader**: The application now dynamically loads plugins from either `node_modules` or the local `src/plugins/` directory, facilitating the transition to standalone NPM packages.
- **Plugin Configuration**: Added default configuration support within plugins via a `config/` directory.
- **NPM Integration**: Added `package.json` to `my-plugin` to prepare it for NPM distribution.

### Changed

- **Standardized Plugin Architecture**: Restructured `my-plugin` to follow a clean, maintainable folder structure (controllers, models, routes, and services moved to a `server/` directory).
- **Core Loader Refactor**: Updated `src/index.js` to handle both local and external plugins gracefully.

### Fixed

- Fixed a regression in the plugin loader where the `plugin` variable was not correctly defined during initialization.
