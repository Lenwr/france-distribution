<script setup>

import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="h-screen bg-white">
    <Navbar />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped>

</style>