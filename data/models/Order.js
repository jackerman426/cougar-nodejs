'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ORDER_STATUS = {

};


var OrderSchema = new Schema({

});


OrderSchema.pre('validate', function (next) {
    if (this.isNew) {
        //generate orderId
        this.order_id = api.utils.generateUniqueToken();
        //  mbLogger.info("OrderSchema:" + this._id + " generated unique id");
    }
    next();
});

OrderSchema.post('init', function (doc) {
    //mbLogger.info("OrderSchema:" + doc._id + " has been initialized from the db");
});

OrderSchema.post('validate', function (doc) {
    //mbLogger.info("OrderSchema:" + doc._id + " has been validated (but not saved yet)");
});

OrderSchema.post('save', function (doc) {
    mbLogger.info("OrderSchema:" + doc._id + " has been saved");
});

OrderSchema.post('remove', function (doc) {
    //mbLogger.info("OrderSchema:" + doc._id + " has been removed");
});

// specify the transform schema option
if (!OrderSchema.options.toJSON) OrderSchema.options.toJSON = {};
OrderSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id, __v of every document before returning the result
    delete ret._id;
    delete ret.__v;

    _.each(ret.processing_errors, function(error) {
        delete error._id;
    });

    _.each(ret.status_history, function(status) {
        delete status._id;
    });

    if(ret.charge_identifier) {
        delete ret.charge_identifier;
    }

    return ret;

};

var OrderModel = mongoose.model('Order', OrderSchema);
OrderModel.ORDER_STATUS = ORDER_STATUS;
OrderModel.PROCESSING_ERROR = PROCESSING_ERROR;
module.exports = OrderModel;