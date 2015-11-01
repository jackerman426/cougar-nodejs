/**
 * Created by jackerman on 01/07/15.
 */

var errors = require('errors');

// Error codes
const ERROR_INVALID_ARGUMENT_PROVIDED = 601;
const ERROR_INVALID_NUMBER_OF_ARGUMENTS_PROVIDED = 602;

// Status codes
const INTERNAL_SERVER_ERROR = 500;

// Constructor
function ApiErrors() {

}

ApiErrors.prototype.invalidArgumentProvidedError = function (argument) {

    // Invalid argument provided
    errors.create({
        name: 'invalidArgumentProvidedError',
        code: ERROR_INVALID_ARGUMENT_PROVIDED,
        status: INTERNAL_SERVER_ERROR,
        defaultMessage: argument + " is invalid argument for this function"
    });

    return new errors.invalidArgumentProvidedError();
};

ApiErrors.prototype.invalidNumberOfArgumentsProvidedError = function () {

    // Invalid argument provided
    errors.create({
        name: 'invalidNumberOfArgumentsProvidedError',
        code: ERROR_INVALID_NUMBER_OF_ARGUMENTS_PROVIDED,
        status: INTERNAL_SERVER_ERROR,
        defaultMessage: "Invalid number/type of arguments provided in this function"
    });

    return new errors.invalidNumberOfArgumentsProvidedError();
};

var apiErrorsInstance = null;

function getApiErrorsInstance() {
    return apiErrorsInstance || (apiErrorsInstance = new ApiErrors());
}

// Expose Builder
module.exports = new getApiErrorsInstance();