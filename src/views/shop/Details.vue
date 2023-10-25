<template>
    <div class="py-9 bg-gray-light">
        <div class="container">
            <!-- bredrums  -->
        </div>
    </div>
    <div class="py-24">

<div class="container mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="">
            <img :src="product.cover" alt="">
        </div>
        <div>
            <h3 class="font-medium text-lg capitalize">{{product.name}}</h3>
            <h5 class="font-bold text-md leading-none text-orange my-3">{{ product.price}}</h5>
            <div class="mb-3">Vendor:<span> Vendor 3 </span></div>
            <!-- <div class="mb-3">{{ product.category }}</div> -->
            <!-- <div class="mb-3"><span>Availability:</span> <span class="font-semibold">9 left in stock</span></div> -->
            <p class="mb-8">{{ product.description }}</p>

            <div>

                <div class="mb-8">
                    <div class="flex flex-wrap items-center mt-8">
                        <div class="flex count border border-solid border-gray-300 p-2 h-11">
                            <button class="decrement flex-auto w-5 leading-none" aria-label="button">-</button>
                            <input type="number" min="1" max="100" step="1" value="1" class="quantity__input flex-auto w-8 text-center focus:outline-none input-appearance-none">
                            <button class="increment flex-auto w-5 leading-none" aria-label="button">+</button>
                        </div>
                        <div class="ml-2 sm:ml-8">
                            <button class="bg-black leading-none py-4 px-5 md:px-8 font-normal text-sm h-11 text-white transition-all hover:bg-orange">Add to Cart</button>
                        </div>
                        <a href="#" class="text-md ml-8"><i class="icon-heart"></i></a>
                        <a href="#" class="text-md ml-8"><i class="icon-refresh"></i></a>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-start mb-8">
                    <a href="#" class="text-md text-facebook hover:text-dark mr-10 leading-none transition relative before:absolute before:top-1/2  before:-translate-y-1/2 before:left-7 before:empty before:bg-gray-900 before:w-4 before:h-1px"><i class="icon-social-facebook"></i></a>
                    <a href="#" class="text-md text-twitter hover:text-dark mr-10 leading-none transition relative before:absolute before:top-1/2  before:-translate-y-1/2 before:left-7 before:empty before:bg-gray-900 before:w-4 before:h-1px"><i class="icon-social-twitter"></i></a>
                    <a href="#" class="text-md text-dribbble hover:text-dark mr-10 leading-none transition relative before:absolute before:top-1/2  before:-translate-y-1/2 before:left-7 before:empty before:bg-gray-900 before:w-4 before:h-1px"><i class="icon-social-instagram"></i></a>
                    <a href="#" class="text-md text-pinterest hover:text-dark leading-none transition"><i class="icon-social-youtube"></i></a>
                    <div>
                    </div>
                </div>
<!-- 
                <div class="flex flex-wrap">
                    <a href="#" class="mr-2"><img src="assets/images/payment/amazon.svg" alt="payment icon"></a>
                    <a href="#" class="mr-2"><img src="assets/images/payment/apple-pay.svg" alt="payment icon"></a>
                    <a href="#" class="mr-2"><img src="assets/images/payment/bitcoin.svg" alt="payment icon"></a>
                    <a href="#" class="mr-2"><img src="assets/images/payment/google-pay.svg" alt="payment icon"></a>
                    <a href="#" class="mr-2"><img src="assets/images/payment/paypal.svg" alt="payment icon"></a>
                    <a href="#" class="mr-2"><img src="assets/images/payment/visa.svg" alt="payment icon"></a>
                </div> -->

            </div>

        </div>
    </div>
</div>

</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from "@/http";
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

// router link data 
const route = useRoute();
const slug = ref(null);

const product = ref([]);
onMounted(async () => {
    slug.value = route.params.slug;
    try {
        const response = await axiosInstance.get(`/product/${slug.value}`);
        product.value = response.data;
        console.log('response :>> ', response);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
</script>