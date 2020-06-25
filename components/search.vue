<template lang="pug">
  v-dialog(v-model="dialog" fullscreen)
    v-card.pb-5(style="height:93vh;")
      v-card-title.headline {{day}}曜日 {{period}}限目
        v-spacer
        v-btn(@click="dialog = false" icon)
          v-icon mdi-close
      v-card-text
        v-text-field(v-model="name" append-icon="mdi-magnify" label="授業名/教授名" @input="search()"  hide-details outlined)
        v-row(align="center")
          v-col(class="d-flex" cols="6" md="5")
            v-select(:items="campuses" v-model="campus" label="キャンパス" @input="search()" outlined hide-details)
          v-col(class="d-flex" cols="6" md="5")
            v-select(:items="faculties" v-model="faculty" label="学部" @input="search()" outlined hide-details)
          v-col(class="d-flex" cols="12" md="2")
            v-btn(@click="reset()" class="primary") 検索条件をリセット
      p.ml-5 検索結果 {{totalHits}}件
        v-divider
      v-card-text(v-show="courses.length !== 0" id="scrollable")
        v-list(two-line)
          v-list-item-group(multple actve-class="pink--text" )
            template(v-for="course in courses")
              v-list-item(:key="course.roomId" @click="handleClick(course)")
                template(v-slot:default="{active,toggle}")
                  v-list-item-content
                    v-list-item-subtitle.mb-2 {{course.campus}}/{{course.faculty}}
                    v-list-item-title(v-text="course.name")
                    v-list-item-subtitle(v-text="professors(course)")
              v-divider
        .text-center
          v-pagination(v-model="selectPage" :length="pages" @input="search()")      
      v-card-text(v-show="courses.length === 0")
        .text-center
          p 検索してください
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '../store'
import { db } from '~/plugins/firebase'
import client from '~/plugins/algolia'
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

interface AlogliaCourse extends Course {
  objectID: string
  facluty: string
}

interface AlogliaResult {
  nbPages: number
  nbHits: number
  hits: Array<AlogliaCourse>
}

interface University {
  faculties: string[]
}

function randomInt(max: number, min: number): number {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

const university = 'rikkyo'
const index = client.initIndex(`${university}_2020`)
@Component
export default class Search extends Vue {
  dialog = false
  day = ''
  period = ''
  sem = ''
  year = '2020'
  items = []
  name = ''
  selectPage = 1
  pages = 0
  totalHits = 0
  faculties = []
  faculty = ''
  campus = ''
  campuses = []
  university: University = { faculties: [] }
  courses: Array<Course> = []
  colors = [
    'red',
    'pink',
    'purple',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'light-green',
    'lime',
    'yellow',
    'orange',
    'amber'
  ]

  get page() {
    return this.selectPage - 1
  }

  professors(course: Course) {
    return course.professor.join(', ')
  }

  handleClick(course: Course) {
    const n = randomInt(0, 11)
    db.collection('users')
      .doc(userStore.uid)
      .collection('2020_spring')
      .doc(course.day + '_' + course.period)
      .set({
        roomId: course.roomId,
        name: course.name,
        professor: course.professor,
        day: course.day,
        period: course.period,
        sem: course.sem,
        campus: course.campus,
        faculty: course.faculty,
        color: this.colors[n]
      })
      .then(() => {
        console.log('success')
      })
    this.dialog = false
  }

  get filter() {
    let base = `period:${this.period} AND day:${this.day} AND sem:${this.sem}`
    if (this.campus) {
      base += ` AND campus:${this.campus}`
    }
    if (this.faculty) {
      base += ` AND facluty:"${this.faculty}"`
    }
    return base
  }

  reset() {
    this.campus = ''
    this.faculty = ''
    this.name = ''
  }

  async search() {
    await index
      .search(this.name, {
        filters: this.filter,
        page: this.page
      })
      .then((res: AlogliaResult) => {
        this.courses = []
        this.pages = res.nbPages
        this.totalHits = res.nbHits
        res.hits.forEach((data) => {
          this.courses.push({
            roomId: data.objectID,
            name: data.name,
            professor: data.professor,
            day: data.day,
            period: data.period,
            sem: data.sem,
            campus: data.campus,
            faculty: data.facluty
          })
        })
        document.getElementById('scrollable')!.scrollTop = 0
      })
  }
}
</script>

<style scoped>
#scrollable {
  overflow: auto;
  height: 58%;
}
</style>
