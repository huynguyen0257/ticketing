import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../stripe");
jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.STRIPE_KEY =
    "sk_test_51JxaECGFGUDQITYxaBct4jeb3mgHcTlvW0wtdZg5gbvvbbzUjHRjcoQqbxGzaadxe59KawRcOzTe5G8CLxAngoTV00R5IJuUws";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Face Auth signin
global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Objects { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJson = JSON.stringify(session);

  // Tke JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // Return a string thats the cookie with the encode data
  return [`express:sess=${base64}`];
};
