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

    <section class="collection py-32 bg-purple-100">
      <div class="container mx-auto">
        <div class="text-center font-bold text-pink-dark">
          <h1 class="font-bold text-6xl">Our Collections</h1>
          <p class="py-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio aperiam deserunt a! Velit, eaque dicta! Corporis, ipsam doloribus minima veritatis tenetur quisquam nostrum recusandae, culpa quos atque modi eligendi qui.</p>
        </div>
      </div>
      <section class="pt-24 pb-24">
        <div class="container mx-auto">
            <div class="flex items-center -mx-4 flex-wrap">

              <div class="w-full md:w-1/2 px-4">
                    <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
                    <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal Travel Bag<br> For Travel Lover</h2>

                    <hr class="w-16 h-1 bg-orange mb-7 border-0">
                    <p class="font-normal text-primary text-base xl:text-md">
                        When an unknown printer took a galley of type and scrambled it to
                        make a type specimen book. sint occaeca Excepteur sint occaecat
                        cupidatat non proident.
                    </p>
                    <a href="single-product.html" class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy Now</a>
                </div>

                <div class="w-full md:w-1/2 px-4">
                    <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/allcolors.jpg" alt="product image" loading="lazy" width="570" height="602">
                </div>
            </div>
        </div>
    </section>
    <section class="pt-24 pb-24">
        <div class="container mx-auto">
            <div class="flex items-center -mx-4 flex-wrap flex-row-reverse">

              <div class="w-full md:w-1/2 px-4">
                    <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
                    <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal Travel Bag<br> For Travel Lover</h2>

                    <hr class="w-16 h-1 bg-orange mb-7 border-0">
                    <p class="font-normal text-primary text-base xl:text-md">
                        When an unknown printer took a galley of type and scrambled it to
                        make a type specimen book. sint occaeca Excepteur sint occaecat
                        cupidatat non proident.
                    </p>
                    <a href="single-product.html" class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy Now</a>
                </div>

                <div class="w-full md:w-1/2 px-4">
                    <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/men.jpg" alt="product image" loading="lazy" width="570" height="602">
                </div>
            </div>
        </div>
    </section>
    <section class="pt-24 pb-24">
        <div class="container mx-auto">
            <div class="flex items-center -mx-4 flex-wrap">

              <div class="w-full md:w-1/2 px-4">
                    <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
                    <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal Travel Bag<br> For Travel Lover</h2>

                    <hr class="w-16 h-1 bg-orange mb-7 border-0">
                    <p class="font-normal text-primary text-base xl:text-md">
                        When an unknown printer took a galley of type and scrambled it to
                        make a type specimen book. sint occaeca Excepteur sint occaecat
                        cupidatat non proident.
                    </p>
                    <a href="single-product.html" class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy Now</a>
                </div>

                <div class="w-full md:w-1/2 px-4">
                    <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/female.jpg" alt="product image" loading="lazy" width="570" height="602">
                </div>
            </div>
        </div>
    </section>
    <section class="pt-24 pb-24">
        <div class="container mx-auto">
            <div class="flex items-center -mx-4 flex-wrap flex-row-reverse">

                <div class="w-full md:w-1/2 px-4">
                    <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
                    <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal Travel Bag<br> For Travel Lover</h2>

                    <hr class="w-16 h-1 bg-orange mb-7 border-0">
                    <p class="font-normal text-primary text-base xl:text-md">
                        When an unknown printer took a galley of type and scrambled it to
                        make a type specimen book. sint occaeca Excepteur sint occaecat
                        cupidatat non proident.
                    </p>
                    <a href="single-product.html" class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy Now</a>
                </div>

                <div class="w-full md:w-1/2 px-4">
                    <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/soap.jpg" alt="product image" loading="lazy" width="570" height="602">
                </div>
            </div>
        </div>
    </section>
    </section>
  </div>
</template>