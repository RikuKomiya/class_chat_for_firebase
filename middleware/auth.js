import { auth, db } from '~/plugins/firebase'
import { userStore } from '~/store'

export default function({ redirect }) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userStore.SET_USER({
        displayName: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL
      })
      db.collection('users')
        .doc(user.uid)
        .get()
        .then((data) => {
          if (data.data().status === 0) {
            redirect('/users/edit')
          }
        })
    } else {
      redirect('/auth/login')
    }
  })
}
