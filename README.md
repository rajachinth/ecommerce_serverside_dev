## Online-Book-Shelf (NodeJS API)

This is an ecommerce application backend API build on `Node(12.13.1)` and `Express(4.17.1)`.  

▶ Deployed on `Heroku`, project is live on this [link](https://online-book-shelf.herokuapp.com/)

▶ Front-end application for this is deployed on `Heroku`, application is live on this [link](https://online-bookshelf.herokuapp.com/)    

▶ Souce code for `Angular front-end` application is available at [ecommerce_clientside_dev](https://github.com/rajachinth/ecommerce_clientside_dev)

## Modelling Relationships in MongoDB (Mongoose)

1. using References (Normalization)  
2. using Embedded documents (Denormalization)  
3. Hybrid  

   Database design depends on the project requirement specific, always should trade off between 
   query performance VS query consistency; based on this principle DB should be designed.  
   
   **1. In Relational DB we use references to store addtional properties in another document.**  
    courses:{  
        coursename:"course 1",  
        author:refID  
    }  
    authors:{  
        authorname:"john kewis"  
    }  
    
    **Advantage**: It's easy to change the author names in future, just to change at one place.  
     i.e., CONSISTENCY.  
    **Disadvantage**: It's become difficult to query, since additional query for author is required  
    i.e., PERFORMANCE issue  
    
    **2. In Embedded/Nested document approach we nest the data.**  
    courses:{  
        coursename:"course 1",  
        authors:{  
            authorname:"john kewis"  
        }  
    }  
    
    **Advantage:** takes less time to retrive data by query document and its fast  
    i.e., PERFORMANCE is good  
    **Disadvantage:** It's hard to change data, since should cahnage data at all places  
    i.e., CONSISTENCY issue   
    
    **3. Hybrid approach, only neccessary properties will be added to the nested document but not all.**  
    author:{  
        name:"XXX",  
        age:"XXX",  
        country:"XXX"  
        language:"XXX"  
    }  
    course:{  
        coursename:"XXX"  
        author:{  
            refID:"XXX"  
            name:"XXX"  
        }  
    }  
    we see like only "name" property added but not all.  
    
 ## MongoDB Schemas used in this API

<pre>
This is the main schema to render all ecommerce related data of the particular user, here used the Normalized approach, and later we use populate to get all the data.

ECOMMERCE USER SCHEMA

const ecommerceUserSchema=new mongoose.Schema({
    uniqueID:{type:String,required:true},
    userdetails:{type:mongoose.Schema.Types.ObjectId,ref:'UserData'},
    shoppingdetails:{type:mongoose.Schema.Types.ObjectId,ref:'ShoppingData'},
    shoppingsummary:{type:mongoose.Schema.Types.ObjectId,ref:'ShoppingSummaryData'},
    orderlist:[{ orderDetails:{type:mongoose.Schema.Types.ObjectId,ref:'orderListData'},
                shippingDetails:{type:mongoose.Schema.Types.ObjectId,ref:'orderShipmentData'}
              }]
});

USER ORDER LIST SCHEMA

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

USER ORDER SHIPPMENT SCHEMA

const orderShipmentSchema=new mongoose.Schema({
    userID:mongoose.Schema.Types.ObjectId,
    orderID:{type:String,required:true,max:50},
    name:{type:String,required:true,max:15,min:4},
    address:{type:String,required:true,max:50},
    pincode:{type:Number,required:true},
    mobile:{type:Number,required:true}
});

USER CART LIST SCHEMA

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

SHOPPING CATEGORY SCHEMA

const CategorySchema=new mongoose.Schema({
    schemaDefaultID:{type:String,required:true},
    categoryList:[{
        categoryID:{type:Number,required:true},
        id:{type:Number,required:true},
        language:{type:String,required:true}
    }]
});

SHOPPING PRODUCT SCHEMA

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
 
 USER SHOPPING SUMMARY SCHEMA
 
 const shoppingSummarySchema=new mongoose.Schema({
    userID:mongoose.Schema.Types.ObjectId,
    totalItemsCount:{type:Number,required:false},
    totalItemsCost:{type:Number,required:false}
});

USER DATA SCHEMA

const userSchema=new mongoose.Schema({
    username:{type:String,minlength:4,maxlength:15,required:true},
    mobile:{type:Number,maxlength:10,required:true},
    uniqueID:{type:String,minlength:6,maxlength:10},
    password:{type:String,minlength:4,maxlength:80},
    membership:{type:String},
    premiumcost:{type:Number,default: function(){ if(this.membership == 'Non-Prime') return 250;
                             else return 500; }},
    admin:{type:Boolean,required:true}
});
</pre>

**Transactions (two phase commit in MongoDB)**  

In sequel or other relational databse we use transactions which means a set of actions/operations thats executes 
all and update the datbase. If any action is failed it will not update document.  
**ex:** money transactions in netbanking etc.,  

IN mongoDB we use "two-phase commit", refer mongo and mongo-drive-nodejs documentation.  

Here we use can `FAWN` which is build-in node package to deal with transactions, the core logic behind `FAWN` is same traditional implementation of transaction code logic.  

**OBJECT ID**  

ObjectID consists of 24 charcter lenght of total size 12bytes (each two charcters in this ObjectID represents 2 bytes)  

first 4 bytes->timestamp  
second 3 bytes->machine identifier  
third 2 bytes->process identifier  
last 3bytes->counter  

->1byte=8 bits  
each byte stores 2^8=256  

Here counter increments for each data like in other sequel languages. SO, 3 bytes can store 2^24=16M.  
So it can store 16M objectID documents at same timestamp.  
So if we are under same machine and process and at same time stamp we can create 16M documents.  
If we exceed 16M at same timestamp then we can get duplicate ID which is highly impossible.  

Here, ID is created by mongo drivers but not MONGODB,that's why mongo is `HIGHLY SCALABILITY` (east to change the data or size).  

## Winston Logger

Used Winston to log errors in both FileSystem and MongoDB using different transports availble.  
Here, the errors are logged both into MongoDB and FileSystem.

## Config

Here to mange our application across different production we use a library `"CONFIG"`;
while we  create a root folder with name "config", we add multiple json files with
names, production.json,default.json, development.json etc.,  
This is called configuration of environments to use defined resources for operation.  

## Template Engine

Here template engine is used to render a response in html enhanced format, there are many for view engine, pug,EJS etc,we dont need to add this using require.just use in below format.  

## Unit and Integration Testing

**TDD(Test Driven Development)**  

Its also called "Test First" approach, where we build tests before the production code.  
we start with  
1.writing a failure test case  
2.write a simple code to pass the test(production code)  
3.try to refactor if neccessary  
 
Its vert promising approach by giving   
1.full coverage to the tests  
 2.testable source code  
 
**Code First**

In code first we write code first and then test.  
Since at times following TDD will end in complex and puts developement speed low.  

In this session we write TDD approach for one scenario like taking customer ID and movie ID from the API 
and responsing to that and return the valid booking details for that correct customer ID and movie ID.  

**write the failing & healthy test cases:**  
1. return client side error 401 if not logged-in  
2. return client side error 400 if customer ID is not provided  
3. return client side error 400 if movie ID is not provided  
4. return client side error 404 if no customer/movie ID is there in database  
5. return success code 200 if all is good  
  
Along with this we need to perform certain actions includes.,(optional for this example)  
->set return data  
->calculate the amount for movie  
->increase/decrease the total movie tickets available  
->return the ticket summary to the client  

Writing Automated Test Cases involves additional time-frame and development cost.  
In few projects, there exist a dedicated testing team who are responsible for testing,
but in some projects there exist only development team who ae responsible for both.  

->It again depends on the time-frame and capital invested by client to make a real world 
application with better solution. If you fall under this, there exist no point to develop
automated test cases for half of the project time-frame; it's meaningless.  

->In few project requirements changes so often, and here writing automated test-cases would be 
other pay-load for development to maintain both production code and test code. In this aspect,
its better to write automated test cases for a few which takes huge time for manual testing.  

->It again depends on the project requirements, time-frame, capital to decide whether to write 
100% code coverage automated test cases for production code or **not**.

`Jest Frame-Work`  be used as they are mostly similar in code signature with `Jasmine`.**(my personal choice)**  

