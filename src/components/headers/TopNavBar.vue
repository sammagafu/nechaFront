<template>
    
<nav class="bg-pink-pink border-gray-200 dark:bg-pink-pink-dark">
  <div class="max-w-screen-xl flex flex-wrap justify-between mx-auto p-4">
  <router-link :to="{name:'home'}"><img src="@/assets/necha-logo.svg" class="h-20 mr-3" alt="Necha Logo" /></router-link>
  <div class="flex items-center justify-between md:order-2">
    <i class="pi pi-search mx-2" style="font-size: 1.2rem"></i>
    <router-link :to="{name:'login'}"><i class="pi pi-user mx-2" style="font-size: 1.2rem"></i></router-link>
    <i class="pi pi-shopping-bag mx-2" style="font-size: 1.2rem" @click="visible = !visible"> </i>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
    <ul class="flex flex-col font-medium p-4 md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0 text-black">
      <li>
        <router-link :to="{name:'home'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">Home</router-link>
      </li>
      <li>
        <router-link :to="{name:'collection'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">Collection</router-link>
      </li>
      <li>
        <router-link :to="{name:'shopIndex'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">Shop</router-link>
      </li>
      <li>
        <router-link :to="{name:'about'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">About Us</router-link>
      </li>
      <li>
        <router-link :to="{name:'impact'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">Social Impact</router-link>
      </li>
      <li>
        <router-link :to="{name:'blog'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">Blog</router-link>
      </li>
      <li>
        <router-link :to="{name:'contant'}" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-pink-dark md:p-0 md:dark:text-pink-dark">Contact</router-link>
      </li>
    </ul>
  </div>
  </div>
</nav>
<div class="card flex justify-content-center">
    <Sidebar v-model:visible="visible" position="right">
        <h2>Sidebar</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </Sidebar>

</div>
</template>

<style scoped>
.pi:hover{
    color:#D9ABAB;
}
.pi{
    color:#AA7474;
}
</style>

<script setup>
import Sidebar from 'primevue/sidebar';
import { ref } from 'vue';
const visible = ref(false)

</script>