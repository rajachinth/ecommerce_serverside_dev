const config=require('config');
const jwt=require('jsonwebtoken');

module.exports = function authorization(request,response,next)
{
    let adminToken=request.header('adminToken');
    if(!adminToken) return response.status(400).send('not authorized');
    try 
    {
        const decodeData=jwt.verify(adminToken,config.get('secretKey'));
        if(decodeData.admin == true) next();
        throw new Error('not an admin to authorize');
    }
    catch(exception)
    {
        response.status(403).send('Forbidden:invalid authorization token');
    }
}
