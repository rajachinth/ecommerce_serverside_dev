const winston=require('winston');
require('winston-mongodb');
const {logger}=require('../startup/winstonlog')

module.exports=function(err,req,res,next)
{
    logger.log('error',err.message);
    res.status(500).send('unknown internal server issue');
}

module.exports.logger=logger;