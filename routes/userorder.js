const {orderListModel,orderListModelValidation,idValidation}=require('../models/orderlistmodel');
const {orderShipmentModel,orderShipmentSchemaValidation}=require('../models/ordershipmentmodel');
const express=require('express');
const router=express.Router()

router.post('/addOrder',async(request,response)=>{
    let orderList=orderListModelValidation({productDetails:request.body.productDetails});
    if(orderList.error) 
        return response.status(400).send(orderList.error.details[0]);
    let orderShipment=orderShipmentSchemaValidation({shipmentDetails:request.body.shipmentDetails});
    if(orderShipment.error) 
        return response.status(400).send(orderShipment.error.details[0]);
    let accountDetails=idValidation({userID:request.body.userID,orderID:request.body.orderID});
    if(accountDetails.error ) 
        return response.status(400).send(accountDetails.error.details[0]);
    await orderListModel.findOne({userID:request.body.userID,orderID:request.body.orderID},
        async(error,queryData)=>{
            if(error){return response.status(422).send("Unpprocessable Request:something wrong happened");};
            if(!queryData)
            {
                let orderShipmentData=new orderShipmentModel({
                    userID:request.body.userID,
                    orderID:request.body.orderID, 
                    name:request.body.shipmentDetails.name,
                    address:request.body.shipmentDetails.address,
                    pincode:request.body.shipmentDetails.pincode,
                    mobile:request.body.shipmentDetails.mobile
                });
                let ID=orderShipmentData._id;
                let DBdataTwo=await orderShipmentData.save()
                    .catch(error=>{return response.status(422).send("Unpprocessable Request:something wrong happened");});
                
                let orderData=new orderListModel({
                        userID:request.body.userID,
                        orderID:request.body.orderID,
                        orderDate:new Date(),
                        productDetails:[].concat(request.body.productDetails),
                        productSummary:{
                            totalItemCount:request.body.orderSummary.totalItemCount,
                            totalItemCost:request.body.orderSummary.totalItemCost
                        },
                        shippingDetails:ID
                });
                let DBdataOne=await orderData.save()
                    .catch(error=>{return response.status(422).send("Unpprocessable Request:something wrong happened");});
                return response.status(200).send({DBdataOne,DBdataTwo});
            }
            response.status(400).send('orderId already exist in DB for this user');
            });
});

router.post('/deleteOrder',async(request,response)=>{
    let {error}=idValidation(request.body);
    if(error) return response.status(400).send(error.details[0]);
    await orderListModel.findOne({userID:request.body.userID,orderID:request.body.orderID},
        async(error,queryData)=>{
            if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
            if(!queryData) return response.status(404).send("Not Found Error:orderID not found in DB");
            await queryData.remove()
                .catch(error=>{return response.status(422).send("Unpprocessable Request:something wrong happened");});
            await orderShipmentModel.findOne({userID:request.body.userID,orderID:request.body.orderID},
                async(error,queryData)=>{
                    if(error) return response.status(422).send("Unpprocessable Request:something wrong happened");
                    if(!queryData) return response.status(404).send("Not Found Error:ordershipment not found for this order");
                    let resultData=await queryData.remove()
                        .catch(error=>{return response.status(422).send("Unpprocessable Request:something wrong happened");});
                    response.status(200).send(resultData);
                });              
        });
});

module.exports=router;