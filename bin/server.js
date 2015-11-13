#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('betjs:server');
var http = require('http');
var winston = require("winston");

var mongoController = require('../lib/connections/MongoController');



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8082');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);


/**
 * Establish connection to mongoDB
 */
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/cougar';
mongoController.initialize(mongoUrl);
mongoController.connect();

// Initialize mongoose event listeners
mongoController.db.on(mongoController.MONGO_EVENTS.OPEN, function (error) {

  betLogger.info("Mongo connection has opened");
  startApiService();
});

mongoController.db.on(mongoController.MONGO_EVENTS.CONNECTING, function (error) {

  betLogger.info("Mongo is connecting..");

});


mongoController.db.on(mongoController.MONGO_EVENTS.RECONNECTED, function (error) {

  betLogger.info("Mongo is reconnected");

});

mongoController.db.on(mongoController.MONGO_EVENTS.ERROR, function (error) {

  betLogger.error(error);

});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Winston logger
 */
var betLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logs/info-error.log' })
  ]
});

global['betLogger'] = betLogger;
global['loginMoment'] = {expirationDate: null};









function startApiService() {
  //startBet.starBetApi(function(error, result){})
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  betLogger.info('Betjs Application Started..');
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      betLogger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      betLogger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
