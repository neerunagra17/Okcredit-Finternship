require('dotenv').config();
const { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, PutPublicAccessBlockCommand, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { Upload } = require("@aws-sdk/lib-storage");

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = `voltcommerce-app-${Date.now()}`;
const DIST_DIR = path.join(__dirname, '../frontend/dist');

async function uploadDir(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const key = prefix ? `${prefix}/${file}` : file;
    
    if (fs.statSync(filePath).isDirectory()) {
      await uploadDir(filePath, key);
    } else {
      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      console.log(`Uploading ${key}...`);
      
      const upload = new Upload({
        client,
        params: {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: fs.createReadStream(filePath),
          ContentType: contentType
        }
      });
      await upload.done();
    }
  }
}

async function setupS3Frontend() {
  try {
    console.log(`Creating S3 Bucket for Frontend: ${BUCKET_NAME}`);
    await client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    
    console.log("Removing public access blocks...");
    await client.send(new PutPublicAccessBlockCommand({
      Bucket: BUCKET_NAME,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Setting bucket policy for public read...");
    const policy = {
      Version: "2012-10-17",
      Statement: [{
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
      }]
    };
    await client.send(new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(policy)
    }));

    console.log("Configuring Static Website Hosting...");
    await client.send(new PutBucketWebsiteCommand({
      Bucket: BUCKET_NAME,
      WebsiteConfiguration: {
        IndexDocument: { Suffix: "index.html" },
        ErrorDocument: { Key: "index.html" } // for SPA routing
      }
    }));

    console.log("Uploading dist folder to S3...");
    await uploadDir(DIST_DIR);

    console.log("\n==============================================");
    console.log("SUCCESS! Your VoltCommerce app is live at:");
    console.log(`http://${BUCKET_NAME}.s3-website-${process.env.AWS_REGION}.amazonaws.com`);
    console.log("==============================================\n");
    
  } catch (error) {
    console.error("Error setting up S3:", error);
  }
}

setupS3Frontend();
