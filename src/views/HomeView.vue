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
              v-for="product in 4" :key="product">
              <a href="#">
                <img src="@/assets/img/product/1.jpg" alt="Product" class="h-100 w-full object-cover" />
                <div class="px-4 py-3 w-72">
                  <span class="text-indigo-600 mr-3 uppercase text-xs">Lotion</span>
                  <p class="text-lg font-semibold text-indigo-900 truncate block uppercase">
                    Lemon Grass Body butter
                  </p>
                  <div class="flex items-center">
                    <p class="text-lg font-semibold text-black cursor-auto my-3">$149</p>
                    <del>
                      <p class="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                    </del>
                    <div class="ml-auto flex justify-between space-x-3">
                      <router-link :to="{ name: '' }"><i class="pi pi-shopping-bag"
                          style="font-size: 1.5rem"></i></router-link>
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

    <section>
      <div
        class="mb-12 md:mb-14 xl:mb-16 bg-gray-200 feature-block-wrapper border border-gray-300 rounded-md w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 md:gap-12 xl:gap-0 overflow-hidden py-12 xl:py-0 sm:px-4 md:px-8 lg:px-16 xl:px-0">
        <div
          class="text-center border-gray-300 xl:border-l xl:first:border-s-0 px-4 sm:px-2.5 2xl:px-8 3xl:px-12 xl:py-12">
          <div class="mb-3.5 md:mb-5 xl:mb-3.5 2xl:mb-5 w-14 md:w-auto mx-auto">
           
            
          </div>
          <div class="-mb-1">
            <h3 class="text-heading text-base md:text-lg font-semibold mb-1.5 md:mb-2">Guaranteed Savings</h3>
            <p class="text-body text-xs md:text-sm leading-6 md:leading-7">If you don’t make your membership fee in
              savings, we’ll refund the difference</p>
          </div>
        </div>
        <div
          class="text-center border-gray-300 xl:border-l xl:first:border-s-0 px-4 sm:px-2.5 2xl:px-8 3xl:px-12 xl:py-12">

          <div class="-mb-1">
            <h3 class="text-heading text-base md:text-lg font-semibold mb-1.5 md:mb-2">Try it risk-free</h3>
            <p class="text-body text-xs md:text-sm leading-6 md:leading-7">If you don’t make your membership fee in
              savings, we’ll refund the difference</p>
          </div>
        </div>
        <div
          class="text-center border-gray-300 xl:border-l xl:first:border-s-0 px-4 sm:px-2.5 2xl:px-8 3xl:px-12 xl:py-12">

          <div class="-mb-1">
            <h3 class="text-heading text-base md:text-lg font-semibold mb-1.5 md:mb-2">Super Fast Delivery</h3>
            <p class="text-body text-xs md:text-sm leading-6 md:leading-7">If you don’t make your membership fee in
              savings, we’ll refund the difference</p>
          </div>
        </div>
        <div
          class="text-center border-gray-300 xl:border-l xl:first:border-s-0 px-4 sm:px-2.5 2xl:px-8 3xl:px-12 xl:py-12">
          <div class="mb-3.5 md:mb-5 xl:mb-3.5 2xl:mb-5 w-14 md:w-auto mx-auto">
            <span
              style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;">
              <span
                style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;">
                <img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20
											xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2778%27%20height=%2778%27/%3e"
                  style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;">
              </span>
              <img alt="1000+ products priced at cost" src="/assets/images/feature/product.svg" decoding="async"
                data-nimg="intrinsic"
                style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
                srcset="/assets/images/feature/product.svg 1x, /assets/images/feature/product.svg 2x">
              <noscript></noscript>
            </span>
          </div>
          <div class="-mb-1">
            <h3 class="text-heading text-base md:text-lg font-semibold mb-1.5 md:mb-2">1000+ products priced at cost</h3>
            <p class="text-body text-xs md:text-sm leading-6 md:leading-7">If you don’t make your membership fee in
              savings, we’ll refund the difference</p>
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
          <p class="py-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio aperiam deserunt a! Velit,
            eaque dicta! Corporis, ipsam doloribus minima veritatis tenetur quisquam nostrum recusandae, culpa quos atque
            modi eligendi qui.</p>
        </div>
      </div>
      <section class="pt-24 pb-24">
        <div class="container mx-auto">
          <div class="flex items-center -mx-4 flex-wrap">

            <div class="w-full md:w-1/2 px-4">
              <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
              <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal
                Travel Bag<br> For Travel Lover</h2>

              <hr class="w-16 h-1 bg-orange mb-7 border-0">
              <p class="font-normal text-primary text-base xl:text-md">
                When an unknown printer took a galley of type and scrambled it to
                make a type specimen book. sint occaeca Excepteur sint occaecat
                cupidatat non proident.
              </p>
              <a href="single-product.html"
                class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy
                Now</a>
            </div>

            <div class="w-full md:w-1/2 px-4">
              <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/allcolors.jpg" alt="product image"
                loading="lazy" width="570" height="602">
            </div>
          </div>
        </div>
      </section>
      <section class="pt-24 pb-24">
        <div class="container mx-auto">
          <div class="flex items-center -mx-4 flex-wrap flex-row-reverse">

            <div class="w-full md:w-1/2 px-4">
              <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
              <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal
                Travel Bag<br> For Travel Lover</h2>

              <hr class="w-16 h-1 bg-orange mb-7 border-0">
              <p class="font-normal text-primary text-base xl:text-md">
                When an unknown printer took a galley of type and scrambled it to
                make a type specimen book. sint occaeca Excepteur sint occaecat
                cupidatat non proident.
              </p>
              <a href="single-product.html"
                class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy
                Now</a>
            </div>

            <div class="w-full md:w-1/2 px-4">
              <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/men.jpg" alt="product image"
                loading="lazy" width="570" height="602">
            </div>
          </div>
        </div>
      </section>
      <section class="pt-24 pb-24">
        <div class="container mx-auto">
          <div class="flex items-center -mx-4 flex-wrap">

            <div class="w-full md:w-1/2 px-4">
              <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
              <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal
                Travel Bag<br> For Travel Lover</h2>

              <hr class="w-16 h-1 bg-orange mb-7 border-0">
              <p class="font-normal text-primary text-base xl:text-md">
                When an unknown printer took a galley of type and scrambled it to
                make a type specimen book. sint occaeca Excepteur sint occaecat
                cupidatat non proident.
              </p>
              <a href="single-product.html"
              class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy
              Now</a>
          </div>

          <div class="w-full md:w-1/2 px-4">
            <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/female.jpg" alt="product image"
              loading="lazy" width="570" height="602">
          </div>
        </div>
      </div>
    </section>
    <section class="pt-24 pb-24">
      <div class="container mx-auto">
        <div class="flex items-center -mx-4 flex-wrap flex-row-reverse">

          <div class="w-full md:w-1/2 px-4">
            <span class="text-md font-medium text-pink-dark block mb-4">#FEATURED PRODUCT</span>
            <h2 class="font-bold text-pink-dark text-[30px] sm:text-[36px] xl:text-[48px] leading-tight mb-5">Minimal
              Travel Bag<br> For Travel Lover</h2>

            <hr class="w-16 h-1 bg-orange mb-7 border-0">
            <p class="font-normal text-primary text-base xl:text-md">
              When an unknown printer took a galley of type and scrambled it to
              make a type specimen book. sint occaeca Excepteur sint occaecat
              cupidatat non proident.
            </p>
            <a href="single-product.html"
              class="bg-pink-dark text-pink-light transition-all hover:bg-orange hover:text-pink-default px-5 md:px-12 py-3 md:py-4 xl:py-4 rounded-full text-orange capitalize font-medium text-sm lg:text-md inline-block mt-8 leading-normal">Buy
              Now</a>
          </div>

          <div class="w-full md:w-1/2 px-4">
            <img class="mt-8 md:mt-0 w-full h-full" src="@/assets/img/collection/soap.jpg" alt="product image"
              loading="lazy" width="570" height="602">
          </div>
        </div>
      </div>
    </section>
  </section>
</div></template>