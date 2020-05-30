const config=require('config');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const Joi=require('@hapi/joi');

const userSchema=new mongoose.Schema({
    username:{type:String,minlength:4,maxlength:15,required:true},
    mobile:{type:Number,maxlength:10,required:true},
    uniqueID:{type:String,minlength:6,maxlength:10},
    password:{type:String,minlength:4,maxlength:80},
    membership:{type:String},
    premiumcost:{type:Number,default: function(){ if(this.membership == 'Non-Prime') return 250;
                             else return 500; }},
    admin:{type:Boolean,required:true}
});
userSchema.methods.returnToken=function()
{
    let payload={username:this.username,mobile:this.mobile,uniqueID:this.uniqueID,
                 membership:this.membership,premiumcost:this.premiumcost};
    let token=jwt.sign(payload,config.get('secretKey'));
    return token;
}
const userModel=mongoose.model('UserData',userSchema);

function userSchemaValidation(userSignupData)
{
    const userSchema=Joi.object({
        username:Joi.string().required().min(4).max(15),
        mobile:Joi.number().required().max(9999999999),
        uniqueID:Joi.string().required().min(6).max(10),
        password:Joi.string().required().min(4).max(10),
        membership:Joi.string().required(),
    });
    const validate=userSchema.validate(userSignupData);
    return validate;
}

function uniqueIDCheck(userSignupData)
{
    const userSchema=Joi.object({
        uniqueID:Joi.string().required().min(6).max(10),
    });
    const validate=userSchema.validate(userSignupData);
    return validate;
}

module.exports.userModel=userModel;
module.exports.userSchemaValidation=userSchemaValidation;
module.exports.uniqueIDCheck=uniqueIDCheck;