/**
 * Created by jackerman on 01/09/15.
 */

var apiErrorHelper = new require('../errors/ApiErrors');

module.exports = {
    /**
     * Calculates the outcome of the bet (back and lay)
     * @param {Number} odd
     * @param {Number} price
     * @param {String} type
     * @param {callback} next - The callback that handles the response.
     * @return {Number} value
     */
    calculateProfitPerBet : function(odd, price, type, next){
        var value = null;
        var error = null;
        if(odd && price && type){
            switch (type) {
                case "back":
                    value = odd * price;
                    break;
                case "lay":
                    value = -price;
                    break;
                default :
                    error = apiErrorHelper.invalidArgumentProvidedError();
                    break;
            }
            return next(error, value);
        }else{
            return next(apiErrorHelper.invalidNumberOfArgumentsProvidedError(), null);
        }


    }

};