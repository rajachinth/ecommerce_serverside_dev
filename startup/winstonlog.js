const winston=require('winston');
const config=require('config');
require('winston-mongodb');

const logger=winston.createLogger({
    level:'error',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename:'winstonError.log',level:'error'}),
        new winston.transports.MongoDB({db:config.get('applicationErrorLogDB')}),
    ],
});

module.exports=function()
{
    process.on('uncaughtException',(exception)=>{
        logger.log('error',`uncaughtException${exception.message,exception}`);
        process.exit(1);
    });
    process.on('unhandledRejection',(exception)=>{
        logger.log('error',`unhandledRejection ${exception.message,exception}`);
        process.exit(1);
});
}

module.exports.logger=logger;