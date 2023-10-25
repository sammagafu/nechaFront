<template>
  <div class="border border-solid border-gray-300 transition-all hover:shadow-product group relative">
    <div class="relative overflow-hidden">
      <span
        class="font-medium uppercase text-sm text-black inline-block py-1 px-2 leading-none absolute top-3 right-3">Sale</span>
      <span
        class="font-medium uppercase text-sm text-black inline-block py-1 px-2 leading-none absolute top-10 right-3">-11%</span>
      <img class="w-full h-full" :src="cover" alt="product image" loading="lazy" width="432"
        height="480">
      <!-- actions start -->

      <div class="absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-10">
        <ul
          class="flex items-center justify-center bg-white shadow rounded-full h-0 transition-all group-hover:h-16 duration-500 overflow-hidden">
          <li class="py-4 pl-7 md:py-5 md:pl-8 text-pink-dark">
            <a href="#modal-cart"
              class="text-dark flex items-center justify-center text-md hover:text-orange modal-toggle"
              aria-label="quick view" data-tippy-content="Quick View">
              <i class="pi pi-search" style="font-size: 1.4rem"></i>
            </a>
          </li>
          <li class="py-4 pl-7 md:py-5 md:pl-8 text-pink-dark">
            <a href="whishlist.html" class="text-dark flex items-center justify-center text-md hover:text-orange"
              aria-label="quick veiw" data-tippy-content="Add to wishlist">
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
          <li class="py-4 pl-7 pr-7 md:py-5 md:pl-8 md:pr-8 text-pink-dark">
            <a href="#modal-addto-cart"
              class="text-dark flex items-center justify-center text-md hover:text-orange modal-toggle"
              aria-label="add to cart" data-tippy-content="Add to cart">
              <i class="pi pi-shopping-bag" style="font-size: 1.4rem"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="py-5 px-4">
      <h4><router-link class="block text-base hover:text-orange transition-all" :to="{ name: 'shopDetail', params: { slug: slug } }">{{ name }}</router-link></h4>
      <h5 class="font-bold text-md leading-none text-orange mt-3">{{price}}</h5>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "Product Name",
    },
    slug: {
      type: String,
      default: "Product Name",
    },
    cover: {
      type: String,
    },
    productCategory: {
      type: String,
      default: "General Category",
    },
    price: {
      type: Number,
      default: 0,
    },
    details: {
      type: String,
      default: "Product details will be added soon.",
    },
  },
  data() {
    return {
      liked: false,
      zoomed: false,
    };
  },
  methods: {
    addToCart() {
      // Implement the logic to add the product to the shopping cart.
    },
    toggleLike() {
      this.liked = !this.liked;
    },
    toggleZoom() {
      this.zoomed = !this.zoomed;
    },
  },
};
</script>