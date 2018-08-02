
const mongoose = require('mongoose')
const database = require('./quotebase')
const mongoosactic =require('mongoosastic')
const Schema = mongoose.Schema;

var userSchema = new Schema({
        firstname: String,
        lastname:  String,
        userid: Number,
        chat_id: Number,
        phonenumber:Number,
        subscribed: {type: Boolean, default:false},
        banned:{type:Boolean,default:false},
        admin:{type:Boolean,default:false},

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



 //var number = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
      //    console.log(number); 



  

