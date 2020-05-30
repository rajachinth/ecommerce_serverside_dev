const Joi=require('@hapi/joi');
const mongoose=require('mongoose');

const shoppingSummarySchema=new mongoose.Schema({
    userID:mongoose.Schema.Types.ObjectId,
    totalItemsCount:{type:Number,required:false},
    totalItemsCost:{type:Number,required:false}
});

const shoppingSummaryModel=mongoose.model('ShoppingSummaryData',shoppingSummarySchema);

function shoppingSummarySchemaValidation(Data)
{
    const shoppingSummarySchema=Joi.object({
        userID:Joi.any().required()
    });
    let validate=shoppingSummarySchema.validate(Data);
    return validate;
}
module.exports.shoppingSummaryModel=shoppingSummaryModel;
module.exports.shoppingSummarySchemaValidation=shoppingSummarySchemaValidation;