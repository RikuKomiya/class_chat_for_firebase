import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

export const registUsers = functions.auth.user().onCreate((user) => {
  const { uid } = user
  const db = admin.firestore()
  const displayName = user.displayName || '匿名'
  const email = user.email || ''
  const status = 0

  return db
    .collection('users')
    .doc(uid)
    .set({
      user_name: displayName,
      email,
      status,
      create_on: new Date()
    })
    .then(() => {
      console.log('Success')
    })
    .catch((err) => {
      console.log(err)
    })
})
