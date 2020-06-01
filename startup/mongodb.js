const mongoose=require('mongoose');
const debug=require('debug')('consoleLogDebug');
const config=require('config');

module.exports=function()
{
    console.log(config.get('db'));
    mongoose.connect(config.get('db'),{useNewUrlParser:true,useUnifiedTopology:true})
          .then(()=>{debug('database connection successful')})
          .catch(()=>{debug('failed to connect database, check mongoDB local server')});
} 