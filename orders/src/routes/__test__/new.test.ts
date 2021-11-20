import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

const ticket = {
  id: new mongoose.Types.ObjectId().toHexString(),
  title: "concert",
  price: 100,
};

it("returns an error if the ticket does not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticketDoc = Ticket.build({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
  });
  await ticketDoc.save();
  const order = Order.build({
    ticket: ticketDoc,
    userId: "asdlkfjalsdkhf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticketDoc.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticketDoc = Ticket.build({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
  });
  await ticketDoc.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticketDoc.id })
    .expect(201);
});

it("todo emits an order created event", async () => {
  const ticketDoc = Ticket.build({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
  });
  await ticketDoc.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticketDoc.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
