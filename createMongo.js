require('dotenv').config();
const JR_MongoPassword=process.env.JR_MongoPassword;

function main()
{
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://jrubin10:"+JR_MongoPassword+"@cluster0.gk3ubkn.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
  });
}

main();
