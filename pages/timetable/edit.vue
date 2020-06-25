<template lang="pug">
div
  v-card
    v-app-bar(color="white" flat)
      v-tabs(v-model="selectedSem")
        v-tab(v-for="sem in sems" :key="sem")
          |{{sem}}学期
      v-spacer
      v-btn.font-weight-black.white--text(@click="$router.push('/dashbord')" color="green")
        v-icon mdi-check
        |編集完了
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
                v-card(v-if="!!courses[`${day}_${period}`]" :color="courses[`${day}_${period}`].color" height="12.5vh" :elevation="hover ? 16 : 2")
                  v-card-text
                    p.white--text.font-weight-black {{courses[`${day}_${period}`].name}}
                  v-overlay(absolute)
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

interface SearchComp {
  dialog: boolean
  period: string
  day: string
  sem: string
  selectPage: number
  faculties: Array<string>
  faculty: string
  campuses: Array<string>
  campus: string
  name: string
  search: () => {}
}

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

  get refs(): any {
    return this.$refs
  }

  handleEdit(period: string, day: string) {
    const search: SearchComp = this.refs.search
    search.dialog = true
    search.period = period
    search.day = day
    search.sem = this.sems[this.selectedSem]
    search.selectPage = 1
    search.faculties = this.faculties
    search.faculty = ''
    search.campuses = this.campus
    search.campus = ''
    search.name = ''
    search.search()
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
        const doc = data.data()
        if (!doc) {
          return
        }
        doc.faculties.forEach((data: string) => {
          faculties.push(data)
        })
        doc.campus.forEach((data: string) => {
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
