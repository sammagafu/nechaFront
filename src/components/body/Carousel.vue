<template>
    <Carousel :autoplay="3800" :wrap-around="true">
      <Slide v-for="slide in slider" :key="slide">
        <div class="relative">
            <div class="carousel__item"><img :src="slide.imageSrc" alt="Object Image" /></div>
            <h1 class="absolute text-8xl text-pink-pink-dark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">{{ slide.title }}</h1>
        </div>
        <!-- {{ slide.title }} -->
        <div class="">
            <h3></h3>
        </div>
      </Slide>
  
      <!-- <template #addons>
        <Pagination />
      </template> -->
    </Carousel>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { Carousel, Pagination, Slide } from 'vue3-carousel'
  import 'vue3-carousel/dist/carousel.css'

  import slide1 from "@/assets/img/slider/1.jpg"
  import slide2 from "@/assets/img/slider/2.jpg"
  import slide3 from "@/assets/img/slider/3.jpg"


  
  export default defineComponent({
    name: 'Autoplay',
    data() {
  return {
    slider : [
        {
        imageSrc: slide1,
        title: 'Pure Bliss for Your Skin',
        caption: 'Object Caption',
      },
      {
        imageSrc: slide2,
        title: 'Silky Smooth Hydration',
        caption: 'Object Caption',
      },
      {
        imageSrc: slide3,
        title: 'Youthful Radiance Unleashed',
        caption: 'Object Caption',
      },
      ]
    };
    } ,
    components: {
      Carousel,
      Slide,
      Pagination,
    },
  })
  </script>
  