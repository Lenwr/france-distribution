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
  <div>
    <Order :Statut="statut" />
  </div>
</template>

<script setup>
     import {ref} from "vue";
     import Order from "./Order.vue";

     const statut = ref('')
     const changeStatutCommande = () => {
       statut.value = 'commande'
     }
     const changeStatutStock = () => {
statut.value = 'stock'
     }



</script>

<style scoped>

</style>