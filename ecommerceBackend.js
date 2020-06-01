const config=require('config');
const debug=require('debug')('consoleLogDebug');
const express=require('express');
const helmet=require('helmet');
const compression=require('compression');

const cors=require('cors');
let corsConfig={
    origin:"*", //access-control-allow-origin
    exposedHeaders:'AuthToken', //access-control-expose-headers
    allowedHeaders:'*' //access-control-allow-headers
}

const app=express();
app.use(helmet()); //use in production
app.use(compression()); //use in production
app.use(cors(corsConfig));
require('./startup/nodeconfig')(app);
require('./startup/winstonlog')();
require('./startup/mongodb')();
require('./startup/routes')(app);
app.listen(process.env.PORT,()=>{
    debug(`port is listening on ${config.util.getEnv('HOST')}...`);})


