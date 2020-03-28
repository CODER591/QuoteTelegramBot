const fs      = require('fs');
const request = require('request');
const cheerio = require('cheerio');
var http = require('http');
const mongoose = require('mongoose');
const models    = require('./models')
const connect  = require ('./mongoconnect')

const database = require('./Databases/quotebase')
const Bizdatabase = require('./Databases/business_quotebase')
const Lovedatabase = require('./Databases/love_quotebase')
const userdb = require('./Databases/user_base')

const { URL }  = require('url');
const HelpUrl = "./files_to_help/help.txt";
const QuoteUrl = "./files_to_help/quote.txt";
const BusinessUrl = "./files_to_help/businessquote.txt";
const LoveQuoteUrl = "./files_to_help/lovequote.txt";
//////////////||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

const TelegramBot = require('node-telegram-bot-api')
//const TOKEN ='527795878:AAHFZzNLrIoq6gt5ZBPiW_FBy4OTzcT_PkA'


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
   var d1 = parseInt(data);
   return d1;
}
function BizquoteCount() {

   BusinQ.count({},function(err,count){
   	 console.log("BusinQ count is "+count);
     fs.writeFile("./files_to_help/BusinQNum.txt", count,"utf-8", function(err) {
    					if(err) {return console.log(err);}
	   });
   });

   var data = fs.readFileSync("./files_to_help/BusinQNum.txt");
   var d1= parseInt(data);
   return d1;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення
}
bot.onText(/\/contact_author/, (msg) => {
    bot.sendMessage(msg.chat.id,"Here is the my contact e-mail: mazorchyk@gmail.com");
})
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,"Look on keyboard",{
        reply_markup:{
            keyboard:[['/Quote'],['/Help'],['/FindHelp'],['/Businessquote'],['/Lovequote']]
        }
    });

});

bot.onText(/\/find (.*):(.*)|\/find/, (msg, match) => {  //find  quote text
      const choice = match[1];
      const quote  = match[2];
      var isChoiceObjectEmpty = !Object.keys(choice).length;
      var isQuoteObjectEmpty = !Object.keys(quote).length;
      const telegramId = msg.from.id;
      if(isQuoteObjectEmpty==false) { // probably working on quote!=null
         if(choice == "Q") {
              Quote.findOne({'text': {'$regex': quote, '$options': 'i'}},function(err,quotes) {
                  if(quotes!=null){
                      bot.sendMessage(msg.chat.id,quotes.text);
                   } // what to do with this null text property //probably fixed with if statement
                   else {
                      bot.sendMessage(msg.chat.id,"Dont find such Quote");
                   }
              });
         }
         if(choice == "B") {
              BusinQ.findOne({'text': {'$regex': quote, '$options': 'i'}},function(err,quotes) {
                  if(quotes!=null){
                      bot.sendMessage(msg.chat.id,quotes.text);
                  }
                  else {
                      bot.sendMessage(msg.chat.id,"Dont find such Quote");
                  }
              });
         }
         if(choice == "L") {
              LoveQ.findOne({'text': {'$regex': quote, '$options': 'i'}},function(err,quotes) {
                   if(quotes!=null){
                      bot.sendMessage(msg.chat.id,quotes.text);
                   }
                   else {
                      bot.sendMessage(msg.chat.id,"Dont find such Quote");
                   }
              });
         }
      }
      else {
         bot.sendMessage(msg.chat.id,"Please input string in format as in example: /find Q:Scientia");
      }

});

