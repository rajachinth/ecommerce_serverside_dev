const {CategoryModel}=require('../models/shoppingcategory');
const express=require('express');
const router=express.Router();

router.get('/',(request,response)=>{
    CategoryModel.findOne({schemaDefaultID:'schema0X1'},(error,querydata)=>{
        if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
        if(!querydata)
        {
            let DBdata=addCategory();
            return response.status(200).send(DBdata);
        }
        response.status(200).send(querydata);
    });
});

async function addCategory()
{
    let category=new CategoryModel({
        schemaDefaultID:'schema0X1',
        categoryList:[
            {id:1,categoryID:1,language:'English'},
            {id:2,categoryID:2,language:'Hindi'},
            {id:2,categoryID:3,language:'Malyalam'},
            {id:4,categoryID:4,language:'Tamil'},
            {id:5,categoryID:5,language:'Telugu'},
        ]
    });
    let DBdata=await category.save();
    return DBdata;
}

module.exports=router;