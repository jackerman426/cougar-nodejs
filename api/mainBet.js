/**
 * Created by mariostzakris on 12/06/15.
 */
'use strict';
var async = require('async');
var betfairService = require('./services/BetfairService');

var params = {
    filter:{}
};

module.exports = {

    startBet : function(next) {
        async.waterfall([
            function(callback){
                var params = {filter: {eventTypeIds:["1"]}};
                betfairService.listEvents(params, function(error, eventsIds){
                    if(error){
                        betLogger.error("Failed to get list of events");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved list evetns");
                        callback(null, eventsIds)

                    }
                })
            },
            function(eventIds, callback){
                var params = {"filter": {
                    "eventIds": eventIds,
                    "textQuery": "Barclays"
                },"maxResults": "200",
                    "marketProjection": [
                    "COMPETITION",
                    "EVENT",
                    "EVENT_TYPE"
                ]};
                betfairService.listMarketCatalogue(params, function(error, marketIds){
                    if(error){
                        betLogger.error("Failed to get list of market info");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved list of market info");
                        callback(null, marketIds)

                    }
                })
            },
            function(marketIds, callback){
                //var params = { "filter":{
                //    "marketIds": marketIds
                //    }
                //};
                var params = {
                    "marketIds": [marketIds[0], marketIds[1]],
                    "priceProjection":{"priceData":["EX_BEST_OFFERS"]},
                    "orderProjection":"EXECUTABLE"
                };

                //var filter = 	{"marketIds":["1.116312560"],"priceProjection":{"priceData":["EX_BEST_OFFERS"]},"marketProjection": "RUNNER_DESCRIPTION"}


                betfairService.listMarketBook(params, function(error, whatever){
                    if(error){
                        betLogger.error("Failed to get market book info");
                        callback(error);
                    }else{
                        betLogger.info("Successfully retrieved market book info");
                        callback(null, marketIds)

                    }
                })
            }
        ],
        function(error){
            next(error);
        })
    },


};
