const config=require('config');
const jwt=require('jsonwebtoken');

module.exports = function authentication(request,response,next)
{
    let authToken=request.header('authToken');
    if(!authToken) return response.status(400).send('not authenticated');
    try 
    {
        jwt.verify(authToken,config.get('secretKey'));
        next();
    }
    catch(exception)
    {
        response.status(401).send('unauthorized:invalid authentication token');
    }
}
