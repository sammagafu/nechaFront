import { defineStore } from "pinia";
import { ref } from "vue";

export const localizationStore = defineStore('localization',()=>{
    const curreny = ref('TZS')
    const language = ref('English')

    return  { curreny, language}
})