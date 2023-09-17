
<template>
    <section class="bg-gray-100 lg:pt-28 sm:pb-36 pb-16 pt-36 relative">
        <div class="">
            <div class="grid grid-cols-1">
                <div class="text-center">
                    <h1 class="text-5xl/relaxed text-pink-dark font-bold">Blog</h1>
                    <Breadcrumbs>
                    <li><a href="">Home</a></li>
                    <li><a href="">Home</a></li>
                    </Breadcrumbs>
                    <p class="mb-6 md:text-lg text-gray-500">Please fill out the following form and we will get back to you
                        shortly</p>
                </div>
            </div>
        </div>
        <div class="absolute -bottom-1 w-full">
            <svg class="w-full h-full" viewBox="0 0 1440 40" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="shape-b" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="curve" fill="#fff">
                        <path
                            d="M0,30.013 C239.659,10.004 479.143,0 718.453,0 C957.763,0 1198.28,10.004 1440,30.013 L1440,40 L0,40 L0,30.013 Z"
                            id="Path"></path>
                    </g>
                </g>
            </svg>
        </div>
    </section>

    <!-- blog start here -->
    <section class="md:pt-[185px] pt-[120px] pb-[100px] md:pb-[160px] relative" id="blog">
        <div class="container mx-auto relative z-10">
            <div class="grid grid-cols-1">
                <div class="text-center max-w-[680px] mx-auto">
                    <p class="text-custom text-[20px] md:text-2xl font-medium font-secondary text-pink-dark">From My Blog</p>
                    <h3 class="md:text-[48px] text-[35px] leading-[1.25] mb-[23px] mt-1.5">Our Recent Updates, Blog, Tips,
                        Tricks &amp; More</h3>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-[65px] gap-[25px]">
                <div class="wow fadeInUp cursor-pointer" data-wow-duration="1s"
                    style="visibility: visible; animation-duration: 1s; animation-name: fadeInUp;" v-for="product in 3"
              :key="product"> 
                    <div onclick="toggleModal('modal-id-blog')">
                        <div class="overflow-hidden group rounded-xl relative">
                            <img src="@/assets/img/product/1.jpg"
                                class="scale-100 rounded-xl object-cover w-full h-full min-h-[303px] duration-300 group-hover:scale-110"
                                alt="">
                            <div
                                class="bg-pink-dark top-[18px] right-[18px] z-20 inline-block absolute rounded-xl text-center py-3 px-5">
                                <h3 class="text-2xl text-white leading-[1.2]">23</h3>
                                <span class="text-white text-sm">Dec</span>
                            </div>
                        </div>
                        <div class="mt-5">
                            <p class="text-custom font-medium font-secondary"><a href="#">Web Development</a></p>
                            <h4 class="mt-1 leading-[1.4] text-[21px]"><a href="#" class="hover:text-custom">Jim Morisson
                                    Says when the musics over turn off the light</a></h4>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</section>
<!-- blog ends here -->
</template>


<script setup>
import Breadcrumbs from "@/components/headers/Breadcrumbs.vue";
import { ref } from "vue";

</script>

//