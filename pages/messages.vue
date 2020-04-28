<template lang="pug">
  div
    .message-list
      div(v-for="message in messages")
        v-card(flat)
          v-card-title
            v-avatar.mr-4(size="36")
              v-img(
                class="elevation-6"
                src="/avatar.png"
              )
            span.title.font-weight-light 匿名
          v-card-text.font-weight-bold
            template(v-for="line in splitText(message.text)")
              |{{line}}
              br
        v-divider
    v-card.message-form(flat)
      v-card-text
        v-row
          v-col(cols="9")
            v-textarea(rows="1" auto-grow clearable v-model="inputText" label="メッセージを入力")
          v-col(cols="3" align-self="center")
            v-btn(@click="submit" color="success") 
              v-icon mdi-send
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { db, timestamp } from '~/plugins/firebase'

interface Message {
  id: string
  text: string
  created_at: Date
}

@Component
export default class Messages extends Vue {
  messages: Array<Message> = []
  inputText = ''

  async submit() {
    await db
      .collection('messages')
      .add({
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

  created() {
    db.collection('messages')
      .orderBy('created_at', 'asc')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const id = change.doc.id
            const doc = change.doc.data({ serverTimestamps: 'estimate' })
            const message: Message = {
              id,
              text: doc.text,
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
  margin-bottom: 95px;
}
.message-form {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
