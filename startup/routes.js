const userLogin=require('../routes/userlogin');
const userSignup=require('../routes/usersignup');
const addItem=require('../routes/shoppingcart');
const addOrder=require('../routes/userorder');
const ecommerceData=require('../routes/ecommercemodel');
const errorHandler=require('../middleware/unhandlederror');
const shoppingProduct=require('../routes/shoppingproduct');
const shoppingCategory=require('../routes/shoppingcategory');

module.exports=function(app)
{   
    app.use('/authentication/login',userLogin);
    app.use('/authentication/signup',userSignup);
    app.use('/shoppingCart',addItem);
    app.use('/order',addOrder);
    app.use('/ecommerce',ecommerceData);
    app.use('/shopping',shoppingProduct);
    app.use('/shoppingcategory',shoppingCategory);
    app.use(errorHandler);
}
