<template>
  <form class="admin-form admin-card" @submit.prevent="submit">
    <p v-if="error" class="admin-error">{{ error }}</p>
    <div class="admin-form-row">
      <label>Name *<input v-model="form.name" required /></label>
      <label>Slug *<input v-model="form.slug" required /></label>
    </div>
    <div class="admin-form-row">
      <label>Brand<input v-model="form.brand_name" /></label>
      <label>Category *
        <select v-model="form.category" required>
          <option value="skin_care">Skin care</option>
          <option value="hair_care">Hair care</option>
          <option value="personal_care">Personal care</option>
          <option value="wellness">Wellness</option>
          <option value="fragrance">Fragrance</option>
          <option value="accessories">Accessories</option>
        </select>
      </label>
    </div>
    <label>Description<textarea v-model="form.description" rows="3" /></label>
    <div class="admin-form-row">
      <label>Price (TZS) *<input v-model.number="form.price" type="number" min="1" required /></label>
      <label>Stock<input v-model.number="form.stock" type="number" min="0" /></label>
    </div>
    <div class="admin-form-row">
      <label>Badge
        <select v-model="form.badge">
          <option value="">None</option>
          <option value="african_brand">African brand</option>
          <option value="best_seller">Best seller</option>
          <option value="new">New</option>
        </select>
      </label>
      <label>Main image URL<input v-model="form.image_url" /></label>
    </div>
    <label>Additional image URLs (one per line)
      <textarea v-model="extraImages" rows="3" placeholder="https://…/image-2.jpg&#10;https://…/image-3.jpg" />
    </label>
    <label style="flex-direction: row; align-items: center; gap: 0.5rem">
      <input v-model="form.is_featured" type="checkbox" /> Featured (guest favourites)
    </label>
    <label v-if="isEdit" style="flex-direction: row; align-items: center; gap: 0.5rem">
      <input v-model="form.is_active" type="checkbox" /> Active
    </label>
    <div class="admin-actions">
      <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save product' }}</button>
      <router-link :to="`/admin/hotels/${hotelId}/products`" class="admin-btn admin-btn--ghost">Cancel</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createProduct, fetchProducts, updateProduct } from '@/api/admin'
import { getApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const hotelId = route.params.hotelId as string
const isEdit = computed(() => !!route.params.productId)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '', slug: '', brand_name: 'NECHA NATURALS', description: '', category: 'skin_care',
  badge: '', price: 0, currency: 'TZS', image_url: '', stock: 0, is_featured: false, is_active: true,
})
const extraImages = ref('')

onMounted(async () => {
  if (!isEdit.value) return
  const products = await fetchProducts(hotelId)
  const product = products.find((p) => p.id === route.params.productId)
  if (product) {
    Object.assign(form, product)
    extraImages.value = (product.images ?? []).join('\n')
  }
})

function parseImages() {
  return extraImages.value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

async function submit() {
  saving.value = true
  error.value = ''
  try {
    const payload = { ...form, images: parseImages() }
    if (isEdit.value) {
      await updateProduct(route.params.productId as string, payload)
    } else {
      await createProduct(hotelId, payload)
    }
    router.push(`/admin/hotels/${hotelId}/products`)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>
