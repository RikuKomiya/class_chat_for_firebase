import { auth } from '~/plugins/firebase'
import { userStore } from '~/store'

export default function({ redirect }) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userStore.SET_USER({ displayName: user.displayName, uid: user.uid })
    } else {
      redirect('/auth/login')
    }
  })
}
