<script setup>
import { useCollection, useFirestore } from 'vuefire'
import {collection, updateDoc, doc, getFirestore, deleteDoc} from 'firebase/firestore'
import { computed, ref } from 'vue'
import Return from '../components/return.vue'
import {toast} from "vue3-toastify";
import {format} from "date-fns";
import frLocale from "date-fns/locale/fr";
import { fr } from 'date-fns/locale';


const db = useFirestore()
const props = defineProps({
  Statut : String
})

const Liste = useCollection(collection(db, 'produits'))
const liste = computed(() => {
  return Liste.value.filter((detail) => detail.statut === "commande")
})

//test gildas
const query = ref('')
let filteredList = liste
async function listFilter() {
  filteredList = computed(() => {
    const lowerCaseQuery = query.value.toLowerCase().trim()
    return liste.value.filter(
        (item) => item.name && item.name.toLowerCase().includes(lowerCaseQuery),
    )
  })
}



const formatDateTime = (dateTimeString) => {
  // Extraire la date et l'heure de la chaîne à l'aide d'une expression régulière
  const date = new Date(dateTimeString)

  return format(date, "EEEE d MMMM yyyy à HH'h' mm", { locale: frLocale })
}

async function deleteLoad(id) {
  const DocRef = doc(db, 'customers', id)
  await deleteDoc(DocRef)
  toast("Client supprimé", {
    "theme": "auto",
    "type": "error",
    "autoClose": 1000,
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
          placeholder="nom du client "
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
                catégorie
              </th>
              <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Prix
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
               Date de commande
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
                {{ Statut }}
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
                {{formatDateTime(item.date)}}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{item.price*item.quantity}}€
              </td>

              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                <router-link :to="'/customersDetails/' + item.id">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </router-link>
              </td>
              <td class="text-black">
                <svg   @click="deleteLoad(item.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
.text-primary {
  color: #021d49;
}
</style>
