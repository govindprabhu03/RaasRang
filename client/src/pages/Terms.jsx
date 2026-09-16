import { EVENT } from "../eventConfig";

export default function Terms() {
  return (
    <div className="section policy">
      <h1>Terms & Conditions</h1>
      <p className="policy-updated">Last updated: {new Date().getFullYear()}</p>

      <h3>1. Tickets</h3>
      <p>
        All tickets purchased for {EVENT.name} are sold subject to availability. Each ticket
        grants entry for the number of guests stated on the pass type. Tickets are non-transferable
        once issued unless explicitly stated otherwise.
      </p>

      <h3>2. Entry</h3>
      <p>
        Entry is subject to producing a valid ticket confirmation (digital or printed) and a
        valid government-issued photo ID at the venue. The organizers reserve the right to deny
        entry for safety, security, or capacity reasons.
      </p>

      <h3>3. Event Changes</h3>
      <p>
        {EVENT.name} reserves the right to modify the event schedule, artist line-up, or venue
        due to circumstances beyond our control. Any material changes will be communicated via
        our official channels.
      </p>

      <h3>4. Conduct</h3>
      <p>
        Attendees are expected to behave respectfully. The organizers reserve the right to remove
        any attendee from the venue without refund for disruptive, unsafe, or unlawful behavior.
      </p>

      <h3>5. Liability</h3>
      <p>
        {EVENT.name} and its organizers are not liable for loss, theft, or damage to personal
        belongings, or for any injury sustained at the venue except where caused by our
        negligence.
      </p>

      <h3>6. Contact</h3>
      <p>
        Questions about these terms can be sent to{" "}
        {EVENT.contactEmail ? <a href={`mailto:${EVENT.contactEmail}`}>{EVENT.contactEmail}</a> : "our contact email"}.
      </p>
    </div>
  );
}
