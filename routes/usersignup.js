const bcrypt=require('bcrypt')
const {userSchemaValidation,userModel,uniqueIDCheck}=require('../models/usermodel');
const express=require('express');
const router=express.Router();
require('mongoose');
require('winston-mongodb');
require('winston');
const {logger}=require('../startup/winstonlog')

router.post('/',async(request,response)=>{
   let {error}=userSchemaValidation(request.body);
   if(error) return response.status(400).send(error.details[0]);
   let queryData=await userModel.findOne({uniqueID:request.body.uniqueID});
   if(queryData) return response.status(409).send('409:conflict:duplicate uniqueID found');
   let userSignupModel=new userModel({
        username:request.body.username,
        mobile:request.body.mobile,
        uniqueID:request.body.uniqueID,
        password:request.body.password,
        membership:request.body.membership,
        admin:false
     });
    let saltRounds=10;
    userSignupModel.password=await bcrypt.hash(userSignupModel.password,saltRounds);
    let userSignupData;
    try{ userSignupData=await userSignupModel.save();}
    catch(errorData){logger.log('error',errorData);}
    let userSignUpToken=userSignupModel.returnToken();
    console.log(userSignupData);
    //response.header('userSignupToken',userSignUpToken).status(200).send(userSignupData);
    response.status(200).send(userSignUpToken);
});

router.post('/uniquecheck',async(request,response)=>{
    let {error}=uniqueIDCheck(request.body);
    if(error) return response.status(400).send(error.details[0]);
    let queryData=await userModel.findOne({uniqueID:request.body.uniqueID});
    if(queryData) return response.status(409).send('409:conflict:duplicate uniqueID found');
    else response.status(200).send('200:SUCCESS:no dupliates for uniqueID');
});

module.exports=router;