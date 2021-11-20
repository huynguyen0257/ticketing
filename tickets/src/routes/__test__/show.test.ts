import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});
it("return the ticket if the ticket is found", async () => {
  const data = {
    title: "string",
    price: 20,
  };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(data)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);
  expect(ticketResponse.body.title).toEqual(data.title);
  expect(ticketResponse.body.price).toEqual(data.price);
});
