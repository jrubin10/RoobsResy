require('dotenv').config();
const JR_MongoPassword=process.env.JR_MongoPassword;
const mongoose=require("mongoose");

async function connectToMongoDB()
{
  const uri = "mongodb+srv://jrubin10:"+JR_MongoPassword+"@cluster0.gk3ubkn.mongodb.net/?retryWrites=true&w=majority";
  await mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true});
  console.log ("connected to MongoDB");
  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  // client.connect(err => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  };

module.exports={connectToMongoDB};
