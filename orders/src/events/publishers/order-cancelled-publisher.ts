import { OrderCancelledEvent, Publisher, Subjects } from "@tommysg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
