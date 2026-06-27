require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_PRODUCTS;

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(data.Items);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ error: "Could not fetch products" });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    if (!product.id) {
      product.id = Date.now().toString(); // Fallback if no ID provided
    }
    
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: product
    }));
    
    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product", err);
    res.status(500).json({ error: "Could not add product" });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error deleting product", err);
    res.status(500).json({ error: "Could not delete product" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
