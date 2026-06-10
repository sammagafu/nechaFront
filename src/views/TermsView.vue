<template>
  <PageDocument
    eyebrow="Legal"
    title="Terms & Conditions"
    subtitle="Please read these terms before using the Necha Africa website, hotel storefronts, or placing an order."
    updated="June 2026"
  >
    <p>
      These Terms &amp; Conditions ("Terms") govern your use of the Necha Africa platform
      (the "Service"), including our website, hotel guest portals, and related ordering features.
      By accessing or using the Service, you agree to these Terms.
    </p>

    <h2>1. The Service</h2>
    <p>
      Necha Africa provides an online marketplace and hotel commerce platform for personal care,
      beauty, wellness products, and related hospitality services. Product availability,
      pricing, and delivery times may vary by hotel, location, and stock.
    </p>

    <h2>2. Eligibility &amp; accounts</h2>
    <p>
      You must provide accurate contact and delivery information when placing an order.
      Guest checkout is available on hotel storefronts; creating an account is optional but may
      be required to access rewards or order history features.
    </p>

    <h2>3. Orders &amp; payment</h2>
    <ul>
      <li>All prices are shown in Tanzanian Shillings (TZS) unless stated otherwise.</li>
      <li>Submitting an order constitutes an offer to purchase; we confirm acceptance when you receive an order reference.</li>
      <li>Payment may be collected via supported mobile money providers or card at checkout.</li>
      <li>We reserve the right to cancel orders affected by pricing errors, stock unavailability, or suspected fraud.</li>
    </ul>

    <h2>4. Hotel room delivery</h2>
    <p>
      When ordering to a hotel, you must provide a valid room number and property name.
      Delivery is made to the address supplied at checkout. Necha and partner hotels are not
      responsible for failed delivery caused by incorrect room details or guest unavailability.
    </p>

    <h2>5. Delivery &amp; returns</h2>
    <p>
      Delivery windows and fees depend on your zone within Dar es Salaam and order value.
      Free delivery thresholds and standard fees are displayed at checkout.
      Due to the nature of personal care products, opened or used items may not be eligible for return
      unless defective or incorrectly supplied. Contact customer care within 48 hours of delivery for assistance.
    </p>

    <h2>6. Hotel referral codes</h2>
    <p>
      Referral codes link purchases to partner hotels for commission and reporting purposes.
      Applying a valid hotel code does not change the price you pay unless a promotion is explicitly shown at checkout.
    </p>

    <h2>7. Product information</h2>
    <p>
      We aim to display accurate descriptions and images. Natural products may vary slightly in appearance.
      Always review ingredient lists if you have allergies or sensitivities.
    </p>

    <h2>8. Acceptable use</h2>
    <p>You agree not to misuse the Service, including attempting unauthorized access, scraping, or placing fraudulent orders.</p>

    <h2>9. Limitation of liability</h2>
    <p>
      To the fullest extent permitted by law, Necha Africa is not liable for indirect or consequential losses
      arising from use of the Service. Our total liability for any claim relating to an order is limited to
      the amount paid for that order.
    </p>

    <h2>10. Changes</h2>
    <p>
      We may update these Terms from time to time. Continued use of the Service after changes are posted
      constitutes acceptance of the revised Terms.
    </p>

    <h2>11. Contact</h2>
    <p>
      Questions about these Terms: <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>
      · <a :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">{{ appConfig.phone }}</a>
    </p>
  </PageDocument>
</template>

<script setup lang="ts">
import PageDocument from '@/components/PageDocument.vue'
import { appConfig } from '@/config/app'
</script>
