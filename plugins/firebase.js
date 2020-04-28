import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/messaging'
import config from '~/firebase.config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const authProviders = {
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()
