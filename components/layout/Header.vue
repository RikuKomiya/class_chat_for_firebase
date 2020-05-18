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
      img( class="logo" src="/logo.png" @click="$router.push('/')")
      v-spacer
      v-btn(v-if="isLoggedin" @click="logout()") ログアウト
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
      to: '/'
    },
    {
      icon: 'mdi-chart-bubble',
      title: 'Inspire',
      to: '/inspire'
    }
  ]

  get isLoggedin() {
    return userStore.loggedIn
  }

  logout() {
    userStore.logout()
  }

  title = 'ClassChat'
}
</script>

<style scoped>
.logo {
  height: 100px;
  width: 100px;
  cursor: pointer;
}
</style>
