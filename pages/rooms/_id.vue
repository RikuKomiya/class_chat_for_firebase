<template lang="pug">
div
  v-banner(single-line elevation).banner
    v-subheader {{year}}{{sem}} {{day}}ー{{period}} {{name}} / {{professors}}
  v-card(flat style="min-height: 80vh;")
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
                .font-weight-light {{message.userName}} ・ {{getDate(message.created_at)}}
                .message
                  template(v-for="line in splitText(message.text)")
                    |{{line}}
                    br
          v-card-action
            v-btn(text @click="displayReplay(message)") 
              v-icon mdi-chat-outline
              |{{message.replyCount}}
            v-btn(text @click="displayReplay(message)") 返信
        v-divider
  v-dialog(v-model="write")
    template(v-slot:activator="{ on }")
      v-btn(fab color="red" large v-on="on").button.white--text
        v-icon mdi-pencil
    v-card(flat)
      v-app-bar(color="blue" dark flat)
        v-toolbar-title.font-weight-black.headline 投稿
        v-spacer
        v-icon(@click="write = false") mdi-close
      v-card-text
        v-form(v-model="valid")
          v-textarea(
            rows="10" 
            clearable 
            v-model="inputText" 
            label="メッセージを入力" 
            counter="400"
            :rules="messageRules"
          )
        v-card-action
          v-btn(@click="submit" color="success" :disabled="inputText.length == 0 || inputText.length > 400 ||!valid") 
            v-icon mdi-send
            |送信
  v-dialog(v-model="reply" width="500" persistent fullscreen transition="dialog-bottom-transition")
    v-card
      v-app-bar(dark color="primary" scroll-target="#replies")
        v-btn(icon dark @click="closeReply()")
          v-icon mdi-close
        v-toolbar-title 返信
      #replies.overflow-y-auto(style="max-height: 100vh;")
        v-card(flat)
          v-card-text
            .d-flex
              v-avatar.mr-4(size="36")
                v-img(
                  class="elevation-6"
                  :src="selectedMessage.avatar"
                )
              .font-weight-bold
                .font-weight-light {{selectedMessage.userName}} ・ {{getDate(selectedMessage.created_at)}}
                template(v-for="line in splitText(selectedMessage.text)")
                  |{{line}}
                  br
            v-form(v-model="replyValid")
              v-row(center)
                v-col(cols="9" offset="1")
                  v-textarea(
                    rows="1" 
                    :error="false"
                    clearable
                    auto-grow 
                    v-model="inputReply" 
                    label="返信を入力" 
                    counter="400"
                    :rules="messageRules"
                  )
                v-col(cols="1" align-self="center")
                  v-btn(@click="submitReply()" color="success" :disabled="(inputReply && inputReply.length == 0) ||!replyValid") 
                    v-icon mdi-send
            v-divider
        div(v-for="message in replies")
          v-card(flat)
            v-card-text
              .d-flex
                v-avatar.mr-4(size="36")
                  v-img(
                    class="elevation-6"
                    :src="message.avatar"
                  )
                .font-weight-bold
                  .font-weight-light {{message.userName}} ・ {{getDate(message.created_at)}}
                  template(v-for="line in splitText(message.text)")
                    |{{line}}
                    br
          v-divider
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import moment from 'moment'
import 'moment/locale/ja'
import { db, timestamp, fieldValue } from '~/plugins/firebase'
import { userStore } from '~/store'

interface Message {
  id: string
  text: string
  uid: string
  userName: string
  avatar: string
  replyCount: number
  created_at: Date | null
}

@Component
export default class Messages extends Vue {
  username = userStore.username
  messages: Array<Message> = []
  replies: Array<Message> = []
  selectedMessage: Message = {
    id: '',
    text: '',
    uid: '',
    userName: '',
    avatar: '',
    replyCount: 0,
    created_at: null
  }

  inputReply = ''
  inputText = ''
  year = ''
  sem = ''
  period = ''
  day = ''
  name = ''
  professor = []
  valid = false
  replyValid = false
  messageRules = [
    (v: string) => (v && v.length < 400) || '400文字以内で入力してください'
  ]

  write = false
  reply = false
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
        replyCount: 0,
        created_at: timestamp
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    this.inputText = ''
  }

  async submitReply() {
    const roomId = this.$route.params.id
    const ref = await db
      .collection('chat')
      .doc('rikkyo_2020')
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .doc(this.selectedMessage.id)

    const batch = db.batch()
    batch.set(ref.collection('replies').doc(), {
      uid: userStore.uid,
      userName: userStore.username,
      avatar: userStore.photoURL,
      text: this.inputReply,
      created_at: timestamp
    })
    batch.update(ref, { replyCount: fieldValue.increment(1) })
    batch.commit()
    this.inputReply = ''
  }

  displayReplay(message: Message) {
    const roomId = this.$route.params.id
    const ref = db
      .collection('chat')
      .doc('rikkyo_2020')
      .collection('rooms')
      .doc(roomId)
    ref
      .collection('messages')
      .doc(message.id)
      .collection('replies')
      .orderBy('created_at', 'desc')
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
              replyCount: doc.replyCount,
              created_at: doc.created_at?.toDate()
            }
            this.replies.unshift(message)
          }
        })
      })
    this.reply = true
    this.selectedMessage = message
  }

  closeReply() {
    this.reply = false
    this.inputReply = ''
    this.replies = []
  }

  splitText(text: string): string[] {
    return text.split('\n')
  }

  get professors() {
    return this.professor.join(', ')
  }

  getDate(date: Date) {
    return moment(date).fromNow()
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
        if (!data) {
          return
        }
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
              replyCount: doc.replyCount,
              created_at: doc.created_at?.toDate()
            }
            this.messages.unshift(message)
          }
          if (change.type === 'modified') {
            const id = change.doc.id
            const doc = change.doc.data()
            const message: Message = {
              id,
              text: doc.text,
              uid: doc.uid,
              avatar: doc.avatar,
              userName: doc.userName,
              replyCount: doc.replyCount,
              created_at: doc.created_at?.toDate()
            }
            this.messages.forEach((e, i) => {
              if (e.id === id) {
                this.messages[i] = message
              }
            })
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
.banner {
  top: 65px;
  position: sticky;
  z-index: 2;
}
.button {
  position: fixed;
  right: 50px;
  bottom: 50px;
  transition: 1s;
  opacity: 0.7;
}
</style>
