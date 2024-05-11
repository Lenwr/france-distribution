<script setup>

import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="bg-white pb-[10%]">
    <Navbar />
    <div class="min-h-screen" >
      <RouterView/>
    </div>
    <Footer />
  </div>
</template>

<style scoped>

</style>