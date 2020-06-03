<template lang="pug">
  .header
    v-navigation-drawer(v-model="drawer" fixed app)
      v-list
        v-list-item(
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact)
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text="item.title")
    v-app-bar(dark fixed app color="#AB47BC")
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
      img( class="logo" src="/logo.png" @click="$router.push('/dashbord')")
      v-spacer
      v-menu(:close-on-content-click="false" :nudge-width="200" v-if="isLoggedin")
        template(v-slot:activator="{on}")
          v-avatar(v-on="on")
            v-img(:src="avatar")
        v-card
          v-list
            v-list-item
              v-list-item-avatar
                img(:src="avatar")
              v-list-item-content
                v-list-item-title {{username}}
          v-divider
          v-list
            v-list-item-group
              v-list-item
                v-list-item-icon
                  v-icon mdi-cog
                v-list-item-content
                  |ユーザー設定
              v-list-item(@click="logout()")
                v-list-item-icon
                  v-icon mdi-logout
                v-list-item-content
                  |ログアウト
      v-btn(v-else @click="$router.push('/auth/login')") ログイン

</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { userStore } from '~/store'

@Component
export default class extends Vue {
  drawer = false
  items = [
    {
      icon: 'mdi-apps',
      title: 'Welcome',
      to: '/dashbord'
    }
  ]

  get avatar() {
    return userStore.photoURL
  }

  get isLoggedin() {
    return userStore.loggedIn
  }

  get username() {
    return userStore.username
  }

  logout() {
    userStore.logout()
  }

  title = 'ClassChat'
}
</script>

<style scoped>
.logo {
  cursor: pointer;
}
</style>
