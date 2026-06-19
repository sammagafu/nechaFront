<template>
  <footer class="site-footer">
    <div class="footer-widgets">
      <div class="footer-inner">
        <div class="footer-col footer-col--brand">
          <router-link to="/" class="footer-logo-link">
            <NechaLogo alt="NECHA" class="footer-logo" :width="120" :height="32" />
          </router-link>
          <p class="footer-about">
            Personal care, beauty and wellness — delivered across Dar es Salaam.
            Shop curated African brands or scan your hotel QR to order to your room.
          </p>
          <ul class="footer-contact-list">
            <li>
              <Icon name="phone" :size="16" />
              <a :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">{{ appConfig.phone }}</a>
            </li>
            <li>
              <Icon name="mail" :size="16" />
              <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>
            </li>
            <li>
              <Icon name="map-pin" :size="16" />
              <span>{{ appConfig.address }}</span>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-widget-title">Information</h4>
          <nav class="footer-links">
            <router-link to="/">Home</router-link>
            <router-link to="/shop">Shop</router-link>
            <router-link to="/about">About Us</router-link>
            <router-link to="/discovery">Discovery</router-link>
            <router-link to="/hotel-partners">Hotel Partners</router-link>
            <router-link to="/earn-with-necha">Earn With Necha</router-link>
            <router-link to="/delivery">Delivery Information</router-link>
            <router-link to="/sign-up">Rewards</router-link>
            <router-link to="/terms">Terms &amp; Conditions</router-link>
            <router-link to="/contact">Contact</router-link>
          </nav>
        </div>

        <div class="footer-col">
          <h4 class="footer-widget-title">My Account</h4>
          <nav class="footer-links">
            <router-link to="/sign-in">Sign in</router-link>
            <router-link to="/sign-up">Sign up</router-link>
            <router-link to="/account">My account</router-link>
            <router-link to="/cart">Cart</router-link>
            <router-link to="/wishlist">Wishlist</router-link>
            <router-link to="/checkout">Checkout</router-link>
            <router-link to="/admin/login">Admin Login</router-link>
          </nav>
        </div>

        <div class="footer-col footer-col--newsletter">
          <h4 class="footer-widget-title">Newsletter</h4>
          <p class="footer-newsletter-text">
            Get wellness tips, new arrivals and exclusive offers delivered to your inbox.
          </p>
          <form class="footer-newsletter" @submit.prevent>
            <input type="email" placeholder="Your email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p class="footer-copyright">Copyright © {{ year }} Necha Africa. All rights reserved.</p>
        <nav class="footer-bottom-links" aria-label="Footer legal">
          <router-link to="/terms">Terms</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/contact">Contact</router-link>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NechaLogo from '@/components/NechaLogo.vue'
import Icon from '@/components/ui/Icon.vue'
import { appConfig } from '@/config/app'

const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  margin-top: auto;
}

/* Hara-style light widget area */
.footer-widgets {
  background: var(--footer-widgets-bg);
  border-top: 1px solid var(--color-border);
  padding: var(--space-16) 0 var(--space-12);
}

.footer-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .footer-inner {
    grid-template-columns: 1.35fr repeat(3, 1fr);
    gap: 2rem;
  }
}

.footer-col--brand {
  max-width: 320px;
}

.footer-logo-link {
  display: inline-block;
  margin-bottom: 1.25rem;
}

.footer-logo {
  height: 32px;
  width: auto;
  display: block;
}

.footer-about {
  margin: 0 0 1.25rem;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-body);
}

.footer-contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.footer-contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 14px;
  color: var(--color-body);
  line-height: 1.5;
}

.footer-contact-list svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-muted);
}

.footer-contact-list a {
  color: var(--color-text);
}

.footer-contact-list a:hover {
  color: var(--color-interactive-hover);
}

.footer-widget-title {
  margin: 0 0 1.25rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-text);
}

.footer-links {
  display: grid;
  gap: 0.55rem;
}

.footer-links a {
  font-size: 14px;
  color: var(--color-body);
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-interactive-hover);
}

.footer-newsletter-text {
  margin: 0 0 1rem;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-body);
}

.footer-newsletter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 480px) {
  .footer-newsletter {
    flex-direction: row;
  }
}

.footer-newsletter input {
  flex: 1;
  min-width: 0;
  min-height: 48px;
  padding: var(--input-padding-y) var(--input-padding-x);
  line-height: 1.5;
  border: 1px solid var(--color-border);
  border-radius: 0;
  background: var(--color-surface);
  font-size: 14px;
  color: var(--color-text);
}

.footer-newsletter input:focus {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.footer-newsletter button {
  height: 44px;
  padding: 0 1.35rem;
  border: none;
  border-radius: var(--radius-editorial);
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s;
}

@media (min-width: 480px) {
  .footer-newsletter button {
    width: auto;
  }
}

.footer-newsletter button:hover {
  opacity: 0.88;
}

/* Bottom copyright bar */
.footer-bottom {
  background: var(--footer-bar-bg);
  border-top: 1px solid var(--color-border);
}

.footer-bottom-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 1.1rem 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  text-align: center;
}

@media (min-width: 768px) {
  .footer-bottom-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer-copyright {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
}

.footer-bottom-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.35rem 1.25rem;
}

.footer-bottom-links a {
  font-size: 13px;
  color: var(--color-body);
}

.footer-bottom-links a:hover {
  color: var(--color-interactive-hover);
}
</style>
