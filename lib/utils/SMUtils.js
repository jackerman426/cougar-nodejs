var uuid = require('node-uuid');
var crypto = require('crypto');

module.exports = {
    generateUniqueToken: function (options) {
        options = options || {};
        options.seed = options.seed || uuid.v4();

        var hash = crypto.createHash('sha1').update(options.seed).digest('hex');
        return hash;
    }
};