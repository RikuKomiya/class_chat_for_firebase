<template lang="pug">
div(style="min-height: 70vh;")
  v-card.mt-12
    .top
      v-row
        v-col(md="6")
          .d-flex.justify-center
            v-img(src="/chat.png" class="chat_img")
        v-col(md="6").d-flex.justify-center.align-center      
          v-card-text.text-center
            h1.display-2.font-weight-black.purple--text.text--lighten-4 大学講義ごとにチャットができるサービス
            h1.display-2.font-weight-black.purple--text.my-3 「ClassChat」
            p.font-weight-bold 対応大学: 立教大学
            v-btn(color="primary" @click="$router.push('/auth/login')").font-weight-black さっそく始める    
</template>

<script>
import { auth } from '~/plugins/firebase'
export default {
  layout: 'guest',
  middleware({ redirect }) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        redirect('/dashbord')
      }
    })
  }
}
</script>

<style scoped>
/* .chat_img {
  height: 500px;
  width: 500px;
} */
</style>
