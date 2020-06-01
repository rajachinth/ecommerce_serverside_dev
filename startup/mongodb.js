const mongoose=require('mongoose');
const debug=require('debug')('consoleLogDebug');
const config=require('config');

module.exports=function()
{
    mongoose.connect(config.get('applicationCoreDB'))
          .then(()=>{debug('database connection successful')})
          .catch(()=>{debug('failed to connect database, check mongoDB local server')});
} 