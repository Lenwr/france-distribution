import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import {getAuth} from 'firebase/auth'
// ... other firebase imports

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyCSy7NsGkyuDiCdTGIp8gUUKIPkcYkBqOc",
    authDomain: "france-distribution-f2061.firebaseapp.com",
    projectId: "france-distribution-f2061",
    storageBucket: "france-distribution-f2061.appspot.com",
    messagingSenderId: "1001398680184",
    appId: "1:1001398680184:web:91da4d6acb652e6e3ecb8d"
})

// used for the firestore refs
const db = getFirestore(firebaseApp)


const storage = getStorage(firebaseApp)

// here we can export reusable database references
export const auth = getAuth()

export { storage }