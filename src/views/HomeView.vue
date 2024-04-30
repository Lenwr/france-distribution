<script setup>
import {category} from "../models.js";
</script>

<template>
  <div class="flex flex-col items-center  justify-center">

    <div
        class="bg-primary mobile:w-[80%] sm:w-[50%] py-6 my-2 rounded-2xl shadow-2xl"
    >
      <p class="text-white text-center "> Gestion </p>

    </div>

    <!-- gestion stock  -->

    <div class="bg-[#F2F3F4] mobile:w-[90%] shadow-2xl  w-[40%] py-6 my-2 rounded-xl">
      <div class="mx-2 flex flex-row items-center justify-around py-4">
        <router-link
            class="text-black bg-white shadow-2xl text-center w-[60%] py-6 rounded-xl"
            to="/form"
        >
          <p>Mes commandes</p>
        </router-link>
        <img src="/images/panier.jpeg" alt="" class="w-[25%] rounded-xl" />
      </div>
      <div class="mx-2 flex flex-row items-center justify-around py-4">
        <router-link
            class="text-black bg-white shadow-2xl text-center w-[60%] py-6 rounded-xl"
            to="/liste"
        >
          <p>Stock</p>
        </router-link>
        <img src="/images/stock.png" alt="" class="w-[25%]" />
      </div>
    </div>

  </div>



</template>

<style scoped></style>