bot.onText(/\/Quote/, (msg) => {
    //var number = Math.floor(Math.random() * (27 - 1 + 1)) + 1;
    var number = getRandomInt(1,QuoteCount());
       Quote.findOne({ 'id': number }, function (err, quotes) {
        if (err) return handleError(err);
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
    var number = getRandomInt(1,LovequoteCount()-1);
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
bot.onText(/\/FindHelp/,(msg) => {
    bot.sendMessage(msg.chat.id,"To find quote input string as in example:\n/find Q:Scientia\nQ - Quotes\nB - Business quotes\nL - Love quotes");
});

bot.onText(/\/Settings/,(msg) =>{
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


///*below is going admin functions
//*
//*
//*
//*

bot.on('message',(msg)=>{
    //bot.sendMessage(msg.chat.id,"debug mode");
})

bot.onText(/\/Debug:(.*)|\/Debug/,(msg,match) => {

    const token = match[1];
    if(token != TOKEN) {
        return;
    }
    bot.sendMessage(msg.chat.id,"debug mode");
    //input here all what you want to try
    //if admin check
    /*User.findOne({ 'chat_id': msg.chat.id }, function (err, user) {

    });*/
    //firstly syncronus code after that async
    // based on this vari is changing and we are checking admin it or not  And we are checking ONLY inside callback


});

bot.onText(/\/Update:(.*)|\/Update/,(msg,match)=> {
    const token = match[1];
    console.log(token);
    if(token != TOKEN) {
        return;
    }
    bot.sendMessage(msg.chat.id,"Look on Update keyboard",{
        	reply_markup:{
            	keyboard:[['/UpdateParse'],['/UpdateTxt']]
        	}
    });
});
bot.onText(/\/UpdateParse:(.*)|\/UpdateParse/,(msg,match)=> {
     const token = match[1];
     if(token != TOKEN) {
         return;
     }
      bot.sendMessage(msg.chat.id," Look in source code at link, what you Updating");
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
   }
});
bot.onText(/\/UpdateParseQuote:(.*)|\/UpdateParseQuote/,(msg,match)=> {
  const token = match[1];
  if(token != TOKEN) {
      return;
  }
   var k = QuoteCount();
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
bot.onText(/\/UpdateParseBiz:(.*)|\/UpdateParseBiz/,(msg,match)=> {
  const token = match[1];
  if(token != TOKEN) {
      return;
  }
    var k = BizquoteCount();
    for (var j = 0; j < 380; j++)
    {
    	fs.readFile("./files_to_help/"+j+".txt",{encoding:'utf8'},(err,data)=>{
            data.split('\n').forEach(line => {
              console.log(line)
           	  var line1 = line + '\n';
            /* creating new object in DB */
              BusinQ.create({ text:line1,id:k }, function (err, small) {
       	  			if (err) return handleError(err);
     	 	      })
     	  	   k = k+1;
            })
  	   })
    }
});
bot.onText(/\/UpdateParseLove:(.*)|\/UpdateParseLove/,(msg,match)=> {
  const token = match[1];
  if(token != TOKEN) {
    return;
  }
    var k = LovequoteCount();
    for (var j = 0; j < 380; j++)
    {
    	fs.readFile("./files_to_help/"+j+".txt",{encoding:'utf8'},(err,data)=>{
          data.split('\n').forEach(line => {
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
bot.onText(/\/UpdateTxt:(.*)|\/UpdateTxt/,(msg,match)=> {
	//need to add an instruction
     const token = match[1];
     if(token != TOKEN) {
       return;
     }
	   bot.sendMessage(msg.chat.id,"Look on UpdateTxt keyboard",{
        	reply_markup:{
            	keyboard:[['/UpdateTxtQuote'],['/UpdateTxtBiznes'],['/UpdateTxtLove']]
        	}
    	});
});
bot.onText(/\/UpdateTxtQuote:(.*)|\/UpdateTxtQuote/, (msg,match) => {
    const token = match[1];
    if(token != TOKEN) {
        return;
    }
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
bot.onText(/\/UpdateTxtBiznes:(.*)|\/UpdateTxtBiznes/, (msg,match) => {
    const token = match[1];
    if(token != TOKEN) {
        return;
    }
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
bot.onText(/\/UpdateTxtLove:(.*)|\/UpdateTxtLove/, (msg,match) => {
      const token = match[1];
      if(token != TOKEN) {
          return;
      }
      var k = LovequoteCount();
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
bot.onText(/\/Delete:(.*)|\/Delete/,(msg,match)=>{
		const token = match[1];
    if(token != TOKEN) {
        return;
    }
    bot.sendMessage(msg.chat.id,"Look on Deleting keyboard",{
        	reply_markup:{
            	keyboard:[['/DeleteALLBase'],['/DeleteQuote'],['/DeleteBusinQ'],['/DeleteLoveQ']]
        	}
    	});
});
bot.onText(/\/DeleteALLBase:(.*)|\/DeleteALLBase/,(msg,match) => {
    const token = match[1];
    if(token != TOKEN) {
          return;
    }
    for(let iiid=0;iiid<=10000;iiid++)
    {
     Quote.find({id:iiid}).remove().exec().then(_ =>console.log('Removed',iiid))
     BusinQ.find({id:iiid}).remove().exec().then(_ =>console.log('Removed',iiid))
     LoveQ.find({id:iiid}).remove().exec().then(_ =>console.log('Removed',iiid))
    }
});
bot.onText(/\/DeleteQuote:(.*)|\/DeleteQuote/,(msg,match)=>{
    const token = match[1];
    if(token != TOKEN) {
        return;
    }
    var P=QuoteCount();
    for (var iiid = 0; iiid <=100; iiid++) {
      Quote.find({id:iiid}).remove().exec().then(_ =>console.log('Removed',iiid))
   	}
    console.log('All Quote removed');
    console.log("Removing control: "+P);

});
bot.onText(/\/DeleteBusinQ:(.*)|\/DeleteBusinQ/,(msg,match)=>{
    const token = match[1];
    if(token != TOKEN) {
        return;
    }
    var J = BizquoteCount();
    for (var iiid = 0; iiid <=BizquoteCount(); iiid++) {
    	BusinQ.find({id:iiid}).remove().exec().then(_ =>console.log('Removed',iiid))
   	}
   	console.log('All BusinQ removed');
   	console.log("Removing control: " + J);
});
bot.onText(/\/DeleteLoveQ:(.*)|\/DeleteLoveQ/,(msg,match) => {
  const token = match[1];
  if(token != TOKEN) {
      return;
  }
     var L = LovequoteCount();
     for (var iiid = 0; iiid < 1000; iiid++) {
  		LoveQ.find({id:iiid}).remove().exec().then(_ =>console.log('Removed',iiid))
  	 }
  	 console.log(' All LoveQ removed');
     console.log("Removing control: "+J);
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
            // Bizdatabase.businessquotes.forEach(element => { new BusinQ(element).save() .catch(element=>console.log(element))});
            // Lovedatabase.lovequotes.forEach(element => { new LoveQ(element).save() .catch(element=>console.log(element))});


//myTelegrambot
//node ./index.js
