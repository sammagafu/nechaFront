<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TopNavBar from './components/headers/TopNavBar.vue';
import Footer from './components/headers/Footer.vue';
</script>

<template>
  <TopNavBar></TopNavBar>
  <RouterView />
  <Footer />
</template>
