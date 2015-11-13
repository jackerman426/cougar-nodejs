/**
 * Created by jackerman on 13/09/15.
 */
var mongoose = require('mongoose');
var EventEmitter = require('events').EventEmitter;

var MONGO_EVENTS = {
    OPEN: 'open',
    ERROR: 'error',
    CONNECTING: 'connecting',
    RECONNECTED: 'reconnected'
};

function MongoController() {
    this.db = null;
    this.mongoose = null;
    this.MONGO_EVENTS = MONGO_EVENTS;
}

MongoController.prototype.initialize = function(mongoUrl) {
    this.mongoose = mongoose;

    if(mongoUrl) {
        this.mongoUrl = mongoUrl;
    }
};

MongoController.prototype.connect = function() {
    var eventEmitter = new EventEmitter();

    var self = this;

    var options = {
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
     * Connect to mongodb mongoose
     */

    this.mongoose.connect(this.mongoUrl, options);
    this.db = mongoose.connection;

    // Initialize mongoose event listeners
    eventEmitter.once('open', function () {
        self.emit(self.MONGO_EVENTS.OPEN, self.mongoose);
    });

    eventEmitter.on('error', function (error) {
        self.emit(self.MONGO_EVENTS.ERROR, error);
    });

    eventEmitter.on('connecting', function () {
        self.emit(self.MONGO_EVENTS.CONNECTING);
    });

    eventEmitter.on('reconnected', function () {
        self.emit(self.MONGO_EVENTS.RECONNECTED);
    });
};

module.exports = new MongoController();