/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const multer = require('multer');
const cors = require('cors');
const http = require('http');
const reload = require('reload');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.keys' });

/**
 * Setup Authentication
 */
// const passportConfig = require('./config/passport');

/**
 * Get Routes
 */
const publicRoutes = require('./src/routesPublic');

/**
 * Setup / Initialization
 */
const app = express();
const BASE_URL = '/api';

const whitelist = ['http://localhost:4000', undefined]; // Undefined for Postman
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('You are not whitelisted'));
    }
  },
  preflightContinue: true,
  credentials: true,
};

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 4000);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static('./public'));
app.use(cors(corsOptions)); // todo set CORS up
app.disable('x-powered-by');

// For public requests
app.use(BASE_URL, cors(corsOptions), publicRoutes);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

reload(app);

module.exports = app;
