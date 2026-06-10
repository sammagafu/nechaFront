<template>
  <PageDocument
    eyebrow="Delivery"
    title="Same-day across Dar es Salaam"
    subtitle="Electric vehicle delivery · Free on orders over TZS 180,000"
  >
    <p>
      We deliver personal care, beauty and wellness orders across Dar es Salaam by electric vehicle.
      Orders placed before 4:00pm East Africa Time are delivered the same day; after 4:00pm,
      delivery is scheduled for the next morning from 9:00am.
    </p>

    <h2>Delivery zones</h2>
    <ul>
      <li><strong>Zone A:</strong> Mbezi Beach</li>
      <li><strong>Zone B:</strong> Kunduchi</li>
      <li><strong>Zone C:</strong> Mikocheni</li>
      <li><strong>Zone D:</strong> City Centre</li>
      <li><strong>Zone E:</strong> Oysterbay / Masaki</li>
      <li><strong>Zone F:</strong> Airport</li>
    </ul>

    <h2>Hotel room delivery</h2>
    <p>
      Staying at a partner hotel? Scan the in-room QR code, shop from your phone, and enter your
      room number at checkout. Typical delivery window: 60–90 minutes.
    </p>

    <p>
      <router-link to="/shop">Shop now</router-link> ·
      <router-link to="/#enter-hotel">Enter hotel code</router-link>
    </p>
  </PageDocument>
</template>

<script setup lang="ts">
import PageDocument from '@/components/PageDocument.vue'
</script>
