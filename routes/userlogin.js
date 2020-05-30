const config=require('config');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {userModel}=require('../models/usermodel')
const mongoose=require('mongoose');
const Joi=require('@hapi/joi');
const express=require('express');
const router=express.Router();

router.post('/',async(request,response)=>{
    let {error}=validateResponseData(request.body);
    console.log(request.body);
    if(error) return response.status(400).send(error.details[0]);
    let queryResult=await userModel.findOne({uniqueID:request.body.uniqueID});
    if(!queryResult) return response.status(400).send('invalid uniqueID or password');
    let checkPassword=await bcrypt.compare(request.body.password,queryResult.password);
    if(!checkPassword) return response.status(400).send('invalid uniqueID or password');
    let payload={name:queryResult.username,subscription:queryResult.membership,admin:queryResult.admin,
        loggedin:true,admin:queryResult.admin,uniqueID:queryResult._id,userID:queryResult.uniqueID};
    let loginToken=jwt.sign(payload,config.get('secretKey'));
    let bcryptPayload=queryResult.uniqueID;
    await bcrypt.hash(bcryptPayload,10,(error,bcryptData)=>{
        if(error) return response.status(422).send('unprocessable error:try again');
        let tokenObj={securedID:bcryptData};
        let authToken=jwt.sign(tokenObj,config.get('secretKey'));
        response.header('AuthToken',authToken).status(200).send(loginToken)
    });   
});

function validateResponseData(responseData)
{
    let userLoginSchema=Joi.object({
        uniqueID:Joi.string().required().min(5).max(15),
        password:Joi.string().required().min(4).max(10),
    });
    let validate=userLoginSchema.validate(responseData)
    return validate;
}

module.exports=router;      