const mongoose=require('mongoose');
const Joi=require('@hapi/joi');

const productSchema=new mongoose.Schema({
   schemaDefaultID:{type:String,required:true},
   productList:[{
    productID:{type:String,required:true,minlength:4},
    title:{type:String,required:true},
    author:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:Number,required:true},
    imageURL:{type:String,required:true}
   }]
});
const productModel=mongoose.model('productData',productSchema);

function productSchemaValidation(productData)
{
    const productSchema=Joi.object({
        productID:Joi.string().required().min(4),
        title:Joi.string().required(),
        author:Joi.string().required(),
        price:Joi.number().required(),
        category:Joi.number().required(),
        imageURL:Joi.string().required()
    });
    const validate=productSchema.validate(productData);
    return validate;
}
function idValidation(data)
{
    const idValidationSchema=Joi.object({
        productID:Joi.string().required(),
    });
    let validate=idValidationSchema.validate(data);
    return validate;
}

module.exports.productModel=productModel;
module.exports.productSchemaValidation=productSchemaValidation;
module.exports.idValidation=idValidation;