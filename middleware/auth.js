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
      userStore.getCourses()
      db.collection('users')
        .doc(user.uid)
        .get()
        .then((doc) => {
          const data = doc.data()
          userStore.SET_USERINFO({
            status: data.status,
            faculty: data.faculty,
            university: data.university,
            university_name: data.university_name
          })
          if (data.status === 0) {
            redirect('/users/edit')
          }
        })
    } else {
      redirect('/auth/login')
    }
  })
}
