
const mongoose = require('mongoose')
const database = require('./Databases/quotebase')
const mongoosactic =require('mongoosastic')
const Schema = mongoose.Schema;

var userSchema = new Schema({
        userid: Number,
        chat_id: Number,
        phonenumber:Number,
        subscribed: {type: Boolean, default:false},
        banned:{type:Boolean,default:false},
        admin:{type:Boolean,default:false},
        quotehis:[],

    }
)
var quoteSchema = new Schema({
    text: String,
    id: Number
})
var BusiquoteSchema = new Schema({
    text: String,
    id: Number
})
var LovequoteSchema = new Schema({
    text: String,
    id: Number
})
mongoose.model('Quote',quoteSchema)
mongoose.model('BusinQ',BusiquoteSchema)
mongoose.model('LoveQ',LovequoteSchema)
mongoose.model('User',userSchema)
