const {productModel,productSchemaValidation,idValidation}=require('../models/shoppingproduct');
const express=require('express');
const router=express.Router();

router.post('/addProduct',async(request,response)=>{
    let {error}=productSchemaValidation(request.body);
    if(error) return response.status(400).send(error.details[0]);
    let duplicateproductID=await productModel.findOne({'productList.productID':request.body.productID});
    if(duplicateproductID) return response.status(400).send("productID already exist in DB");
    await productModel.findOne({schemaDefaultID:'schema0X1'},
    async(error,queryData)=>{
        if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
        const productObj=[{
            productID:request.body.productID,
            title:request.body.title,
            author:request.body.author,
            price:request.body.price,
            category:request.body.category,
            imageURL:request.body.imageURL
        }];
        if(!queryData)
        {
            let productmodel=new productModel({
                schemaDefaultID:'schema0X1',
                productList:[].concat(productObj)
            });
            let DBdata=await productmodel.save()
            return response.status(200).send(DBdata);
        }
        queryData.productList=queryData.productList.concat(productObj);
        let DBdata=await queryData.save();
        response.status(200).send(DBdata);
    });
});
router.post('/deleteProduct',async(request,response)=>{
    let {error}=idValidation(request.body);
    if(error) return response.status(400).send(error.details[0]);
    await productModel.findOne({"productList.productID":request.body.productID},
    async(error,queryData)=>{
        if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
        if(!queryData) return response.status(404).send('productID not found error');
        let filterArray=queryData.productList;
        queryData.productList=filterArray.filter((element)=>element.productID != request.body.productID);
        const DBdata=await queryData.save();
        response.status(200).send(DBdata);
    });
});
router.post('/updateProduct',async(request,response)=>{
    let {error}=productSchemaValidation(request.body);
    if(error) return response.status(400).send(error.details[0]);
    await productModel.findOne({'productList.productID':request.body.productID},
    async(error,queryData)=>{
        if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
        if(!queryData) return response.status(404).send("productID doesnt exist in DB");
        let duplicateArray=queryData.productList.map(element=>{
            if(element.productID == request.body.productID)
            {
                return  {   productID:request.body.productID,
                            title:request.body.title,
                            author:request.body.author,
                            price:request.body.price,
                            category:request.body.category,
                            imageURL:request.body.imageURL
                        }
            }
                return element;
        });
        queryData.productList=duplicateArray;
        let DBdata=await queryData.save();
        response.status(200).send(DBdata);
    });
});
router.get('/getProducts',async(request,response)=>{
    await productModel.findOne({schemaDefaultID:'schema0X1'},
    async(error,queryData)=>{
        if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
        if(!queryData) return response.status(404).send("data not found error");
        response.status(200).send(queryData);
    });
});
module.exports=router;