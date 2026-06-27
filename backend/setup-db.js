require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function createTable() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }  // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" } // S = String
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 1, 
      WriteCapacityUnits: 1
    }
  };

  try {
    console.log("Creating DynamoDB table...");
    const data = await client.send(new CreateTableCommand(params));
    console.log("Table Created Successfully!", data.TableDescription.TableArn);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log("Table already exists!");
    } else {
      console.error("Error creating table:", err);
    }
  }
}

createTable();
