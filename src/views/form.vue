<script setup>
import {getFirestore, collection, addDoc , getDocs } from 'firebase/firestore'
import "vue3-toastify/dist/index.css";

import {ref} from 'vue'

import {category} from "../models.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import {toast} from "vue3-toastify";


const commande = ref({
  date:'',
  name: '',
  quantity: '',
  price: '',
  category: [],
  brand:"",
  image: null,
})

const db = getFirestore()
const  commandeCollection = collection(db, 'commande')
const storage = getStorage()


const handleFileChange = (event) => {
  commande.image = event.target.files[0]
}
async function submitForm() {
  try {
    // Téléchargez l'image vers Firebase Storage
    const imageRef = storageRef(
        storage,
        `commandes_images/${Date.now()}_${commande.image}`,
    )
    await uploadBytes(imageRef, commande.image)
    // Obtenez l'URL de téléchargement de l'image
    const imageUrl = await getDownloadURL(imageRef)
    // Créez un document dans Firestore avec les données du formulaire
    const Data = {
      date: commande.value.date,
      name: commande.value.name,
      quantity: commande.value.quantity,
      price: commande.value.price,
      category: commande.value.category,
      brand: commande.value.brand,
      imageUrl: imageUrl, // Stockez l'URL de l'image dans Firestore
    }
    const newDocumentRef = await addDoc(commandeCollection, Data)
    commande.value.name = "",
      commande.value.quantity = "",
         commande.value.price="",
      commande.value.category = [],
        await console.log('formulaire envoyé ')
    toast("Formulaire envoyé", {
      "theme": "auto",
      "type": "success",
      "autoClose":1000,
      "dangerouslyHTMLString": true
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire :", error)
  }
}



</script>

<template>
  <div
      class=" bg-white flex flex-1 flex-col item-center justify-center px-6 py-12 lg:px-8 "
  >

    <H1 class="text-black text-2xl pb-4"> Commander un article </H1>

    <form class="space-y-6 mb-10" @submit.prevent="submitForm">

      <div class="date mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label
              for="date"
              class="block text-sm font-medium leading-6 text-gray-900"
          >
            Date
          </label>
          <div class="mt-2">
            <input
                required
                type="datetime-local"
                name="date"
                v-model="commande.date"
                id="date"
                autocomplete="given-name"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

    <div class="name pb-2">
      <label
          for="prix"
          class="block text-sm font-medium leading-6 text-gray-900"
      >
       Nom
      </label>
      <div class="mt-2">
        <input
            type="text"
            v-model="commande.name"
            autocomplete=""
            class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
            placeholder="Nom du commande"
        />
      </div>
    </div>
      <div class="name pb-2">
        <label
            for="marque"
            class="block text-sm font-medium leading-6 text-gray-900"
        >
          Marque
        </label>
        <div class="mt-2">
          <input
              type="text"

              v-model="commande.brand"
              class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
              placeholder="Marque du commande"
          />
        </div>
      </div>
    <div class="quantity pb-2">
      <label
          for="quantity"
          class="block text-sm font-medium leading-6 text-gray-900"
      >
        Quantité
      </label>
      <div class="mt-2">
        <input
            type="text"
            id="prix"
            name="prix"
            v-model="commande.quantity"
            class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
            placeholder="Quantité"
        />
      </div>
    </div>
    <div class="price pb-2">
      <label
          for="price"
          class="block text-sm font-medium leading-6 text-gray-900"
      >
        Prix
      </label>
      <div class="mt-2">
        <input
            type="text"
            id="prix"
            name="prix"
            v-model="commande.price"
            class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
            placeholder="Prix"
        />
      </div>
    </div>
    <div class="image pb-2">
      <label
          for="image"
          class="block text-sm font-medium leading-6 text-gray-900"
      >
        Image
      </label>
      <div class="mt-2">
        <input
            required
            type="file"
            id="image"
            @change="handleFileChange"
            accept="image/*"
            class="block bg-white file-input max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
    <div class="category pb-2">
      <label
          for="category"
          class="block text-sm font-medium leading-6 text-gray-900"
      >
        Catégorie
      </label>
      <select
          id="modeDePaiement"
          name="modeDePaiement"
          v-model="commande.category"
          autocomplete="modeDePaiement"
          class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
      >
       <option
           v-for="item in category"
       >{{item}}</option>

      </select>
  </div>

    <button
        type="submit"
        class="flex h-[3em] w-full justify-center rounded-md bg-primary px-3 py-1.5 mb-[2em] text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Enregistrer
    </button>

    </form>

  </div>

</template>

<style scoped>

</style>
