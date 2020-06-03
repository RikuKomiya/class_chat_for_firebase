<template lang="pug">
div
  v-card.message-form(flat).pb-5
    v-subheader {{year}}{{sem}} {{day}}ー{{period}} {{name}} / {{professors}}
    v-divider
    v-card-text
      v-form
        v-row(v-model="valid")
          v-col(cols="9")
            v-textarea(
              rows="1" 
              auto-grow 
              clearable 
              v-model="inputText" 
              label="メッセージを入力" 
              counter="400"
              :rules="messageRules"
            )
          v-col(cols="3" align-self="center")
            v-btn(@click="submit" color="success" :disabled="inputText.length == 0 ||!valid") 
              v-icon mdi-send
  v-divider
  v-card(flat style="min-height: 70vh;")
    .text-center.pt-8(v-if="messages.length === 0")
      p 最初の投稿をしてみよう
    .message-list
      div(v-for="message in messages")
        v-card(flat)
          v-card-text
            .d-flex
              v-avatar.mr-4(size="36")
                v-img(
                  class="elevation-6"
                  :src="message.avatar"
                )
              .font-weight-bold
                .font-weight-light {{message.userName}}
                template(v-for="line in splitText(message.text)")
                  |{{line}}
                  br
        v-divider

</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { db, timestamp } from '~/plugins/firebase'
import { userStore } from '~/store'

interface Message {
  id: string
  text: string
  uid: string
  userName: string
  avatar: string
  created_at: Date
}

@Component
export default class Messages extends Vue {
  username = userStore.username
  messages: Array<Message> = []
  inputText = ''
  year = ''
  sem = ''
  period = ''
  day = ''
  name = ''
  professor = []
  valid = false
  messageRules = [
    (v: string) => v.length < 400 || '400文字以内で入力してください'
  ]

  async submit() {
    const roomId = this.$route.params.id
    await db
      .collection('chat')
      .doc('rikkyo_2020')
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .add({
        uid: userStore.uid,
        userName: userStore.username,
        avatar: userStore.photoURL,
        text: this.inputText,
        created_at: timestamp
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    this.inputText = ''
  }

  splitText(text: string): string[] {
    return text.split('\n')
  }

  get professors() {
    return this.professor.join(', ')
  }

  created() {
    const roomId = this.$route.params.id
    const ref = db
      .collection('chat')
      .doc('rikkyo_2020')
      .collection('rooms')
      .doc(roomId)
    ref.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data()
        this.year = data.year
        this.sem = data.sem
        this.day = data.day
        this.period = data.period
        this.name = data.name
        this.professor = data.professor
      } else {
        this.$router.push('/dashbord')
      }
    })

    ref
      .collection('messages')
      .orderBy('created_at', 'asc')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const id = change.doc.id
            const doc = change.doc.data({ serverTimestamps: 'estimate' })
            const message: Message = {
              id,
              text: doc.text,
              uid: doc.uid,
              avatar: doc.avatar,
              userName: doc.userName,
              created_at: doc.created_at?.toDate()
            }
            this.messages.unshift(message)
          }
        })
      })
  }
}
</script>

<style scoped>
.message-list {
  margin-bottom: 130px;
}
</style>
