<template>
  <RouteLoadingBar :active="navigating && !booting" />

  <Transition name="boot-fade">
    <AppLoadingScreen v-if="booting" />
  </Transition>

  <div class="app-shell" :class="{ 'app-shell--booting': booting }">
    <template v-if="!isStandaloneRoute">
      <SiteHeader />
      <main class="app-main" :class="{ 'app-main--full': isFullWidth }">
        <router-view />
      </main>
      <AppFooter />
    </template>
    <router-view v-else />
    <button v-show="showTop && !isStandaloneRoute" class="back-to-top" type="button" aria-label="Back to top" @click="scrollTop">
      ↑
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppLoadingScreen from '@/components/AppLoadingScreen.vue'
import RouteLoadingBar from '@/components/RouteLoadingBar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { useAppBoot } from '@/composables/useAppBoot'
import { useRouteLoading } from '@/composables/useRouteLoading'

const route = useRoute()
const { booting } = useAppBoot()
const { navigating } = useRouteLoading()

const isFullWidth = computed(() => route.meta.fullWidth === true)
const isStandaloneRoute = computed(() => route.path.startsWith('/hotel/') || route.path.startsWith('/admin'))
const showTop = ref(false)

function onScroll() {
  showTop.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.app-shell--booting {
  pointer-events: none;
  user-select: none;
}

.boot-fade-enter-active,
.boot-fade-leave-active {
  transition: opacity 0.55s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.boot-fade-leave-to {
  opacity: 0;
}

.back-to-top {
  position: fixed;
  right: max(var(--space-4), env(safe-area-inset-right, 0px));
  bottom: max(var(--space-4), env(safe-area-inset-bottom, 0px));
  z-index: 250;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  box-shadow: var(--shadow-premium);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
</style>
