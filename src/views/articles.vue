<script setup>
import {computed, ref} from "vue";
import {useRoute} from 'vue-router'
import {useCollection, useFirestore} from "vuefire";
import {addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {toast} from "vue3-toastify";

const route = useRoute()
const db = useFirestore()


const commande = ref({
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
  return ListeCommande.value.filter((detail) => detail.id === myId)
})

async function stock(myItem) {
  const docRef = doc(db, 'commande', myItem.id);
  const stockQuery = query(stockCollection, where('idCommande', '==', myItem.id));
  const stockQuerySnapshot = await getDocs(stockQuery);
  switch (true) {
    case commande.value.quantity <= myItem.quantity:
      if (!stockQuerySnapshot.empty) {
        const updateProduct = new Promise(async (resolve, reject) => {
          const updateCustomerDoc = await updateDoc(docRef, {
            quantity: myItem.quantity - commande.value.quantity,
          });
          resolve();
        }).then(async () => {
          const firstDoc = stockQuerySnapshot.docs[0]; // Récupérer le premier document trouvé
          const stockDocRef = doc(db, 'stock', firstDoc.id);
          const currentQuantity = firstDoc.data().quantity;
          const newQuantity = currentQuantity + commande.value.quantity;
          const updateCustomerDoc = await updateDoc(stockDocRef, {
            quantity: newQuantity,
          });
          commande.value.quantity = "",
              commande.value.price = ""
          toast("Produit mis en stock", {
            "theme": "auto",
            "type": "success",
            "autoClose": 2000,
            "dangerouslyHTMLString": true
          });
        });
      } else {
        const updateProduct = new Promise(async (resolve, reject) => {
          const Data = {
            idCommande: myItem.id,
            date: myItem.date,
            name: myItem.name,
            brand: myItem.brand,
            quantity: commande.value.quantity,
            price: commande.value.price,
            category: myItem.category,
            imageUrl: myItem.imageUrl, // Stockez l'URL de l'image dans Firestore
          }
          const newDocumentRef = await addDoc(stockCollection, Data);
          resolve();
        }).then(async () => {
          const updateCustomerDoc = await updateDoc(docRef, {
            quantity: myItem.quantity - commande.value.quantity,
          });
          toast("Produit mis en stock", {
            "theme": "auto",
            "type": "success",
            "autoClose": 2000,
            "dangerouslyHTMLString": true
          });
          commande.value.quantity = "",
              commande.value.price = ""
        });
      }
      break;
    case commande.value.quantity > myItem.quantity:
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


async function newOrder(myItem){
  const docRef = doc(db, 'commande', myItem.id);
  const updateProduct = new Promise(async (resolve, reject) => {
    const updateCustomerDoc = await updateDoc(docRef, {
      date:commande.value.date,
      quantity: myItem.quantity + commande.value.quantity,
    });
})
  toast("Nouvelle commande ajoutée", {
    "theme": "auto",
    "type": "success",
    "autoClose": 2000,
    "dangerouslyHTMLString": true
  });}
</script>


<template>
  <div class=" bg-white  " v-for="item in articles">
    <div
        class="bg-white flex flex-row w-full flex flex-col justify-center px-6 py-12 lg:px-8"
    >

      <H1 class="text-black text-2xl pb-4"> Mettre des {{ item.name }} en stock </H1>
      <div class="flex mobile:flex-col mobile:items-center justify-around  mobile:w-full  ">
        <div
            class="bg-primary flex flex-col mobile:w-[80%] sm:w-[40%] py-6 my-2 rounded-2xl shadow-2xl"
        >

        <span class="text-white text-center px-4 "> Votre commande en cours est de
          <p class="text-3xl text-white"> {{ item.quantity }}</p>
          unités
        </span>
        </div>
        <div
            class=" btn border-0 bg-primary flex flex-col mobile:w-[80%] sm:w-[40%] py-6 my-2 rounded-2xl shadow-2xl" onclick="my_modal_3.showModal()"
        >
        <span class="text-white text-center px-4 ">
         Nouvelle Commande
        </span>
        </div>
      </div>


      <dialog id="my_modal_3" class="modal">
        <div class="modal-box bg-white">
         <form @submit.prevent="newOrder(item)" >
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
           <H1 class="text-black text-2xl pb-4"> Nouvelle commande </H1>
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
                   v-model="commande.quantity"
                   class="block h-[3em] w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                   :placeholder="item.quantity"
               />
             </div>
           </div>
           <button
               type="submit"
               class="flex h-[3em] w-full justify-center rounded-md bg-primary px-3 py-1.5 mb-[2em] text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
           >
             Envoyer
           </button>
           <form method="dialog">
             <!-- if there is a button, it will close the modal -->
             <button class="btn btn-error">Fermer</button>
           </form>
         </form>
        </div>
      </dialog>




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
                type="number"
                id="prix"
                name="prix"
                required
                v-model="commande.quantity"
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
                v-model="commande.price"
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
</template>


<style scoped>

</style>