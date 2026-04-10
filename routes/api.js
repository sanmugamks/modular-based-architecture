const Router = require('@koa/router');
const passport = require('../middleware/passport');
const authorizeApi = require('../middleware/authorizeApi');

// Controllers
const AuthController = require('../controllers/AuthController');
const NegotiatorController = require('../controllers/NegotiatorController');
const PropertyController = require('../controllers/PropertyController');
const ApplicantController = require('../controllers/ApplicantController');
const OfferController = require('../controllers/OfferController');
const AppointmentController = require('../controllers/AppointmentController');

const { koaBody } = require('koa-body');

const router = new Router({ prefix: '/api' });
router.use(koaBody({ multipart: true }));

// Helper: JWT auth middleware shorthand
const auth = passport.authenticate('jwt', { session: false });

// ============================
// Public Routes (No JWT needed)
// ============================

// Health Check
router.get('/health', (ctx) => {
  ctx.body = { status: 'healthy', version: '1.0.0 POC' };
});

// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// ============================
// Protected Routes (JWT + RBAC)
// ============================

// Auth - Profile
router.get('/auth/me', auth, authorizeApi, AuthController.me);

// Negotiators CRUD
router.get('/negotiators', auth, authorizeApi, NegotiatorController.findAll);
router.get('/negotiators/:id', auth, authorizeApi, NegotiatorController.findOne);
router.post('/negotiators', auth, authorizeApi, NegotiatorController.create);
router.put('/negotiators/:id', auth, authorizeApi, NegotiatorController.update);
router.del('/negotiators/:id', auth, authorizeApi, NegotiatorController.destroy);

// Properties CRUD
router.get('/properties', auth, authorizeApi, PropertyController.findAll);
router.get('/properties/:id', auth, authorizeApi, PropertyController.findOne);
router.post('/properties', auth, authorizeApi, PropertyController.create);
router.put('/properties/:id', auth, authorizeApi, PropertyController.update);
router.del('/properties/:id', auth, authorizeApi, PropertyController.destroy);

// Applicants CRUD
router.get('/applicants', auth, authorizeApi, ApplicantController.findAll);
router.get('/applicants/:id', auth, authorizeApi, ApplicantController.findOne);
router.post('/applicants', auth, authorizeApi, ApplicantController.create);
router.put('/applicants/:id', auth, authorizeApi, ApplicantController.update);
router.del('/applicants/:id', auth, authorizeApi, ApplicantController.destroy);

// Offers CRUD
router.get('/offers', auth, authorizeApi, OfferController.findAll);
router.get('/offers/:id', auth, authorizeApi, OfferController.findOne);
router.post('/offers', auth, authorizeApi, OfferController.create);
router.put('/offers/:id', auth, authorizeApi, OfferController.update);
router.del('/offers/:id', auth, authorizeApi, OfferController.destroy);

// Appointments CRUD
router.get('/appointments', auth, authorizeApi, AppointmentController.findAll);
router.get('/appointments/:id', auth, authorizeApi, AppointmentController.findOne);
router.post('/appointments', auth, authorizeApi, AppointmentController.create);
router.put('/appointments/:id', auth, authorizeApi, AppointmentController.update);
router.del('/appointments/:id', auth, authorizeApi, AppointmentController.destroy);

module.exports = router;
