<template>
    
<nav class="bg-pink-pink border-gray-200 dark:bg-pink-pink-dark">
  <div class="max-w-screen-xl flex flex-wrap justify-between mx-auto p-4">
  <router-link :to="{name:'home'}"><img src="@/assets/necha-logo.svg" class="h-20 mr-3" alt="Necha Logo" /></router-link>
  <div class="flex items-center justify-between md:order-2">
    <i class="pi pi-search mx-2" style="font-size: 1.2rem"></i>
    <i class="pi pi-user mx-2" style="font-size: 1.2rem"></i>
    <i class="pi pi-shopping-bag mx-2" style="font-size: 1.2rem"></i>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
    <ul class="flex flex-col font-medium p-4 md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0 text-black">
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-pink-pink-dark rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Collections</a>
      </li>
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-pink-pink-dark  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Shop</a>
      </li>
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-pink-pink-dark  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-pink-pink-dark  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Social Impact</a>
      </li>
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-pink-pink-dark  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Blog</a>
      </li>
      <li>
        <a href="#" class="block py-2 pl-3 pr-4 text-pink-pink-dark  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div>
  </div>
</nav>
</template>

<style scoped>
.pi:hover{
    color:#D9ABAB;
}
.pi{
    color:#AA7474;
}
</style>