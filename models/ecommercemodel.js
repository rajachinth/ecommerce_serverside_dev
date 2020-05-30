const mongoose=require('mongoose');
const Joi=require('@hapi/joi');

const ecommerceUserSchema=new mongoose.Schema({
    uniqueID:{type:String,required:true},
    userdetails:{type:mongoose.Schema.Types.ObjectId,ref:'UserData'},
    shoppingdetails:{type:mongoose.Schema.Types.ObjectId,ref:'ShoppingData'},
    shoppingsummary:{type:mongoose.Schema.Types.ObjectId,ref:'ShoppingSummaryData'},
    orderlist:[{ orderDetails:{type:mongoose.Schema.Types.ObjectId,ref:'orderListData'},
                shippingDetails:{type:mongoose.Schema.Types.ObjectId,ref:'orderShipmentData'}
              }]
});
function idValidation(data)
{
    const idValidationSchema=Joi.object({ uniqueID:Joi.string().required().min(4) });
    let validate=idValidationSchema.validate(data);
    return validate;
}

const ecommerceUserModel=mongoose.model('ecommerceUserData',ecommerceUserSchema);

module.exports.ecommerceUserModel=ecommerceUserModel;   
module.exports.idValidation=idValidation;