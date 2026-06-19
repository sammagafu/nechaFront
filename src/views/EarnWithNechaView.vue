<template>
  <PageDocument
    eyebrow="Earn with Necha"
    title="Share wellness. Earn rewards."
    subtitle="Refer guests, influencers and partners — and earn Necha points or cash on qualifying purchases."
  >
    <h2>Necha rewards</h2>
    <p>
      Every order on Necha Africa earns points. Redeem them for discounts on your next purchase or
      withdraw as cash to your mobile money account once you create an account.
    </p>

    <h2>For influencers &amp; ambassadors</h2>
    <p>
      Share curated African personal care with your audience. Contact us to discuss referral links,
      content partnerships and campaign collaborations.
    </p>

    <h2>For hotel staff</h2>
    <p>
      When guests use your property's referral code, your hotel earns commission — automatically
      attributed at checkout. See our
      <router-link to="/hotel-partners">hotel partners</router-link> page for onboarding.
    </p>

    <p>
      Get started: <router-link to="/sign-up">Create an account</router-link> or email
      <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>.
    </p>
  </PageDocument>
</template>

<script setup lang="ts">
import PageDocument from '@/components/PageDocument.vue'
import { appConfig } from '@/config/app'
</script>
