<script setup>
import {useCollection, useFirestore} from 'vuefire'
import {collection, updateDoc, doc, getFirestore, deleteDoc, addDoc} from 'firebase/firestore'
import {computed, ref} from 'vue'
import {toast} from "vue3-toastify";
import {format} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {category} from "../models.js";


const db = useFirestore()


const Liste = useCollection(collection(db, 'stock'))
const stockCollection = collection(db, 'stock')


const stock = ref({
  date: '',
  name: '',
  quantity: '',
  price: '',
  brand:'',
  category: [],
  image: null,
})


const query = ref('')
let filteredList = Liste

async function listFilter() {
  filteredList = computed(() => {
    const lowerCaseQuery = query.value.toLowerCase().trim()
    return filteredList.value.filter(
        (item) => item.name && item.name.toLowerCase().includes(lowerCaseQuery),
    )
  })
}


const formatDateTime = (dateTimeString) => {
  // Extraire la date et l'heure de la chaîne à l'aide d'une expression régulière
  const date = new Date(dateTimeString)

  return format(date, "EEEE d MMMM yyyy à HH'h' mm", {locale: frLocale})
}

async function updateStock(id) {
  const DocRef = doc(db, 'stock', id)
  await updateDoc(DocRef, {
    name: stock.value.name,
    brand: stock.value.brand,
    category: stock.value.category,
    price: stock.value.price,
  })
      .then(()=>{
        toast("Formulaire envoyé", {
          "theme": "auto",
          "type": "success",
          "autoClose":1000,
          "dangerouslyHTMLString": true
        })
      })
}

async function deleteLoad(id) {
  const DocRef = doc(db, 'stock', id)
  await deleteDoc(DocRef)
  toast("stock supprimé", {
    "theme": "auto",
    "type": "success",
    "autoClose": 2000,
    "dangerouslyHTMLString": true
  })
}

</script>

<template>
  <!-- component -->
  <div>
    <!-- <return route="" /> -->
    <span class="flex flex-row items-center justify-center px-2 py-4">
      <p class="text-black px-4">Rechercher</p>
      <input
          v-model="query"
          @input="listFilter"
          type="text"
          placeholder="nom de l'article "
          class="input input-bordered input-primary w-full max-w-xs bg-white"
      />
    </span>
  </div>
  <div class="flex flex-col w-screen">
    <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
      <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-white border-b">
            <tr>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Nom
              </th>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Marque
              </th>
              <th
                  scope="col"

                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                catégorie
              </th>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Prix de vente
              </th>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Quantité
              </th>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Date de stock
              </th>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Prix Total
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                class="bg-gray-100 border-b"
                v-for="(item, i) in filteredList"
                :key="i"
            >
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.name }}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.brand }}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.category }}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.price }}€
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.quantity }}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{formatDateTime( item.date )}}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.price * item.quantity }}€
              </td>
              <td>
                <button class="btn btn-primary" onclick="my_modal_5.showModal()">Modifier</button>
                <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
                  <div class="modal-box bg-white text-black">
                    <h3 class="font-bold text-lg">Modifier</h3>
                    <p class="py-4"></p>
                    <form @submit.prevent="updateStock(item.id)">
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
                              required
                              v-model="stock.quantity"
                              class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                              :placeholder=item.quantity
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
                              required
                              v-model="stock.price"
                              class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                             :placeholder=item.price
                          />
                        </div>
                      </div>
                      <button class="btn btn-primary text-white">Envoyer</button>
                    </form>
                    <div class="modal-action">
                      <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn btn-primary text-white">Fermer</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </td>
              <td class="text-black">
                <svg @click="deleteLoad(item.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>



</template>

<style scoped>

</style>
