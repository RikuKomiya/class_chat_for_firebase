<template lang="pug">
div
  h1.headline.my-8 時間割
  v-card
    v-app-bar(color="white" flat)
      v-tabs(v-model="selectedSem")
        v-tab(v-for="sem in sems" :key="sem")
          |{{sem}}学期
      v-spacer
      v-btn(@click="$router.push('/timetable/edit')")
        |時間割を編集
        //- v-tooltip(bottom)
        //-   template(v-slot:activator="{on}")
        //-     v-btn(dark fab v-on="on" @click="onEdit()")
        //-       v-icon mdi-pencil
        //-   span 時間割を編集
    v-divider
    v-tabs-items(v-model="selectedSem")
      v-tab-item
        v-card-text
          table
            tr(height="5vh")
              th(width="10%") 時間
              th(width="15%" v-for="day in days") {{day}}
            tr.text-center(v-for="period in periods")
              td {{period}}
              td(v-for="day in days")
                v-hover(v-slot:default="{ hover }" v-if="!!courses[`${day}_${period}`]")
                  v-card(:color="courses[`${day}_${period}`].color" height="12.5vh" :elevation="hover ? 16 : 2")
                    v-card-text
                      p.white--text.font-weight-black {{courses[`${day}_${period}`].name}}
                    v-overlay(absolute :value="hover")
                      v-btn(outlineds @click="$router.push(`/rooms/${courses[`${day}_${period}`]['roomId']}`)") 入室
                v-hover(v-slot:default="{ hover }" v-else v-show="edit")
                  v-card(@click="handleEdit(period, day)" height="12.5vh" :elevation="hover ? 16 : 2").edit
                    v-card-text
                      v-icon(x-large) mdi-plus
      v-tab-item
        v-card-text
          .text-center
            p 秋学期はまだご利用になれません
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/store'

@Component
export default class extends Vue {
  periods = ['１', '２', '３', '４', '５', '６']
  days = ['月', '火', '水', '木', '金', '土']
  sems = ['春', '秋']
  edit = false
  selectedSem = ''

  get courses() {
    return userStore.takingCourses['2020_spring']
  }
}
</script>

<style scoped>
table {
  width: 100%;
  height: 80vh;
  border-collapse: separate;
  border-spacing: 5px;
  margin: 0 auto;
}

tr.text-center td {
  height: 12.5vh;
}

@media screen and (max-width: 768px) {
  p {
    font-size: 0.5em;
  }
  td .v-card .v-card__text {
    padding: 0 1px;
  }
  td .v-card {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
