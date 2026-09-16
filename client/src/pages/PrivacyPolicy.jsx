import { EVENT } from "../eventConfig";

export default function PrivacyPolicy() {
  return (
    <div className="section policy">
      <h1>Privacy Policy</h1>
      <p className="policy-updated">Last updated: {new Date().getFullYear()}</p>

      <h3>Information We Collect</h3>
      <p>
        When you purchase a ticket for {EVENT.name}, we collect your name, email address, and
        phone number to process your order and send confirmation. Payment details are handled
        entirely by Razorpay — we never see or store your card, UPI, or bank information.
      </p>

      <h3>How We Use Your Information</h3>
      <p>
        Your information is used to confirm your ticket, contact you with event updates, and
        provide entry verification at the venue. We do not sell or rent your personal
        information to third parties.
      </p>

      <h3>Payment Processing</h3>
      <p>
        All payments are processed securely by Razorpay, a PCI-DSS compliant payment gateway.
        Refer to{" "}
        <a href="https://razorpay.com/privacy/" target="_blank" rel="noreferrer">
          Razorpay's Privacy Policy
        </a>{" "}
        for details on how they handle payment data.
      </p>

      <h3>Data Retention</h3>
      <p>
        We retain order information for as long as necessary to fulfil the event and for
        reasonable record-keeping afterward.
      </p>

      <h3>Contact</h3>
      <p>
        For any privacy-related questions, reach us at{" "}
        {EVENT.contactEmail ? <a href={`mailto:${EVENT.contactEmail}`}>{EVENT.contactEmail}</a> : "our contact email"}.
      </p>
    </div>
  );
}
