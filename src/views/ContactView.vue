<template>
  <div class="contact-page">
    <header class="contact-hero">
      <img :src="siteImages.banner" alt="" class="contact-hero-image" loading="eager" />
      <div class="section-inner contact-hero-inner">
        <p class="kicker">Contact</p>
        <h1 class="page-title">Get in Touch</h1>
        <p class="contact-lead">We respond within one business day.</p>
      </div>
    </header>

    <div class="section-inner contact-grid">
      <aside class="contact-aside">
        <h2>Visit &amp; call</h2>
        <p>{{ appConfig.address }}</p>
        <p>{{ appConfig.hours }}</p>
        <p>
          <a :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">{{ appConfig.phone }}</a><br />
          <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>
        </p>
      </aside>

      <form class="contact-form form-stack card card-elevated" @submit.prevent="submitted = true">
        <div class="field">
          <label for="contact-type">I am a</label>
          <select id="contact-type" v-model="form.type" required>
            <option value="">Select…</option>
            <option value="consumer">Consumer</option>
            <option value="hotel">Hotel Partner</option>
            <option value="brand">Brand</option>
            <option value="influencer">Influencer</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label for="contact-name">Full name</label>
            <input id="contact-name" v-model="form.name" type="text" required />
          </div>
          <div class="field">
            <label for="contact-phone">Phone</label>
            <input id="contact-phone" v-model="form.phone" type="tel" />
          </div>
        </div>
        <div class="field">
          <label for="contact-email">Email</label>
          <input id="contact-email" v-model="form.email" type="email" required />
        </div>
        <div class="field">
          <label for="contact-message">How can we help you?</label>
          <textarea id="contact-message" v-model="form.message" rows="5" required />
        </div>
        <p v-if="submitted" class="success">Thank you — we'll be in touch shortly.</p>
        <button v-else class="btn btn-block" type="submit">Send Message</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { appConfig } from '@/config/app'
import { siteImages } from '@/config/images'

const submitted = ref(false)
const form = reactive({
  type: '',
  name: '',
  phone: '',
  email: '',
  message: '',
})
</script>

<style scoped>
.contact-page {
  background: var(--color-bg);
}

.contact-hero {
  position: relative;
  min-height: 220px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.contact-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(12, 12, 12, 0.82), rgba(12, 12, 12, 0.25));
}

.contact-hero-inner {
  position: relative;
  z-index: 1;
  padding-block: 2.5rem;
}

.contact-hero .kicker,
.contact-hero .page-title,
.contact-lead {
  color: var(--color-white);
}

.contact-lead {
  margin: 0.5rem 0 0;
  font-size: 15px;
  opacity: 0.85;
}

.contact-grid {
  display: grid;
  gap: 2.5rem;
  padding-block: 3rem 4rem;
}

@media (min-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr 1.4fr;
    align-items: start;
  }
}

.contact-aside h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
}

.contact-aside p {
  margin: 0 0 1rem;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-body);
}

.contact-aside a {
  color: var(--color-text);
}

.contact-form {
  padding: clamp(1.75rem, 4vw, 2.25rem);
}

.contact-form .grid {
  gap: var(--form-gap);
}
</style>
