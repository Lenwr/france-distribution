<template>
  <div class="container flex justify-center ">
    <div class="main flex  w-[70%]">
      <button  @click="changeStatutCommande" class="btn btn-primary grid h-20 flex-grow card my-4 text-white rounded-box place-items-center shadow-2xl ">
       Commande
      </button> <div class="divider divider-horizontal">    </div>
      <button  @click="changeStatutStock" class="btn btn-primary grid h-20 flex-grow card my-4 text-white rounded-box place-items-center shadow-2xl ">
    Stock
      </button>
    </div>
  </div>
  <div v-if="viewPage=='commande'" >
    <Order />
  </div>
  <div v-if="viewPage=='stock'"  >
    <Stock />
  </div>
</template>

<script setup>
     import {ref} from "vue";
     import Order from "./Order.vue";
     import "vue3-toastify/dist/index.css";
     import Stock from "./Stock.vue";
     import {useRoute} from "vue-router";
     const viewPage = ref('commande')
     const route = useRoute()
     const changeStatutCommande = () => {
       viewPage.value = 'commande'
       console.log(viewPage.value)
     }
     const changeStatutStock = () => {
        viewPage.value = 'stock'
       console.log(viewPage.value)
     }
     const category = ref(route.params.category)
     console.log()


</script>

<style scoped>

</style>