const mongoose=require('mongoose');
const Joi=require('@hapi/joi');

const CategorySchema=new mongoose.Schema({
    schemaDefaultID:{type:String,required:true},
    categoryList:[{
        categoryID:{type:Number,required:true},
        id:{type:Number,required:true},
        language:{type:String,required:true}
    }]
});
const CategoryModel=mongoose.model('CategoryData',CategorySchema);

function CategorySchemaValiation(CategoryData)
{
    const CategorySchema=Joi.object({
        categoryList:Joi.array().items({
            categoryID:Joi.number().required(),
            id:Joi.number().required(),
            language:Joi.string().required()
        })
    });
    const validate=CategorySchema.validate(CategoryData);
    return validate;
}

module.exports.CategoryModel=CategoryModel;
module.exports.CategorySchemaValiation=CategorySchemaValiation;