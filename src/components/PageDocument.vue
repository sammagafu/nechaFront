<template>
  <article class="page-document">
    <header class="page-document-header">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      <p v-if="updated" class="page-updated">Last updated: {{ updated }}</p>
    </header>
    <div class="page-document-body">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  eyebrow?: string
  subtitle?: string
  updated?: string
}>()
</script>

<style scoped>
.page-document {
  max-width: 760px;
  margin: 0 auto;
}

.page-document-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.page-updated {
  margin: 0.75rem 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.page-document-body :deep(h2) {
  margin: 2rem 0 0.75rem;
  font-size: 1.35rem;
}

.page-document-body :deep(h3) {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.1rem;
}

.page-document-body :deep(p),
.page-document-body :deep(li) {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-body);
}

.page-document-body :deep(ul),
.page-document-body :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}

.page-document-body :deep(a) {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.page-document-body :deep(a:hover) {
  color: var(--color-interactive-hover);
}
</style>
