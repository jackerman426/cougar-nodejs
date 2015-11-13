/**
 * Created by jackerman on 01/09/15.
 */

var apiErrorHelper = new require('../errors/ApiErrors');

module.exports = {
    /**
     * Calculates the outcome of the bet (back and lay)
     * @param {Number} odd
     * @param {Number} stake
     * @param {String} type
     * @param {callback} next - The callback that handles the response.
     * @return {Number} value
     */
        //this is nonsense
    calculateProfitPerBet : function(odd, stake, type, next){
        var profit = null;
        var error = null;
        if(odd && stake && type){
            switch (type) {
                case "back":
                    profit = odd * stake;
                    break;
                case "lay":
                    profit = -stake;
                    break;
                default :
                    error = apiErrorHelper.invalidArgumentProvidedError();
                    break;
            }
            return next(error, profit);
        }else{
            return next(apiErrorHelper.invalidNumberOfArgumentsProvidedError(), null);
        }


    }

};