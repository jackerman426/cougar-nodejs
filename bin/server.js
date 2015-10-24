#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('betjs:server');
var http = require('http');
var mongoose = require('mongoose');
var winston = require("winston");
var async = require('async');
var betfairService = require('../api/services/BetfairService');

var mongoUrl = process.env.MONGOLAB_URI;
var mongoOptions = {
  server: {
    auto_reconnect: true, //default
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8082');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);




async.series([
    function(callback){
      connectToMongo(function(error){
        callback(error)
      })
    },
    function(callback){
      betfairService.login(function(error){
        if(error){
          betLogger.error("Login to betfair.com failed")
          callback(error)
        }else{
          betLogger.info("Successfully logged in to betfair.com");
          callback(null)
        }
      });
    }
], function(error){
  if(error) {
    betLogger.error(error);
  }else{
      startApiService();
    }
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


function connectToMongo(next){
  /**
   * Connect to mongodb mongoose
   */

  mongoose.connect(mongoUrl, mongoOptions);
  var db = mongoose.connection;

// Initialize mongoose event listeners
  db.once('open', function () {
    betLogger.info("MongoDB connection opened")
    next(null)
  });

  db.on('error', function (error) {
    betLogger.error(' MongoDB failed to connect');
  });

  db.on('connecting', function () {
    betLogger.info("MongoDB connecting");
  });
}


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
