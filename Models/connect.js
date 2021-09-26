const Mongoose  = require('mongoose');

const mongoSchema = Mongoose.Schema({
    Name : {
        type : String,
        required : [true,'Name is required'],
        unique : true
    },
/*
    HSN : {
        type : Number
    },
*/
    Quantity : {
        type : Number,
        required : [true,'quantity is required']
    },

    Rate : {
        type : Number,
        required : [true, 'Rate is required']
    }
}, { timestamps: true });

const Store = Mongoose.model('Store', mongoSchema);
module.exports = Store;