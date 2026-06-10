<template>
  <div class="brands-page">
    <header class="brands-hero section-inner">
      <p class="kicker">Brands</p>
      <h1 class="page-title">Authentic African Beauty</h1>
      <p class="brands-lead">
        Curated personal care and wellness labels from across the continent — starting with NECHA
        NATURALS.
      </p>
    </header>

    <div class="section-inner brands-grid">
      <article class="brand-card card card-elevated">
        <img :src="siteImages.products.lemongrass" alt="NECHA NATURALS" loading="lazy" />
        <div class="brand-card-body">
          <p class="brand-label">Flagship</p>
          <h2>NECHA NATURALS</h2>
          <p>
            Botanical body care crafted in Tanzania — shea, baobab, lemongrass, turmeric and
            hibiscus for skin, hair and ritual.
          </p>
          <router-link to="/shop" class="text-link">Shop NECHA NATURALS →</router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { siteImages } from '@/config/images'
</script>

<style scoped>
.brands-page {
  background: var(--color-bg);
  padding-bottom: 4rem;
}

.brands-hero {
  padding-block: 3rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.brands-lead {
  margin: 0.75rem 0 0;
  max-width: 52ch;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-body);
}

.brands-grid {
  padding-top: 2.5rem;
}

.brand-card {
  overflow: hidden;
  display: grid;
}

@media (min-width: 768px) {
  .brand-card {
    grid-template-columns: 1fr 1.2fr;
  }
}

.brand-card img {
  width: 100%;
  min-height: 240px;
  object-fit: cover;
}

.brand-card-body {
  padding: 1.75rem;
}

.brand-label {
  margin: 0 0 0.35rem;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-necha-green);
}

.brand-card-body h2 {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
}

.brand-card-body p {
  margin: 0 0 1rem;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-body);
}
</style>
