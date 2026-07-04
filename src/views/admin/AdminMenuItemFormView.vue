<template>
  <form class="admin-form admin-card" @submit.prevent="submit">
    <p v-if="error" class="admin-error">{{ error }}</p>
    <div class="admin-form-row">
      <label>Name *<input v-model="form.name" required /></label>
      <label>Slug *<input v-model="form.slug" required /></label>
    </div>
    <div class="admin-form-row">
      <label>Category *<input v-model="form.category" required placeholder="e.g. mains" /></label>
      <label>Menu kind *
        <select v-model="form.menu_kind" required>
          <option value="food">Food & drinks</option>
          <option value="wellness">Wellness</option>
        </select>
      </label>
    </div>
    <label>Description<textarea v-model="form.description" rows="3" /></label>
    <div class="admin-form-row">
      <label>Price (TZS) *<input v-model.number="form.price" type="number" min="0" required /></label>
      <label>Tag<input v-model="form.tag" placeholder="e.g. Popular" /></label>
    </div>
    <div class="admin-form-row">
      <label>Sort order<input v-model.number="form.sort_order" type="number" min="0" /></label>
    </div>
    <label v-if="isEdit" style="flex-direction: row; align-items: center; gap: 0.5rem">
      <input v-model="form.is_active" type="checkbox" /> Active
    </label>
    <div class="admin-actions">
      <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save menu item' }}</button>
      <router-link :to="`/admin/hotels/${hotelId}/menu`" class="admin-btn admin-btn--ghost">Cancel</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createMenuItem, fetchMenuItems, updateMenuItem } from '@/api/admin'
import { getApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const hotelId = route.params.hotelId as string
const isEdit = computed(() => !!route.params.itemId)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  slug: '',
  category: 'mains',
  description: '',
  price: 0,
  tag: '',
  menu_kind: 'food',
  sort_order: 0,
  is_active: true,
})

onMounted(async () => {
  if (!isEdit.value) return
  const itemId = route.params.itemId as string
  try {
    const items = await fetchMenuItems(hotelId)
    const item = items.find((entry) => entry.id === itemId)
    if (!item) {
      error.value = 'Menu item not found'
      return
    }
    form.name = item.name
    form.slug = item.slug
    form.category = item.category
    form.description = item.description
    form.price = item.price
    form.tag = item.tag
    form.menu_kind = item.menu_kind
    form.sort_order = item.sort_order
    form.is_active = item.is_active
  } catch (e) {
    error.value = getApiError(e)
  }
})

async function submit() {
  saving.value = true
  error.value = ''
  try {
    if (isEdit.value) {
      await updateMenuItem(route.params.itemId as string, { ...form })
    } else {
      await createMenuItem(hotelId, { ...form })
    }
    router.push(`/admin/hotels/${hotelId}/menu`)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>
