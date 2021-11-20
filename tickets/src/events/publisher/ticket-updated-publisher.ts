import { Publisher, Subjects, TicketUpdatedEvent } from "@tommysg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
