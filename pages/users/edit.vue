<template lang="pug">
  v-card.mt-12
    v-card-title.headline ユーザー情報編集
    v-card-text
      v-row(align="center")
        v-col(sm="2" cols="4")
          v-img(:src="url")
        v-col(sm="9" cols="8")
          v-form(v-model="valid")
            v-text-field(v-model="name" label="ニックネーム")
            v-select(v-model="selectedUniversity" :items="university_name" @input="selectUniversity" label="大学")
            v-select(v-model="selectedFaculty" label="学部" :disabled="!university" @input="selectFaculty" :items="faculty_names")
      v-card-actions
        v-btn(color="primary" @click="chengeAvatar()") アバター変更
        v-btn(color="success" @click="submit()") 登録
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { db, auth } from '~/plugins/firebase'
import { userStore } from '~/store'

function randomInt(max: number, min: number): number {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

interface University {
  id: string
  name: string
  faculties: string[]
}

@Component({
  middleware({ redirect }) {
    if (userStore.status !== 0) {
      redirect('/dashbord')
    }
  }
})
export default class extends Vue {
  name = ''
  selectedUniversity = ''
  selectedFaculty = ''
  university: University = { id: '', name: '', faculties: [] }
  universities: University[] = []
  faculty = ''
  faculties: string[] = []
  url = ''
  loadging = false

  created() {
    if (/\/avatar\/avataaars \([\d]*\).png/.test(userStore.photoURL)) {
      this.url = userStore.photoURL
    } else {
      const i = randomInt(105, 2)
      this.url = `/avatar/avataaars (${i}).png`
    }
  }

  async asyncData() {
    const array: University[] = []
    db.collection('universities').onSnapshot((snapshot) =>
      snapshot.forEach((doc) => {
        const data = doc.data()
        array.push({
          id: doc.id,
          name: data.name,
          faculties: data.faculties
        })
      })
    )
    return {
      universities: await array
    }
  }

  get university_name() {
    return this.universities.map(function(v) {
      return v.name
    })
  }

  get faculty_names() {
    return this.faculties.map(function(v) {
      return v
    })
  }

  selectUniversity() {
    const selectedUniversity = this.universities.find(
      ({ name }) => name === this.selectedUniversity
    )
    if (!selectedUniversity) {
      return
    }
    this.university = selectedUniversity
    this.faculties = selectedUniversity.faculties
  }

  selectFaculty() {
    const selectedFacluty = this.faculties.find(
      (name) => name === this.selectedFaculty
    )
    if (!selectedFacluty) return
    this.faculty = selectedFacluty
  }

  chengeAvatar() {
    const i = randomInt(105, 2)
    this.url = `/avatar/avataaars (${i}).png`
  }

  submit() {
    const uid = userStore.uid
    const user = auth.currentUser
    if (user === null) {
      return
    }
    user
      .updateProfile({ displayName: this.name, photoURL: this.url })
      .then(() => {
        db.collection('users')
          .doc(uid)
          .set(
            {
              user_name: this.name,
              university: this.university.id,
              faculty: this.faculty,
              status: 1
            },
            { merge: true }
          )
          .then(() => {
            this.$router.push('/timetable/edit')
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
