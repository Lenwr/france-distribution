<script setup>
import {useCollection, useFirestore} from 'vuefire'
import {collection, updateDoc, doc, getFirestore, deleteDoc, addDoc} from 'firebase/firestore'
import {computed, ref} from 'vue'
import Return from '../components/return.vue'
import {toast} from "vue3-toastify";
import {format} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {fr} from 'date-fns/locale';


const db = useFirestore()
const props = defineProps({
  Statut: String
})


const Liste = useCollection(collection(db, 'produits'))
const produitsCollection = collection(db, 'produits')
const liste = computed(() => {
  return Liste.value.filter((detail) => detail.statut === props.Statut)
})

const product = ref({
  date: '',
  name: '',
  quantity: '',
  price: '',
  category: [],
  statut: "commande",
  image: null,
})


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

  return format(date, "EEEE d MMMM yyyy à HH'h' mm", {locale: frLocale})
}

async function deleteLoad(id) {
  const DocRef = doc(db, 'produits', id)
  await deleteDoc(DocRef)
  toast("Produit supprimé", {
    "theme": "auto",
    "type": "success",
    "autoClose": 2000,
    "dangerouslyHTMLString": true
  })
}

async function stock(myItem) {
  const docRef = doc(db, 'produits', myItem.id);

  switch (true) {
    case product.value.quantity < myItem.quantity:
      const updateProduct = new Promise(async (resolve, reject) => {
        const Data = {
          date: myItem.date,
          name: myItem.name,
          quantity: myItem.quantity - product.value.quantity,
          price: product.value.price,
          category: myItem.category,
          statut: "commande",
          imageUrl: myItem.imageUrl, // Stockez l'URL de l'image dans Firestore
        }
        const newDocumentRef = await addDoc(produitsCollection, Data);
        resolve()
      }).then(async () => {
        const updateCustomerDoc = await updateDoc(docRef, {
          quantity: product.value.quantity,
          price: product.value.price,
          statut: "stock"
        });
        toast("Produit mis en stock", {
          "theme": "auto",
          "type": "success",
          "autoClose": 2000,
          "dangerouslyHTMLString": true
        });
      });
      break;
    case myItem.quantity == product.value.quantity:
      const updateCustomerDoc = await updateDoc(docRef, {
        quantity: product.value.quantity,
        price: product.value.price,
        statut: "stock"
      });
      toast("Produit mis en stock", {
        "theme": "auto",
        "type": "success",
        "autoClose": 2000,
        "dangerouslyHTMLString": true
      });
      break;

    case product.value.quantity > myItem.quantity:
      toast("Quantité supérieure à quantité commandée", {
        "theme": "auto",
        "type": "error",
        "autoClose": 2000,
        "dangerouslyHTMLString": true
      });
      break;

    default:
      break;
  }
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
          placeholder="nom du produit "
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
                {{ item.name }}
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
                {{ formatDateTime(item.date) }}
              </td>
              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                {{ item.price * item.quantity }}€
              </td>

              <td
                  class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
              >
                <button class="btn btn-primary text-white" v-if="item.statut==='commande'"
                        onclick="my_modal_3.showModal()">Réceptionner commande
                </button>
              </td>
              <td class="text-black">
                <svg @click="deleteLoad(item.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
              </td>
              <td>

                <!-- envoyer produit de commande vers stock -->
                <dialog id="my_modal_3" class="modal ">
                  <div class="modal-box bg-white">
                    <form method="dialog">
                      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div
                        class="bg-white flex h-full flex-1 flex-col item-center justify-center px-6 py-12 lg:px-8"
                    >

                      <H1 class="text-black text-2xl pb-4"> Mettre un produit en stock </H1>

                      <form class="space-y-6" @submit.prevent="stock(item)">

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
                                v-model="product.quantity"
                                class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                                :placeholder="item.quantity"
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
                                v-model="product.price"
                                class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                                :placeholder="item.price"
                            />
                          </div>
                        </div>
                        <button
                            type="submit"
                            class="flex h-[3em] w-full justify-center rounded-md bg-primary px-3 py-1.5 mb-[2em] text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Envoyer
                        </button>

                      </form>

                    </div>
                  </div>
                </dialog>
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
