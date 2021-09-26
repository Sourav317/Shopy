const Mongoose  = require('mongoose');

const mongoSchema = Mongoose.Schema({
    Name : {
        type : String,
        required : true
    },
/*
    HSN : {
        type : Number
    },
*/
    Quantity : {
        type : Number,
        required : true
    },

    Rate : {
        type : Number,
        required : true
    }
}, { timestamps: true });

const Store = Mongoose.model('Store', mongoSchema);
module.exports = Store;