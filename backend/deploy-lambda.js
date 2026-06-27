require('dotenv').config();
const { IAMClient, CreateRoleCommand, AttachRolePolicyCommand, GetRoleCommand } = require('@aws-sdk/client-iam');
const { LambdaClient, CreateFunctionCommand, UpdateFunctionCodeCommand, AddPermissionCommand, CreateFunctionUrlConfigCommand } = require('@aws-sdk/client-lambda');
const fs = require('fs');

const region = process.env.AWS_REGION;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

const iam = new IAMClient({ region, credentials });
const lambda = new LambdaClient({ region, credentials });
const ROLE_NAME = "VoltCommerceLambdaExecutionRole";
const FUNCTION_NAME = "VoltCommerceAPI";

async function deploy() {
  let roleArn;
  try {
    console.log("Creating IAM Role...");
    const roleRes = await iam.send(new CreateRoleCommand({
      RoleName: ROLE_NAME,
      AssumeRolePolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{ Effect: "Allow", Principal: { Service: "lambda.amazonaws.com" }, Action: "sts:AssumeRole" }]
      })
    }));
    roleArn = roleRes.Role.Arn;
    await iam.send(new AttachRolePolicyCommand({
      RoleName: ROLE_NAME,
      PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    }));
    
    // Add DynamoDB permissions
    await iam.send(new AttachRolePolicyCommand({
      RoleName: ROLE_NAME,
      PolicyArn: "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
    }));
    
    // Add S3 permissions
    await iam.send(new AttachRolePolicyCommand({
      RoleName: ROLE_NAME,
      PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess"
    }));
    
    console.log("Waiting for IAM Role to propagate...");
    await new Promise(r => setTimeout(r, 10000));
  } catch (err) {
    if (err.name === 'EntityAlreadyExistsException') {
      const roleRes = await iam.send(new GetRoleCommand({ RoleName: ROLE_NAME }));
      roleArn = roleRes.Role.Arn;
      console.log("IAM Role already exists.");
    } else {
      throw err;
    }
  }

  const zipFile = fs.readFileSync('lambda.zip');

  try {
    console.log("Creating Lambda Function...");
    await lambda.send(new CreateFunctionCommand({
      FunctionName: FUNCTION_NAME,
      Runtime: "nodejs20.x",
      Role: roleArn,
      Handler: "server.handler",
      Code: { ZipFile: zipFile },
      Timeout: 15,
      Environment: {
        Variables: {
          DYNAMODB_TABLE_PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS,
          DYNAMODB_TABLE_ORDERS: process.env.DYNAMODB_TABLE_ORDERS,
          IMAGE_BUCKET_NAME: process.env.IMAGE_BUCKET_NAME,
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
        }
      }
    }));
    console.log("Function created.");

    console.log("Creating Function URL...");
    const urlRes = await lambda.send(new CreateFunctionUrlConfigCommand({
      FunctionName: FUNCTION_NAME,
      AuthType: "NONE",
      Cors: {
        AllowOrigins: ["*"],
        AllowMethods: ["*"],
        AllowHeaders: ["*"]
      }
    }));

    await lambda.send(new AddPermissionCommand({
      FunctionName: FUNCTION_NAME,
      StatementId: "FunctionURLAllowPublicAccess",
      Action: "lambda:InvokeFunctionUrl",
      Principal: "*",
      FunctionUrlAuthType: "NONE"
    }));

    console.log("\n==============================================");
    console.log("SUCCESS! Your Serverless API is live at:");
    console.log(urlRes.FunctionUrl);
    console.log("==============================================\n");
    console.log("Add this URL to your frontend .env file as VITE_API_URL");

  } catch (err) {
    if (err.name === 'ResourceConflictException') {
      console.log("Function already exists, updating code...");
      await lambda.send(new UpdateFunctionCodeCommand({
        FunctionName: FUNCTION_NAME,
        ZipFile: zipFile
      }));
      console.log("Function code updated.");
    } else {
      console.error("Error creating lambda:", err);
    }
  }

  // Always update configuration in case env vars changed
  try {
    const { UpdateFunctionConfigurationCommand } = require('@aws-sdk/client-lambda');
    await lambda.send(new UpdateFunctionConfigurationCommand({
      FunctionName: FUNCTION_NAME,
      Environment: {
        Variables: {
          DYNAMODB_TABLE_PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS || 'VoltCommerce_Products',
          DYNAMODB_TABLE_ORDERS: 'VoltCommerce_Orders',
          IMAGE_BUCKET_NAME: process.env.IMAGE_BUCKET_NAME || '',
          USER_POOL_ID: process.env.USER_POOL_ID || '',
          CLIENT_ID: process.env.CLIENT_ID || '',
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
        }
      }
    }));
    console.log("Function configuration updated.");
  } catch (e) {
    console.error("Error updating config:", e);
  }
}

deploy();
