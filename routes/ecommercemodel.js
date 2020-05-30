const {ecommerceUserModel,idValidation}=require('../models/ecommercemodel');
const {userModel}=require('../models/usermodel');
const {shoppingCartModel}=require('../models/shoppingcartmodel');
const {shoppingSummaryModel}=require('../models/shoppingsummary');
const {orderListModel}=require('../models/orderlistmodel');
const {orderShipmentModel}=require('../models/ordershipmentmodel');
const express=require("express");
const router=express.Router();

router.post('/userData/populate',async(request,response)=>{
    let {error}=idValidation(request.body);
    if(error) return response.status(400).send("Bad Request: uniqueID is required");
    await ecommerceUserModel.findOne({uniqueID:request.body.uniqueID},
        async(error,queryData)=>{
            if(error) return response.status(422).send('UnProcessable error:please retry to submit');
            const userdetailsID=await userModel.findOne({uniqueID:request.body.uniqueID},'_id');
            if(!userdetailsID) return response.status(404).send("uniqueID doesnt exist in DB");
            const shoppingdetailsID=await shoppingCartModel.findOne({userID:userdetailsID._id},'_id');
            const shoppingsummaryID=await shoppingSummaryModel.findOne({userID:userdetailsID._id},'_id');
            const orderdetailsID=await orderListModel.find({userID:userdetailsID._id},'_id shippingDetails');

            if(!queryData)
            {
                const ecommercemodel=new ecommerceUserModel({
                    uniqueID:request.body.uniqueID,
                    userdetails:userdetailsID._id,
                    shoppingdetails:(shoppingdetailsID) ? shoppingdetailsID._id : null,
                    shoppingsummary:(shoppingsummaryID) ? shoppingsummaryID._id : null,
                    orderlist:[].concat(arrayElementPush(orderdetailsID)),
                });
            const DB_Reference=await ecommercemodel.save();
            const DB_Populate=await ecommerceUserModel.findOne({uniqueID:request.body.uniqueID})
                                                 .populate('userdetails')
                                                 .populate('shoppingdetails')
                                                 .populate('shoppingsummary')
                                                 .populate('orderlist.orderDetails')
                                                 .populate('orderlist.shippingDetails');
            return response.status(200).send({DB_Reference,DB_Populate});
            }
            const DB_Reference=await queryData.replaceOne(
                {   uniqueID:request.body.uniqueID,
                    userdetails:userdetailsID._id,
                    shoppingdetails:(shoppingdetailsID) ? shoppingdetailsID._id : null,
                    shoppingsummary:(shoppingsummaryID) ? shoppingsummaryID._id : null,
                    orderlist:[].concat(arrayElementPush(orderdetailsID)),
                }
            );
            const DB_Populate=await ecommerceUserModel.findOne({uniqueID:request.body.uniqueID})
                                                 .populate('userdetails')
                                                 .populate('shoppingdetails')
                                                 .populate('shoppingsummary')
                                                 .populate('orderlist.orderDetails')
                                                 .populate('orderlist.shippingDetails');
                                           
            response.status(200).send({queryData,DB_Populate});
        });
});

function arrayElementPush(orderdetailsID)
{
    let totalLength=orderdetailsID.length;
    let newArrayData=[];
    console.log(orderdetailsID);
    if(totalLength == 0) 
    {
        let obj=[{orderDetails:null,shippingDetails:null}];
        return obj;
    }
    for(let i=0;i<totalLength;i++)
    {
        newArrayData[i]={orderDetails:orderdetailsID[i]._id,shippingDetails:orderdetailsID[i].shippingDetails};
    }
    return newArrayData;
}

module.exports=router;
