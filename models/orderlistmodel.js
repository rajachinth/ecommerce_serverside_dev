const Joi=require('@hapi/joi');
const mongoose=require('mongoose');

const orderListSchema=new mongoose.Schema({
        userID:mongoose.Schema.Types.ObjectId,
        orderID:{type:String,required:true},
        orderDate:{type:Date},
        productDetails:[{
            productID:{type:String,required:true,max:6},
            title:{type:String,required:true},
            price:{type:Number,required:true},
            itemCount:{type:Number,required:false},
            imageURL:{type:String,require:false}
        }],
        productSummary:{
            totalItemCount:{type:Number,require:true},
            totalItemCost:{type:Number,require:true}
        },
        shippingDetails:mongoose.Schema.Types.ObjectId
});
const orderListModel=mongoose.model('orderListData',orderListSchema);

function orderListModelValidation(orderListData)
{
    const orderListSchema=Joi.object({
            productDetails:Joi.array().items(
                {   productID:Joi.string().required().max(6),
                    title:Joi.string().required(),
                    price:Joi.number().required(),
                    itemCount:Joi.number(),
                    imageURL:Joi.string(),
                })
    });
    let validate=orderListSchema.validate(orderListData);
    return validate;
}
function idValidation(data)
{
    const idValidationSchema=Joi.object({
        userID:Joi.any().required(),
        orderID:Joi.string().required(),    
    });
    let validate=idValidationSchema.validate(data);
    return validate;
}

module.exports.orderListModel=orderListModel;
module.exports.orderListModelValidation=orderListModelValidation;
module.exports.idValidation=idValidation;