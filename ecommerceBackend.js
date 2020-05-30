const config=require('config');
const debug=require('debug')('consoleLogDebug');
const express=require('express');

const cors=require('cors');
let corsConfig={
    origin:"*", //access-control-allow-origin
    exposedHeaders:'AuthToken', //access-control-expose-headers
    allowedHeaders:'*' //access-control-allow-headers
}

const app=express();
app.use(cors(corsConfig));
require('./startup/nodeconfig')(app);
require('./startup/winstonlog')();
require('./startup/mongodb')();
require('./startup/routes')(app);
app.listen(config.util.getEnv('HOST'),()=>{
    debug(`port is listening on ${config.util.getEnv('HOST')}...`);})


