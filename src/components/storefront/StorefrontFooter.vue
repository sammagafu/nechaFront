<script setup lang="ts">
import NechaLogo from '@/components/NechaLogo.vue'
</script>

<template>
  <footer class="sf-footer">
    <div class="sf-container sf-footer-inner">
      <router-link to="/" class="sf-footer-logo" aria-label="Necha Africa home">
        <NechaLogo alt="Necha Africa" :width="112" :height="28" />
      </router-link>
      <p class="sf-footer-tagline">Personal care, beauty &amp; wellness — powered by Necha Africa.</p>
    </div>
  </footer>
</template>
