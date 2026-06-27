require('dotenv').config();
const { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutPublicAccessBlockCommand, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = `voltcommerce-images-${Date.now()}`;

async function setupS3() {
  try {
    console.log(`Creating S3 Bucket: ${BUCKET_NAME}`);
    await client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    
    // Disable Block Public Access
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

    // Wait a couple seconds to ensure public access block is removed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add public read policy
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

    // Add CORS configuration
    console.log("Setting CORS configuration...");
    await client.send(new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [{
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "POST", "GET"],
          AllowedOrigins: ["*"],
          ExposeHeaders: []
        }]
      }
    }));

    console.log(`\nSUCCESS! Image Bucket created: ${BUCKET_NAME}`);
    console.log(`Please add IMAGE_BUCKET_NAME=${BUCKET_NAME} to your backend/.env`);
    
  } catch (error) {
    console.error("Error setting up S3:", error);
  }
}

setupS3();
