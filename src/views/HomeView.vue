<script setup>
import Carousel from "@/components/body/Carousel.vue";
</script>

<template>
  <Carousel></Carousel>
  <div class="my-32">
    <div class="my-32 mx-auto text-center">
      <h2 class="text-3xl font-black text-pink-pink-dark">Shop our Feature products</h2>
      <p>
        Made using clean, non-toxic ingredients, <br />Our products are designed for
        everyone.
      </p>
    </div>
    <section class="container mx-auto scroll-smooth">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div>
          <img src="@/assets/img/banner/banner-2.jpg" alt="" />
        </div>

        <div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <!--   ✅ Product card 1 - Starts Here 👇 -->
            <div
              class="w-100 bg-black-100 shadow-md rounded-xl duration-500 hover:scale-105 cursor-pointer hover:shadow-xl"
              v-for="product in 4"
              :key="product"
            >
              <a href="#">
                <img
                  src="@/assets/img/product/1.jpg"
                  alt="Product"
                  class="h-100 w-full object-cover"
                />
                <div class="px-4 py-3 w-72">
                  <span class="text-indigo-600 mr-3 uppercase text-xs">Lotion</span>
                  <p
                    class="text-lg font-semibold text-indigo-900 truncate block uppercase"
                  >
                    Lemon Grass Body butter
                  </p>
                  <div class="flex items-center">
                    <p class="text-lg font-semibold text-black cursor-auto my-3">$149</p>
                    <del>
                      <p class="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                    </del>
                    <div class="ml-auto flex justify-between space-x-3">
                      <router-link :to="{ name: '' }"
                        ><i class="pi pi-shopping-bag" style="font-size: 1.5rem"></i
                      ></router-link>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <!--   🛑 Product card 1 - Ends Here  -->
          </div>
        </div>
      </div>
    </section>
    <section class="feature my-32">
      <div class="container mx-auto">
        <div class="flex flex-row flex-wrap justify-center space-x-32">
          <div class="text-center">
            <img src="@/assets/img/specs/1.svg" alt="" class="h-24" />
          </div>
          <div class="text-center">
            <img src="@/assets/img/specs/2.svg" alt="" class="h-24" />
          </div>
          <div class="text-center">
            <img src="@/assets/img/specs/3.svg" alt="" class="h-24" />
          </div>
          <div class="text-center">
            <img src="@/assets/img/specs/4.svg" alt="" class="h-24" />
          </div>
        </div>
      </div>
    </section>

    <section class="collections">
      <div class="grid grid-cols-1 md:grid-cols-4">
        <div
          class="collection bg-[url('@/assets/img/collection/allcolors.jpg')] bg-cover bg-center p-4 relative group hover:scale-105 cursor-pointer transition md:h-screen h-96"
        >
        <div class="py-96">
          <h2 class="text-6xl font-semibold mt-2 text-white">Body wash</h2>
          <p class="text-gray-600 hidden group-hover:block mt-2">Some text here.</p>
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded mt-2 hidden group-hover:block"
          >
            Learn More
          </button>
        </div>
        </div>

        <div
          class="collection bg-[url('@/assets/img/collection/men.jpg')] bg-cover bg-center p-4 relative group hover:scale-105 cursor-pointer transition md:h-screen h-96"
        >
        <div class="py-96">
          <h2 class="text-6xl font-semibold mt-2 text-white">Body wash</h2>
          <p class="text-gray-600 hidden group-hover:block mt-2">Some text here.</p>
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded mt-2 hidden group-hover:block"
          >
            Learn More
          </button>
        </div>
        </div>

        <div
          class="collection bg-[url('@/assets/img/collection/soap.jpg')] bg-cover bg-center p-4 relative group hover:scale-105 cursor-pointer transition md:h-screen h-96"
        >
        <div class="py-96">
          <h2 class="text-6xl font-semibold mt-2 text-white">Body wash</h2>
          <p class="text-gray-600 hidden group-hover:block mt-2">Some text here.</p>
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded mt-2 hidden group-hover:block"
          >
            Learn More
          </button>
        </div>
        </div>

        <div
          class="collection bg-[url('@/assets/img/collection/unisex.jpg')] bg-cover bg-center p-4 relative group hover:scale-105 cursor-pointer transition md:h-screen h-96"
        >
        <div class="py-96 mx-auto">
          <h2 class="text-6xl font-semibold mt-2 text-white">Body wash</h2>
          <p class="text-gray-600 hidden group-hover:block mt-2">Some text here.</p>
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded mt-2 hidden group-hover:block"
          >
            Learn More
          </button>
        </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.collection{
  background-color: rgba(255, 255, 255, 0.8);
}
</style>