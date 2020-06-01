const config=require('config');
const debug=require('debug')('consoleLogDebug');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const pug=require('pug');

module.exports=function nodeConfig(app)
{
    if(!config.get('secretKey')) { process.exit(1); }
    const PORT=process.env.PORT || 4000;
    const HOST=process.env.HOST || 4000;
    debug(`port ${HOST} is logged`);
    const ENV=process.env.NODE_ENV || 'production';
    debug(`environment set to ${config.util.getEnv('NODE_ENV')}`);
    debug(`${config.get('name')} is active`);
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.set('view engine',pug);
    app.set('views','./template_engine');
}
