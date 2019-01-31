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
const userdb=require('./Databases/user_base')

const { URL }  = require('url');
const HelpUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/help.txt');
const QuoteUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/quote.txt');
const BusinessUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/businessquote.txt');
const LoveQuoteUrl = new URL('file:///D:/MY_PROJCT/MyTelegramBot/files_to_help/lovequote.txt');
//////////////||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
const TelegramBot =require('node-telegram-bot-api')
const TOKEN ='527795878:AAGvCHi4GNE5IbKkvTHd8vRAS8VbcCuTtkM'

const bot = new  TelegramBot(TOKEN,{
    polling:  true
})
var helpfile = fs.readFileSync(HelpUrl,"utf-8");
//var quotefile = fs.readFileSync(QuoteUrl,"utf-8");

const Quote = mongoose.model('Quote')
const LoveQ = mongoose.model('LoveQ')
const BusinQ= mongoose.model('BusinQ')
const User  = mongoose.model('User')

function QuoteCount() {
   Quote.count({},function(err,count){
   	 console.log("Quote count is "+count);
     fs.writeFile("./files_to_help/QuoteNum.txt", count,"utf-8", function(err) {
    					if(err) {return console.log(err);}				
	 });
    }); 
    
   var data = fs.readFileSync("./files_to_help/QuoteNum.txt");
   var d1= parseInt(data);
   return d1;    
} 
function LovequoteCount() {
   LoveQ.count({},function(err,count){
   	 console.log("LoveQ count is "+count);
     fs.writeFile("./files_to_help/LoveQNum.txt", count,"utf-8", function(err) {
    					if(err) {return console.log(err);}				
	 });
    }); 
    
   var data = fs.readFileSync("./files_to_help/LoveQNum.txt");
   var d1= parseInt(data);
   return d1; 
} 
function BizquoteCount() {
   
   BusinQ.count({},function(err,count){
   	 console.log("BusinQ count is "+count);
     fs.writeFile("./files_to_help/BusinQNum.txt", count,"utf-8", function(err) {
    					if(err) {return console.log(err);}				
	 });
    }); 
    //fs.readFile("./files_to_help/BusinQNum.txt",{encoding:'utf8'},(err,data)=>{
   //});
   var data = fs.readFileSync("./files_to_help/BusinQNum.txt");
   var d1= parseInt(data);
   return d1; 
} 


function getRandomInt(min, max) 
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення 
}

bot.on('message',(msg)=>{
    
})
bot.onText(/\/contact_author/, (msg) => {
    bot.sendMessage(msg.chat.id,"Here is the my contact e-mail: mazorchyk@gmail.com");
})
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,"Look on keyboard",{
        reply_markup:{
            keyboard:[['/Quote'],['/Help'],['/Businessquote'],['/Lovequote']]
        }
    });
    
});

bot.onText(/\/Quote/, (msg) => {
    //var number = Math.floor(Math.random() * (27 - 1 + 1)) + 1;
    var number = getRandomInt(1,48);
    
       Quote.findOne({ 'id': number }, function (err, quotes) {
        if (err) return handleError(err);
        //console.log(quotes.text);
        const TXT=quotes.text;
        bot.sendMessage(msg.chat.id,TXT)   
      });      
 
});

bot.onText(/\/Businessquote/, (msg) => {
    //var number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    var number = getRandomInt(1,BizquoteCount());
       BusinQ.findOne({ 'id': number }, function (err, businessquotes) {
        if (err) return handleError(err);
        
        const TXT=businessquotes.text;
        bot.sendMessage(msg.chat.id,TXT)   
      });      
 
});

