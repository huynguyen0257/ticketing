import { Publisher, PaymentCreatedEvent, Subjects } from "@tommysg/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
