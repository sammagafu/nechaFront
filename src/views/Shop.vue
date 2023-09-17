<template>
  <section class="bg-gray-100 lg:pt-28 sm:pb-36 pb-16 pt-36 relative">
    <div class="container mx-auto">
      <div class="flex justify-center">
        <div class="lg:w-7/12 text-center">
          <h1 class="text-5xl/relaxed text-gray-700">Shop</h1>
          <p class="mb-6 md:text-lg text-gray-500">
            Please fill out the following form and we will get back to you shortly
          </p>
        </div>
      </div>
    </div>
    <div class="absolute -bottom-1 w-full">
      <svg
        class="w-full h-full"
        viewBox="0 0 1440 40"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g id="shape-b" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="curve" fill="#fff">
            <path
              d="M0,30.013 C239.659,10.004 479.143,0 718.453,0 C957.763,0 1198.28,10.004 1440,30.013 L1440,40 L0,40 L0,30.013 Z"
              id="Path"
            ></path>
          </g>
        </g>
      </svg>
    </div>
  </section>

  <section class="container mx-auto">
    <div class="py-24">
      <div class="container">
        <div class="flex flex-wrap flex-col lg:flex-row -mx-4">
          <div class="lg:w-1/4 px-4 order-last lg:order-first mt-8 lg:mt-0">
          <FilterMenu></FilterMenu>
          </div>

          <div id="shoptab" class="flex-1">
            <div class="flex flex-wrap justify-between items-center px-4">
              <div class="flex flex-wrap">
                <div class="shop-select flex mr-12">
                  <label for="SortBy">Sort by :</label>
                  <select id="SortBy" class="px-2 bg-transparent">
                    <option value="manual">Featured</option>
                    <option value="best-selling">Best Selling</option>
                    <option value="title-ascending">Alphabetically, A-Z</option>
                    <option value="title-descending">Alphabetically, Z-A</option>
                    <option value="price-ascending">Price, low to high</option>
                    <option value="price-descending">Price, high to low</option>
                    <option value="created-descending">Date, new to old</option>
                    <option value="created-ascending">Date, old to new</option>
                  </select>
                </div>
                <p class="my-2 sm:my-0">Showing 1 - 9 of 9 result</p>
              </div>
              <div>
                <span>Show :</span>
                <select class="bg-transparent">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div>
                <ul class="shop-tab-nav flex flex-wrap">
                  <li class="active">
                    <a
                      href="#grid"
                      class="text-base hover:text-orange inline-block py-2 px-2"
                      ><i class="icon-grid"></i
                    ></a>
                  </li>
                  <li class="">
                    <a
                      href="#list"
                      class="text-base hover:text-orange inline-block py-2 px-2 ml-5"
                      ><i class="icon-menu"></i
                    ></a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-10">
              <div id="grid" class="shop-tab-content" style="">
                <div class="flex flex-wrap -mb-7 -px-4">
                  <div
                    class="w-full md:w-1/2 xl:w-1/3 px-4 mb-7"
                    v-for="product in 9"
                    :key="product"
                  >
                                    <div class="border border-solid border-gray-300 transition-all hover:shadow-product group relative">
                                        <div class="relative overflow-hidden">
                                            <span class="font-medium uppercase text-sm text-black inline-block py-1 px-2 leading-none absolute top-3 right-3">Sale</span>
                                            <span class="font-medium uppercase text-sm text-black inline-block py-1 px-2 leading-none absolute top-10 right-3">-11%</span>
                                            <img class="w-full h-full" src="@/assets/img/product/1.jpg" alt="product image" loading="lazy" width="432" height="480">
                                            <!-- actions start -->

                                            <div class="absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-10">
                                                <ul
                            class="flex items-center justify-center bg-white shadow rounded-full h-0 transition-all group-hover:h-16 duration-500 overflow-hidden"
                          >
                            <li class="py-4 pl-7 md:py-5 md:pl-8 text-pink-dark">
                              <a
                                href="#modal-cart"
                                class="text-dark flex items-center justify-center text-md hover:text-orange modal-toggle"
                                aria-label="quick view"
                                data-tippy-content="Quick View"
                              >
                                <i class="pi pi-search" style="font-size: 1.4rem"></i>
                              </a>
                            </li>
                            <li class="py-4 pl-7 md:py-5 md:pl-8 text-pink-dark">
                              <a
                                href="whishlist.html"
                                class="text-dark flex items-center justify-center text-md hover:text-orange"
                                aria-label="quick veiw"
                                data-tippy-content="Add to wishlist"
                              >
                                <i class="pi pi-heart" style="font-size: 1.4rem"></i>
                              </a>
                            </li>
                            <!-- <li class="py-4 pl-7 md:py-5 md:pl-8 text-pink-dark">
                              <a
                                href="compare.html"
                                class="text-dark flex items-center justify-center text-md hover:text-orange"
                                aria-label="compare"
                                data-tippy-content="Compare"
                              >
                                <i class="pi pi-heart" style="font-size: 1.4rem"></i>
                              </a>
                            </li> -->
                            <li
                              class="py-4 pl-7 pr-7 md:py-5 md:pl-8 md:pr-8 text-pink-dark"
                            >
                              <a
                                href="#modal-addto-cart"
                                class="text-dark flex items-center justify-center text-md hover:text-orange modal-toggle"
                                aria-label="add to cart"
                                data-tippy-content="Add to cart"
                              >
                                <i
                                  class="pi pi-shopping-bag"
                                  style="font-size: 1.4rem"
                                ></i>
                              </a>
                            </li>
                          </ul>
                                            </div>
                                        </div>

                                        <div class="py-5 px-4">
                                            <h4><a class="block text-base hover:text-orange transition-all" href="#">Batin crofessor pampden</a></h4>
                                            <h5 class="font-bold text-md leading-none text-orange mt-3"><del class="font-normal text-sm mr-1 inline-block">$110.00</del>$130.00</h5>
                                        </div>
                                    </div>

                                </div>
                  </div>
                </div>
            </div>

            <!-- <div class="mt-12">
              <ul class="pagination flex flex-wrap items-center justify-center">
                <li class="mx-2">
                  <a
                    class="flex flex-wrap items-center justify-center w-11 h-11 bg-white shadow text-orange leading-none transition-all hover:bg-orange hover:text-white"
                    href="#"
                  >
                    <i class="icon-arrow-left"></i>
                  </a>
                </li>

                <li class="mx-2">
                  <a
                    class="flex flex-wrap items-center justify-center w-11 h-11 bg-white shadow text-orange leading-none transition-all hover:bg-orange hover:text-white active"
                    href="#"
                    >1</a
                  >
                </li>
                <li class="mx-2">
                  <a
                    class="flex flex-wrap items-center justify-center w-11 h-11 bg-white shadow text-orange leading-none transition-all hover:bg-orange hover:text-white"
                    href="#"
                    >2</a
                  >
                </li>
                <li class="mx-2">
                  <a
                    class="flex flex-wrap items-center justify-center w-11 h-11 bg-white shadow text-orange leading-none transition-all hover:bg-orange hover:text-white"
                    href="#"
                    >3</a
                  >
                </li>
                <li class="mx-2">
                  <a
                    class="flex flex-wrap items-center justify-center w-11 h-11 bg-white shadow text-orange leading-none transition-all hover:bg-orange hover:text-white"
                    href="#"
                  >
                    <i class="icon-arrow-right"></i>
                  </a>
                </li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import FilterMenu from "@/components/body/FilterMenu.vue";
</script>