bot.onText(/\/Lovequote/, (msg) => {
    //var number = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
    var number = getRandomInt(1,LovequoteCount());
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


bot.onText(/\/Update/,(msg)=> {

    bot.sendMessage(msg.chat.id,"Look on Update keyboard",{
        	reply_markup:{
            	keyboard:[['/UpdateParse'],['/UpdateTxt']]
        	}
    	});
});

bot.onText(/\/UpdateParse/,(msg)=> {
     bot.sendMessage(msg.chat.id," Look in source  code at link, what you Updating");

     request('https://motivationping.com/quotes/',(error,response,body)=>{
        const $ = cheerio.load(body)
        const wlinks = $('p');//.text();
 
          wlinks.each(i => {
              var link = wlinks.eq(i).text();
       		  fs.writeFile("./files_to_help/"+i+".txt", link,"utf-8", function(err) {
    					if(err) {return console.log(err);}	
              			//console.log(link);
    					//console.log("The file was saved!");			
			  }); 
			   
       
          });

     })
  
     bot.sendMessage(msg.chat.id,"quotes Are load to files\n Choose what you want to update",{
        	reply_markup:{
            	keyboard:[['/UpdateParseQuote'],['/UpdateParseBiz'],['/UpdateParseLove']]
        	}
    	});
});

bot.onText(/\/UpdateParseQuote/,(msg)=> {
   var k=QuoteCount();
   for (var j = 0; j < 380; j++) 
   {
  	fs.readFile("./files_to_help/"+j+".txt",{encoding:'utf8'},(err,data)=>{
           data.split('\n').forEach(line=>{ 
           	console.log(line)
           	var line1=line+'\n';
            //here we need to create new object in DB
             Quote.create({ text:line1,id:k }, function (err, small) {
       	  			if (err) return handleError(err);
     	 	 })     
     	  	k=k+1;    
           })
          
  	})
   }
});
bot.onText(/\/UpdateParseBiz/,(msg)=> {
   var k=BizquoteCount();
   for (var j = 0; j < 380; j++) 
   {
  	fs.readFile("./files_to_help/"+j+".txt",{encoding:'utf8'},(err,data)=>{
           data.split('\n').forEach(line=>{ 
           	console.log(line)
           	var line1=line+'\n';
            //here we need to create new object in DB
             BusinQ.create({ text:line1,id:k }, function (err, small) {
       	  			if (err) return handleError(err);
     	 	 })     
     	  	k=k+1;    
           })
          
  	})
   }
});

bot.onText(/\/UpdateParseLove/,(msg)=> {
   //var k=LovequoteCount();
   var k=8;
   for (var j = 0; j < 380; j++) 
   {
  	fs.readFile("./files_to_help/"+j+".txt",{encoding:'utf8'},(err,data)=>{
           data.split('\n').forEach(line=>{ 
           	if (err) throw err;
           	var LoveQuotTXTLine = line.toString();
      
      	LoveQ.create({ text:LoveQuotTXTLine,id:k }, function (err, small) {
       	  if (err) return handleError(err);
       	  console.log("LoveQ added")
     	  })     
     	  k=k+1;  
           })
          
  	})
   }
});

bot.onText(/\/UpdateTxt/,(msg)=> {
	//need to add an instruction
	bot.sendMessage(msg.chat.id,"Look on UpdateTxt keyboard",{
        	reply_markup:{
            	keyboard:[['/UpdateTxtQuote'],['/UpdateTxtBiznes'],['/UpdateTxtLove']]
        	}
    	});
});

bot.onText(/\/UpdateTxtQuote/, (msg) => {
     
     //var i=Quote.count({},function(err,count){console.log("Quote count is "+count)}); //28
     var i=QuoteCount();
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
});
bot.onText(/\/UpdateTxtBiznes/, (msg) => {
   
    //var j=BusinQ.count({},function(err,count){console.log("Biz count is "+count)}); //j=8;
    var j=BizquoteCount();
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
});
bot.onText(/\/UpdateTxtLove/, (msg) => {

      // var k=LoveQ.count({},function(err,count){console.log("Love count is "+count)});//k=8;
       var k=LovequoteCount();
       
  	  fs.readFile(LoveQuoteUrl, { encoding : 'utf8' },(err, data) => {
    	if (err) throw err;
   	 	data.split('\n').forEach(line => {
      	var LoveQuotTXTLine = line;
      
      	LoveQ.create({ text:LoveQuotTXTLine,id:k }, function (err, small) {
       	  if (err) return handleError(err);
     	  })     
     	  k=k+1;
    	 });
  	  });
});
bot.onText(/\/Delete/,(msg)=>{
	
		bot.sendMessage(msg.chat.id,"Look on Deleting keyboard",{
        	reply_markup:{
            	keyboard:[['/DeleteALLBase'],['/DeleteQuote'],['/DeleteBusinQ'],['/DeleteLoveQ']]
        	}
    	});
});
bot.onText(/\/DeleteALLBase/,(msg)=>{
		
    for(let iiid=0;iiid<=100;iiid++)
    {
     Quote.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
     BusinQ.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
     LoveQ.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
    }
});
bot.onText(/\/DeleteQuote/,(msg)=>{
    //var P=Quote.count({},function(err,count){console.log("Quote count is "+count)}); //28
    var P=QuoteCount();
    for (var iiid = 0; iiid <=100; iiid++) {
      Quote.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
   	}
    console.log('All Quote removed');

    console.log("Removing control: "+P);
});
bot.onText(/\/DeleteBusinQ/,(msg)=>{
    //var J=BusinQ.count({},function(err,count){console.log("Biz count is "+count)}); //j=8;
    var J=BizquoteCount()
    for (var iiid = 0; iiid <=100; iiid++) {
    	BusinQ.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
   	}
   	console.log(' All BusinQ removed');

   	console.log("Removing control: "+J);
});
bot.onText(/\/DeleteLoveQ/,(msg)=>{
     //LoveQ.count({},function(err,count){console.log("Love count is "+count)});//k=8;
     var L=LovequoteCount();
     for (var iiid = 0; iiid < 1000; iiid++) {
  		LoveQ.find({id:iiid}).remove().then(_ =>console.log('Removed',iiid))
  	 }
  	 console.log(' All LoveQ removed');

  	 //LoveQ.count({},function(err,count){console.log("Love count is "+count)});//k=8;
});




/*bot.onText(/\/UpToDateBase/, (msg) => {
 
   //database.quotes.forEach(element => { new Quote(element).save() .catch(element=>console.log(element))});
   //Bizdatabase.businessquotes.forEach(element => { new BusinQ(element).save() .catch(element=>console.log(element))});
   //Lovedatabase.lovequotes.forEach(element => { new LoveQ(element).save() .catch(element=>console.log(element))});
   console.log('Updating')
  request('https://motivationping.com/quotes/',(error,response,body)=>{
       const $ = cheerio.load(body)
       const wlinks = $('p');//.text();
 
        wlinks.each(i => {
              var link = wlinks.eq(i).text();
       		  fs.writeFile("./files_to_help/"+i+".txt", link,"utf-8", function(err) {
    					if(err) {return console.log(err);}
    		 				
              			//console.log(link);
    					//console.log("The file was saved!");			
			  }); 
			   
       
         });

    })
    console.log('end of parsing quotes and writing to file')
  for (var j = 0; j < 380; j++) 
  {
  	fs.readFile("./files_to_help/"+j+".txt",{encoding:'utf8'},(err,data)=>{
           data.split('\n').forEach(line=>{ 
           	console.log(line)
           	var line1=line+'\n';
            //here we need to create new object in DB
           })
  	})
  }

}); */




// database useful  used methods
    //method used to delete any element by field
            //Quote.find({id:number}).remove().then(_ =>console.log('Removed'))

    //method used to show all database in console           
            /* Quote.find({id:number}).exec(function(err, quotes) {
                         console.log(quotes)                                                        
                    });*/
    
    //method used to create base by reading quotebase.json
            //database.quotes.forEach(element => { new Quote(element).save() .catch(element=>console.log(element))});
            //userdb.users.forEach(element => { new User(element).save() .catch(element=>console.log(element))});



//myTelegrambot
//node ./index.js
