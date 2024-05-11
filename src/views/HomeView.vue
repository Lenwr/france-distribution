<script setup>
import {category} from "../models.js";
import {ref} from "vue";
import router from "../router/index.js";
import SelectArticle from "../components/selectArticle.vue";

const dataToPass = ref('')

async function toGestion(variable) {
  await router.push({
    path: '/gestion',
    params: {
      variableName: variable
    }
  });
  console.log(dataToPass.value)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">

    <div
        class="bg-primary mobile:w-[80%] sm:w-[50%] py-6 mt-20 rounded-2xl shadow-2xl"
    >
      <p class="text-white text-center "> Gestion </p>

    </div>
    <div class="mt-10">
      <select-article />
    </div>


    <!-- gestion stock  -->
    <!--

    <div class="bg-[#F2F3F4] mobile:w-[90%] shadow-2xl  w-[40%] py-6 my-2 rounded-xl">

      <div class="mx-2 flex flex-row items-center justify-center py-4">
        <div class="fex flex-col text-black w-[50%]"><p>Commande</p>
          <div class="flex flex-row items-center justify-around">
            <select
                id="modeDePaiement"
                name="modeDePaiement"
                v-model="dataToPass"
                autocomplete="modeDePaiement"
                class="text-black bg-white shadow-2xl text-center w-[60%] py-6 rounded-xl">
              <option
                  v-for="item in category"
              >{{ item }}
              </option>
            </select>
            <svg @click="toGestion(dataToPass)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-white bg-primary p-2 rounded-2xl">
              <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"/>
            </svg>
          </div>
        </div>
        <img src="/images/panier.jpeg" alt="" class="w-[25%] rounded-xl"/>
      </div>
      <div class="mx-2 flex flex-row items-center justify-around py-4">
        <router-link
            class="text-black bg-white shadow-2xl text-center w-[60%] py-6 rounded-xl"
            to="/liste"
        >
          <p>Stock</p>
        </router-link>
        <img src="/images/stock.png" alt="" class="w-[25%]"/>
      </div>
    </div>
    -->

  </div>


</template>

<style scoped></style>
