import { OrderCreatedEvent, Publisher, Subjects } from "@tommysg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
