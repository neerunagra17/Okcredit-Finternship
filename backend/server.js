require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

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

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Generate S3 Pre-signed URL for direct frontend upload
app.get('/api/upload-url', async (req, res) => {
  try {
    const fileName = req.query.fileName;
    const fileType = req.query.fileType;
    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType query params are required" });
    }

    const key = `products/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.IMAGE_BUCKET_NAME,
      Key: key,
      ContentType: fileType
    });

    // URL expires in 60 seconds
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const publicUrl = `https://${process.env.IMAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("Error generating presigned URL", err);
    res.status(500).json({ error: "Could not generate upload URL" });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

module.exports.handler = serverless(app);
