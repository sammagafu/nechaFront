<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Compare</p>
      <h1 class="page-title">Compare products</h1>
      <p class="page-subtitle">Compare up to {{ compare.MAX_ITEMS }} products side by side</p>
    </header>

    <div v-if="compare.items.length === 0" class="card card-elevated empty-state">
      <p>No products to compare yet.</p>
      <router-link to="/shop" class="btn">Browse products</router-link>
    </div>

    <template v-else>
      <div class="compare-toolbar">
        <button type="button" class="btn-link" @click="compare.clear()">Clear all</button>
      </div>
      <div class="compare-table-wrap card">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Product</th>
              <th v-for="item in compare.items" :key="item.id">
                <button type="button" class="remove-x" @click="compare.remove(item.id)">×</button>
                {{ item.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Price</td>
              <td v-for="item in compare.items" :key="`${item.id}-price`">
                {{ formatPrice(item.price, item.currency) }}
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td v-for="item in compare.items" :key="`${item.id}-desc`">{{ item.description }}</td>
            </tr>
            <tr>
              <td>Stock</td>
              <td v-for="item in compare.items" :key="`${item.id}-stock`">{{ item.stock ?? '—' }}</td>
            </tr>
            <tr>
              <td>Action</td>
              <td v-for="item in compare.items" :key="`${item.id}-action`">
                <button class="btn btn-sm" type="button" @click="cart.add(item)">Add to cart</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCompareStore } from '@/stores/compare'
import { formatPrice } from '@/utils/commerce'

const compare = useCompareStore()
const cart = useCartStore()
</script>

<style scoped>
.empty-state {
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
  padding: 3rem;
}

.compare-toolbar {
  margin-bottom: 1rem;
  text-align: right;
}

.compare-table-wrap {
  overflow-x: auto;
  padding: 0;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.compare-table th,
.compare-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  vertical-align: top;
}

.compare-table th {
  font-family: var(--font-display);
  font-size: 1rem;
  background: var(--color-bg-soft);
}

.compare-table td:first-child {
  font-weight: 600;
  color: var(--color-text);
  min-width: 120px;
}

.remove-x {
  float: right;
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--color-muted);
  line-height: 1;
}

.remove-x:hover {
  color: var(--color-error);
}
</style>
