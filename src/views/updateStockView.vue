<script setup>
import {computed, ref} from "vue";
import {useRoute} from 'vue-router'
import {useCollection, useFirestore} from "vuefire";
import {addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {toast} from "vue3-toastify";

const route = useRoute()
const db = useFirestore()


const stock = ref({
  date: '',
  name: '',
  quantity: '',
  brand: '',
  price: '',
  category: [],
  image: null,
})

const detailId = ref(route.params.id)
const myId = detailId.value
let articles = ref('')
const article = ref()
const ListeCommande = useCollection(collection(db, 'commande'))
const commandeCollection = collection(db, 'commande')
const stockCollection = collection(db, 'stock')
const ListeStock = useCollection(collection(db, 'stock'))

articles = computed(() => {
  return ListeStock.value.filter((detail) => detail.idCommande === myId)
})

async function updateSell(item) {
  const DocRef = doc(db, 'stock', item.id)
  await updateDoc(DocRef, {
   quantity:(item.quantity - stock.value.quantity)
  })
      .then(()=>{
        toast("Article mis à jour", {
          "theme": "auto",
          "type": "success",
          "autoClose":1000,
          "dangerouslyHTMLString": true
        })
      })
      .then(()=>{
        stock.value.quantity=''
      })
}
async function updateItem(item) {
  const DocRef = doc(db, 'stock', item.id)
  await updateDoc(DocRef, {
    quantity:stock.value.quantity,
    price:stock.value.price
  })
      .then(()=>{
        toast(`l'article ${item.name} à été modifié`, {
          "theme": "auto",
          "type": "success",
          "autoClose":1000,
          "dangerouslyHTMLString": true
        })
      })
}
</script>


<template>
  <div class=" bg-white  " v-for="item in articles">
    <div
        class="bg-white flex flex-row w-full flex flex-col justify-center px-6 py-12 lg:px-8"
    >

      <H1 class="text-black text-2xl pb-4"> Modifier le stock de  {{ item.name }} </H1>
      <div class="flex mobile:flex-col mobile:items-center justify-around  mobile:w-full  ">
        <div
            class="bg-primary flex flex-col mobile:w-[80%] sm:w-[40%] py-6 my-2 rounded-2xl shadow-2xl"
        >

        <span class="text-white text-center px-4 "> Votre stock actuel est de
          <p class="text-3xl text-white"> {{ item.quantity }}</p>
          unités
        </span>
        </div>
        <div
            class=" btn border-0 bg-primary flex flex-col mobile:w-[80%] sm:w-[40%] py-6 my-2 rounded-2xl shadow-2xl" onclick="my_modal_3.showModal()"
        >
        <span class="text-white text-center px-4 ">
         Mettre a jour mes ventes
        </span>
        </div>
      </div>


      <dialog id="my_modal_3" class="modal">
        <div class="modal-box bg-white">
          <div class="text-black">
            <h3 class="font-bold text-lg">Combien de {{item.name}} vous avez vendu ? </h3>
            <p class="py-4"></p>
            <form @submit.prevent="updateSell(item)">
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
              <button class="btn btn-primary text-white">Mettre à jour</button>
            </form>
            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-primary text-white">Fermer</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>




      <form class="space-y-6" @submit.prevent="updateItem(item)">

        <div class="quantity pb-2">
          <label
              for="quantity"
              class="block text-sm font-medium leading-6 text-gray-900"
          >
            Quantité
          </label>
          <div class="mt-2">
            <input
                type="number"
                id="prix"
                name="prix"
                required
                v-model="stock.quantity"
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
                required
                v-model="stock.price"
                class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                :placeholder="item.price"
            />
          </div>
        </div>
        <button
            type="submit"
            class="flex h-[3em] w-full justify-center rounded-md bg-primary px-3 py-1.5 mb-[2em] text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Modifier
        </button>

      </form>

    </div>
  </div>
</template>


<style scoped>

</style>yle>