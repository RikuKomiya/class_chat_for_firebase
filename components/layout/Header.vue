<template lang="pug">
  .header
    v-navigation-drawer(v-model="drawer" fixed app)
      v-list
        v-list-item(to="/dashbord" router exact)
          v-list-item-action
            v-icon mdi-home
          v-list-item-content
            v-list-item-title Home
        v-list-item(to="/timetable/edit" router exact)
          v-list-item-action
            v-icon mdi-timetable
          v-list-item-content
            v-list-item-title 時間割編集
      v-list(two-line subheader)
        v-list-group(multple value="true" no-action)
          template(v-slot:activator)
            v-list-item-content
              v-list-item-title マイ講義一覧
          v-list-item(:key="course.roomId" :to="'/rooms/' + course.roomId" router v-for="(course,index) in courses")
            v-list-item-content
              v-list-item-title(v-text="index + course.name")
              v-list-item-subtitle(v-text="professors(course)")
    v-app-bar(dark fixed app color="#AB47BC")
      v-app-bar-nav-icon(@click.stop="drawer = !drawer" v-if="isLoggedin")
      img( class="logo" src="/logo.png" @click="$router.push('/')")
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

interface Course {
  roomId: string
  name: string
  professor: string[]
  day: string
  period: string
  sem: string
  campus: string
  faculty: string
}
@Component
export default class extends Vue {
  drawer = false
  items = [
    {
      icon: 'mdi-home',
      title: 'Home',
      to: '/dashbord'
    }
  ]

  get courses() {
    return userStore.takingCourses['2020_spring']
  }

  professors(course: Course) {
    return course.professor.join(', ')
  }

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
