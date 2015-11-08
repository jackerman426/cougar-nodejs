/**
 * Created by jackerman on 12/06/15.
 */
'use strict';
var betfairClient = require('betfair');
var betfairAppKey = process.env.BETFAIR_DELAYED_APIKEY;

//create session for betfair
var session = betfairClient.newSession(betfairAppKey);

var credentials = {
    username: process.env.username,
    password: process.env.password
};

module.exports = {
    login: function (next) {
        session.login(credentials.username, credentials.password, function (error, result) {
            next(error);
        })
    },
    listEvents: function (params, next) {
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
    listMarketBook: function(params, next) {

        session.listMarketBook(params, function(error, res){
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
    placeBet: function(params, next){

        session.placeOrders(params, function(error, res){
            if(error){
                next(error);
            } else {
              next(null, res);
            }
        })
    }

};
