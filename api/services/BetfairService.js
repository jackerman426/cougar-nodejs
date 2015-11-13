/**
 * Created by jackerman on 12/06/15.
 */
'use strict';
var betfairClient = require('betfair');
var fs = require('fs');
var moment = require('moment');
//DELAYED APIKEY returns delayed price data and does not allow betting transactions to be performed
var betfairAppKey = process.env['BETFAIR_DELAYED_APIKEY'] || null;

var settings = exports.settings = {};
//create session for betfair
settings.session = betfairClient.newSession(betfairAppKey);
settings.sslOptions = {};
settings.credentials = {};
var key = fs.existsSync("certificates/client-2048.key") && fs.readFileSync("certificates/client-2048.key");
var cert = fs.existsSync("certificates/client-2048.crt") && fs.readFileSync("certificates/client-2048.crt");

if (key && cert) {
    settings.isBotLogin = true;
    settings.sslOptions = {key: key, cert: cert};
}
settings.credentials['username'] = process.env.username || null;
settings.credentials['password'] = process.env.password || null;


module.exports = {
    login: function (next) {
        var session = settings.session;
        //set sslOptions for bot login
        session.setSslOptions(settings.sslOptions);
        betLogger.info('===== Sending login ... =====');
        session.login(settings.credentials.username, settings.credentials.password, function (error, res) {
            if(error){
                betLogger.error('Login error', error);
                return next(error);
            }else{
                betLogger.info('Login OK, %s secs', res.duration / 1000);
                //session lasts for 4 hours
                loginMoment.expirationDate = moment().add(4, 'hours');
                return next(error)
            }

        })
    },
    keepAlive: function (next) {
        betLogger.info('===== Sending keepAlive ... =====');
        var session = settings.session;
        session.keepAlive(function (error, res) {
            if (error) {
                betLogger.error('KeepAlive error', error);
                return next(error);
            }else{
                betLogger.info('keepAlive OK, %s secs', res.duration / 1000, res);
                return next(null)
            }
        });
    },

    listEvents: function (params, next) {
        var session = settings.session;
        var ids = [];
        session.listEvents(params, function (error, res) {
            if (error) {
                next(error)
            } else {
                for (var index in res.response.result) {
                    var item = res.response.result[index];
                    ids.push(item.event.id);
                }
                next(null, ids);
            }
        })
    },
    listCompetitions: function (params, next) {
        var session = settings.session;
        var ids = [];
        session.listCompetitions(params, function (error, res) {
            if (error) {
                next(error)
            } else {
                for (var index in res.response.result) {
                    var item = res.response.result[index];
                    ids.push(item.competition.id);
                }
                next(null, ids);
            }
        })
    },
    listMarketCatalogue: function (params, next) {
        var session = settings.session;
        var ids = [];
        session.listMarketCatalogue(params, function (error, res) {
            if (error) {
                next(error)
            } else {
                for (var index in res.response.result) {
                    var item = res.response.result[index];
                    ids.push(item.marketId);
                }
                next(null, ids);
            }
        });
    },
    listMarketBook: function (params, next) {
        var session = settings.session;
        session.listMarketBook(params, function (error, res) {
            if (error) {
                next(error)
            } else {
                for (var index in res.response.result) {
                    var item = res.response.result[index];
                    console.log("test");
                }
                next(null);
            }
        })
    },
    /**
     * Calculates the outcome of the bet (back and lay)
     * @param {object} params
     * @param {callback} next - The callback that handles the response.
     * @return {Number} value
     */
    placeBet: function (params, next) {
        var session = settings.session;
        session.placeOrders(params, function (error, res) {
            if (error) {
                next(error);
            } else {
                next(null, res);
            }
        })
    }

};
