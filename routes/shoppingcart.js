const {shoppingCartSchemaValidation,idValidation,shoppingCartModel}=require('../models/shoppingcartmodel');
const {shoppingSummarySchemaValidation,shoppingSummaryModel}=require('../models/shoppingsummary');
const express=require('express');
const router=express.Router()

router.post('/addItem',async(request,response)=>{
    let {error}=shoppingCartSchemaValidation(request.body);
    if(error) return response.status(400).send(error.details[0]);
    await shoppingCartModel.findOne({userID:request.body.userID},
        async(error,queryData)=>{
            if(error){return response.status(422).send("Unpprocessable Request:something wrong happened");};
            if(!queryData)
            {
                let shoppingData=new shoppingCartModel({
                        userID:request.body.userID,
                        productDetails:[].concat([{
                            productID:request.body.productID,
                            title:request.body.title,
                            price:request.body.price,
                            imageURL:request.body.imageURL,
                            itemCount:1
                        }])
                });
                let DBdata=await shoppingData.save();
                return response.status(200).send(DBdata);
            }
            let optimisticCount=0;
            let shoppingCount=queryData.productDetails;
            let shoppingCountFilter=shoppingCount.map(element=>{
                if(element.productID == request.body.productID)
                {
                    optimisticCount=1;
                    return  {   productID:request.body.productID,
                                title:request.body.title,
                                price:request.body.price,
                                imageURL:request.body.imageURL,
                                itemCount:element.itemCount+1,
                            }
                }
                return element;
                });
            if(optimisticCount == 0)
            {
                shoppingCountFilter=shoppingCountFilter.concat({
                    productID:request.body.productID,
                    title:request.body.title,
                    price:request.body.price,
                    imageURL:request.body.imageURL,
                    itemCount:1
                });
            }
            queryData.productDetails=shoppingCountFilter;
            let DBdata=await queryData.save();
            response.status(200).send(DBdata);
        });
}); 

router.post('/deleteItem',async(request,response)=>{
    let {error}=idValidation(request.body);
    if(error) return response.status(400).send(`Bad Request:invalid data:${error.details[0]}`);
    await shoppingCartModel.findOne({userID:request.body.userID},
        async(error,queryData)=>{
            if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
            if(!queryData) return response.status(404).send("Not Found Error:product not found in DB");
            let shoppingCount=queryData.productDetails;
            let shoppingCountFilter=shoppingCount.map((element)=>{
                if(element.productID == request.body.productID && element.itemCount > 0)
                {
                    return  {       productID:request.body.productID,
                                    title:element.title,
                                    price:element.price,
                                    imageURL:request.body.imageURL,
                                    itemCount:element.itemCount-1,
                            }
                }
                return element;
            });
            const filterArray=shoppingCountFilter.filter((element)=>element.itemCount > 0);
            queryData.productDetails=filterArray;
            let DBdata=await queryData.save();
            response.status(200).send(DBdata);
        });
});

router.post('/summary',async(request,response)=>{
    let {error}=shoppingSummarySchemaValidation(request.body);
    if(error) return response.status(400).send(error.details[0]);
    await shoppingCartModel.findOne({userID:request.body.userID},
        async(error,queryData)=>{
            if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
            if(!queryData) return response.status(404).send("Not Found Error:no products in DB");
            let cartSummary=getCartSummary(queryData.productDetails);
            let shoppingSummary=await shoppingSummaryModel.findOne({userID:request.body.userID});
            if(!shoppingSummary)
            {
                let summaryModel=new shoppingSummaryModel({
                    userID:request.body.userID,
                    totalItemsCount:cartSummary.itemCount,
                    totalItemsCost:cartSummary.itemCost
                });
                let DBdata=await summaryModel.save();
                return response.status(200).send(DBdata);
            }
            shoppingSummary.totalItemsCount=cartSummary.itemCount;
            shoppingSummary.totalItemsCost=cartSummary.itemCost;
            let DBdata=await shoppingSummary.save();
            response.status(200).send(DBdata);
        });
}); 

router.post('/clearCart',async(request,response)=>{
    let {error}=shoppingSummarySchemaValidation(request.body);
    if(error) return response.status(400).send(`Bad Request:invalid data:${error.details[0]}`);
    let queryData=await shoppingCartModel.findOne({userID:request.body.userID});
    if(!queryData) return response.status(404).send("Not Found Error:no ShoppingCart in DB");
    let resultData=await queryData.remove();
    response.status(200).send(resultData);
});

function getCartSummary(queryData)
{
    let count=0;
    let cost=0;
    let totalCartItem=queryData;
    totalCartItem.forEach(function(elementItem)
        {   
            count=count+elementItem.itemCount; 
            totalCartItem.find((element)=>{
                if(element.productID == elementItem.productID) 
                    cost=cost+(element.price*element.itemCount);
        });
    })
    return {itemCount:count,itemCost:cost}
}

module.exports=router;