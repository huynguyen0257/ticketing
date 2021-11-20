import { Listener, Subjects, TicketUpdatedEvent } from "@tommysg/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    // Make sure the event concurrency
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
      // console.error(`Ticket not found: ${JSON.stringify(data)}`);
      // return;
    }

    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
