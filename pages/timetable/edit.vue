<template lang="pug">
div
  v-card
    v-app-bar(color="white" flat)
      v-tabs(v-model="selectedSem")
        v-tab(v-for="sem in sems" :key="sem")
          |{{sem}}学期
      v-spacer
      v-btn(@click="$router.push('/dashbord')")
        |編集完了
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
                v-hover(v-slot:default="{ hover }" :disabled="!edit" v-if="!!courses[`${day}_${period}`]")
                  v-card(:color="courses[`${day}_${period}`].color" height="12.5vh" :elevation="hover ? 16 : 2")
                    v-card-text
                      p.white--text.font-weight-black {{courses[`${day}_${period}`].name}}
                    v-overlay(absolute :value="hover")
                      v-btn(outlined fab @click="deleteCourse(`${day}_${period}`)")
                        v-icon mdi-close
                v-hover(v-slot:default="{ hover }" v-else v-show="edit")
                  v-card(@click="handleEdit(period, day)" height="12.5vh" :elevation="hover ? 16 : 2").edit
                    v-card-text
                      v-icon(x-large) mdi-plus
      v-tab-item
        v-card-text
          .text-center
            p 秋学期はまだご利用になれません
  search(ref="search")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/store'
import { db } from '~/plugins/firebase'

const university = 'rikkyo'
@Component({
  components: {
    Search: () => import('~/components/search.vue')
  }
})
export default class extends Vue {
  edit = true
  dialog = false
  selectedPeriod = ''
  selectedDay = ''
  selectedSem = 0
  faculties = []
  campus = []
  periods = ['１', '２', '３', '４', '５', '６']
  days = ['月', '火', '水', '木', '金', '土']
  sems = ['春', '秋']

  get courses() {
    return userStore.takingCourses['2020_spring']
  }

  onEdit() {
    this.edit = !this.edit
  }

  handleEdit(period: string, day: string) {
    this.$refs.search.dialog = true
    this.$refs.search.period = period
    this.$refs.search.day = day
    this.$refs.search.sem = this.sems[this.selectedSem]
    this.$refs.search.selectPage = 1
    this.$refs.search.faculties = this.faculties
    this.$refs.search.faculty = ''
    this.$refs.search.campuses = this.campus
    this.$refs.search.campus = ''
    this.$refs.search.name = ''
    this.$refs.search.search()
  }

  deleteCourse(id: string) {
    db.collection('users')
      .doc(userStore.uid)
      .collection('2020_spring')
      .doc(id)
      .delete()
      .then(() => {
        userStore.DELETE_COURSE(id)
      })
  }

  async asyncData() {
    const faculties: string[] = []
    const campus: string[] = []
    db.collection('universities')
      .doc(`${university}`)
      .get()
      .then((data) => {
        data.data().faculties.forEach((data: string) => {
          faculties.push(data)
        })
        data.data().campus.forEach((data: string) => {
          campus.push(data)
        })
      })
    return {
      faculties: await faculties,
      campus: await campus
    }
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

.edit {
  display: flex;
  justify-content: center;
  align-items: center;
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
