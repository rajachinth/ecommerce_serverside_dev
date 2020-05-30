const Joi=require('@hapi/joi');
const mongoose=require('mongoose');

const orderShipmentSchema=new mongoose.Schema({
        userID:mongoose.Schema.Types.ObjectId,
        orderID:{type:String,required:true,max:50},
        name:{type:String,required:true,max:15,min:4},
        address:{type:String,required:true,max:50},
        pincode:{type:Number,required:true},
        mobile:{type:Number,required:true}
});

const orderShipmentModel=mongoose.model('orderShipmentData',orderShipmentSchema);

function orderShipmentSchemaValidation(userOrderShipmentData)
{
    const orderShipmentCartSchema=Joi.object({
        shipmentDetails:{
                name:Joi.string().required().max(15).min(4),
                address:Joi.string().required().max(50),
                pincode:Joi.number().required().max(999999),
                mobile:Joi.number().required().max(9999999999)
        }});
    let validate=orderShipmentCartSchema.validate(userOrderShipmentData);
    return validate;
}
module.exports.orderShipmentModel=orderShipmentModel;
module.exports.orderShipmentSchemaValidation=orderShipmentSchemaValidation;