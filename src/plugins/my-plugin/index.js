const NoteModel = require('./models/Note');
const NoteService = require('./services/NoteService');
const NoteController = require('./controllers/NoteController');
const registerRoutes = require('./routes');

module.exports = async (app, { config, apiRouter, auth, authorizeApi, sequelize, DataTypes }) => {
  console.log(`[Plugin: my-plugin] Initializing Standardized Architecture...`);

  // 1. Initialize Model
  const PluginNote = NoteModel(sequelize, DataTypes);

  // 2. Initialize Service
  const service = NoteService(PluginNote);

  // 3. Initialize Controller
  const controller = NoteController(service);

  // 4. Register Routes
  registerRoutes(apiRouter, auth, authorizeApi, controller);

  // Example: Attach a custom context property
  app.context.myPlugin = {
    getMessage: () => config.message || 'No message configured',
    service, // Expose service to the app context if needed
    model: PluginNote
  };

  console.log('[Plugin: my-plugin] Architecture initialized successfully.');

  // 5. Return metadata for AdminJS registration
  return {
    adminResources: [
      {
        resource: PluginNote,
        options: {
          navigation: { name: 'Plugins', icon: 'Folder' },
        }
      }
    ]
  };
};
