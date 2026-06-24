# AWS Amplify Deployment Guide ☁️

This guide outlines the steps to deploy the VoltCommerce frontend (React + Vite) to **AWS Amplify**. 

AWS Amplify offers a highly generous free tier that makes it an excellent choice for hosting single-page applications at **$0 cost** for prototypes and low-traffic applications.

## Why AWS Amplify?
- **Cost**: The free tier includes 15 GB of bandwidth and 5 GB of storage per month (for 12 months), which translates to $0 for an application of this scale.
- **CI/CD Integration**: It connects directly to your GitHub repository and automatically deploys any new changes pushed to the `main` branch.
- **Global CDN**: Assets are served from edge locations globally, ensuring lightning-fast load times.

---

## Deployment Steps

### 1. Push to GitHub
Ensure all your latest changes are committed and pushed to your GitHub repository.
```bash
git add .
git commit -m "Prepare for AWS deployment"
git push origin main
```

### 2. Connect Repository to AWS Amplify
1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Search for **AWS Amplify** in the top search bar.
3. Click **"New app"** -> **"Host web app"**.
4. Select **GitHub** as your repository service and click **Continue**.
5. Authorize AWS Amplify to access your GitHub repositories.
6. Select your `Okcredit-Finternship` repository and the `main` branch. Click **Next**.

### 3. Configure Build Settings
AWS Amplify will try to auto-detect your framework. Because we are using **Vite** instead of Create React App, you must ensure the build directory is correctly set to `dist`.

In the "Build settings" screen, look at the YAML configuration and make sure it matches this perfectly:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```
*(Crucial step: Ensure `baseDirectory` is set to `dist`, as that is where Vite outputs the production build.)*

Click **Next** and then **Save and deploy**.

### 4. Configure React Router Redirects (Important)
Because we are using React Router to navigate between the Storefront and the Merchant Portal (`/admin`), we need to tell AWS Amplify to route all raw URL requests back to `index.html`. If you skip this, refreshing the `/admin` page will result in a 404 error.

1. In the AWS Amplify console for your app, look at the left sidebar and click on **Rewrites and redirects**.
2. Click **Edit** and add the following rule:
   - **Source address**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>`
   - **Target address**: `/index.html`
   - **Type**: `200 (Rewrite)`
3. Click **Save**.

### 🎉 You're Live!
AWS Amplify will provision, build, and deploy your app. You will be provided with a live URL (e.g., `https://main.xxxxxx.amplifyapp.com`). 

From now on, whenever you `git push` to your main branch, AWS Amplify will automatically deploy the newest version!

---

## Future Architecture: AWS Database Integration

Currently, the application uses browser `localStorage` as a mock database. For production, you will want to connect the Merchant Portal to a real AWS database so that data is persistent globally across all users and devices.

Here are the two recommended AWS database architectures for VoltCommerce:

### Option 1: AWS Amplify + Amazon DynamoDB (Recommended for $0 Cost)
This is the most seamless way to stay within the AWS Amplify ecosystem and keep costs at $0.
* **The Database**: **Amazon DynamoDB**, a lightning-fast NoSQL database with a free tier of 25 GB of storage free *forever*.
* **The API Layer**: **AWS AppSync**, which automatically generates a GraphQL API.
* **Security**: You can integrate **Amazon Cognito** to lock down the `/admin` route. You can configure the database rules so that unauthenticated users (storefront shoppers) can only READ data, while authenticated admins (the merchant) can WRITE data.
* **Real-time**: AppSync provides native WebSocket subscriptions, meaning when a price changes in the DB, the storefront UI updates instantly without polling.

### Option 2: Amazon RDS (PostgreSQL/MySQL) + AWS Lambda
If you prefer a traditional relational database (which handles complex e-commerce relationships better as the app scales heavily).
* **The Database**: **Amazon RDS** running PostgreSQL or MySQL. RDS has a free tier for 12 months (750 hours of a `t2.micro` or `t3.micro` instance per month). After 12 months, it will incur a monthly cost.
* **The API Layer**: You will need to build a custom backend. A common serverless pattern is using **Amazon API Gateway** to route HTTP requests to **AWS Lambda** functions, which then query the RDS database.
* **Security**: You would manage JWT authentication tokens yourself or use Amazon Cognito to verify requests at the API Gateway level before they hit your database.
