const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BotForTelegram',{ useNewUrlParser: true })
 .then(()=> console.log('we connected'))
 .catch(e =>console.log(e))



 /* To start MongoDB 
   1) run as administrator cmd   
   2)input in cmd line cd C:\mongodb\bin\mongod
   3) mongod --storageEngine=mmapv1 --dbpath C:\mongodb\  //   --auth
   4)run all files what you want
   
   *3) need to test with --auth try to make another base and make only secure connection
    */