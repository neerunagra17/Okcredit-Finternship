require('dotenv').config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_PRODUCTS;

const mockProducts = [
  {
    id: '1',
    name: 'Copper Wire 10 AWG (per meter)',
    basePrice: 12.50,
    mrp: 18.00,
    volatility: 0.05, // 5% max swing per tick
    history: [12.0, 12.2, 12.1, 12.4, 12.5],
    category: 'Wiring',
    image: 'https://picsum.photos/seed/copperwire/400/300',
    rating: 4.6,
    reviews: 1284,
    stock: 5,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
    warranty: '1 Year Warranty',
    returnPolicy: '30 Day Returns'
  },
  {
    id: '2',
    name: 'Aluminum Cable 4/0 (per meter)',
    basePrice: 8.20,
    mrp: 12.00,
    volatility: 0.03,
    history: [8.0, 8.1, 8.05, 8.15, 8.20],
    category: 'Wiring',
    image: 'https://picsum.photos/seed/aluminumcable/400/300',
    rating: 4.1,
    reviews: 842,
    stock: 145,
    isBestSeller: false,
    deliveryDate: 'Thursday, June 27',
    warranty: '1 Year Warranty',
    returnPolicy: '30 Day Returns'
  },
  {
    id: '3',
    name: 'Standard Light Switch',
    basePrice: 45.00,
    mrp: 55.00,
    volatility: 0.0, // Static price
    history: [45.0, 45.0, 45.0, 45.0, 45.0],
    category: 'Switches',
    image: 'https://picsum.photos/seed/lightswitch/400/300',
    rating: 4.8,
    reviews: 3042,
    stock: 12,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
    warranty: '1 Year Warranty',
    returnPolicy: '30 Day Returns'
  },
  {
    id: '4',
    name: 'High-Speed Ceiling Fan (48 inch)',
    basePrice: 1450.00,
    mrp: 2200.00,
    volatility: 0.02,
    history: [1450.0, 1460.0, 1455.0, 1440.0, 1450.0],
    category: 'Appliances',
    image: 'https://picsum.photos/seed/ceilingfan/400/300',
    rating: 4.4,
    reviews: 512,
    stock: 45,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
    warranty: '2 Year Warranty',
    returnPolicy: '15 Day Returns'
  },
  {
    id: '5',
    name: 'LED Tube Light (20W)',
    basePrice: 250.00,
    mrp: 350.00,
    volatility: 0.01,
    history: [250.0, 250.0, 252.0, 248.0, 250.0],
    category: 'Lighting',
    image: 'https://picsum.photos/seed/tubelight/400/300',
    rating: 4.7,
    reviews: 1205,
    stock: 200,
    isBestSeller: false,
    deliveryDate: 'Wednesday, June 26',
    warranty: '1 Year Warranty',
    returnPolicy: '7 Day Returns'
  },
  {
    id: '6',
    name: 'Exhaust Fan (8 inch)',
    basePrice: 850.00,
    mrp: 1200.00,
    volatility: 0.03,
    history: [850.0, 830.0, 840.0, 860.0, 850.0],
    category: 'Appliances',
    image: 'https://picsum.photos/seed/exhaustfan/400/300',
    rating: 4.2,
    reviews: 320,
    stock: 25,
    isBestSeller: false,
    deliveryDate: 'Thursday, June 27',
    warranty: '1 Year Warranty',
    returnPolicy: '30 Day Returns'
  },
  {
    id: '7',
    name: 'Extension Cord (4 Socket, 2m)',
    basePrice: 320.00,
    mrp: 450.00,
    volatility: 0.0,
    history: [320.0, 320.0, 320.0, 320.0, 320.0],
    category: 'Wiring',
    image: 'https://picsum.photos/seed/extensioncord/400/300',
    rating: 4.5,
    reviews: 890,
    stock: 80,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
    warranty: '6 Months Warranty',
    returnPolicy: '30 Day Returns'
  },
  {
    id: '8',
    name: 'Smart LED Bulb (9W)',
    basePrice: 199.00,
    mrp: 499.00,
    volatility: 0.04,
    history: [199.0, 195.0, 205.0, 190.0, 199.0],
    category: 'Lighting',
    image: 'https://picsum.photos/seed/smartbulb/400/300',
    rating: 4.3,
    reviews: 2150,
    stock: 150,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
    warranty: '1 Year Warranty',
    returnPolicy: '7 Day Returns'
  }
];

async function seedData() {
  console.log("Starting seed process...");
  for (const product of mockProducts) {
    try {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: product
      }));
      console.log(`Seeded: ${product.name}`);
    } catch (err) {
      console.error(`Failed to seed ${product.name}:`, err);
    }
  }
  console.log("Seed process complete!");
}

seedData();
