const Joi=require('@hapi/joi');
const mongoose=require('mongoose');

const shoppingCartSchema=new mongoose.Schema({
        userID:mongoose.Schema.Types.ObjectId,
        productDetails:[{
            productID:{type:String,required:true,max:5},
            title:{type:String,required:true},
            price:{type:Number,required:true},
            imageURL:{type:String,required:true},
            itemCount:{type:Number,required:false}
        }]
});
const shoppingCartModel=mongoose.model('ShoppingData',shoppingCartSchema);

function shoppingCartSchemaValidation(userShoppingData)
{
    const shoppingCartSchema=Joi.object({
            userID:Joi.any().required(),
            productID:Joi.string().required().max(50),
            imageURL:Joi.string().required(),
            title:Joi.string().required(),
            price:Joi.number().required()
    });
    let validate=shoppingCartSchema.validate(userShoppingData);
    return validate;
}
function idValidation(data)
{
    const idValidationSchema=Joi.object({
        userID:Joi.any().required(),
        productID:Joi.string().max(50).required(),
    });
    let validate=idValidationSchema.validate(data);
    return validate;
}

module.exports.shoppingCartModel=shoppingCartModel;
module.exports.shoppingCartSchemaValidation=shoppingCartSchemaValidation;
module.exports.idValidation=idValidation;