import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/messaging'
import config from '~/firebase.config.js'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const authProviders = {
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
export const storage = firebase.storage()
export const fieldValue = firebase.firestore.FieldValue
