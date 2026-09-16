import { EVENT } from "../eventConfig";

export default function RefundPolicy() {
  return (
    <div className="section policy">
      <h1>Refund & Cancellation Policy</h1>
      <p className="policy-updated">Last updated: {new Date().getFullYear()}</p>

      <h3>Ticket Cancellations</h3>
      <p>
        Tickets purchased for {EVENT.name} are generally non-refundable once payment is
        successfully completed, as they secure your entry for a limited-capacity event.
      </p>

      <h3>Event Cancellation by Organizers</h3>
      <p>
        If {EVENT.name} is cancelled entirely by the organizers, a full refund will be issued
        to the original payment method within 7–10 business days.
      </p>

      <h3>Event Postponement</h3>
      <p>
        If the event is postponed to a new date, existing tickets will remain valid for the
        rescheduled date. Attendees unable to attend the new date may request a refund within
        7 days of the postponement announcement.
      </p>

      <h3>Duplicate or Failed Transactions</h3>
      <p>
        If you were charged more than once for the same order, or a payment failed but the
        amount was debited, contact us with your payment reference and we will investigate and
        refund any erroneous charge within 7–10 business days.
      </p>

      <h3>How to Request a Refund</h3>
      <p>
        Email{" "}
        {EVENT.contactEmail ? <a href={`mailto:${EVENT.contactEmail}`}>{EVENT.contactEmail}</a> : "our support email"}{" "}
        with your order details. Approved refunds are processed back to the original payment
        method via Razorpay.
      </p>
    </div>
  );
}
