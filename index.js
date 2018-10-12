const fs       = require('fs');
const request = require('request');
const cheerio = require('cheerio');
var http = require('http');
const mongoose = require('mongoose');
const models    = require('./models')
const connect  = require ('./mongoconnect')

const database = require('./quotebase')
const Bizdatabase=require('./Databases/business_quotebase')
const Lovedatabase = require('./Databases/love_quotebase')

const { URL }  = require('url');
const HelpUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/help.txt');
const QuoteUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/quote.txt');
const BusinessUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/businessquote.txt');
const LoveQuoteUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/lovequote.txt');
//////////////||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
const TelegramBot =require('node-telegram-bot-api')
const TOKEN ='527795878:AAHntUVN-2O1S5uv1spDgSfhUAiSSWmIcRY'

const bot = new  TelegramBot(TOKEN,{
    polling:  true
})
var helpfile = fs.readFileSync(HelpUrl,"utf-8");
//var quotefile = fs.readFileSync(QuoteUrl,"utf-8");

const Quote = mongoose.model('Quote')
const LoveQ = mongoose.model('LoveQ')
const BusinQ= mongoose.model('BusinQ')
const User  = mongoose.model('User')



bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,"Look on keyboard",{
        reply_markup:{
            keyboard:[['/Quote'],['/Help'],['/Businessquote'],['/Lovequote']]
        }
    });
});

bot.onText(/\/Quote/, (msg) => {
    var number = Math.floor(Math.random() * (27 - 1 + 1)) + 1;
    //console.log(number);
       Quote.findOne({ 'id': number }, function (err, quotes) {
        if (err) return handleError(err);
        //console.log(quotes.text);
        const TXT=quotes.text;
        bot.sendMessage(msg.chat.id,TXT)   
      });      
 
});

bot.onText(/\/Businessquote/, (msg) => {
    var number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    //console.log(number);
       BusinQ.findOne({ 'id': number }, function (err, businessquotes) {
        if (err) return handleError(err);
        
        const TXT=businessquotes.text;
        bot.sendMessage(msg.chat.id,TXT)   
      });      
 
});

bot.onText(/\/Lovequote/, (msg) => {
    var number = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
    //console.log(number);
       LoveQ.findOne({ 'id': number }, function (err, lovequotes) {
        if (err) return handleError(err);
        //console.log(lovequotes.text);
        const TXT=lovequotes.text;
        bot.sendMessage(msg.chat.id,TXT)   
      });      
});

bot.onText(/\/Help/,(msg)=> {

    bot.sendMessage(msg.chat.id,helpfile)

});

bot.onText(/\/Settings/,(msg) =>{
  /* bot.sendMessage(msg.chat.id, "Look on inline keyboard",{
       reply_markup: {
       inline_keyboard: [
              [ {
                   text:"/Notify",   
                   callback_data:"/Notify" 
                                             }],
              [ { 
                   text:"/Disnotify", 
                   callback_data:"/Disnotify" 
                                              }]
               ]
                     
            }
      });*/
      bot.sendMessage(msg.chat.id,"look on keyboard",{
        reply_markup:{
            keyboard:[['/Notify'],['/Disnotify'],['/start']]
        }
    });
});

bot.onText(/\/Notify/,(msg)=> {
    
    bot.sendMessage(msg.chat.id,"Your notificaton is enabled ",{
        disable_notifications:false
    });

});

bot.onText(/\/Disnotify/,(msg)=> {
    
    bot.sendMessage(msg.chat.id,"Your notificaton is disabled",{
        disable_notifications:true
    });

});

bot.onText(/\/UpToDateBase/, (msg) => {
 
   //database.quotes.forEach(element => { new Quote(element).save() .catch(element=>console.log(element))});
   //Bizdatabase.businessquotes.forEach(element => { new BusinQ(element).save() .catch(element=>console.log(element))});
   //Lovedatabase.lovequotes.forEach(element => { new LoveQ(element).save() .catch(element=>console.log(element))});
  request('https://motivationping.com/quotes/',(error,response,body)=>{
       const $ = cheerio.load(body)
       const wlinks = $('p');//.text();
        
        // все кидає в один масив
        //add writing to file and its over
         
        
        wlinks.each(i => {
              var link = wlinks.eq(i).text();//+'\n';
       		  fs.writeFile("./files_to_help/forBase.txt", link, function(err) {
    					if(err) {return console.log(err);}
    		 				
              			console.log(link);
    					console.log("The file was saved!");			
			  }); 
       
         });

    })

    /*var i=28;
   fs.readFile(QuoteUrl, { encoding : 'utf8' },(err, data) => {
    if (err) throw err;
    data.split('\n').forEach(line => {
      var QuotTXTLine = line;
      
      Quote.create({ text:QuotTXTLine,id:i }, function (err, small) {
        if (err) return handleError(err);
      })     
     i=i+1;
    });
  });
 
  var j=8;
  fs.readFile(BusinessUrl, { encoding : 'utf8' },(err, data) => {
    if (err) throw err;
    data.split('\n').forEach(line => {
      var BizQuotTXTLine = line;
      
      BusinQ.create({ text:BizQuotTXTLine,id:j }, function (err, small) {
        if (err) return handleError(err);
      })     
     j=j+1;
    });
  });

  var k=8;
  fs.readFile(LoveQuoteUrl, { encoding : 'utf8' },(err, data) => {
    if (err) throw err;
    data.split('\n').forEach(line => {
      var LoveQuotTXTLine = line;
      
      LoveQ.create({ text:LoveQuotTXTLine,id:k }, function (err, small) {
        if (err) return handleError(err);
      })     
     k=k+1;
    });
  });*/
   
});

bot.onText(/\/DeleteALLBase/,(msg)=>{

    for(let iiid=0;iiid<35;iiid++)
    {
     Quote.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
     BusinQ.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
     LoveQ.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
    }

});

// database useful  used methods
    //method used to delete any element by field
            //Quote.find({id:number}).remove().then(_ =>console.log('Removed'))

    //method used to show all database in console           
            /* Quote.find({id:number}).exec(function(err, quotes) {
                         console.log(quotes)                                                        
                    });*/
    
    //method used to create base by reading quotebase.json
            //database.quotes.forEach(element => { new Quote(element).save() .catch(element=>console.log(element))});




//myTelegrambot
//node ./index.js
